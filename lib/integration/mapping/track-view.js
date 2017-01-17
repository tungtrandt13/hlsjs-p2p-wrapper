class TrackView {

    constructor(obj) {
        this.level = obj.level;
        this.urlId = obj.urlId;
        this.bitrate = obj.bitrate;
    }

    /**
     * @returns {String}
     */
    viewToString() {
        return `L${this.level}U${this.urlId}`;
    }

    /**
     * @param trackView {TrackView}
     * @returns {boolean}
     */
    isEqual(trackView) {
        if (!trackView) {
            return false;
        }
        return trackView.level === this.level && trackView.urlId === this.urlId;
    }

    get type() {
        return "video";
    }
}

export default TrackView;
