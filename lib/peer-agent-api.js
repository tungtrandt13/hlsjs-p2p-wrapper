function getPeerAgentAPI(privateWrapper) {

    const peerAgentAPI = {

        get stats() {
            return privateWrapper.peerAgentModule.stats;
        },

        get version() {
            return privateWrapper.peerAgentModule.version;
        },

        get isP2PEnabled() {
            return privateWrapper.peerAgentModule.isP2PEnabled;
        },

        get p2pDownloadOn() {
            return privateWrapper.peerAgentModule.p2pDownloadOn;
        },
        set p2pDownloadOn(value) {
            privateWrapper.peerAgentModule.p2pDownloadOn = value;
        },

        get p2pUploadOn() {
            return privateWrapper.peerAgentModule.p2pUploadOn;
        },
        set p2pUploadOn(value) {
            privateWrapper.peerAgentModule.p2pUploadOn = value;
        },
    };

    return peerAgentAPI;
}

export default { get: getPeerAgentAPI };