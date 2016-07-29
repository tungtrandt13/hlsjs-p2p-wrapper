import {BaseXHR} from 'xhr-shaper';

function inheritStaticPropertiesReadOnly(target, source) {

    function defineReadOnlyProperty(staticProperty) {
        Object.defineProperty(target, staticProperty, {
            get: function () {
                return source[staticProperty];
            },
            set: undefined
        });
    }

    for (var staticProperty of Object.getOwnPropertyNames(source)) {
        if (["prototype", "name", "length", "caller", "arguments", "isSupported"].indexOf(staticProperty) === -1) {
            defineReadOnlyProperty(staticProperty);
        }
    }
}

function extractInfoFromXhrSetup(xhrSetup, url, headersBase) {
    var headers = headersBase || {};

    // this will get called when the `on...` event handler properties
    // are set on BaseXHR
    var noEventHandlers = () => {
        throw new Error('Can\'t use event handler property in this xhrSetup function. Contact Streamroot support.');
    };

    const xhrMock = new BaseXHR({
        setRequestHeader: (header, value) => {
            headers[header] = value;
        },
        withCredentials: false
    }, noEventHandlers, noEventHandlers, noEventHandlers);

    // In case xhrSetup calls functions others than the one implemented
    // above on xhrMock (like `setRequestHeader`) then BaseXHR will throw
    // We will also throw explicitly at an attempt to set event handlers (on...)
    // A call to an undefined function will throw anyway
    xhrSetup && xhrSetup(xhrMock, url);

    return {headers, withCredentials: xhrMock.withCredentials};
}

export {
    inheritStaticPropertiesReadOnly,
    extractInfoFromXhrSetup
};
