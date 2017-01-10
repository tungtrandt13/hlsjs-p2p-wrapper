import webpack from 'webpack';
import { baseConfig, ROOT_PATH } from './webpack.base';
import parseArgv from './tools/parseArgv';

const { version } = require(`${ROOT_PATH}/package.json`);

export default Object.assign(baseConfig, {
    entry: [`${ROOT_PATH}/lib/hlsjs-p2p-wrapper.js`],

    output: {
        library: [
            'HlsjsP2PWrapper'
        ],
        libraryTarget: 'umd',
        path: `${ROOT_PATH}/dist/wrapper`,
        filename: 'hlsjs-p2p-wrapper.js',
    },

    plugins: [
        new webpack.DefinePlugin({
            _VERSION_: JSON.stringify(version),
        }),
    ]
});
