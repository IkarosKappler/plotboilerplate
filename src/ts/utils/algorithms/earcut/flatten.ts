// Original algorithms by https://github.com/mapbox/earcut
//  
// @date 2020-12-08

interface IEarcutProps {
    vertices : Array<number>;
    holes : Array<number>;
    dimensions : number;
};

type IArrayVert = Array<number>; // like: [number, number]

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
export const flatten = ( data : Array<Array<IArrayVert>> ) :  IEarcutProps => {
    const dim : number = data[0][0].length;
    const result : IEarcutProps = { vertices: [], holes: [], dimensions: dim };
    let holeIndex : number = 0;

    for (var i = 0; i < data.length; i++) {
	for (var j = 0; j < data[i].length; j++) {
	    for (var d = 0; d < dim; d++) {
		result.vertices.push(data[i][j][d]);
	    }
	}
	if (i > 0) {
	    holeIndex += data[i - 1].length;
	    result.holes.push(holeIndex);
	}
    }
    return result;
}; 
