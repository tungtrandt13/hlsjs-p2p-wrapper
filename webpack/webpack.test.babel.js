import webpack from 'webpack';
import { baseConfig, ROOT_PATH } from './webpack.base';
import parseArgv from './tools/parseArgv';

const { version } = require(`${ROOT_PATH}/package.json`);

export default Object.assign(baseConfig, {
    entry: [`${ROOT_PATH}/test/html/tests.js`],

    output: {
        library: [
            'Tests'
        ],
        libraryTarget: 'umd',
        path: `${ROOT_PATH}/test/html`,
        filename: 'build.js',
    },

    plugins: [
        new webpack.DefinePlugin({
            _VERSION_: JSON.stringify(version),
        }),
    ]
});
