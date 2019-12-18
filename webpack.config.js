const webpack = require('webpack');
const path = require('path');
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');


module.exports = [
    {
        entry: [
	    './src/entry.js'
	],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'plotboilerplate.min.js'
        },
        plugins: [
            new webpack.BannerPlugin({
              banner: 'PlotBoilerplate,\nGit branch https://github.com/IkarosKappler/plotboilerplate/commit/' + new GitRevisionPlugin().version(),
            }),
	    new UnminifiedWebpackPlugin()
          ]
    }
    // Un-comment this block if you also want to re-compile the Color class.
    ,{
        entry: [
        './lib/Color.js',
        ],
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'Color.min.js'
        }
    }
    /*
    // Un-comment this block if you also want to re-compile the Touchy-updated class.
    ,{
        entry: [
        './lib/Touchy-updated.js',
        ],
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'Touchy-updated.min.js'
        }
    }
    // Un-comment this block if you also want to re-compile the Color class.
    ,{
        entry: [
        './lib/bbtree.js',
        ],
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'bbtree.min.js'
        }
    }
    ,{
        entry: [
        './lib/bbtree.collection.js',
        ],
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'bbtree.collection.min.js'
        }
    } 
    */
];


// Use this plugin to concat already minified
// files in exactly the given order.
const ConcatPlugin = require('webpack-concat-plugin');
 
new ConcatPlugin({
    //...see options
    // examples
    uglify: false,
    sourceMap: false,
    name: 'vendor',
    outputPath: 'lib/',
    //fileName: '[name].[hash:8].js',
    fileName: '[name].js',
    filesToConcat: [
	'./lib/humane.min.js',
	'./lib/dat.gui.min.js',
	'./lib/dat.gui.title.polyfill.js',
	'./lib/FileSaver.min.js',
	'./lib/Color.js',
	'./lib/Touchy.min.js'
    ],
    attributes: {
        async: false
    }
});
