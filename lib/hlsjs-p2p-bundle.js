import HlsjsP2PWrapper from './hlsjs-p2p-wrapper';
import { inheritStaticPropertiesReadOnly } from './utils';
import Hlsjs from 'hls.js';
import extend from 'lodash.assigninwith';
import defaults from 'lodash.defaults';

/**
 * Shims Hls.js class. This de facto extends the class definition by ES6 spec, which means it inherits defined properties)
 *  and runs the base class constructor.
 *
 *  This constructor results in a valid Hls.js instance bootstrapped to use Streamroot.
 *
 *  NOTE: We don't use ES6 extend to avoid to have to call `super()`,
 *        which would run the constructor twice and creating a zombie context.
 *
 * @constructor
 * @param {object} hlsjsConfig - Hls.js config
 * @param {object} p2pConfig - Client specific Streameroot P2P agent config
 */


class StreamrootHlsjsBundle {
    constructor (hlsjsConfig, p2pConfig) {
        let recommendedHlsjsConfig = this._recommendedHlsjsConfig;
        if (hlsjsConfig.liveSyncDurationCount !== undefined) {
            delete recommendedHlsjsConfig.liveSyncDuration; // Don't override liveSyncDuration if liveSyncDurationCount has been manually set by user
        }

        let hlsjs = new Hlsjs(defaults(hlsjsConfig, recommendedHlsjsConfig));
        new HlsjsP2PWrapper(p2pConfig, hlsjs);

        return hlsjs;
    }

    get _recommendedHlsjsConfig() {
        return {
            maxBufferSize: 0,
            maxBufferLength: 30,
            liveSyncDuration: 30,
        };
    }
}

/**
 * Extend this class with Hls.js base class (inherits nested protoypes, in case you want to extend this further).
 * This is necessary to make this a fully valid and extensible class definiton by ES6.
 */
extend(StreamrootHlsjsBundle, Hlsjs);

/* Inherit static read-only props (like Events etc.) */
inheritStaticPropertiesReadOnly(StreamrootHlsjsBundle, Hlsjs);

export default StreamrootHlsjsBundle;
