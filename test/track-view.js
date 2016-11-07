import TrackView from '../lib/integration/mapping/track-view';

describe("TrackView",() => {
    describe("isEqual", function() {
        it('should be equal', () => {
            let trackView1 = new TrackView({level: 0, urlId: 1});
            let trackView2 = new TrackView({level: 0, urlId: 1});
            trackView1.isEqual(trackView2).should.be.true();
        });

        it('should not be equal if level is different', () => {
            let trackView1 = new TrackView({level: 0, urlId: 1});
            let trackView2 = new TrackView({level: 1, urlId: 1});
            trackView1.isEqual(trackView2).should.be.false();
        });

        it('should not be equal if urlId is different', () => {
            let trackView1 = new TrackView({level: 0, urlId: 1});
            let trackView2 = new TrackView({level: 0, urlId: 0});
            trackView1.isEqual(trackView2).should.be.false();
        });
    });
    describe("viewToString", function() {
        it('same tracks should have the same string output', () => {
            let trackView1 = new TrackView({level: 0, urlId: 1});
            let trackView2 = new TrackView({level: 0, urlId: 1});
            trackView1.viewToString().should.eql(trackView2.viewToString());
        });

        it('tracks with different level should have different output', () => {
            let trackView1 = new TrackView({level: 0, urlId: 1});
            let trackView2 = new TrackView({level: 1, urlId: 1});
            trackView1.viewToString().should.not.eql(trackView2.viewToString());
        });

        it('tracks with different urlId should have different output', () => {
            let trackView1 = new TrackView({level: 0, urlId: 1});
            let trackView2 = new TrackView({level: 0, urlId: 0});
            trackView1.viewToString().should.not.eql(trackView2.viewToString());
        });
    });
});
