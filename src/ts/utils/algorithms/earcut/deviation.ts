
// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
export const deviation = ( data : Array<number>,
			   holeIndices : Array<number>|undefined,
			   dim : number,
			   triangles : Array<number>
			 ) : number => {

    // earcut.deviation = function (data, holeIndices, dim, triangles) {
    const hasHoles : boolean = holeIndices && holeIndices.length > 0;
    const outerLen : number = hasHoles ? holeIndices[0] * dim : data.length;

    let polygonArea : number = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
	    let start : number = holeIndices[i] * dim;
	    let end : number = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
	    polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    let trianglesArea : number = 0;
    for (i = 0; i < triangles.length; i += 3) {
        const a : number = triangles[i] * dim;
        const b : number = triangles[i + 1] * dim;
        const c : number = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
	    (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
		(data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};


// TODO: duplicate function from earcut.ts
const signedArea = (data : Array<number>, start:number, end:number, dim:number) : number => {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}
