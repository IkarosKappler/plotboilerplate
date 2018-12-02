const webpack = require('webpack');
const path = require('path');


module.exports = [
    {
        entry: [
        // './src/WebColors.js',

        './src/VertexAttr.js',
        './src/VertexListeners.js',
        './src/Vertex.js',
    	'./src/Grid.js',
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
        }
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
];

