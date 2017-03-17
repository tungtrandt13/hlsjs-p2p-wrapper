const TRACK_CHANGE_EVENT = 'onTrackChange';
const EMERGENCY_FRAG_LOAD_ABORT = 'onEmergencyFragLoadAborted';

const supportedEvents = [
    TRACK_CHANGE_EVENT,
    EMERGENCY_FRAG_LOAD_ABORT
];

const isSupported = (eventName) => supportedEvents.indexOf(eventName) > -1;

module.exports = {

    TRACK_CHANGE_EVENT,
    EMERGENCY_FRAG_LOAD_ABORT,

    isSupported

};