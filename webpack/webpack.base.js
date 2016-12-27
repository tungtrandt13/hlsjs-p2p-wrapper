export const ROOT_PATH = `${__dirname}/..`;
export const baseConfig = {
    module: {
        noParse: /node_modules\/hls.js\/dist\/hls.js|node_modules\/streamroot-p2p\/p2p.js/,
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    },
};
