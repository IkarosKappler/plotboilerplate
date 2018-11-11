const webpack = require('webpack');
const path = require('path');


module.exports = {
    entry: [
	'./src/gup.js',
        // './src/WebColors.js',

        './src/VertexAttr.js',
        './src/VertexListeners.js',
        './src/Vertex.js',

        './src/MouseHandler.js',
	'./src/KeyHandler.js',
        './src/draw.js',
        './src/overlay-dialog.js',

        './src/PlotBoilerplate.js',
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'plot-boilerplate.min.js'
    }
};

