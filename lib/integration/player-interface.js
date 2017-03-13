import EventEmitter from 'events';
import TrackView from './mapping/track-view';
import ExternalEvents from './external-events';

class PlayerInterface extends EventEmitter {

    constructor(hls, onDispose) {
        super();

        this.hls = hls;


        this.onDispose = onDispose;

        // LEVEL_SWITCH is going to be deprecated in next major release
        // https://github.com/dailymotion/hls.js/blob/2287cfebc187db0d342aca03773410abc8872f6c/src/events.js#L32
        const QUALITY_CHANGE_EVENT = hls.constructor.Events.LEVEL_SWITCH || hls.constructor.Events.LEVEL_SWITCHING;
        if (QUALITY_CHANGE_EVENT === undefined) {
            throw new Error('Can\'t find neither LEVEL_SWITCH nor LEVEL_SWITCHING hls.js event.');
        }
        // eslint-disable-next-line no-unused-vars
        this.hls.on(QUALITY_CHANGE_EVENT, (event, data) => {
            const { urlId, bitrate } = this.hls.levels[data.level];
            this.emit(ExternalEvents.TRACK_CHANGE_EVENT, {
                video: new TrackView({ urlId, bitrate, level: data.level })
            });
        });

        const FRAG_LOAD_EMERGENCY_ABORTED_EVENT = hls.constructor.Events.FRAG_LOAD_EMERGENCY_ABORTED;
        if (FRAG_LOAD_EMERGENCY_ABORTED_EVENT === undefined) {
            throw new Error('Can not find FRAG_LOAD_EMERGENCY_ABORTED hls.js event.');
        }
        this.hls.on(FRAG_LOAD_EMERGENCY_ABORTED_EVENT, () => {
            this.emit(ExternalEvents.EMERGENCY_FRAG_LOAD_ABORT);
        });

        const DESTROYING_EVENT = hls.constructor.Events.DESTROYING;
        if (DESTROYING_EVENT === undefined) {
            throw new Error('Can not find DESTROYING_EVENT hls.js event.');
        }
        this.hls.on(DESTROYING_EVENT, () => {
            this.onDispose();
        });
    }


  /**
    * @returns boolean
    */
    isLive() {
        if (!this.hls.levels) {
            throw new Error("Called isLive before the master playlist was parsed");
        }

        for (let level of this.hls.levels) {
            if (level.details) {
                return !!level.details.live;
            }
        }

        throw new Error("Called isLive before any levelplaylist was parsed");
    }

    getBufferLevelMax() {
        let confParam;
        let maxBufferLevel;
        if (this.hls.config.liveSyncDuration) {
            confParam = "liveSyncDuration";
            maxBufferLevel = this.hls.config.liveSyncDuration;
        } else {
            confParam = "maxBufferLength";
            maxBufferLevel = this.hls.config.maxBufferLength;
        }

        if (maxBufferLevel < 0) {
            throw Error(`Invalid configuration: hlsjsConfig.${confParam} must be greater than p2pConfig.liveMinBufferMargin`);
        }

        return maxBufferLevel;
    }

    setBufferMarginLive(bufferLevel) {
        this.hls.config.maxBufferSize = 0;
        this.hls.config.maxBufferLength = bufferLevel;
    }

    addEventListener(eventName, listener) {
        if (ExternalEvents.isSupported(eventName)) {
            this.on(eventName, listener);
        } else {
            console.warn('Trying to add an unsupported event listener. eventName=', eventName);
        }
    }

    removeEventListener(eventName, listener) {
        if (ExternalEvents.isSupported(eventName)) {
            this.removeListener(eventName, listener);
        } else {
            console.warn('Trying to remove an unsupported event listener. eventName=', eventName);
        }
    }

}

export default PlayerInterface;
