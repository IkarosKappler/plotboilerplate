/**
 * @author  Ikaros Kappler
 * @date    2021-11-08
 * @version 1.0.0
 */

// interface CellState {
//    isAlive: boolean;
//    lastAliveStep: number;
// }

/**
 * Creata new biotope of the given size and data from the generator function.
 *
 * @param {number} height - The height of the biotope.
 * @param {number} width - The width of the biotope.
 * @param {function(number,number)} dataGenerator - Must return an Object { isAlive: boolean, lastAliveStep: number }
 */
var Biotope = function (height, width, dataGenerator) {
  Array.call(this);

  this.width = width;
  this.height = height;
  this.stepNumber = 0;

  for (var j = 0; j < height; j++) {
    var row = [];
    this.push(row);
    for (var i = 0; i < width; i++) {
      row.push(dataGenerator(j, i));
    }
  }
};

Biotope.prototype = Object.create(Array.prototype);

// +---------------------------------------------------------------------------------
// | This function rebuilds the maze and renders it onto the SVG canvas.
// | The old SVG data is cleared.
// +-------------------------------
Biotope.prototype.setCellAlive = function (position, alive) {
  // Check bounds before setting anything
  if (position.i >= 0 && position.j >= 0 && position.j < this.length && position.i < this[position.j].length) {
    this[position.j][position.i].isAlive = alive;
  }
};

Biotope.prototype.relCol = function (i) {
  return i + Math.floor(this.width / 2);
};
Biotope.prototype.relRow = function (j) {
  return j + Math.floor(this.height / 2);
};
Biotope.prototype.relPos = function (j, i) {
  return { j: this.relRow(j), i: this.relCol(i) };
};
Biotope.prototype.absCol = function (i) {
  return i - Math.floor(this.width / 2);
};
Biotope.prototype.absRow = function (j) {
  return j - Math.floor(this.height / 2);
};
Biotope.prototype.absPos = function (relPos) {
  return { j: this.absRow(relPos.j), i: this.absCol(relPos.i) };
};

Biotope.prototype.createNextCycle = function () {
  var _self = this;
  var stepNumber = _self.stepNumber + 1;
  var newBiotope = new Biotope(_self.height, _self.width, function (j, i) {
    var isAlive = _self[j][i].isAlive;
    var latestAliveStep = _self[j][i].lastAliveStep;
    var neighbourCount = _self.getNumberOfLivingNeighbours(j, i);
    if (isAlive) {
      if (neighbourCount < 2) {
        // Die of under-population
        return { isAlive: false, lastAliveStep: latestAliveStep };
      } else if (neighbourCount == 2 || neighbourCount == 3) {
        // Keep on living
        return { isAlive: true, lastAliveStep: stepNumber };
      } else if (neighbourCount > 3) {
        // Die of under-population
        return { isAlive: false, lastAliveStep: latestAliveStep };
      } else {
        return { isAlive: false, lastAliveStep: latestAliveStep };
      }
    } else {
      if (neighbourCount === 3) {
        // Dead cell becomes alive dues to 3 living neighboures
        return { isAlive: true, lastAliveStep: stepNumber };
      } else {
        // Dead cell stays dead due to under- or over-poulation
        return { isAlive: false, lastAliveStep: latestAliveStep };
      }
    }
  });
  newBiotope.stepNumber = stepNumber;
  return newBiotope;
};

// +---------------------------------------------------------------------------------
// | Get the number of neightbours for the given cell position.
// |
// | j is the row
// | i is the column
// +-------------------------------
Biotope.prototype.getNumberOfLivingNeighbours = function (j, i) {
  var count = 0;
  if (j - 1 >= 0 && this[j - 1][i].isAlive) {
    count++;
  }
  if (j + 1 < this.length && this[j + 1][i].isAlive) {
    count++;
  }
  if (i - 1 >= 0 && this[j][i - 1].isAlive) {
    count++;
  }
  if (i + 1 < this[j].length && this[j][i + 1].isAlive) {
    count++;
  }
  // Also look at diagoal neighbours
  if (j - 1 >= 0 && i - 1 >= 0 && this[j - 1][i - 1].isAlive) {
    count++;
  }
  if (j + 1 < this.length && i - 1 >= 0 && this[j + 1][i - 1].isAlive) {
    count++;
  }
  if (j + 1 < this.length && i + 1 < this[j].length && this[j + 1][i + 1].isAlive) {
    count++;
  }
  if (j - 1 >= 0 && i + 1 < this[j].length && this[j - 1][i + 1].isAlive) {
    count++;
  }
  return count;
};
