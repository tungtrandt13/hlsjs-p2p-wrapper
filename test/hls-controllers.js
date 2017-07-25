import Hls from "hls.js";
import HlsMock from "./mocks/hls";
import StreamController from "../node_modules/hls.js/lib/controller/stream-controller.js";

const AbrController = Hls.DefaultConfig.abrController;

global.performance = {
    now: Date.now
};

describe("Hls controllers", () => {

    it("should estimate the right bandwidth according to stats of loaded fragment", () => {

        let hlsMock = new HlsMock(5, false, 0, false);
        let abrController = new AbrController(hlsMock);

        const frag = {
            loadCounter: 1,
            url: "http://foo.bar/foo",
            level: 1,
            bitrateTest: true,
            type: "main"
        };

        let now = Date.now();
        const stats = {
            trequest: now - 1000,
            tload: now,
            loaded: 128000
        };

        abrController.onFragLoading({frag});
        abrController.onFragLoaded({frag, stats});

        abrController._bwEstimator.getEstimate().should.be.approximately(1024000, 4000);
        abrController.lastLoadedFragLevel.should.be.equal(frag.level);
    });

    it("should estimate the right bandwidth according to stats of buffered fragment", () => {

        let hlsMock = new HlsMock(5, false, 0, false);
        let streamController = new StreamController(hlsMock);

        // Invoke this to initialize bufferRange, which helps bypass a bufferRange check inside onBufferAppended added in 0.6.21
        streamController.onManifestLoading();

        const frag = {
            loadCounter: 1,
            url: "http://foo.bar/foo",
            level: 1,
            sn: 0,
            type: "main"
        };

        let now = Date.now();
        const stats = {
            trequest: now - 1000,
            tfirst: now - 1000,
            loaded: 128000,
            total: 128000
        };

        // monkey-patch up a working StreamController
        streamController.state = 'FRAG_LOADING';
        streamController.fragCurrent = frag;
        streamController.levels = hlsMock.levels;
        streamController.level = 0;
        streamController.demuxer = {
            push() {}
        };

        streamController.onFragLoaded({frag, stats});

        streamController.stats.should.be.equal(stats);

        streamController.state = 'PARSED';
        streamController.pendingAppending = 1;

        streamController.media = {
            buffered: 60
        };

        streamController.doTick = function() {};
        streamController.onBufferAppended({parent: 'main'});

        streamController.fragLastKbps.should.be.approximately(1000, 24);

    });

});
