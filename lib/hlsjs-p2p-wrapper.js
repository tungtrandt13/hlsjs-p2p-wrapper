"use strict";

import HlsjsP2PWrapperPrivate from './hlsjs-p2p-wrapper-private';
import StreamrootPeerAgentModule from 'streamroot-p2p';
import PeerAgentAPI from './peer-agent-api';

class HlsjsP2PWrapper {

    constructor(p2pConfig, hlsjs) {
        if (!!hlsjs) {
            let wrapper = new HlsjsP2PWrapperPrivate(p2pConfig, hlsjs, StreamrootPeerAgentModule);

            let peerAgentAPI = PeerAgentAPI.get(wrapper);
            Object.defineProperty(this, 'peerAgent', {
                get() {
                    return wrapper.peerAgentModule ? peerAgentAPI : null;
                }
            });
        } else {
            console.error('HLS.js instance must not be \'null\' or \'undefined\'.');
        }
    }

    get version() {
        return HlsjsP2PWrapper.version;
    }

    static get version() {
        return HlsjsP2PWrapperPrivate.version;
    }
}

export default HlsjsP2PWrapper;
