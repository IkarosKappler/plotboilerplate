const webpack = require('webpack');
const path = require('path');

module.exports = {
    // https://webpack.js.org/configuration/mode/
    mode: 'development',
    entry: './src/js/entry.js',
    output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'plotboilerplate.js'
    },
    devtool: 'source-map',
    optimization: {
        minimize: false
    }
};
