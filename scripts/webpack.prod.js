const { merge } = require('webpack-merge');
const TerserPlugin = require("terser-webpack-plugin");
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',

    optimization: {
        minimizer: [
            new TerserPlugin({
            terserOptions: {
                mangle: {
                    properties: {
                        regex: /^_/,
                        reserved: ['_e', '_s'],
                    }
                }
            }
        })]
    }
});