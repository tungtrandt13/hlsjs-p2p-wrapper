"use strict";

import HlsjsP2PWrapperPrivate from './hlsjs-p2p-wrapper-private';
import StreamrootPeerAgentModule from 'streamroot-p2p';
import PeerAgentAPI from './peer-agent-api';

class HlsjsP2PWrapper {

    constructor(p2pConfig, hlsjs) {
        let wrapper = new HlsjsP2PWrapperPrivate(p2pConfig, hlsjs, StreamrootPeerAgentModule);

        this.peerAgent = PeerAgentAPI.get(wrapper);
    }

    get version() {
        return HlsjsP2PWrapper.version;
    }

    static get version() {
        return HlsjsP2PWrapperPrivate.version;
    }
}

export default HlsjsP2PWrapper;
