"use strict";

import HlsjsP2PWrapperPrivate from './hlsjs-p2p-wrapper-private';
import StreamrootPeerAgentModule from 'streamroot-p2p';

class HlsjsP2PWrapper {

    constructor(hlsjsConstructor) {
        let wrapper = new HlsjsP2PWrapperPrivate(hlsjsConstructor, StreamrootPeerAgentModule);
        this.createPlayer = wrapper.createPlayer.bind(wrapper);
        this.createSRModule = wrapper.createSRModule.bind(wrapper);
        this.P2PLoader = wrapper.P2PLoader;

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

    static get version() {
        return HlsjsP2PWrapperPrivate.version;
    }
}

export default HlsjsP2PWrapper;
