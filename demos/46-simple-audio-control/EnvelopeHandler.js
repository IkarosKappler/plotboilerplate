/**
 * @author  Ikaros Kappler
 * @date    2023-01-27
 * @version 1.0.0
 */

(function (context) {
  context.EnvelopeHandler = function (canvasId, GUP, backgroundColor) {
    this.envelope = {
      attackTime: 0.3,
      sustainLevel: 0.8,
      releaseTime: 0.3,
      noteLength: 1.0
    };

    // All config params are optional.
    this.pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById(canvasId),
          fullSize: false,
          fitToParent: true,
          backgroundColor: backgroundColor, // isDarkmode ? "#000000" : "#ffffff",
          drawGrid: true,
          drawRaster: true,
          drawOrigin: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 0,
          offsetAdjustYPercent: 100
        },
        GUP
      )
    );

    // {Bounds}
    var viewport = this.pb.viewport();

    var baseVert = new Vertex(0, 0);
    baseVert.attr.draggable = false;
    var attackTimeVert = new Vertex();
    var releaseTimeVert = new Vertex();
    var noteLengthVert = new Vertex();
    noteLengthVert.attr.draggable = false;
    this.pb.add(new Polygon([baseVert, attackTimeVert, releaseTimeVert, noteLengthVert], true));
    this.pb.drawConfig.polygon.lineWidth = 2.0;

    // +---------------------------------------------------------------------------------
    // | Draw our custom stuff after everything else in the scene was drawn.
    // +-------------------------------
    var predraw = function (draw, fill) {
      draw.polygon(viewport.toPolygon(), "rgba(192,192,192,0.5)", 1);
    };

    this._updateVertices = function () {
      attackTimeVert.set((this.envelope.attackTime / this.envelope.noteLength) * viewport.width, -1.0 * viewport.height);
      releaseTimeVert.set(
        ((this.envelope.noteLength - this.envelope.releaseTime) / this.envelope.noteLength) * viewport.width,
        -this.envelope.sustainLevel * viewport.height
      );
      //   noteLengthVert.set(this.envelope.noteLength * viewport.width, -0.5 * viewport.height);
      noteLengthVert.set(viewport.width, 0.0);
    };

    this._updateDisplay = function () {
      console.log("update");
      const attackControlDisplay = document.querySelector("#display-attack-control");
      attackControlDisplay.innerHTML = this.envelope.attackTime;
      const releaseControlDisplay = document.querySelector("#display-release-control");
      releaseControlDisplay.innerHTML = this.envelope.releaseTime;
      const noteLengthControlDisplay = document.querySelector("#display-note-length-control");
      noteLengthControlDisplay.innerHTML = this.envelope.noteLength;
      const sustainLevelControlDisplay = document.querySelector("#display-sustain-level-control");
      sustainLevelControlDisplay.innerHTML = this.envelope.sustainLevel;
    };

    // EFFECTS CONTROLS
    // Envelope
    this._attackControl = document.querySelector("#attack-control");
    this._releaseControl = document.querySelector("#release-control");
    this._noteLengthControl = document.querySelector("#note-length-control");
    this._sustainLevelControl = document.querySelector("#sustain-level-control");

    var _self = this;
    this._attackControl.addEventListener("input", function () {
      // attackTime = Number(this.value);
      _self.envelope.attackTime = Number(this.value);
      _self.update();
    });

    this._releaseControl.addEventListener("input", function () {
      // releaseTime = Number(this.value);
      _self.envelope.releaseTime = Number(this.value);
      _self.update();
    });

    this._noteLengthControl.addEventListener("input", function () {
      // noteLength = Number(this.value);
      _self.envelope.noteLength = Number(this.value);
      _self.update();
    });

    this._sustainLevelControl.addEventListener("input", function () {
      // noteLength = Number(this.value);
      _self.envelope.sustainLevel = Number(this.value);
      _self.update();
    });

    this.pb.config.preDraw = predraw;
    this._updateVertices();
    this._updateDisplay();
    this.pb.redraw();
    this.pb.canvas.focus();
  };

  /**
   * Set the values of the envelope
   * @param {number?} options.attackTime (optional)
   * @param {number?} options.releaseTime (optional)
   * @param {number?} options.sustainLevel (optional)
   * @param {number?} options.noteLength (optional)
   */
  context.EnvelopeHandler.prototype.setValues = function (options) {
    // console.log("EnvelopeHandler.prototype.setValues", options);
    if (options && typeof options.attackTime !== "undefined") {
      this.envelope.attackTime = options.attackTime;
      this._attackControl.value = options.attackTime;
    }
    if (options && typeof options.releaseTime !== "undefined") {
      this.envelope.releaseTime = options.releaseTime;
      this._releaseControl.value = options.releaseTime;
    }
    if (options && typeof options.noteLength !== "undefined") {
      //   console.log("Set note length");
      this.envelope.noteLength = options.noteLength;
      this._noteLengthControl.value = options.noteLength;
    }
    if (options && typeof options.sustainLevel !== "undefined") {
      this.envelope.sustainLevel = options.sustainLevel;
      this._sustainLevelControl.value = options.sustainLevel;
    }
    // Adjust vertices to new points
    this._updateVertices();
    this._updateDisplay();
    this.pb.redraw();
  };

  context.EnvelopeHandler.prototype.update = function () {
    // Adjust vertices to new points
    this._updateVertices();
    this._updateDisplay();
    this.pb.redraw();
  };
})(globalThis);
