"use strict";
/**
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
        // NOTE SELECTS
        var mainControls = new MainControls_1.MainControls();
        mainControls.setValues(initialPreset.mainValues);
        this.envelopeHandler.setValues(initialPreset.envelope);
        setOscillatorValues(initialPreset.oscillator);
        var playbackControl = new PlaybackControl_1.PlaybackControl(mainControls, this.noteSelectHandler);
        // TODO: convert to class method!
        this.setTrackCount = function (newTrackCount) {
            // TODO: make this changable!
            var newNoteInputCount = _this.noteSelectHandler.noteInputCount; // currentPreset.noteValues.length;
            if (_this.noteSelectHandler.trackCount === newTrackCount) {
                console.log("setTrackCount: no change.");
                return;
            }
            _this.noteSelectHandler.setTrackCount(currentPreset, newTrackCount, newNoteInputCount);
            setTrackCountDisplay();
        };
        var setTrackCountDisplay = function () {
            var trackCountDisplay = document.querySelector("#display-track-count");
            trackCountDisplay.innerHTML = "" + _this.noteSelectHandler.trackCount;
        };
        setTrackCountDisplay();
        // TODO: convert to class method!
        this.setNoteInputCount = function (newNoteInputCount) {
            // TODO: make this changable!
            var newTrackCount = _this.noteSelectHandler.trackCount; // currentPreset.noteValues.length;
            if (_this.noteSelectHandler.noteInputCount === newNoteInputCount) {
                console.log("setNoteInputCount: no change.");
                return;
            }
            _this.noteSelectHandler.setTrackCount(currentPreset, newTrackCount, newNoteInputCount);
            setNoteInputCountDisplay();
        };
        var setNoteInputCountDisplay = function () {
            var noteInputCountDisplay = document.querySelector("#display-note-input-count");
            noteInputCountDisplay.innerHTML = "" + _this.noteSelectHandler.noteInputCount;
        };
        setNoteInputCountDisplay();
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
        // ---EFFECTS CONTROLS---
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
    } // END constructor
    AudioControl.prototype.getIOFormat = function () {
        return {
            version: "0.0.1",
            notes: this.noteSelectHandler.getNotesIOFormat()
            // TODO ...
            // delay?
        };
    };
    return AudioControl;
}());
exports.AudioControl = AudioControl;
//# sourceMappingURL=AudioControl.js.map