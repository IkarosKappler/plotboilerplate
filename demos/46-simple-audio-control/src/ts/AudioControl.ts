/**
 * @author   Ikaros Kappler
 * @date     2023-01-22
 * @modified 2023-02-24
 * @version  1.0.0
 **/

import { NoteSelectHandler } from "./NoteSelectHandler";
import { EnvelopeHandler } from "./EnvelopeHandler";
import { getDefaultPreset } from "./presets";
import { AudioIOFormat, FrquencyModulation, NotesIOFormat, Track, Waveform } from "./interfaces";
import { MainControls } from "./MainControls";
import { PresetSelector } from "./PresetSelector";
import { PlaybackControl } from "./PlaybackControl";

export class AudioControl {
  noteSelectHandler: NoteSelectHandler;
  private envelopeHandler: EnvelopeHandler;
  private setTrackCount: (newTrackCount: number) => void;
  private setNoteInputCount: (newNoteInputCount: number) => void;
  getIOFormat: () => AudioIOFormat;
  setFromIO: (audioData: AudioIOFormat) => void;

  constructor(GUP: Record<string, string>, isDarkmode: boolean) {
    const _self = this;

    /**
     * Called from the this.EnvelopeHandler when the envelope values are manually altered.
     *
     * @param {EnvelopeSettings} newEnvelope
     */
    const onEnvelopeChanged = newEnvelope => {
      this.noteSelectHandler.tracks[this.noteSelectHandler.selectedTrackIndex].envelope = newEnvelope;
    };
    this.envelopeHandler = new EnvelopeHandler("envelope-canvas", GUP, isDarkmode ? "#000000" : "#ffffff", onEnvelopeChanged);

    /**
     * Called from the this.NoteSelectHandler when a track is selected and the
     * selectedTrackIndex changed.
     *
     * @param {Track} selectedTrack
     * @param {number} selectedTrackIndex
     */
    const handleTrackSelected = (selectedTrack: Track, selectedTrackIndex: number) => {
      console.log("track selected", selectedTrackIndex);
      // Track selected
      _self.envelopeHandler.setValues(selectedTrack.envelope);
      setVibratoFrequencyModulation(selectedTrack.vibratoValues.amount);
      setVibratoSpeed(selectedTrack.vibratoValues.speed);
      setVibratoFrequencyModulation(selectedTrack.vibratoValues.modulation);
      setOscillatorValues(selectedTrack.oscillator);
    };

    // NOTE SELECTS
    var initialPreset = getDefaultPreset();
    var currentPreset = initialPreset;
    this.noteSelectHandler = new NoteSelectHandler(initialPreset, 2, handleTrackSelected);

    // ---BEGIN--- WAVEFORM SELECT
    const waveforms = document.getElementsByName("waveform") as NodeListOf<HTMLInputElement>;
    function handleWaveformChange() {
      console.log(
        // "this.noteSelectHandler.selectedTrackIndex",
        // this.noteSelectHandler.selectedTrackIndex,
        "waveforms.length",
        waveforms.length
      );
      for (var i = 0; i < waveforms.length; i++) {
        if (waveforms[i].checked) {
          _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].oscillator.waveform = waveforms[i]
            .value as Waveform;
        }
      }
      // console.log("waveform", waveform);
    }

    waveforms.forEach(waveformInput => {
      waveformInput.addEventListener("change", function () {
        handleWaveformChange();
      });
    });

