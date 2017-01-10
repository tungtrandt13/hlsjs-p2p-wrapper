import webpack from 'webpack';
import { baseConfig, ROOT_PATH } from './webpack.base';
import parseArgv from './tools/parseArgv';

const { version } = require(`${ROOT_PATH}/package.json`);

export default Object.assign(baseConfig, {
    entry: [`${ROOT_PATH}/lib/hlsjs-p2p-bundle.js`],

    output: {
        library: [
            'Hls'
        ],
        libraryTarget: 'umd',
        path: `${ROOT_PATH}/dist/bundle`,
        filename: 'hlsjs-p2p-bundle.js',
    },

    plugins: [
        new webpack.DefinePlugin({
            _VERSION_: JSON.stringify(version),
        }),
    ]
});
