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
	resolve: {
            symlinks: true
	},
	/* resolve: {
	    extensions: ['.js'],
	    fallback: [ path.resolve(__dirname, './node_modules') ]
	}, */
	/* module: {
            rules: [
		{test: /\.ts$/, use: 'ts-loader'}
            ]
	    }, */
	/* resolve: {
	    alias: {
		"alloyfinger-typescript": path.resolve(__dirname, 'node_modules/alloyfinger-typescript/src/js/alloy_finger.js'), // path/to/file.js'),
	    },
	}, */
	devtool: 'source-map',
	optimization: {
            minimize: true
	}
    }
];
