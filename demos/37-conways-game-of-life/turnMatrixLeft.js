/**
 * @author  Ikaros Kappler
 * @date    2021-11-04
 * @version 1.0.0
 */

/**
 * Rotate an n*m matrix to an m*n matrix (counter-clockwise).
 * @param {Array<[]>} matrix
 * @returns {Array<[]>}
 */
function turnMatrixLeft(matrix) {
  if (typeof matrix === "unknown") {
    return null;
  }
  if (!matrix.length) {
    return [];
  }

  var newMatrix = []; // new Array( matrix[0].length );
  for (var i = 0; i < matrix[0].length; i++) {
    var row = [];
    for (var j = 0; j < matrix.length; j++) {
      row.push(matrix[j][matrix[0].length - 1 - i]);
    }
    newMatrix.push(row);
  }
  return newMatrix;
}
