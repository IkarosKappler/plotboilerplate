const webpack = require('webpack');
const path = require('path');
const GitRevisionPlugin = require("git-revision-webpack-plugin")


module.exports = [
    {
        entry: [
	// gup is not really required. Just the demos use it.
        // './src/gup.js',

	'./src/extend.js', // The Vector class extends the Line class    
        './src/VertexAttr.js',
        './src/VertexListeners.js',
        './src/Vertex.js',
    	'./src/Grid.js',
	'./src/Line.js',
	'./src/Vector.js',
    	'./src/CubicBezierCurve.js',
    	'./src/BezierPath.js',
    	'./src/Polygon.js',
    	'./src/VEllipse.js',
	'./src/PBImage.js',

        './src/MouseHandler.js',
    	'./src/KeyHandler.js',
	'./src/TouchHandler.js',
        './src/draw.js',
        './src/overlay-dialog.js',

        './src/PlotBoilerplate.js',
	'./src/PlotBoilerplate.RectSelector.js'
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'plot-boilerplate.min.js'
        },
        plugins: [
            new webpack.BannerPlugin({
              banner: 'PlotBoilerplate,\nGit branch https://github.com/IkarosKappler/plot-boilerplate/commit/' + new GitRevisionPlugin().version(),
            }),
          ]
    }
/*
    ,{
        entry: [
        'script-loader!uglify-loader!./lib/humane.min.js',
    	'script-loader!uglify-loader!./lib/dat.gui.min.js',
	'script-loader!uglify-loader!./lib/dat.gui.title.polyfill.js',
        'script-loader!uglify-loader!./lib/FileSaver.min.js',
        'script-loader!uglify-loader!./lib/Color.js',
	'script-loader!uglify-loader!./lib/Touchy.min.js'
        ],
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'vendor.min.js'
        }
    }
*/
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
    filesToConcat: [ './lib/humane.min.js',
       './lib/dat.gui.min.js',
       './lib/dat.gui.title.polyfill.js',
       './lib/FileSaver.min.js',
       './lib/Color.js',
       './lib/Touchy.min.js'
     ],
    // filesToConcat: ['jquery', './src/lib/**', './dep/dep.js', ['./some/**', '!./some/excludes/**']],
    attributes: {
        async: false
    }
});
