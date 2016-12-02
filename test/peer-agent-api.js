import PeerAgentAPI from '../lib/peer-agent-api';

const peerAgentMock = {
    isP2PEnabled: true,
    p2pDownloadOn: true,
    stats: {},
    version: 'fakeVersion',
    p2pUploadOn: true,
    dispose: () => {

    }
};

const privateWrapperMock = {
    peerAgentModule: peerAgentMock,
};

describe('PeerAgentAPI', () => {
    it('should expose defined list of properties only', () => {
        const peerAgentAPI = PeerAgentAPI.get(privateWrapperMock);

        peerAgentAPI.should.eql({
            stats: peerAgentMock.stats,
            version: peerAgentMock.version,
            isP2PEnabled: peerAgentMock.isP2PEnabled,
            p2pDownloadOn: peerAgentMock.p2pDownloadOn,
            p2pUploadOn: peerAgentMock.p2pUploadOn,
        });
    });

    it('should expose stats correctly and throw if trying to set its value', () => {
        const peerAgentAPI = PeerAgentAPI.get(privateWrapperMock);

        peerAgentAPI.stats.should.equal(peerAgentMock.stats);
        (() => { peerAgentAPI.stats = {}; }).should.throw();
    });

    it('should expose correct peer agent version', () => {
        const peerAgentAPI = PeerAgentAPI.get(privateWrapperMock);

        peerAgentAPI.version.should.equal(peerAgentMock.version);
    });

    it('should expose isP2PEnabled correctly and throw if trying to set its value', () => {
        const peerAgentAPI = PeerAgentAPI.get(privateWrapperMock);

        peerAgentAPI.isP2PEnabled.should.equal(peerAgentMock.isP2PEnabled);
        (() => { peerAgentAPI.isP2PEnabled = false; }).should.throw();
    });

    it('should expose p2pDownloadOn correctly and allow setting its value', () => {
        const peerAgentAPI = PeerAgentAPI.get(privateWrapperMock);

        peerAgentAPI.p2pDownloadOn.should.equal(peerAgentMock.p2pDownloadOn);
        peerAgentAPI.p2pDownloadOn = false;
        peerAgentAPI.p2pDownloadOn.should.equal(false);
    });

    it('should expose p2pUploadOn correctly and allow setting its value', () => {
        const peerAgentAPI = PeerAgentAPI.get(privateWrapperMock);

        peerAgentAPI.p2pUploadOn.should.equal(peerAgentMock.p2pUploadOn);
        peerAgentAPI.p2pUploadOn = false;
        peerAgentAPI.p2pUploadOn.should.equal(false);
    });
});