    var updateWaveformDisplay = function () {
      var selectedTrack = _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex];
      for (var i = 0; i < waveforms.length; i++) {
        waveforms[i].checked = Boolean(waveforms[i].value === selectedTrack.oscillator.waveform);
      }
    };
    // ---END--- WAVEFORM SELECT

    var setOscillatorValues = function (options) {
      if (options && typeof options.waveform !== "undefined") {
        // waveform = options.waveform;
        _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].oscillator.waveform = options.waveform;
        updateWaveformDisplay();
      }
    };

    // NOTE SELECTS
    var mainControls = new MainControls();
    mainControls.setValues(initialPreset.mainValues);
    this.envelopeHandler.setValues(initialPreset.envelope);
    setOscillatorValues(initialPreset.oscillator);

    const playbackControl = new PlaybackControl(mainControls, this.noteSelectHandler);

    // TODO: convert to class method!
    this.setTrackCount = (newTrackCount: number) => {
      // TODO: make this changable!
      var newNoteInputCount = this.noteSelectHandler.noteInputCount; // currentPreset.noteValues.length;
      if (this.noteSelectHandler.trackCount === newTrackCount) {
        console.log("setTrackCount: no change.");
        return;
      }
      this.noteSelectHandler.setTrackCount(currentPreset, newTrackCount, newNoteInputCount);
      setTrackCountDisplay();
    };
    const setTracks = (noteValues: NotesIOFormat) => {
      this.noteSelectHandler.setTracks(noteValues);
      setTrackCountDisplay();
      updateFrequencyModulationDisplay();
    };
    const setTrackCountDisplay = () => {
      const trackCountDisplay = document.querySelector("#display-track-count") as HTMLElement;
      trackCountDisplay.innerHTML = `${this.noteSelectHandler.trackCount}`;
    };
    setTrackCountDisplay();

    // TODO: convert to class method!
    this.setNoteInputCount = (newNoteInputCount: number) => {
      // TODO: make this changable!
      var newTrackCount = this.noteSelectHandler.trackCount; // currentPreset.noteValues.length;
      if (this.noteSelectHandler.noteInputCount === newNoteInputCount) {
        console.log("setNoteInputCount: no change.");
        return;
      }
      this.noteSelectHandler.setTrackCount(currentPreset, newTrackCount, newNoteInputCount);
      setNoteInputCountDisplay();
    };
    const setNoteInputCountDisplay = () => {
      const noteInputCountDisplay = document.querySelector("#display-note-input-count") as HTMLElement;
      noteInputCountDisplay.innerHTML = `${this.noteSelectHandler.noteInputCount}`;
    };
    setNoteInputCountDisplay();

    new PresetSelector(selectedPreset => {
      this.noteSelectHandler.setFromPreset(selectedPreset);
      console.log("selectedPreset.envelope", selectedPreset.envelope);
      this.envelopeHandler.setValues(selectedPreset.envelope);
      mainControls.setValues(selectedPreset.mainValues);
      setOscillatorValues(selectedPreset.oscillator);
      currentPreset = selectedPreset;
      //   resetLoop();
      playbackControl.resetLoop();
    });

    // ---EFFECTS CONTROLS---
    // Vibrato
    // let vibratoSpeed = 10;
    // let vibratoAmount = 0;
    const vibratoAmountControl = document.querySelector("#vibrato-amount-control") as HTMLInputElement;
    const vibratoSpeedControl = document.querySelector("#vibrato-speed-control") as HTMLInputElement;
    // const vibratoFrequencyModulationControl = document.querySelector("#vibrato-frequency-modulation") as HTMLInputElement;

    var handleVibratoAmountChange = function () {
      var vibratoAmount = Number(vibratoAmountControl.value);
      console.log("handleVibratoAmountChange", vibratoAmountControl.value);
      _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.amount = vibratoAmount;
      const vibratoAmountDisplay = document.querySelector("#display-vibrato-amount-control") as HTMLElement;
      vibratoAmountDisplay.innerHTML = `${vibratoAmount}`;
    };
    vibratoAmountControl.addEventListener("input", handleVibratoAmountChange);
    handleVibratoAmountChange();
    var setVibratoFrequencyModulation = function (amnt) {
      console.log("");
      vibratoAmountControl.value = amnt;
      handleVibratoAmountChange();
    };

    var handleVibratoSpeedChange = function () {
      var vibratoSpeed = Number(vibratoSpeedControl.value);
      _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.speed = vibratoSpeed;
      const vibratoSpeedDisplay = document.querySelector("#display-vibrato-speed-control") as HTMLElement;
      vibratoSpeedDisplay.innerHTML = `${vibratoSpeed} Hz`;
    };
    vibratoSpeedControl.addEventListener("input", handleVibratoSpeedChange);
    handleVibratoSpeedChange();
    var setVibratoSpeed = function (spd) {
      vibratoSpeedControl.value = spd;
      handleVibratoSpeedChange();
    };

    // ---BEGIN--- VIBRATO FRQUENCY-MODULATOR SELECT
    const freuquencyModulatorMethods = document.getElementsByName("vibrato-frequency-modulation") as NodeListOf<HTMLInputElement>;
    const handleFrequencyModulationChange = () => {
      console.log(
        // "this.noteSelectHandler.selectedTrackIndex",
        // this.noteSelectHandler.selectedTrackIndex,
        "freuquencyModulatorMethods.length",
        freuquencyModulatorMethods.length
      );
      for (var i = 0; i < freuquencyModulatorMethods.length; i++) {
        if (freuquencyModulatorMethods[i].checked) {
          _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.modulation =
            freuquencyModulatorMethods[i].value as FrquencyModulation;
        }
      }
      // console.log("waveform", waveform);
    };

    freuquencyModulatorMethods.forEach(freuquencyModulatorMethodInput => {
      freuquencyModulatorMethodInput.addEventListener("change", function () {
        handleFrequencyModulationChange();
      });
    });

    var updateFrequencyModulationDisplay = function () {
      var selectedTrack = _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex];
      for (var i = 0; i < freuquencyModulatorMethods.length; i++) {
        freuquencyModulatorMethods[i].checked = Boolean(
          freuquencyModulatorMethods[i].value === selectedTrack.vibratoValues.modulation
        );
      }
    };
    // ---END--- VIBRATO FRERQUENCY-MODULATOR SELECT

    // var handleVibratoFrequencyModulationChange = function () {
    //   var vibratoAmount = Number(vibratoFrequencyModulationControl.value);
    //   console.log("handleVibratoFrquencyModulationChange", vibratoFrequencyModulationControl.value);
    //   _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.amount = vibratoAmount;
    //   // const vibratoAmountDisplay = document.querySelector("#display-vibrato-frequency-modulation-control") as HTMLElement;
    //   // vibratoAmountDisplay.innerHTML = `${vibratoAmount}`;
    // };
    // vibratoFrequencyModulationControl.addEventListener("input", handleVibratoFrequencyModulationChange);
    // handleVibratoFrequencyModulationChange();
    // var setVibratoFrequencyModulation = function (method) {
    //   vibratoFrequencyModulationControl.value = method;
    //   handleVibratoFrequencyModulationChange();
    // };

    // Delay
    const delayAmountControl = document.querySelector("#delay-amount-control") as HTMLInputElement;
    const delayTimeControl = document.querySelector("#delay-time-control") as HTMLInputElement;
    const feedbackControl = document.querySelector("#feedback-control") as HTMLInputElement;
    const delay = mainControls.context.createDelay();
    const feedback = mainControls.context.createGain();
    const delayAmountGain = mainControls.context.createGain();

    delayAmountGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(mainControls.masterVolume);

    delay.delayTime.value = 0;
    delayAmountGain.gain.value = 0;
    feedback.gain.value = 0;

    var handleDelayAmountChange = function () {
      // delayAmountGain.value = delayAmountControl.value;
      // CHECK: I CHANGED THIS
      delayAmountGain.gain.value = Number(delayAmountControl.value);
      // this.noteSelectHandler.tracks[this.noteSelectHandler.selectedTrackIndex].delayValues.amount = delayAmountControl.value; // delayAmountGain.value;
      const delayAmountControlDisplay = document.querySelector("#display-delay-amount-control") as HTMLElement;
      delayAmountControlDisplay.innerHTML = delayAmountControl.value; // delayAmountControl.value;
    };
    delayAmountControl.addEventListener("input", handleDelayAmountChange);
    handleDelayAmountChange();

    var handleDelayTimeChange = function () {
      delay.delayTime.value = Number(delayTimeControl.value);
      const delayTimeDisplay = document.querySelector("#display-delay-time-control") as HTMLElement;
      delayTimeDisplay.innerHTML = delayTimeControl.value;
    };
    delayTimeControl.addEventListener("input", handleDelayTimeChange);
    handleDelayTimeChange();

    var handleFeedbackChanged = function () {
      feedback.gain.value = Number(feedbackControl.value);
      const feedbackDisplay = document.querySelector("#display-feedback-control") as HTMLElement;
      feedbackDisplay.innerHTML = feedbackControl.value;
    };
    feedbackControl.addEventListener("input", handleFeedbackChanged);
    handleFeedbackChanged();

    this.getIOFormat = (): AudioIOFormat => {
      return {
        version: "0.0.1",
        globalSettings: {
          mainSettings: mainControls.values,
          delaySettings: {
            time: 0,
            feedback: 0,
            amount: 0
          }
        },
        notes: this.noteSelectHandler.getNotesIOFormat()
      };
    };

    this.setFromIO = (audioData: AudioIOFormat) => {
      if (!audioData) {
        console.warn("[AudioControl] Cannot load settings (no data given)");
        return;
      }

      if (!audioData.globalSettings || !audioData.globalSettings.mainSettings) {
        console.warn("[AudioControl] Cannot apply main settings (no data given)");
      } else {
        mainControls.setValues(audioData.globalSettings.mainSettings);
      }

      if (!audioData.notes || !audioData.notes) {
        console.warn("[AudioControl] Cannot load notes (no data given)");
      } else {
        setTracks(audioData.notes);
        // updateFrequencyModulationDisplay();
        // setTrackCountDisplay();
      }

      // if (!audioData. || !audioData.notes) {
      //   console.warn("[AudioControl] Cannot load notes (no data given)");
      // } else {
      //   setTracks(audioData.notes);
      //   // setTrackCountDisplay();
      // }
    };
  } // END constructor
}
