import HlsjsP2PWrapper from "../../lib/hlsjs-p2p-wrapper.js";
import Hls from "hls.js";
import should from 'should';

describe("HlsjsP2PWrapper", function() { // using plain ES5 function here
                                            // otherwise `this.timeout` is broken
    this.timeout(10000);

    let config;
    before(() => {
        config = {
            p2pConfig:{
                streamrootKey: "ry-v7xuywnt",
                debug: true,
            },
            contentUrl: 'http://www.streambox.fr/playlists/test_001/stream.m3u8',
        };
    });

    it("should return null as peerAgent public API while peer agent is not initialized", (done) => {
        let hls = new Hls();
        let wrapper = new HlsjsP2PWrapper(config.p2pConfig, hls);
        should.equal(wrapper.peerAgent, null);

        hls.loadSource(config.contentUrl);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            should.exist(wrapper.peerAgent);
            done();
        });
    });

});
