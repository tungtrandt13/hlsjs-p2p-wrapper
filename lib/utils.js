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

/**
 * Extracts HTTP request headers and withCredentials option from `xhrSetup` hls.js-like function via an XHR mock.
 * @function
 * @returns a hash like {headers: Object, withCredentials: Boolean}. Headers object will at least be empty in any case
 *
 */
function extractInfoFromXhrSetup(xhrSetup, originalURL, headersBase) {
    const headers = headersBase || {};
    let url = originalURL;

    const xhrMock = new BaseXHR({
        setRequestHeader: (header, value) => {
            headers[header] = value;
        },
        withCredentials: false,
        open: (method, openURL, async = true) => {
            if (method !== 'GET') {
                throw new Error('xhrSetup is calling open with a method other than GET, which is not supported at the moment. Please contact Streamroot support');
            }
            if (async !== true) {
                throw new Error('xhrSetup is trying to open a synchronous request, which is not supported at the moment. Please contact Streamroot support');
            }
            url = openURL;
        }
    });

    // In case xhrSetup calls functions others than the one implemented
    // above on xhrMock (like `setRequestHeader`) then BaseXHR will throw
    // We will also throw explicitly at an attempt to set event handlers (on...)
    // A call to an undefined function will throw anyway
    try {
        xhrSetup && xhrSetup(xhrMock, originalURL);
    } catch (e) {
        throw new Error('xhrSetup is trying to acces a forbidden property/method of XHR mock. Please contact Streamroot support. Internal mock error: ' + e.message);
    }

    return {headers, withCredentials: xhrMock.withCredentials, url};
}

export {
    inheritStaticPropertiesReadOnly,
    extractInfoFromXhrSetup
};
