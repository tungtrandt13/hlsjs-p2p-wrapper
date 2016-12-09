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
            }
        };
    });

    it("should return null if peerAgent is not initialized", (done) => {
        let hls = new Hls();
        let wrapper = new HlsjsP2PWrapper(config.p2pConfig, hls);
        should.equal(wrapper.peerAgent, null);

        done();
    });

});
