/**
 * Playback controls.
 *
 * @author   Ikaros Kappler
 * @date     2023-02-24
 * @version  1.0.0
 **/

import { NoteSelectHandler } from "./NoteSelectHandler";
import { EnvelopeHandler } from "./EnvelopeHandler";
import { getDefaultPreset } from "./presets";
import { Waveform } from "./interfaces";
import { MainControls } from "./MainControls";
import { PresetSelector } from "./PresetSelector";
import { noteValues } from "./noteValues";

export class PlaybackControl {
  private mainControls: MainControls;
  private noteSelectHandler: NoteSelectHandler;

  private currentNoteIndex: number = 0;
  private isPlaying: boolean = false;

  constructor(_mainControls: MainControls, _noteSelectHandler: NoteSelectHandler) {
    this.mainControls = _mainControls;
    this.noteSelectHandler = _noteSelectHandler;

    const _self = this;

    // /**
    //  * Called from the this.EnvelopeHandler when the envelope values are manually altered.
    //  *
    //  * @param {EnvelopeSettings} newEnvelope
    //  */
    // const onEnvelopeChanged = newEnvelope => {
    //   this.noteSelectHandler.tracks[this.noteSelectHandler.selectedTrackIndex].envelope = newEnvelope;
    // };
    // this.envelopeHandler = new EnvelopeHandler("envelope-canvas", GUP, isDarkmode ? "#000000" : "#ffffff", onEnvelopeChanged);

    // /**
    //  * Called from the this.NoteSelectHandler when a track is selected and the
    //  * selectedTrackIndex changed.
    //  *
    //  * @param {Track} selectedTrack
    //  * @param {number} selectedTrackIndex
    //  */
    // var handleTrackSelected = function (selectedTrack, selectedTrackIndex) {
    //   console.log("track selected", selectedTrackIndex);
    //   // Track selected
    //   _self.envelopeHandler.setValues(selectedTrack.envelope);
    //   setVibratoAmount(selectedTrack.vibratoValues.amount);
    //   setVibratoSpeed(selectedTrack.vibratoValues.speed);
    //   setOscillatorValues(selectedTrack.oscillator);
    // };

    // // NOTE SELECTS
    // var initialPreset = getDefaultPreset();
    // var currentPreset = initialPreset;
    // this.noteSelectHandler = new NoteSelectHandler(initialPreset, 2, handleTrackSelected);

    // // WAVEFORM SELECT
    // const waveforms = document.getElementsByName("waveform") as NodeListOf<HTMLInputElement>;
    // function handleWaveformChange() {
    //   console.log(
    //     // "this.noteSelectHandler.selectedTrackIndex",
    //     // this.noteSelectHandler.selectedTrackIndex,
    //     "waveforms.length",
    //     waveforms.length
    //   );
    //   for (var i = 0; i < waveforms.length; i++) {
    //     if (waveforms[i].checked) {
    //       _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].oscillator.waveform = waveforms[i]
    //         .value as Waveform;
    //     }
    //   }
    //   // console.log("waveform", waveform);
    // }

    // waveforms.forEach(waveformInput => {
    //   waveformInput.addEventListener("change", function () {
    //     handleWaveformChange();
    //   });
    // });

    // var updateWaveformDisplay = function () {
    //   var selectedTrack = _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex];
    //   for (var i = 0; i < waveforms.length; i++) {
    //     waveforms[i].checked = Boolean(waveforms[i].value === selectedTrack.oscillator.waveform);
    //   }
    // };

    // var setOscillatorValues = function (options) {
    //   if (options && typeof options.waveform !== "undefined") {
    //     // waveform = options.waveform;
    //     _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].oscillator.waveform = options.waveform;
    //     updateWaveformDisplay();
    //   }
    // };

    // let currentNoteIndex = 0;
    // let isPlaying = false;

    // // NOTE SELECTS
    // var mainControls = new MainControls();
    // mainControls.setValues(initialPreset.mainValues);
    // this.envelopeHandler.setValues(initialPreset.envelope);
    // setOscillatorValues(initialPreset.oscillator);

    // var resetLoop = () => {
    //   currentNoteIndex = 0;
    // };

    // var setTrackCount = newTrackCount => {
    //   if (this.noteSelectHandler.trackCount === newTrackCount) {
    //     console.log("setTrackCount: no change.");
    //     return;
    //   }
    //   this.noteSelectHandler.setTrackCount(currentPreset, newTrackCount);
    //   setTrackCountDisplay();
    // };
    // const setTrackCountDisplay = () => {
    //   const trackCountDisplay = document.querySelector("#display-track-count") as HTMLElement;
    //   trackCountDisplay.innerHTML = `${this.noteSelectHandler.trackCount}`;
    // };
    // setTrackCountDisplay();

    // new PresetSelector(selectedPreset => {
    //   this.noteSelectHandler.setFromPreset(selectedPreset);
    //   console.log("selectedPreset.envelope", selectedPreset.envelope);
    //   this.envelopeHandler.setValues(selectedPreset.envelope);
    //   mainControls.setValues(selectedPreset.mainValues);
    //   setOscillatorValues(selectedPreset.oscillator);
    //   currentPreset = selectedPreset;
    //   resetLoop();
    // });

    // // // EFFECTS CONTROLS
    // // Vibrato
    // // let vibratoSpeed = 10;
    // // let vibratoAmount = 0;
    // const vibratoAmountControl = document.querySelector("#vibrato-amount-control") as HTMLInputElement;
    // const vibratoSpeedControl = document.querySelector("#vibrato-speed-control") as HTMLInputElement;

    // var handleVibratoAmountChange = function () {
    //   var vibratoAmount = Number(vibratoAmountControl.value);
    //   console.log("handleVibratoAmountChange", vibratoAmountControl.value);
    //   _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.amount = vibratoAmount;
    //   const vibratoAmountDisplay = document.querySelector("#display-vibrato-amount-control") as HTMLElement;
    //   vibratoAmountDisplay.innerHTML = `${vibratoAmount}`;
    // };
    // vibratoAmountControl.addEventListener("input", handleVibratoAmountChange);
    // handleVibratoAmountChange();
    // var setVibratoAmount = function (amnt) {
    //   vibratoAmountControl.value = amnt;
    //   handleVibratoAmountChange();
    // };

    // var handleVibratoSpeedChange = function () {
    //   var vibratoSpeed = Number(vibratoSpeedControl.value);
    //   _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.speed = vibratoSpeed;
    //   const vibratoSpeedDisplay = document.querySelector("#display-vibrato-speed-control") as HTMLElement;
    //   vibratoSpeedDisplay.innerHTML = `${vibratoSpeed}`;
    // };
    // vibratoSpeedControl.addEventListener("input", handleVibratoSpeedChange);
    // handleVibratoSpeedChange();
    // var setVibratoSpeed = function (spd) {
    //   vibratoSpeedControl.value = spd;
    //   handleVibratoSpeedChange();
    // };

    // // Delay
    // const delayAmountControl = document.querySelector("#delay-amount-control") as HTMLInputElement;
    // const delayTimeControl = document.querySelector("#delay-time-control") as HTMLInputElement;
    // const feedbackControl = document.querySelector("#feedback-control") as HTMLInputElement;
    const delay = this.mainControls.context.createDelay();
    // const feedback = mainControls.context.createGain();
    // const delayAmountGain = mainControls.context.createGain();

    const singleLoopControl = document.querySelector("#single-loop-only") as HTMLInputElement;
    // //   singleLoopControl.addEventListener("input", function () {
    // //     // ???
    // //   });

    // delayAmountGain.connect(delay);
    // delay.connect(feedback);
    // feedback.connect(delay);
    // delay.connect(mainControls.masterVolume);

    // delay.delayTime.value = 0;
    // delayAmountGain.gain.value = 0;
    // feedback.gain.value = 0;

    // var handleDelayAmountChange = function () {
    //   // delayAmountGain.value = delayAmountControl.value;
    //   // CHECK: I CHANGED THIS
    //   delayAmountGain.gain.value = Number(delayAmountControl.value);
    //   // this.noteSelectHandler.tracks[this.noteSelectHandler.selectedTrackIndex].delayValues.amount = delayAmountControl.value; // delayAmountGain.value;
    //   const delayAmountControlDisplay = document.querySelector("#display-delay-amount-control") as HTMLElement;
    //   delayAmountControlDisplay.innerHTML = delayAmountControl.value; // delayAmountControl.value;
    // };
    // delayAmountControl.addEventListener("input", handleDelayAmountChange);
    // handleDelayAmountChange();

    // var handleDelayTimeChange = function () {
    //   delay.delayTime.value = Number(delayTimeControl.value);
    //   const delayTimeDisplay = document.querySelector("#display-delay-time-control") as HTMLElement;
    //   delayTimeDisplay.innerHTML = delayTimeControl.value;
    // };
    // delayTimeControl.addEventListener("input", handleDelayTimeChange);
    // handleDelayTimeChange();

    // var handleFeedbackChanged = function () {
    //   feedback.gain.value = Number(feedbackControl.value);
    //   const feedbackDisplay = document.querySelector("#display-feedback-control") as HTMLElement;
    //   feedbackDisplay.innerHTML = feedbackControl.value;
    // };
    // feedbackControl.addEventListener("input", handleFeedbackChanged);
    // handleFeedbackChanged();

    // LOOP CONTROLS
    var resetButton = document.querySelector("#reset-button") as HTMLButtonElement;
    var startButton = document.querySelector("#start-button") as HTMLButtonElement;
    var stopButton = document.querySelector("#stop-button") as HTMLButtonElement;

    resetButton.addEventListener("click", function () {
      _self.resetLoop();
    });

    var updatePlayingDisplay = function () {
      if (_self.isPlaying) {
        startButton.classList.remove("d-none");
        stopButton.classList.add("d-none");
      } else {
        startButton.classList.add("d-none");
        stopButton.classList.remove("d-none");
      }
    };

    startButton.addEventListener("click", function () {
      if (!_self.isPlaying) {
        // startButton.classList.add("d-none");
        // stopButton.classList.remove("d-none");
        updatePlayingDisplay();
        _self.isPlaying = true;
        noteLoop();
      }
    });

    stopButton.addEventListener("click", function () {
      if (_self.isPlaying) {
        // startButton.classList.remove("d-none");
        // stopButton.classList.add("d-none");
        updatePlayingDisplay();
      }
      _self.isPlaying = false;
    });

    function noteLoop() {
      const secondsPerBeat = 60.0 / _self.mainControls.values.tempo;
      if (_self.isPlaying) {
        for (var curTrackIndex = 0; curTrackIndex < _self.noteSelectHandler.trackCount; curTrackIndex++) {
          // console.log("Play note in track", curTrackIndex);
          if (_self.noteSelectHandler.isTrackMuted[curTrackIndex]) {
            // Don't play muted tracks.
            continue;
          }
          playCurrentNote(curTrackIndex);
        }
        // playCurrentNote(0);
        nextNote();
        if (_self.currentNoteIndex === 0 && singleLoopControl.checked) {
          singleLoopControl.checked = false;
          _self.isPlaying = false;
          updatePlayingDisplay();
        } else {
          window.setTimeout(function () {
            noteLoop();
          }, secondsPerBeat * 1000);
        }
      }
    }

    function nextNote() {
      _self.noteSelectHandler.setPlayingNoteIndex(_self.currentNoteIndex);
      _self.currentNoteIndex = (_self.currentNoteIndex + 1) % NoteSelectHandler.NOTE_INPUT_COUNT;
    }

    function playCurrentNote(curTrackIndex) {
      var curTrack = _self.noteSelectHandler.tracks[curTrackIndex];
      var curNote = curTrack.currentNotes[_self.currentNoteIndex];
      // delayAmountGain.value = curTrack.delayValues.amount;
      console.log("curTrack.vibratoValues", curTrack.vibratoValues); // , vibratoAmount, vibratoSpeed);

      console.log("curNote", curNote);
      if (!curNote || curNote.noteIndex < 1 || curNote.noteIndex >= Object.keys(noteValues).length) {
        console.info("Note at index " + _self.currentNoteIndex + " not set.");
        return;
      }
      const noteLengthFactor = curNote.lengthFactor;
      if (noteLengthFactor <= 0.0) {
        return;
      }
      const osc = _self.mainControls.context.createOscillator();
      const noteGain = _self.mainControls.context.createGain();
      noteGain.gain.setValueAtTime(0, 0);
      noteGain.gain.linearRampToValueAtTime(
        curTrack.envelope.sustainLevel,
        _self.mainControls.context.currentTime + curTrack.envelope.noteLength * curTrack.envelope.attackTime * noteLengthFactor
      );
      // console.log("this.envelopeHandler.envelope", this.envelopeHandler.envelope, "noteLengthFactor", noteLengthFactor);
      noteGain.gain.setValueAtTime(
        curTrack.envelope.sustainLevel,
        _self.mainControls.context.currentTime +
          (curTrack.envelope.noteLength - curTrack.envelope.noteLength * curTrack.envelope.releaseTime) * noteLengthFactor
      );
      noteGain.gain.linearRampToValueAtTime(
        0,
        _self.mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor
      );

      var lfoGain = _self.mainControls.context.createGain();
      // lfoGain.gain.setValueAtTime(vibratoAmount, 0);
      lfoGain.gain.setValueAtTime(curTrack.vibratoValues.amount, 0);
      lfoGain.connect(osc.frequency);

      var lfo = _self.mainControls.context.createOscillator();
      // lfo.frequency.setValueAtTime(vibratoSpeed, 0);
      lfo.frequency.setValueAtTime(curTrack.vibratoValues.speed, 0);
      lfo.start(0);
      // lfo.stop(context.currentTime + this.envelopeHandler.envelope.noteLength);
      lfo.stop(_self.mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor);
      lfo.connect(lfoGain);

      // osc.type = waveform;
      osc.type = curTrack.oscillator.waveform;
      console.log("curNote", curNote);
      osc.frequency.setValueAtTime(Object.values(noteValues)[`${curNote.noteIndex}`], 0);

      osc.start(0);
      osc.stop(_self.mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor);
      osc.connect(noteGain);

      noteGain.connect(_self.mainControls.masterVolume);
      noteGain.connect(delay);
    }
    // ### END SYNTH
  } // END constructor

  resetLoop() {
    this.currentNoteIndex = 0;
  }
}
