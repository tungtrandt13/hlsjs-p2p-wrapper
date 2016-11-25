import PlayerInterface from './integration/player-interface';
import MediaMap from './integration/mapping/media-map';
import SegmentView from './integration/mapping/segment-view';
import p2pLoaderGenerator from './integration/p2p-loader-generator';
import StreamrootPeerAgentModule from 'streamroot-p2p';

/**
 * A wrapper for provided hls.js media engine instance around the P2P agent
 * This should allow to hold a session around a particular content ID with a given media engine instance using the Streamroot P2P agent.
 * @class
 */
class HlsjsP2PWrapperPrivate {

    /**
     * Asynchronously constructs an instance of a StreamrootWrapper
     * @constructor
     * @param {object} p2pConfig - Client specific P2P configuration.
     * @param {objeсt} hlsjs - Hls.js instance
     */
    constructor(p2pConfig, hlsjs) {
        if (!p2pConfig || typeof p2pConfig !== 'object') {
            throw new Error('p2pConfig must be a valid config object');
        }

        if (!!hlsjs.url) {
            // synchronous peer agent initialization if hls.js instance loaded the manifest already
            this._createPeerAgent(p2pConfig, hlsjs);
        } else {
            // asynchronous peer agent initialization if hls.js instance has't started manifest loading yet
            hlsjs.on(hlsjs.constructor.Events.MANIFEST_LOADING, () => {
                this._createPeerAgent(p2pConfig, hlsjs);
            });
        }
    }

    /**
     * Disposes the agent instance.
     */
    onDispose() {
        if (!this.peerAgentModule) {
            return;
        }

        this.peerAgentModule.dispose();
        delete this.peerAgentModule;
    }

    /**
     * Indicates wether there is an existing agent instance alive.
     * @method
     * @return {boolean} True when there is an existing session
     */
    hasSession() {
        return !!this.peerAgentModule;
    }

    /**
     * Creates the internal P2P agent instance.
     *
     * @method
     * @param {object} p2pConfig - P2P agent configuration
     * @param {object} hlsjs - Hls.js configuration
     *
     */
    _createPeerAgent(p2pConfig, hlsjs) {
        this.hls = hlsjs;
        const streamType = StreamrootPeerAgentModule.StreamTypes.HLS;
        const integrationVersion = 'v2';

        if (this.hasSession()) {
            throw new Error('Streamroot session already started');
        }

        const contentUrl = hlsjs.url;
        if (!contentUrl) {
            throw new Error('Hls.js instance must have valid `url` property');
        }

        hlsjs.config.fLoader = p2pLoaderGenerator(this);

        // attach error handling to media engine
        hlsjs.on(hlsjs.constructor.Events.ERROR, this._onMediaEngineError);

        const playerBridge = new PlayerInterface(hlsjs, this.onDispose.bind(this));
        const mediaMap = new MediaMap(hlsjs);

        this.peerAgentModule = new StreamrootPeerAgentModule(playerBridge, contentUrl, mediaMap, p2pConfig, SegmentView, streamType, integrationVersion);
        this._setMediaElement(hlsjs);
    }

    /**
     * Pass media element to peer-agent, either synchronously if media element is already attached to hls.js, or when we receive hls.js's MEDIA_ATTACHING event
     * @param {object} hlsjs - Hls.js configuration
     */
    _setMediaElement(hlsjs) {
        if (hlsjs.media) {
            this.peerAgentModule.setMediaElement(hlsjs.media);
        } else {
            hlsjs.on(hlsjs.constructor.Events.MEDIA_ATTACHING, () => {
                this.peerAgentModule.setMediaElement(hlsjs.media);
            });
        }
    }

    _onMediaEngineError(event, data) {
        /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "event" }] */
        if (data.fatal) {
            console.error('Hls.js fatal error: ' + data.type + ' - ' + data.details);
        } else {
            console.warn('Hls.js non-fatal error: ' + data.type + ' - ' + data.details);
        }
    }

    static get version() {
        return _VERSION_;
    }
}

export default HlsjsP2PWrapperPrivate;
