"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2023-01-27
 * @modified 2023-02-04 Ported to Typescript.
 * @version  1.0.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvelopeHandler = void 0;
var cloneObject_1 = require("./cloneObject");
// import { PlotBoilerplate } from "../../../../src/ts/PlotBoilerplate";
// import PlotBoilerplate from "../../../../dist/plotboilerplate";
// import { Vertex } from "../../../../src/ts/Vertex";
// import { Polygon } from "../../../../src/ts/Polygon";
// import { PBParams } from "../../../../src/ts/interfaces";
// import { Bounds } from "../../../../src/ts/Bounds";
var EnvelopeHandler = /** @class */ (function () {
    function EnvelopeHandler(canvasId, GUP, backgroundColor, onEnvelopeChanged) {
        var _this = this;
        this._updateDisplay = function () {
            console.log("update");
            var attackControlDisplay = document.querySelector("#display-attack-control");
            attackControlDisplay.innerHTML = this.envelope.attackTime.toFixed(2);
            var releaseControlDisplay = document.querySelector("#display-release-control");
            releaseControlDisplay.innerHTML = this.envelope.releaseTime.toFixed(2);
            var noteLengthControlDisplay = document.querySelector("#display-note-length-control");
            noteLengthControlDisplay.innerHTML = this.envelope.noteLength.toFixed(2);
            if (this.envelope.attackTime + this.envelope.releaseTime > this.envelope.noteLength) {
                noteLengthControlDisplay.classList.add("value-error");
            }
            else {
                noteLengthControlDisplay.classList.remove("value-error");
            }
            var sustainLevelControlDisplay = document.querySelector("#display-sustain-level-control");
            sustainLevelControlDisplay.innerHTML = this.envelope.sustainLevel.toFixed(2);
        };
        // }, mkPlotBoilerplate:(config)=>void) {
        this.envelope = {
            attackTime: 0.3,
            sustainLevel: 0.8,
            releaseTime: 0.3,
            noteLength: 1.0
        };
        this.onEnvelopeChanged = onEnvelopeChanged;
        // All config params are optional.
        var PlotBoilerplate = window["PlotBoilerplate"];
        var Vertex = window["Vertex"];
        var Polygon = window["Polygon"];
        this.pb = new PlotBoilerplate(PlotBoilerplate.utils.safeMergeByKeys({
            canvas: document.getElementById(canvasId),
            fullSize: false,
            fitToParent: true,
            backgroundColor: backgroundColor,
            drawGrid: true,
            drawRaster: true,
            drawOrigin: true,
            autoAdjustOffset: true,
            offsetAdjustXPercent: 0,
            offsetAdjustYPercent: 100,
            enablePan: false,
            enableZoom: false
        }, GUP));
        // {Bounds}
        this.viewport = this.pb.viewport();
        var baseVert = new Vertex(0, 0);
        this.attackTimeVert = new Vertex();
        this.releaseTimeVert = new Vertex();
        this.noteLengthVert = new Vertex();
        baseVert.attr.draggable = false;
        this.noteLengthVert.attr.draggable = false;
        this.attackTimeVert.listeners.addDragListener(function () {
            _this.attackTimeVert.y = -1.0 * _this.viewport.height;
            _this._updateValuesFromVertices();
            _this._updateDisplay();
        });
        this.releaseTimeVert.listeners.addDragListener(function () {
            _this._updateValuesFromVertices();
            _this._updateDisplay();
        });
        var envelopePolygon = new Polygon([baseVert, this.attackTimeVert, this.releaseTimeVert, this.noteLengthVert], true);
        this.pb.add(envelopePolygon);
        this.pb.drawConfig.polygon.lineWidth = 4.0;
        // +---------------------------------------------------------------------------------
        // | Draw our custom stuff after everything else in the scene was drawn.
        // +-------------------------------
        var _self = this;
        var predraw = function (draw, fill) {
            draw.polygon(_self.viewport.toPolygon(), "rgba(192,192,192,0.5)", 1);
            fill.polygon(envelopePolygon, "rgba(192,192,192,0.1)");
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
    } // END constructor
    EnvelopeHandler.prototype._fireEnvelopeChanged = function () {
        this.onEnvelopeChanged(cloneObject_1.cloneObject(this.envelope));
    };
    EnvelopeHandler.prototype._updateVertices = function () {
        this.attackTimeVert.set((this.envelope.attackTime / this.envelope.noteLength) * this.viewport.width, -1.0 * this.viewport.height);
        this.releaseTimeVert.set(((this.envelope.noteLength - this.envelope.releaseTime) / this.envelope.noteLength) * this.viewport.width, -this.envelope.sustainLevel * this.viewport.height);
        //   noteLengthVert.set(this.envelope.noteLength * viewport.width, -0.5 * viewport.height);
        this.noteLengthVert.set(this.viewport.width, 0.0);
    };
    EnvelopeHandler.prototype._updateValuesFromVertices = function () {
        this.envelope.attackTime = (this.attackTimeVert.x / this.viewport.width) * this.envelope.noteLength;
        this.envelope.releaseTime = ((this.viewport.width - this.releaseTimeVert.x) / this.viewport.width) * this.envelope.noteLength;
        this.envelope.sustainLevel = (this.viewport.height - this.releaseTimeVert.y) / this.viewport.height - 1.0;
    };
    /**
     * Set the values of the envelope
     * @param {number?} options.attackTime (optional)
     * @param {number?} options.releaseTime (optional)
     * @param {number?} options.sustainLevel (optional)
     * @param {number?} options.noteLength (optional)
     */
    EnvelopeHandler.prototype.setValues = function (options) {
        // console.log("EnvelopeHandler.prototype.setValues", options);
        if (options && typeof options.attackTime !== "undefined") {
            this.envelope.attackTime = options.attackTime;
            this._attackControl.value = "" + options.attackTime;
        }
        else {
            console.warn("[Envelope] Cannot set attackTime from options (no attackTime setting given).");
        }
        if (options && typeof options.releaseTime !== "undefined") {
            this.envelope.releaseTime = options.releaseTime;
            this._releaseControl.value = "" + options.releaseTime;
        }
        else {
            console.warn("[Envelope] Cannot set releaseTime from options (no releaseTime setting given).");
        }
        if (options && typeof options.noteLength !== "undefined") {
            //   console.log("Set note length");
            this.envelope.noteLength = options.noteLength;
            this._noteLengthControl.value = "" + options.noteLength;
        }
        else {
            console.warn("[Envelope] Cannot set noteLength from options (no noteLength setting given).");
        }
        if (options && typeof options.sustainLevel !== "undefined") {
            this.envelope.sustainLevel = options.sustainLevel;
            this._sustainLevelControl.value = "" + options.sustainLevel;
        }
        else {
            console.warn("[Envelope] Cannot set sustainLevel from options (no sustainLevel setting given).");
        }
        // Adjust vertices to new points
        this._updateVertices();
        this._updateDisplay();
        this.pb.redraw();
    };
    EnvelopeHandler.prototype.update = function () {
        // Adjust vertices to new points
        this._updateVertices();
        this._updateDisplay();
        this.pb.redraw();
        this._fireEnvelopeChanged();
    };
    return EnvelopeHandler;
}());
exports.EnvelopeHandler = EnvelopeHandler;
//# sourceMappingURL=EnvelopeHandler.js.map