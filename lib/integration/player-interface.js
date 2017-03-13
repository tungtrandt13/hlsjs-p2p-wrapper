import EventEmitter from 'events';
import TrackView from './mapping/track-view';
import ExternalEvents from './external-events';

class PlayerInterface extends EventEmitter {

    constructor(hls, onDispose) {
        super();

        this.hls = hls;


        this.onDispose = onDispose;

        // eslint-disable-next-line no-unused-vars
        this.hls.on(hls.constructor.Events.LEVEL_SWITCH, (event, data) => {
            const { urlId, bitrate } = this.hls.levels[data.level];
            this.emit(ExternalEvents.TRACK_CHANGE_EVENT, {
                video: new TrackView({ urlId, bitrate, level: data.level })
            });
        });

        this.hls.on(hls.constructor.Events.FRAG_LOAD_EMERGENCY_ABORTED, () => {
            this.emit(ExternalEvents.EMERGENCY_FRAG_LOAD_ABORT);
        });

        this.hls.on(hls.constructor.Events.DESTROYING, () => {
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
