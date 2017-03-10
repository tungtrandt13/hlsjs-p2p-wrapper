const TRACK_CHANGE_EVENT = 'onTrackChange';

const supportedEvents = [
    TRACK_CHANGE_EVENT,
];

const isSupported = (eventName) => supportedEvents.indexOf(eventName) > -1;

module.exports = {

    TRACK_CHANGE_EVENT,

    isSupported

};