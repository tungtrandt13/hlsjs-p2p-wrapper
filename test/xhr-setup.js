import {extractInfoFromXhrSetup} from '../lib/utils';

describe("xhrSetup extractor",() => {

    it('should throw when we use a forbidden method', (done) => {
        try {
            extractInfoFromXhrSetup((xhr) => {
                xhr.open();
            });
        } catch (e) {
            // FIXME: no idea why should.throw doesn't work here, but this does ...
            // this is not really a problem since the test is still the same
            done();
            return;
        }
        throw new Error('failed!');
    });

    it('should throw when we write a forbidden property', (done) => {
        try {
            extractInfoFromXhrSetup((xhr) => {
                xhr.onload = () => {};
            });
        } catch (e) {
            // FIXME: no idea why should.throw doesn't work here, but this does ...
            // this is not really a problem since the test is still the same
            done();
            return;
        }
        throw new Error('failed!');
    });

    it('should throw when we access a forbidden read-only property', (done) => {
        try {
            extractInfoFromXhrSetup((xhr) => {
                xhr.response;
            });
        } catch (e) {
    		// FIXME: no idea why should.throw doesn't work here, but this does ...
    		// this is not really a problem since the test is still the same
            done();
            return;
        }
        throw new Error('failed!');
    });

    it('should not throw when we call setRequestHeader', () => {

        extractInfoFromXhrSetup((xhr) => {
            xhr.setRequestHeader('SomeHeader', 'SomeValue');
        }).should.not.throw;

    });

    it('should not throw when we access withCredentials', () => {
        extractInfoFromXhrSetup((xhr) => {
            xhr.withCredentials.should.be.false;
            xhr.withCredentials = true;
        }).should.not.throw;
    });

    it('should return a hash with correct values', () => {
        let {headers, withCredentials} = extractInfoFromXhrSetup((xhr) => {
            xhr.withCredentials.should.be.false;
            xhr.withCredentials = true;
            xhr.setRequestHeader('SomeHeader', 'SomeValue');
        });

        headers.should.be.eql({'SomeHeader': 'SomeValue'});
        withCredentials.should.be.true;
    });

});