/**
 * @authos   Ikaros Kappler
 * @date     2023-01-28
 * @modified 2023-02-03 Ported to typescript.
 * @version  1.0.1
 */

import { MainSettings } from "./interfaces";

export class MainControls {
  values: MainSettings;
  context: AudioContext;
  masterVolume: GainNode;
  volumeControl: HTMLInputElement;
  tempoControl: HTMLInputElement;

  constructor() {
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
    this.volumeControl = document.querySelector("#volume-control") as HTMLInputElement;
    var handleMasterVolumeChange = function () {
      _self.masterVolume.gain.value = _self.values.masterVolume = Number(_self.volumeControl.value);
      // document.querySelector("#display-master-volume-control").innerHTML = `${(Number(volumeControl.value) * 100).toFixed(0)}%`;
      _self._updateDisplays();
    };
    this.volumeControl.addEventListener("input", handleMasterVolumeChange);
    handleMasterVolumeChange();

    this.tempoControl = document.querySelector("#tempo-control") as HTMLInputElement;
    var handleTempChange = function () {
      _self.values.tempo = Number(_self.tempoControl.value);
      // document.querySelector("#display-tempo-control").innerHTML = `${_self.values.tempo}bpm`;
      _self._updateDisplays();
    };
    this.tempoControl.addEventListener("input", handleTempChange, false);
    handleTempChange();

    // this._updateDisplays();
  } // END constructor

  _updateDisplays() {
    (document.querySelector("#display-tempo-control") as HTMLSpanElement).innerHTML = `${this.values.tempo}bpm`;
    (document.querySelector("#display-master-volume-control") as HTMLSpanElement).innerHTML = `${(
      Number(this.volumeControl.value) * 100
    ).toFixed(0)}%`;
  }

  setValues(options: MainSettings) {
    console.log("Setting main controls", options);
    if (options && typeof options.tempo !== "undefined") {
      this.values.tempo = options.tempo;
    }
    if (options && typeof options.masterVolume !== "undefined") {
      this.values.masterVolume = options.masterVolume;
      this.masterVolume.gain.value = 0.2;
    }
    this._updateDisplays();
  }
}
