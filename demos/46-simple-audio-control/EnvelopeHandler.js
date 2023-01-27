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

    // let attackTime = 0.3;
    // let sustainLevel = 0.8;
    // let releaseTime = 0.3;
    // let noteLength = 1;

    var baseVert = new Vertex(0, 0);
    baseVert.attr.draggable = false;
    var attackTimeVert = new Vertex(); // new Vertex(this.envelope.attackTime * viewport.width, -1.0 * viewport.height);
    var releaseTimeVert = new Vertex(); /* new Vertex(
      (1 - this.envelope.releaseTime) * viewport.width,
      -this.envelope.sustainLevel * viewport.height
    ); */
    var noteLengthVert = new Vertex(); // new Vertex(viewport.width, 0.0);
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

    this.pb.config.preDraw = predraw;
    this._updateVertices();
    this._updateDisplay();
    this.pb.redraw();
    this.pb.canvas.focus();
  };

  context.EnvelopeHandler.prototype.update = function () {
    // Adjust vertices to new points
    this._updateVertices();
    this._updateDisplay();
    this.pb.redraw();
  };
})(globalThis);
