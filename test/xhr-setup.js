import {extractInfoFromXhrSetup} from '../lib/utils';

describe("xhrSetup extractor",() => {

    it('should throw when we use a forbidden method', () => {
        extractInfoFromXhrSetup.bind(null, (xhr) => {
            xhr.open();
        }).should.throw(Error);
    });

    it('should throw when we write a forbidden property', () => {
        extractInfoFromXhrSetup.bind(null, (xhr) => {
            xhr.onloadend = () => {};
        }).should.throw(Error);
    });

    it('should throw when we access a forbidden read-only property', () => {
        extractInfoFromXhrSetup.bind(null, (xhr) => {
            xhr.response;
        }).should.throw(Error);
    });

    it('should not throw when we call setRequestHeader', () => {
        extractInfoFromXhrSetup.bind(null, (xhr) => {
            xhr.setRequestHeader('SomeHeader', 'SomeValue');
        }).should.not.throw;
    });

    it('should not throw when we access withCredentials', () => {
        extractInfoFromXhrSetup.bind(null, (xhr) => {
            xhr.withCredentials.should.be.false;
            xhr.withCredentials = true;
        }).should.not.throw;
    });

    it('should throw when we call open with a method other than GET', () => {
        extractInfoFromXhrSetup.bind(null, (xhr) => {
            xhr.open('POST', 'foo', true)
        }).should.throw;
    });

    it('should throw when we call open with sync=false', () => {
        extractInfoFromXhrSetup.bind(null, (xhr) => {
            xhr.open('GET', 'foo', false)
        }).should.throw;
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

    it('should extend base headers when present', () => {
        let {headers} = extractInfoFromXhrSetup((xhr, url) => {
            xhr.setRequestHeader('bla', 'bla');
            url.should.eql('foobar');
        }, "foobar", {foo: "bar"});

        headers.should.eql({foo: "bar", bla: 'bla'});
    });

    it('should pass through URL to `xhrSetup` when present', () => {
        extractInfoFromXhrSetup((xhr, url) => {
            xhr.setRequestHeader('bla', 'bla');
            url.should.eql('foobar');
        }, "foobar");
    });

    it('should return original URL when open is not called', () => {
        let originalURL = 'foobar';
        let { url } = extractInfoFromXhrSetup((xhr, xhrSetupURL) => {}, originalURL);
        url.should.equal(originalURL);
    });

    it('should return URL passed to "open" when called', () => {
        let modifiedURL = "baz";
        let originalURL = 'foobar';
        let { url } = extractInfoFromXhrSetup((xhr, xhrSetupURL) => {
            xhr.open('GET', modifiedURL);
        }, originalURL);
        url.should.equal(modifiedURL);
    });
});
