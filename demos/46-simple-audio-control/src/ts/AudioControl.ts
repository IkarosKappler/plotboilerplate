/**
 * A script to demonstrate how to animate beziers and curvature.
 *
 * I used this neat quick-tutorial of how to build a simple synthesizer:
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2023-01-22
 * @modified 2023-02-24
 * @version  1.0.0
 **/

import { NoteSelectHandler } from "./NoteSelectHandler";
import { EnvelopeHandler } from "./EnvelopeHandler";
import { getDefaultPreset } from "./presets";
import { Waveform } from "./interfaces";
import { MainControls } from "./MainControls";
import { PresetSelector } from "./PresetSelector";
import { noteValues } from "./noteValues";
import { PlaybackControl } from "./PlaybackControl";

export class AudioControl {
  noteSelectHandler: NoteSelectHandler;
  private envelopeHandler: EnvelopeHandler;
  private setTrackCount: (newTrackCount: number) => void;

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
    var handleTrackSelected = function (selectedTrack, selectedTrackIndex) {
      console.log("track selected", selectedTrackIndex);
      // Track selected
      _self.envelopeHandler.setValues(selectedTrack.envelope);
      setVibratoAmount(selectedTrack.vibratoValues.amount);
      setVibratoSpeed(selectedTrack.vibratoValues.speed);
      setOscillatorValues(selectedTrack.oscillator);
    };

    // NOTE SELECTS
    var initialPreset = getDefaultPreset();
    var currentPreset = initialPreset;
    this.noteSelectHandler = new NoteSelectHandler(initialPreset, 2, handleTrackSelected);

    // WAVEFORM SELECT
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

