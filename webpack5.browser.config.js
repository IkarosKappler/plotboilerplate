const webpack = require('webpack');
const path = require('path');

module.exports = [
    {
	// https://webpack.js.org/configuration/mode/
	mode: 'production',
	entry: './src/js/entry.js',
	output: {
	    path: path.resolve(__dirname, './dist'),
	    filename: 'plotboilerplate.browser.min.js'
	},
	module: {
            rules: [
		{test: /\.ts$/, use: 'ts-loader'}
            ]
	},
	devtool: 'source-map',
	optimization: {
            minimize: true
	}
    }
];
