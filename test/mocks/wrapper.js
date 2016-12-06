/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "Hls" }]*/

import PeerAgentMock from "./peer-agent";

class HlsjsWrapperMock {

    constructor(hls) {
        this.hls = hls;
        this.peerAgentModule = new PeerAgentMock();
    }

}

export default HlsjsWrapperMock;