    var setOscillatorValues = function (options) {
      if (options && typeof options.waveform !== "undefined") {
        // waveform = options.waveform;
        _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].oscillator.waveform = options.waveform;
        updateWaveformDisplay();
      }
    };

    let currentNoteIndex = 0;
    let isPlaying = false;

    // NOTE SELECTS
    var mainControls = new MainControls();
    mainControls.setValues(initialPreset.mainValues);
    this.envelopeHandler.setValues(initialPreset.envelope);
    setOscillatorValues(initialPreset.oscillator);

    const playbackControl = new PlaybackControl(mainControls, this.noteSelectHandler);

    // var resetLoop = () => {
    //   currentNoteIndex = 0;
    // };

    // TODO: convert to class method!
    this.setTrackCount = newTrackCount => {
      if (this.noteSelectHandler.trackCount === newTrackCount) {
        console.log("setTrackCount: no change.");
        return;
      }
      this.noteSelectHandler.setTrackCount(currentPreset, newTrackCount);
      setTrackCountDisplay();
    };
    const setTrackCountDisplay = () => {
      const trackCountDisplay = document.querySelector("#display-track-count") as HTMLElement;
      trackCountDisplay.innerHTML = `${this.noteSelectHandler.trackCount}`;
    };
    setTrackCountDisplay();

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

    // // EFFECTS CONTROLS
    // Vibrato
    // let vibratoSpeed = 10;
    // let vibratoAmount = 0;
    const vibratoAmountControl = document.querySelector("#vibrato-amount-control") as HTMLInputElement;
    const vibratoSpeedControl = document.querySelector("#vibrato-speed-control") as HTMLInputElement;

    var handleVibratoAmountChange = function () {
      var vibratoAmount = Number(vibratoAmountControl.value);
      console.log("handleVibratoAmountChange", vibratoAmountControl.value);
      _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.amount = vibratoAmount;
      const vibratoAmountDisplay = document.querySelector("#display-vibrato-amount-control") as HTMLElement;
      vibratoAmountDisplay.innerHTML = `${vibratoAmount}`;
    };
    vibratoAmountControl.addEventListener("input", handleVibratoAmountChange);
    handleVibratoAmountChange();
    var setVibratoAmount = function (amnt) {
      vibratoAmountControl.value = amnt;
      handleVibratoAmountChange();
    };

    var handleVibratoSpeedChange = function () {
      var vibratoSpeed = Number(vibratoSpeedControl.value);
      _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.speed = vibratoSpeed;
      const vibratoSpeedDisplay = document.querySelector("#display-vibrato-speed-control") as HTMLElement;
      vibratoSpeedDisplay.innerHTML = `${vibratoSpeed}`;
    };
    vibratoSpeedControl.addEventListener("input", handleVibratoSpeedChange);
    handleVibratoSpeedChange();
    var setVibratoSpeed = function (spd) {
      vibratoSpeedControl.value = spd;
      handleVibratoSpeedChange();
    };

    // Delay
    const delayAmountControl = document.querySelector("#delay-amount-control") as HTMLInputElement;
    const delayTimeControl = document.querySelector("#delay-time-control") as HTMLInputElement;
    const feedbackControl = document.querySelector("#feedback-control") as HTMLInputElement;
    const delay = mainControls.context.createDelay();
    const feedback = mainControls.context.createGain();
    const delayAmountGain = mainControls.context.createGain();

    const singleLoopControl = document.querySelector("#single-loop-only") as HTMLInputElement;
    //   singleLoopControl.addEventListener("input", function () {
    //     // ???
    //   });

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

    // LOOP CONTROLS
    // var resetButton = document.querySelector("#reset-button") as HTMLButtonElement;
    // var startButton = document.querySelector("#start-button") as HTMLButtonElement;
    // var stopButton = document.querySelector("#stop-button") as HTMLButtonElement;

    // resetButton.addEventListener("click", function () {
    //   playbackControl.resetLoop();
    // });

    // var updatePlayingDisplay = function () {
    //   if (isPlaying) {
    //     startButton.classList.remove("d-none");
    //     stopButton.classList.add("d-none");
    //   } else {
    //     startButton.classList.add("d-none");
    //     stopButton.classList.remove("d-none");
    //   }
    // };

    // startButton.addEventListener("click", function () {
    //   if (!isPlaying) {
    //     // startButton.classList.add("d-none");
    //     // stopButton.classList.remove("d-none");
    //     updatePlayingDisplay();
    //     isPlaying = true;
    //     noteLoop();
    //   }
    // });

    // stopButton.addEventListener("click", function () {
    //   if (isPlaying) {
    //     // startButton.classList.remove("d-none");
    //     // stopButton.classList.add("d-none");
    //     updatePlayingDisplay();
    //   }
    //   isPlaying = false;
    // });

    // function noteLoop() {
    //   const secondsPerBeat = 60.0 / mainControls.values.tempo;
    //   if (isPlaying) {
    //     for (var curTrackIndex = 0; curTrackIndex < _self.noteSelectHandler.trackCount; curTrackIndex++) {
    //       // console.log("Play note in track", curTrackIndex);
    //       if (_self.noteSelectHandler.isTrackMuted[curTrackIndex]) {
    //         // Don't play muted tracks.
    //         continue;
    //       }
    //       playCurrentNote(curTrackIndex);
    //     }
    //     // playCurrentNote(0);
    //     nextNote();
    //     if (currentNoteIndex === 0 && singleLoopControl.checked) {
    //       singleLoopControl.checked = false;
    //       isPlaying = false;
    //       updatePlayingDisplay();
    //     } else {
    //       window.setTimeout(function () {
    //         noteLoop();
    //       }, secondsPerBeat * 1000);
    //     }
    //   }
    // }

    // function nextNote() {
    //   _self.noteSelectHandler.setPlayingNoteIndex(currentNoteIndex);
    //   currentNoteIndex = (currentNoteIndex + 1) % NoteSelectHandler.NOTE_INPUT_COUNT;
    // }

    // function playCurrentNote(curTrackIndex) {
    //   var curTrack = _self.noteSelectHandler.tracks[curTrackIndex];
    //   var curNote = curTrack.currentNotes[currentNoteIndex];
    //   // delayAmountGain.value = curTrack.delayValues.amount;
    //   console.log("curTrack.vibratoValues", curTrack.vibratoValues); // , vibratoAmount, vibratoSpeed);

    //   console.log("curNote", curNote);
    //   if (!curNote || curNote.noteIndex < 1 || curNote.noteIndex >= Object.keys(noteValues).length) {
    //     console.info("Note at index " + currentNoteIndex + " not set.");
    //     return;
    //   }
    //   const noteLengthFactor = curNote.lengthFactor;
    //   if (noteLengthFactor <= 0.0) {
    //     return;
    //   }
    //   const osc = mainControls.context.createOscillator();
    //   const noteGain = mainControls.context.createGain();
    //   noteGain.gain.setValueAtTime(0, 0);
    //   noteGain.gain.linearRampToValueAtTime(
    //     curTrack.envelope.sustainLevel,
    //     mainControls.context.currentTime + curTrack.envelope.noteLength * curTrack.envelope.attackTime * noteLengthFactor
    //   );
    //   // console.log("this.envelopeHandler.envelope", this.envelopeHandler.envelope, "noteLengthFactor", noteLengthFactor);
    //   noteGain.gain.setValueAtTime(
    //     curTrack.envelope.sustainLevel,
    //     mainControls.context.currentTime +
    //       (curTrack.envelope.noteLength - curTrack.envelope.noteLength * curTrack.envelope.releaseTime) * noteLengthFactor
    //   );
    //   noteGain.gain.linearRampToValueAtTime(
    //     0,
    //     mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor
    //   );

    //   var lfoGain = mainControls.context.createGain();
    //   // lfoGain.gain.setValueAtTime(vibratoAmount, 0);
    //   lfoGain.gain.setValueAtTime(curTrack.vibratoValues.amount, 0);
    //   lfoGain.connect(osc.frequency);

    //   var lfo = mainControls.context.createOscillator();
    //   // lfo.frequency.setValueAtTime(vibratoSpeed, 0);
    //   lfo.frequency.setValueAtTime(curTrack.vibratoValues.speed, 0);
    //   lfo.start(0);
    //   // lfo.stop(context.currentTime + this.envelopeHandler.envelope.noteLength);
    //   lfo.stop(mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor);
    //   lfo.connect(lfoGain);

    //   // osc.type = waveform;
    //   osc.type = curTrack.oscillator.waveform;
    //   console.log("curNote", curNote);
    //   osc.frequency.setValueAtTime(Object.values(noteValues)[`${curNote.noteIndex}`], 0);

    //   osc.start(0);
    //   osc.stop(mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor);
    //   osc.connect(noteGain);

    //   noteGain.connect(mainControls.masterVolume);
    //   noteGain.connect(delay);
    // }
    // ### END SYNTH
  } // END constructor
}
