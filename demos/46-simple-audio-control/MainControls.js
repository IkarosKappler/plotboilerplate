/**
 * @authos  Ikaros Kappler
 * @date    2023-01-28
 * @version 1.0.0
 */

(function (_context) {
  _context.MainControls = function () {
    this.values = {
      tempo: 120,
      masterVolume: 0.2
    };
    // CONTEXT AND MASTER VOLUME
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    this.context = new AudioContext();
    this.masterVolume = this.context.createGain();
    this.masterVolume.connect(this.context.destination);
    this.masterVolume.gain.value = 0.2;

    this._updateDisplays = function () {
      document.querySelector("#display-tempo-control").innerHTML = `${_self.values.tempo}bpm`;
      document.querySelector("#display-master-volume-control").innerHTML = `${(Number(volumeControl.value) * 100).toFixed(0)}%`;
    };

    var _self = this;
    const volumeControl = document.querySelector("#volume-control");
    var handleMasterVolumeChange = function () {
      _self.masterVolume.gain.value = _self.values.masterVolume = Number(volumeControl.value);
      // document.querySelector("#display-master-volume-control").innerHTML = `${(Number(volumeControl.value) * 100).toFixed(0)}%`;
      _self._updateDisplays();
    };
    volumeControl.addEventListener("input", handleMasterVolumeChange);
    handleMasterVolumeChange();

    const tempoControl = document.querySelector("#tempo-control");
    var handleTempChange = function () {
      _self.values.tempo = Number(tempoControl.value);
      // document.querySelector("#display-tempo-control").innerHTML = `${_self.values.tempo}bpm`;
      _self._updateDisplays();
    };
    tempoControl.addEventListener("input", handleTempChange, false);
    handleTempChange();

    // this._updateDisplays();
  };

  _context.MainControls.prototype.setValues = function (options) {
    if (options && typeof options.tempo !== "undefined") {
      this.values.tempo = options.tempo;
    }
    if (options && typeof options.masterVolume !== "undefined") {
      this.values.masterVolume = options.masterVolume;
      this.masterVolume.gain.value = 0.2;
    }
    this._updateDisplays();
  };
})(globalThis);
