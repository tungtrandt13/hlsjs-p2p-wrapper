import jsdom from 'jsdom';

require('should');
require("babel-core/register");

global.jsdom = jsdom.jsdom;
global.document = global.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;

/**
 * Unsuported jsom globals
 */

global.Blob = () => {};
global.Worker = () => {};
global.URL = {
    createObjectURL: () => 'fakeUrl',
    revokeObjectURL: () => {},
};