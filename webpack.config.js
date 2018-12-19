const webpack = require('webpack');
const path = require('path');
const GitRevisionPlugin = require("git-revision-webpack-plugin")


module.exports = [
    {
        entry: [
        // './src/WebColors.js',

        './src/VertexAttr.js',
        './src/VertexListeners.js',
        './src/Vertex.js',
    	'./src/Grid.js',
	'./src/Line.js', 
    	'./src/CubicBezierCurve.js',
    	'./src/BezierPath.js',
    	'./src/Polygon.js',
    	'./src/VEllipse.js',

        './src/MouseHandler.js',
    	'./src/KeyHandler.js',
        './src/draw.js',
        './src/overlay-dialog.js',

        './src/PlotBoilerplate.js'
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
    // Un-comment this block if you also want to re-compile the Color class.
    /* ,{
        entry: [
        './lib/Color.js',
        ],
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'Color.min.js'
        }
    } */
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
];

