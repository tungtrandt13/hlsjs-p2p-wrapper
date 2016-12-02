"use strict";

import HlsjsP2PWrapperPrivate from './hlsjs-p2p-wrapper-private';
import StreamrootPeerAgentModule from 'streamroot-p2p';

class HlsjsP2PWrapper {

    constructor(p2pConfig, hlsjs) {
        let wrapper = new HlsjsP2PWrapperPrivate(p2pConfig, hlsjs, StreamrootPeerAgentModule);

        Object.defineProperty(this, "stats", {
            get() {
                return wrapper.peerAgentModule.stats;
            }
        });

        Object.defineProperty(this, "p2pDownloadOn", {
            get: () => {
                return wrapper.peerAgentModule.p2pDownloadOn;
            },
            set: (on) => {
                wrapper.peerAgentModule.p2pDownloadOn = on;
            }
        });

        Object.defineProperty(this, "p2pUploadOn", {
            get: () => {
                return wrapper.peerAgentModule.p2pUploadOn;
            },
            set: (on) => {
                wrapper.peerAgentModule.p2pUploadOn = on;
            }
        });
    }

    get version() {
        return HlsjsP2PWrapper.version;
    }

    static get version() {
        return HlsjsP2PWrapperPrivate.version;
    }
}

export default HlsjsP2PWrapper;
