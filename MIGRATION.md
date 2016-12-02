# How to migrate from v3.x to v4.x

## Bundle

For the Hls bundle nothing changes. You can still construct a player like before with it, and passing P2P config as second parameter.

## Wrapper
This is the legacy v3 way of configuring a player to use Streamroot using the wrapper directly:

```javascript
let hls;
let video = document.getElementById('video');

// Create wrapper where we dependency-inject the Hls.js constructor (in this example we use the one provided by the bundle)
let wrapper = new HlsjsP2PWrapper(Hls);

let p2pConfig = {
    streamrootKey: YOUR_STREAMROOT_KEY_HERE
};

// To create a new configured default player using the wrapper toolkit
hls = wrapper.createPlayer(hlsjsConfig, p2pConfig);

hls.loadSource(config.contentUrl);
hls.attachMedia(video);
hls.on(Hls.Events.MANIFEST_PARSED,function() {
    video.play();
});
```

It's not supported in v4 anymore, use new simplified API instead:

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
```

Create `Hls` instance passing hls.js config as a constructor param. Then create `HlsjsP2PWrapper` instance passing `p2pConfig` and `Hls` instance as params.

If hls.js has not start loading manifest at the time of wrapper creation, wrapper will wait for `Hls.Events.MANIFEST_LOADING` event before initializing peer agent. Otherwise, peer agent will be initialized synchronously at the time of wrapper creation.

So, you can instantiate the wrapper either immediately with hls.js, or later at any time of hls.js lifecycle.
