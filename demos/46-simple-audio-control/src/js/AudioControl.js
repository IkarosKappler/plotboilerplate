"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioControl = void 0;
var NoteSelectHandler_1 = require("./NoteSelectHandler");
var EnvelopeHandler_1 = require("./EnvelopeHandler");
var presets_1 = require("./presets");
var MainControls_1 = require("./MainControls");
var PresetSelector_1 = require("./PresetSelector");
var PlaybackControl_1 = require("./PlaybackControl");
var AudioControl = /** @class */ (function () {
    function AudioControl(GUP, isDarkmode) {
        var _this = this;
        var _self = this;
        /**
         * Called from the this.EnvelopeHandler when the envelope values are manually altered.
         *
         * @param {EnvelopeSettings} newEnvelope
         */
        var onEnvelopeChanged = function (newEnvelope) {
            _this.noteSelectHandler.tracks[_this.noteSelectHandler.selectedTrackIndex].envelope = newEnvelope;
        };
        this.envelopeHandler = new EnvelopeHandler_1.EnvelopeHandler("envelope-canvas", GUP, isDarkmode ? "#000000" : "#ffffff", onEnvelopeChanged);
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
        var initialPreset = presets_1.getDefaultPreset();
        var currentPreset = initialPreset;
        this.noteSelectHandler = new NoteSelectHandler_1.NoteSelectHandler(initialPreset, 2, handleTrackSelected);
        // WAVEFORM SELECT
        var waveforms = document.getElementsByName("waveform");
        function handleWaveformChange() {
            console.log(
            // "this.noteSelectHandler.selectedTrackIndex",
            // this.noteSelectHandler.selectedTrackIndex,
            "waveforms.length", waveforms.length);
            for (var i = 0; i < waveforms.length; i++) {
                if (waveforms[i].checked) {
                    _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].oscillator.waveform = waveforms[i]
                        .value;
                }
            }
            // console.log("waveform", waveform);
        }
        waveforms.forEach(function (waveformInput) {
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
        var currentNoteIndex = 0;
        var isPlaying = false;
        // NOTE SELECTS
        var mainControls = new MainControls_1.MainControls();
        mainControls.setValues(initialPreset.mainValues);
        this.envelopeHandler.setValues(initialPreset.envelope);
        setOscillatorValues(initialPreset.oscillator);
        var playbackControl = new PlaybackControl_1.PlaybackControl(mainControls, this.noteSelectHandler);
        // var resetLoop = () => {
        //   currentNoteIndex = 0;
        // };
        // TODO: convert to class method!
        this.setTrackCount = function (newTrackCount) {
            if (_this.noteSelectHandler.trackCount === newTrackCount) {
                console.log("setTrackCount: no change.");
                return;
            }
            _this.noteSelectHandler.setTrackCount(currentPreset, newTrackCount);
            setTrackCountDisplay();
        };
        var setTrackCountDisplay = function () {
            var trackCountDisplay = document.querySelector("#display-track-count");
            trackCountDisplay.innerHTML = "" + _this.noteSelectHandler.trackCount;
        };
        setTrackCountDisplay();
        new PresetSelector_1.PresetSelector(function (selectedPreset) {
            _this.noteSelectHandler.setFromPreset(selectedPreset);
            console.log("selectedPreset.envelope", selectedPreset.envelope);
            _this.envelopeHandler.setValues(selectedPreset.envelope);
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
        var vibratoAmountControl = document.querySelector("#vibrato-amount-control");
        var vibratoSpeedControl = document.querySelector("#vibrato-speed-control");
        var handleVibratoAmountChange = function () {
            var vibratoAmount = Number(vibratoAmountControl.value);
            console.log("handleVibratoAmountChange", vibratoAmountControl.value);
            _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.amount = vibratoAmount;
            var vibratoAmountDisplay = document.querySelector("#display-vibrato-amount-control");
            vibratoAmountDisplay.innerHTML = "" + vibratoAmount;
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
            var vibratoSpeedDisplay = document.querySelector("#display-vibrato-speed-control");
            vibratoSpeedDisplay.innerHTML = "" + vibratoSpeed;
        };
        vibratoSpeedControl.addEventListener("input", handleVibratoSpeedChange);
        handleVibratoSpeedChange();
        var setVibratoSpeed = function (spd) {
            vibratoSpeedControl.value = spd;
            handleVibratoSpeedChange();
        };
        // Delay
        var delayAmountControl = document.querySelector("#delay-amount-control");
        var delayTimeControl = document.querySelector("#delay-time-control");
        var feedbackControl = document.querySelector("#feedback-control");
        var delay = mainControls.context.createDelay();
        var feedback = mainControls.context.createGain();
        var delayAmountGain = mainControls.context.createGain();
        var singleLoopControl = document.querySelector("#single-loop-only");
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
            var delayAmountControlDisplay = document.querySelector("#display-delay-amount-control");
            delayAmountControlDisplay.innerHTML = delayAmountControl.value; // delayAmountControl.value;
        };
        delayAmountControl.addEventListener("input", handleDelayAmountChange);
        handleDelayAmountChange();
        var handleDelayTimeChange = function () {
            delay.delayTime.value = Number(delayTimeControl.value);
            var delayTimeDisplay = document.querySelector("#display-delay-time-control");
            delayTimeDisplay.innerHTML = delayTimeControl.value;
        };
        delayTimeControl.addEventListener("input", handleDelayTimeChange);
        handleDelayTimeChange();
        var handleFeedbackChanged = function () {
            feedback.gain.value = Number(feedbackControl.value);
            var feedbackDisplay = document.querySelector("#display-feedback-control");
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
    return AudioControl;
}());
exports.AudioControl = AudioControl;
//# sourceMappingURL=AudioControl.js.map