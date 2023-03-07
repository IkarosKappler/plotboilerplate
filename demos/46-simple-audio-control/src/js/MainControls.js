"use strict";
/**
 * @authos   Ikaros Kappler
 * @date     2023-01-28
 * @modified 2023-02-03 Ported to typescript.
 * @version  1.0.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainControls = void 0;
var MainControls = /** @class */ (function () {
    function MainControls() {
        this.values = {
            tempo: 120,
            masterVolume: 0.2
        };
        // CONTEXT AND MASTER VOLUME
        var AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
        this.context = new AudioContext();
        this.masterVolume = this.context.createGain();
        this.masterVolume.connect(this.context.destination);
        this.masterVolume.gain.value = 0.2;
        //   this._updateDisplays = function () {
        //     document.querySelector("#display-tempo-control").innerHTML = `${_self.values.tempo}bpm`;
        //     document.querySelector("#display-master-volume-control").innerHTML = `${(Number(volumeControl.value) * 100).toFixed(0)}%`;
        //   };
        var _self = this;
        this.volumeControl = document.querySelector("#volume-control");
        var handleMasterVolumeChange = function () {
            _self.masterVolume.gain.value = _self.values.masterVolume = Number(_self.volumeControl.value);
            // document.querySelector("#display-master-volume-control").innerHTML = `${(Number(volumeControl.value) * 100).toFixed(0)}%`;
            _self._updateDisplays();
        };
        this.volumeControl.addEventListener("input", handleMasterVolumeChange);
        handleMasterVolumeChange();
        this.tempoControl = document.querySelector("#tempo-control");
        var handleTempChange = function () {
            _self.values.tempo = Number(_self.tempoControl.value);
            // document.querySelector("#display-tempo-control").innerHTML = `${_self.values.tempo}bpm`;
            _self._updateDisplays();
        };
        this.tempoControl.addEventListener("input", handleTempChange, false);
        handleTempChange();
        // this._updateDisplays();
    } // END constructor
    MainControls.prototype._updateDisplays = function () {
        document.querySelector("#display-tempo-control").innerHTML = this.values.tempo + "bpm";
        document.querySelector("#display-master-volume-control").innerHTML = (Number(this.volumeControl.value) * 100).toFixed(0) + "%";
    };
    MainControls.prototype.setValues = function (options) {
        console.log("Setting main controls", options);
        if (options && typeof options.tempo !== "undefined") {
            this.values.tempo = options.tempo;
        }
        else {
            console.warn("[MainControls] Cannot set tempo from options (no tempo setting given).");
        }
        if (options && typeof options.masterVolume !== "undefined") {
            this.values.masterVolume = options.masterVolume;
            this.masterVolume.gain.value = options.masterVolume; // 0.2;
        }
        else {
            console.warn("[MainControls] Cannot set volume from options (no volume setting given).");
        }
        console.log("options.masterVolume", options.masterVolume);
        this._updateDisplays();
    };
    return MainControls;
}());
exports.MainControls = MainControls;
//# sourceMappingURL=MainControls.js.map