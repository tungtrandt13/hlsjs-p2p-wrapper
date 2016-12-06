import p2pLoaderGenerator_v0_5_46 from './p2p-loader-generator-v0-5-46';
import p2pLoaderGenerator_v0_6_2 from './p2p-loader-generator-v0-6-2';

const P2PLoaderGenerator = function (hlsjsWrapper) {

    let hlsjsVersion = hlsjsWrapper.hls.constructor.version;
    if (hlsjsVersion === undefined) {
        return p2pLoaderGenerator_v0_5_46(hlsjsWrapper);
    } else {
        let versionParts = hlsjsVersion.split('.');
        let minor = versionParts[1];
        let patch = versionParts[2];
        if (Number(minor) >= 6 && Number(patch) >= 2) {
            return p2pLoaderGenerator_v0_6_2(hlsjsWrapper);
        }

        return p2pLoaderGenerator_v0_5_46(hlsjsWrapper);
    }
};

export default P2PLoaderGenerator;
