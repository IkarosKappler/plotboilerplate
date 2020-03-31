const webpack = require('webpack');
const path = require('path');
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

// const WebpackUglifyHarmonyPlugin = require('webpack-uglify-harmony');
const WebpackUglifyHarmonyPlugin = require('webpack-uglify-harmony-plugin');

module.exports = [
    {

	optimization: {
	    minimizer: [
		// we specify a custom UglifyJsPlugin here to get source maps in production
		new WebpackUglifyHarmonyPlugin({ // UglifyJsPlugin({
		    cache: true,
		    parallel: true,
		    uglifyOptions: {
			compress: false,
			ecma: 6,
			mangle: true
		    },
		    sourceMap: true
		})
	    ]
	},
	
	entry: {
	    'plotboilerplate': './src/js/entry.js',
	    'plotboilerplate.min': './src/js/entry.js'
	}, 
	/* app: [
          './src/js/VertexAttr.js',
          './src/js/Vertex.js',
          './src/js/PlotBoilerplate.js'
	], */
	output: {
	    path: path.resolve(__dirname, 'dist'), // path.resolve(__dirname, '_bundles'),
	    filename: '[name].js',
	    libraryTarget: 'umd',
	    library: 'pb',
	    umdNamedDefine: true
	},
	resolve: {
	    extensions: ['.ts', '.tsx', '.js']
	},
	devtool: 'source-map',
	plugins: [
	    /* new webpack.optimize.UglifyJsPlugin({
	       minimize: true,
	       sourceMap: true,
	       include: /\.min\.js$/,
	       })
	    */
	    /* new config.optimization.minimize({
		minimize: true,
		sourceMap: true,
		include: /\.min\.js$/,
	    })	 */
	], 
	module: {
	    rules: [{
		test: /\.tsx?$/,
		loader: 'awesome-typescript-loader',
		exclude: [ '/node_modules/', '/tmp/', '/src/vanilla' ],
		query: {
		    declaration: false,
		}
	    }]
	}
    }
];
