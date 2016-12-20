# hlsjs-p2p-wrapper

This module wraps an instance of [`hls.js`](https://github.com/dailymotion/hls.js) to bootstrap it with [the Streamroot P2P module](http://streamroot.io).

It provides a **bundle** that extends the [`hls.js`](https://github.com/dailymotion/hls.js) constructor to create a fully configured player which will use the Streamroot P2P module, giving you the exact same API.
You can integrate this bundle with minimal changes in your application (you only need to add an additional argument to the [`hls.js`](https://github.com/dailymotion/hls.js) constructor). **The bundled version of [`hls.js`](https://github.com/dailymotion/hls.js) is [`v0.6.12`](https://github.com/dailymotion/hls.js/releases/tag/v0.6.12)**.

It also provides a **wrapper** that allows you to create/configure a player with a specific version of [`hls.js`](https://github.com/dailymotion/hls.js).
Supported versions of [`hls.js`](https://github.com/dailymotion/hls.js): from [`v0.5.46`](https://github.com/dailymotion/hls.js/releases/tag/v0.5.46) to [`v0.6.12`](https://github.com/dailymotion/hls.js/releases/tag/v0.6.12).

### Install via npm

You can install the artifacts distributed as NPM modules:

For the wrapper with [`hls.js`](https://github.com/dailymotion/hls.js) included:

```
npm install streamroot-hlsjs-p2p-bundle
```

For the wrapper without [`hls.js`](https://github.com/dailymotion/hls.js):

```
npm install streamroot-hlsjs-p2p-wrapper
```

In your application import/require the package you want to use as in the example like

```javascript
import StreamrootHlsjsP2PBundle from 'streamroot-hlsjs-p2p-bundle';
```

or

```javascript
import StreamrootHlsjsP2PWrapper from 'streamroot-hlsjs-p2p-wrapper';
```

### Build

#### Pre-requisites

First of all, make sure you are using a Node.js version >= 6.0.0

Since the installation uses a Ruby script, you need Ruby to be installed on your machine. On most Linux distros and on macOS, it's installed by default, but for Windows you need to install it [manually](https://www.ruby-lang.org/en/).

Finally, one of the install steps assumes the presence of `wget` on your system. Again this is most likely installed on all Unix based systems. If you have a Mac, you could use [Homebrew](https://brew.sh/) and then run `brew install wget`.

Webpack is used for building, so make sure that you have `webpack` installed in your global node binaries otherwise install it like this:
```
sudo npm install -g webpack
```

#### Clone this repo

```
git clone https://github.com/streamroot/hlsjs-p2p-wrapper.git
```

#### Install library dependencies

```
npm install
```

#### Build bundle

Run this task to build it:
```
npm run build:bundle
```

Now you can include `dist/bundle/hlsjs-p2p-bundle.js` in your application.

To build and compile-watch development/debug version use:

```
npm run build:bundle_dev
```

#### Build wrapper

Run this task to build it:
```
npm run build:wrapper
```

Now you can include `dist/wrapper/hlsjs-p2p-wrapper.js` in your application.

To build and compile-watch development/debug version use:

```
npm run build:wrapper_dev
```

### Tests

For running unit tests (in node.js), use

```
npm test
```

For integration tests (Running in PhantomJS/Chrome browsers via Karma through Mocha plugin), use

```
npm run karma
```

IMPORTANT: Set `export NODE_ENV=development` in your shell to make sure Karma will use all your local browser capabilities when in dev mode.

For integration tests in dev mode (Mocha suite running in your favorite browser, better for debugging):

1. Start dev server:

```
npm start
```

2. Start compile&watch process (in another shell):

```
npm run karma_dev
```

3. Go to http://localhost:8080/test/html/

### Example

#### Bundle

Include the bundle build in your app.

```html
<head>
    <!-- path to hlsjs-p2p-bundle build -->
    <script src="hlsjs-p2p-bundle.js"></script>
</head>
```

Create `hls.js` instance passing `hlsjsConfig` and `p2pConfig` as constructor params.

```javascript
var hlsjsConfig = {
    debug: true,
    maxBufferSize: 0,       // Highly recommended setting
    maxBufferLength: 30,    // Highly recommended setting
    liveSyncDuration: 30    // Highly recommended setting
};

var p2pConfig = {
    streamrootKey: YOUR_STREAMROOT_KEY_HERE
};

// Hls constructor is overriden by included bundle
var hls = new Hls(hlsjsConfig, p2pConfig);
// Use `hls` just like your usual hls.js ...
```

#### Wrapper

Include the wrapper build and [`hls.js`](https://github.com/dailymotion/hls.js) build in your app.

```html
<head>
    <!-- path to hlsjs-p2p-wrapper build -->
    <script src="hlsjs-p2p-wrapper.js"></script>

    <!-- hls.js build of your choice -->
    <script src="hls.js"></script>
</head>
```

Create [`hls.js`](https://github.com/dailymotion/hls.js) instance passsing `hlsjsConfig` as param.
Create [`hls.js`](https://github.com/dailymotion/hls.js) wrapper instance passing `p2pConfig` and `hls.js` instance as params. Call hls.js `loadSource` and `attachMedia` methods.

**Please note that you can intialize the wrapper any time after hls.js is initialized, even after calling `hls.attachSource` or `hls.attachMedia`, and even if the playback has started already. This late p2p init option is possible only with wrapper, bundle does not support this feature.**


```javascript
var hlsjsConfig = {
    debug: true,
    maxBufferSize: 0,       // Highly recommended setting
    maxBufferLength: 30,    // Highly recommended setting
    liveSyncDuration: 30    // Highly recommended setting
};

var p2pConfig = {
    streamrootKey: YOUR_STREAMROOT_KEY_HERE
};

var hls = new Hls(hlsjsConfig);
var wrapper = new HlsjsP2PWrapper(p2pConfig, hls);

// Use `hls` just like your usual hls.js…
hls.loadSource(contentUrl);
hls.attachMedia(video);
hls.on(Hls.Events.MANIFEST_PARSED,function() {
    video.play();
});
```

To see full sample code and extended possibilities of how to use this module, take a look at the code in the `example` directory.

### Configuration

Specify your `streamrootKey` in the `p2pConfig` object. If you don't have it, go to [Streamroot's dashboard](http://dashboard.streamroot.io/) and sign up. It's free. You can check other `p2pConfig` options in the [documentation](https://streamroot.readme.io/docs/p2p-config).

Recommended `hlsjsConfig` settings:

```javascript
var hlsjsConfig = {
    maxBufferSize: 0,       // Highly recommended setting
    maxBufferLength: 30,    // Highly recommended setting
    liveSyncDuration: 30    // Highly recommended setting
};
```

Detailed recommendations about [`hls.js`](https://github.com/dailymotion/hls.js) configuration [here](https://streamroot.readme.io/docs/hls-config).

### Peer agent instance exposure

#### Bundle

Not available yet.

#### Wrapper

A `peerAgent` public API is exposed on a `HlsjsP2PWrapper` instance -- `wrapper.peerAgent`.
List of peerAgent's public API getters/setters is documented here https://streamroot.readme.io/docs/peeragent-class-reference.

### Run demos

To build and run the shipped [`hls.js`](https://github.com/dailymotion/hls.js) and Streamroot demos run:

```
npm run demo
```

This will start a server.

Go to <http://localhost:8080/example> for the Streamroot demo.

Go to <http://localhost:8080/demo> for the [`hls.js`](https://github.com/dailymotion/hls.js) demo.

To see some p2p traffic open several browser tabs/windows playing the same manifest (so there will be peers to exchange p2p traffic).

### API docs

The public API documentation is generated from the code.

After clonig the repo run:

```
npm run docs
```

### Player integration

The module is integrated in the following players:

* [Video.js 5](https://github.com/videojs/video.js/) through [videojs5-hlsjs-p2p-source-handler](https://github.com/streamroot/videojs5-hlsjs-p2p-source-handler)
