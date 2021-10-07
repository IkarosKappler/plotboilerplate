/**
 * @author  Ikaros Kappler
 * @date    2021-10-06
 * @version 1.0.0
 */

var printMazeMatrix = function (mazeMatrix) {
  var buffer = [];
  for (var j = 0; j < mazeMatrix.length; j++) {
    buffer.push("" + j + ":");
    for (var i = 0; i < mazeMatrix[j].length; i++) {
      if (mazeMatrix[j][i] && BORDER_LEFT) {
        buffer.push("|");
      } else {
        buffer.push(" ");
      }
    }
    for (var i = 0; i < mazeMatrix[j].length; i++) {
      if (mazeMatrix[j][i] && BORDER_BOTTOM) {
        buffer.push(" ");
      } else {
        buffer.push("_");
      }
    }
    buffer.push("\n");
  }
  console.log("printMazeMatrix", buffer.join(""));
};
