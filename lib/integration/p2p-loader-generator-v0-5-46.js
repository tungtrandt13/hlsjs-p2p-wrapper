import SegmentView from './mapping/segment-view';
import TrackView from './mapping/track-view';
import {extractInfoFromXhrSetup} from '../utils';

/**
 * Generates a P2PLoader class definition that will use the Streamroot Hls.js wrapper instance passed
 * @static
 * @function
 * @return {class} P2PLoader class definiton that implements Hls.js Loader interface.
 */
const P2PLoaderGenerator_v0_5_46 = function (hlsjsWrapper) {
    return class P2PLoader_v0_5_46 {

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

        load(url, responseType, onSuccess, onError, onTimeout, timeout, maxRetry, retryDelay, onProgress, frag) {
            if (!onProgress) {
                throw new Error('P2P loader expects progress-callback to be passed for ABR stats (use only as `fLoader` in config)');
            }

            if (!frag) {
                throw new Error('P2P loader can only be used for media fragments (use only as `fLoader` in config)');
            }

            if (!isNaN(frag.byteRangeStartOffset) && !isNaN(frag.byteRangeEndOffset)) {
                this.byteRange = frag.byteRangeStartOffset + '-' + frag.byteRangeEndOffset;
            }

            this.frag = frag;
            this.url = url;
            this.responseType = responseType;
            this.onSuccess = onSuccess;
            this.onProgress = onProgress;
            this.onTimeout = onTimeout;
            this.onError = onError;
            this.stats = { trequest: performance.now(), retry: 0 };
            this.timeout = timeout;
            this.maxRetry = maxRetry;
            this.retryDelay = retryDelay;

            this.loadInternal();
        }

        loadSuccess(segmentData) {
            // we might get called while aborted
            // ignore these cases
            if (this.stats.aborted) {
                return;
            }

            let event = {
                currentTarget: {
                    response: segmentData
                }
            };

            this.stats.tload = performance.now();
            this.onSuccess(event, this.stats);
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

            if (this.stats.retry < this.maxRetry) {
                console.warn(`${status} while loading ${this.url}, retrying in ${this.retryDelay}...`);
                this.retryTimeout = setTimeout(this.loadInternal.bind(this), this.retryDelay);
                // exponential backoff
                this.retryDelay = Math.min(2 * this.retryDelay, 64000);
                this.stats.retry++;
                this.reset(false);
            } else {
                console.error(`${status} while loading ${this.url}` );
                let xhrEventShim = {
                    target: {
                        status,
                    },
                };
                this.onError(xhrEventShim);
                this.reset();
            }
        }

        loadInternal() {

            if (this.peerAgentLoader) {
                throw new Error('P2P loader was not reset correctly, internal state indicates unfinalized request');
            }

            let {url, xhrSetup} = this;
            let {headers, withCredentials} = extractInfoFromXhrSetup(xhrSetup, url);

            if (this.byteRange) {
                headers.Range = `bytes=${this.frag.byteRangeStartOffset}-${this.frag.byteRangeEndOffset - 1}`;
            }
            let level = hlsjsWrapper.hls.levels[this.frag.level];
            let trackView = new TrackView({level: this.frag.level, urlId: level.urlId});
            let segmentView = new SegmentView({sn: this.frag.sn, trackView, time: this.frag.start});

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
            this.requestTimeout = setTimeout(this.loadTimeout.bind(this), this.timeout);
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

            if (this.stats.tfirst === null) {
                let now = performance.now();

                // If we did p2p download, this handler will be called immediately. We need to offset trequest to avoid computing a very high bandwidth in abr-controller
                // If we didn't do p2p download, this handler will be called with the right timing so we don't need to offset anything.
                // If this is not the first progress event (i.e. tfirst !== null), we probably don't need to do any adjustment:
                // we offseted trequest with the 1st progress event to represent the P2P bandwidth,
                // and subsequent progress event should correctly account for CDN download (and P2P will not trigger other progress event than the 1st)
                if ((event.p2pDuration + event.cdnDuration > 0) && event.p2pDownloaded > 0) {
                    let srTime = event.p2pDuration + event.cdnDuration;

                    // we set trequest delayed by srTime
                    this.stats.trequest = now - srTime;
                    // we set tifrst equal to trequest and add 10ms (arbitrary fake RTT), limited by half of srTime
                    // FIXME: we are introducing an error of 10ms in the bandwidth calculation based on tload - tfirst here.
                    //        we could instead use real rtt information from p2p module via srStats object
                    this.stats.tfirst = this.stats.trequest + Math.min(Math.round(srTime / 2), 10);
                } else {
                    this.stats.tfirst = now;
                }
            }

            this.onProgress(event, this.stats);
        }

        loadTimeout() {
            this.onTimeout(null, this.stats);
        }
    };
};

export default P2PLoaderGenerator_v0_5_46;
