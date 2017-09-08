import SegmentView from './mapping/segment-view';
import TrackView from './mapping/track-view';
import {extractInfoFromXhrSetup} from '../utils';

/**
 * Generates a P2PLoader class definition that will use the Streamroot Hls.js wrapper instance passed
 * @static
 * @function
 * @return {class} P2PLoader class definiton that implements Hls.js Loader interface.
 */
const P2PLoaderGenerator_v0_6_2 = function (hlsjsWrapper) {
    return class P2PLoader_v0_6_2 {

        constructor(config) {
            if (config) {
                this.xhrSetup = config.xhrSetup;
            }
            this.reset();
        }

        destroy() {
            this.abort();
        }

        abort() {
            if (this.peerAgentLoader) {
                this.stats.aborted = true;
                this.peerAgentLoader.abort();
            }
            this.reset();
        }

        reset(cancelRetry = true) {
            clearTimeout(this.requestTimeout);
            this.requestTimeout = null;
            // we only want to cancel the retry
            // if this is a full reset. when we reset
            // during a retry routine we want to keep this timeout alive!
            if (cancelRetry) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }
            this.peerAgentLoader = null;
        }

        load(context, config, callbacks) {
            if (!callbacks.onProgress) {
                throw new Error('P2P loader expects progress-callback to be passed for ABR stats (use only as `fLoader` in config)');
            }

            this.stats = { trequest: performance.now(), retry: 0 };

            this.context = context;
            this.callbacks = callbacks;
            this.config = config;
            // retryDelay value will be modified due to exponential backoff used in fragment load retry
            // so we keep this value in a var to avoid altering hls.js config value.
            this.retryDelay = config.retryDelay;

            this.loadInternal();
        }

        loadSuccess(segmentData, p2pStats) {
            // we might get called while aborted
            // ignore these cases
            if (this.stats.aborted) {
                return;
            }

            let response = {
                data: segmentData
            };

            if ((p2pStats.p2pDuration + p2pStats.cdnDuration > 0) && p2pStats.p2pDownloaded > 0) {
                let now = performance.now();
                let srTime = p2pStats.p2pDuration + p2pStats.cdnDuration;

                // FIXME: we are fixing an arbitrary RTT of 10ms, since the 1st progress event is triggered immediately if we have p2p data
                let latency = Math.min(srTime / 2, 10);

                // Offset trequest and tfirst to account for p2p bandwidth
                this.stats.trequest = now - srTime;
                this.stats.tfirst = this.stats.trequest + latency;
            }

            this.stats.tload = performance.now();
            this.stats.loaded = segmentData.byteLength;
            this.stats.total = this.stats.loaded;
            this.callbacks.onSuccess(response, this.stats, this.context);
            this.reset();
        }

        // Errors from Peer-agent can only be XHR events
        // because it ultimately fails-through to XHRs always
        loadError (httpError) {
            // we might get called while aborted
            // ignore these cases
            if (this.stats.aborted) {
                return;
            }

            let status = httpError.status;

            if (this.stats.retry < this.config.maxRetry) {
                console.warn(`${status} while loading ${this.context.url}, retrying in ${this.retryDelay}...`);
                this.retryTimeout = setTimeout(this.loadInternal.bind(this), this.retryDelay);
                // exponential backoff
                this.retryDelay = Math.min(2 * this.retryDelay, 64000);
                this.stats.retry++;
                this.reset(false);
            } else {
                console.error(`${status} while loading ${this.context.url}` );
                let error = {
                    code: status,
                    text: httpError.message,
                };
                this.callbacks.onError(error, this.context);
                this.reset();
            }
        }

        loadInternal() {

            if (this.peerAgentLoader) {
                throw new Error('P2P loader was not reset correctly, internal state indicates unfinalized request');
            }

            let url = this.context.url;
            let xhrSetup = this.xhrSetup;
            let {headers, withCredentials} = extractInfoFromXhrSetup(xhrSetup, url);

            if (!isNaN(this.context.rangeStart) && !isNaN(this.context.rangeEnd)) {
                headers.Range = `bytes=${this.context.rangeStart}-${this.context.rangeEnd - 1}`;
            }

            let segmentView = null;
            if (this.context.frag.type === 'main') {
                // Only pass SegmentView for 'main' segments. Segment from alternate audio tracks will have a null SegmentView which instructs the peer-agent to download them directly from the CDN
                const { urlId, bitrate } = hlsjsWrapper.hls.levels[this.context.frag.level];
                let trackView = new TrackView({ urlId, bitrate, level: this.context.frag.level });
                segmentView = new SegmentView({sn: this.context.frag.sn, trackView, time: this.context.frag.start});
            }

            let reqInfo = {
                url,
                headers,
                withCredentials
            };

            let callbacks = {
                onSuccess: this.loadSuccess.bind(this),
                onError: this.loadError.bind(this),
                onProgress: this.loadProgress.bind(this)
            };

            this.stats.tfirst = null;
            this.stats.loaded = 0;
            this.requestTimeout = setTimeout(this.loadTimeout.bind(this), this.config.timeout);
            this.peerAgentLoader = hlsjsWrapper.peerAgentModule.getSegment(reqInfo, callbacks, segmentView);
        }

        loadProgress(event) {

            let loaded = 0;

            if (event.cdnDownloaded) {
                loaded += event.cdnDownloaded;
            }

            if (event.p2pDownloaded) {
                loaded += event.p2pDownloaded;
            }

            this.stats.loaded = loaded;

            if (event.lengthComputable) {
                this.stats.total = event.total;
            }

            if (this.stats.tfirst === null) {
                this.stats.tfirst = Math.max(performance.now(), this.stats.trequest);
            }

            this.callbacks.onProgress(this.stats, this.context);
        }

        loadTimeout() {
            this.callbacks.onTimeout(this.stats, this.context);
        }
    };
};

export default P2PLoaderGenerator_v0_6_2;
