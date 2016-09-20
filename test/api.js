import HlsjsP2PWrapper from '../lib/hlsjs-p2p-wrapper-private';

describe("API", () => {

    beforeEach(() => {
        global._VERSION_ = 'foobar';
    });

    afterEach(() => {
        delete global._VERSION_;
    });

    it('should expose a version property', () => {
        HlsjsP2PWrapper.version.should.be.eql('foobar');
    });
});
