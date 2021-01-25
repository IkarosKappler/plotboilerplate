const webpack = require('webpack');
const path = require('path');

module.exports = [
    {
	// https://webpack.js.org/configuration/mode/
	mode: 'production',
	entry: '../src/js/entry.js',
	output: {
	    path: path.resolve(__dirname, '../dist'),
	    filename: 'plotboilerplate.min.js'
	},
	devtool: 'source-map',
	optimization: {
            minimize: true
	}
    },
    {
	// https://webpack.js.org/configuration/mode/
	mode: 'production',
	entry: '../src/js/entry-glsupport.js',
	output: {
	    path: path.resolve(__dirname, '../dist'),
	    filename: 'plotboilerplate-glsupport.min.js'
	},
	devtool: 'source-map',
	optimization: {
            minimize: true
	}
    }
];
