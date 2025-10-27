/**
 * A datastructure to describe timing intervals.
 * Used for animation.
 *
 * Example for making a binary 8 bit clock:
 *      timingIntervals.push([[500, 500]]); // Wait 500ms, then show 500ms, repeat...
 *      timingIntervals.push([[1000, 1000]]); // Wait 1s, then show 1s, repeat...
 *      timingIntervals.push([[2000, 2000]]); // Wait 2s, then show 2s, repeat...
 *      timingIntervals.push([[4000, 4000]]);
 *      timingIntervals.push([[8000, 8000]]);
 *      timingIntervals.push([[16000, 16000]]);
 *      timingIntervals.push([[32000, 32000]]);
 *      timingIntervals.push([[64000, 64000]]);
 *
 * @author  Ikaros Kappler
 * @date    2025-10-27
 * @version 1.0.0
 */

(function (_context) {
  var TimeSegmentation = function () {
    // Array<[number,number]>
    this.timingIntervals = [];
    this.totalDurationMs = 0;
  };

  /**
   * Adds a new wait-and-display interval (in milliseconds).
   *
   * @param {[number,number]} - The timing interval, consisting of two numeric elements: the wait-amount and the display-amount.
   */
  TimeSegmentation.prototype.add = function (interval) {
    if (!Array.isArray(interval)) {
      throw "Cannot add non-array element to this TimeSegmentation.";
    }
    if (interval.length != 2) {
      throw "Cannot malformed array element to this TimeSegmentation: array must have two elements.";
    }
    if (
      typeof interval[0] !== "number" ||
      Number.isNaN(interval[0]) ||
      typeof interval[1] !== "number" ||
      Number.isNaN(interval[1])
    ) {
      throw "Cannot malformed array element to this TimeSegmentation: array elements must be numeric.";
    }
    if (interval[0] < 0 || interval[1] < 0) {
      throw "Cannot malformed array element to this TimeSegmentation: array elements must not be negative.";
    }
    this.timingIntervals.push(interval);
    // Update total length
    this.totalDurationMs += interval[0] + interval[1];
    return this;
  };

  TimeSegmentation.prototype.isTimestampVisible = function (milliseconds) {
    // var totalDurationMs = timingInterval.reduce(function (accu, curValue) {
    //   accu += curValue[0] + curValue[1];
    //   return accu;
    // }, 0);
    var currentTimeSection = milliseconds % this.totalDurationMs;
    var isRenderTimerItem = this.timingIntervals.reduce(
      function (accu, curValue, _index) {
        /**
         * {boolean} accu
         * {[number,number]} curvalue
         */
        if (
          accu.leadingMs + curValue[0] <= currentTimeSection &&
          currentTimeSection < accu.leadingMs + curValue[0] + curValue[1]
        ) {
          accu.isVisible = true;
        }
        // if (timingSquareIndex == 0 && animationFrameNumber % 25 === 0 && _index + 1 >= timingInterval.length) {
        //   console.log(
        //     "totalDurationMs",
        //     totalDurationMs,
        //     "currentTimeSection",
        //     currentTimeSection,
        //     "accu",
        //     accu,
        //     "timingInterval",
        //     JSON.stringify(timingInterval)
        //   );
        // }
        accu.leadingMs += curValue[0] + curValue[1];
        return accu;
      },
      { leadingMs: 0, isVisible: false }
    );
    // if (isRenderTimerItem.isVisible) {
    //   fill.square({ x: timingSquareIndex * (16 + 4), y: 0 }, 16, "red");
    // }
    return isRenderTimerItem.isVisible;
  };

  _context.TimeSegmentation = TimeSegmentation;
})(globalThis);
