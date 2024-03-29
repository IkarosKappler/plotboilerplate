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
            setVibratoFrequencyModulation(selectedTrack.vibratoValues.amount);
            setVibratoSpeed(selectedTrack.vibratoValues.speed);
            setVibratoFrequencyModulation(selectedTrack.vibratoValues.modulation);
            setOscillatorValues(selectedTrack.oscillator);
        };
        // NOTE SELECTS
        var initialPreset = presets_1.getDefaultPreset();
        var currentPreset = initialPreset;
        this.noteSelectHandler = new NoteSelectHandler_1.NoteSelectHandler(initialPreset, 2, handleTrackSelected);
        // ---BEGIN--- WAVEFORM SELECT
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
        // ---END--- WAVEFORM SELECT
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
        var playbackControl = new PlaybackControl_1.PlaybackControl(this, mainControls, this.noteSelectHandler);
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
        var setTracks = function (noteValues) {
            _this.noteSelectHandler.setTracks(noteValues);
            setTrackCountDisplay();
            updateFrequencyModulationDisplay();
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
        // const vibratoFrequencyModulationControl = document.querySelector("#vibrato-frequency-modulation") as HTMLInputElement;
        var handleVibratoAmountChange = function () {
            var vibratoAmount = Number(vibratoAmountControl.value);
            console.log("handleVibratoAmountChange", vibratoAmountControl.value);
            _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.amount = vibratoAmount;
            var vibratoAmountDisplay = document.querySelector("#display-vibrato-amount-control");
            vibratoAmountDisplay.innerHTML = "" + vibratoAmount;
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
            var vibratoSpeedDisplay = document.querySelector("#display-vibrato-speed-control");
            vibratoSpeedDisplay.innerHTML = vibratoSpeed + " Hz";
        };
        vibratoSpeedControl.addEventListener("input", handleVibratoSpeedChange);
        handleVibratoSpeedChange();
        var setVibratoSpeed = function (spd) {
            vibratoSpeedControl.value = spd;
            handleVibratoSpeedChange();
        };
        // ---BEGIN--- VIBRATO FRQUENCY-MODULATOR SELECT
        var freuquencyModulatorMethods = document.getElementsByName("vibrato-frequency-modulation");
        var handleFrequencyModulationChange = function () {
            console.log(
            // "this.noteSelectHandler.selectedTrackIndex",
            // this.noteSelectHandler.selectedTrackIndex,
            "freuquencyModulatorMethods.length", freuquencyModulatorMethods.length);
            for (var i = 0; i < freuquencyModulatorMethods.length; i++) {
                if (freuquencyModulatorMethods[i].checked) {
                    _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex].vibratoValues.modulation =
                        freuquencyModulatorMethods[i].value;
                }
            }
            // console.log("waveform", waveform);
        };
        freuquencyModulatorMethods.forEach(function (freuquencyModulatorMethodInput) {
            freuquencyModulatorMethodInput.addEventListener("change", function () {
                handleFrequencyModulationChange();
            });
        });
        var updateFrequencyModulationDisplay = function () {
            var selectedTrack = _self.noteSelectHandler.tracks[_self.noteSelectHandler.selectedTrackIndex];
            for (var i = 0; i < freuquencyModulatorMethods.length; i++) {
                freuquencyModulatorMethods[i].checked = Boolean(freuquencyModulatorMethods[i].value === selectedTrack.vibratoValues.modulation);
            }
        };
        // ---END--- VIBRATO FRERQUENCY-MODULATOR SELECT
        // Delay
        var delayAmountControl = document.querySelector("#delay-amount-control");
        var delayTimeControl = document.querySelector("#delay-time-control");
        var feedbackControl = document.querySelector("#feedback-control");
        // const delay = mainControls.context.createDelay();
        _self.delay = mainControls.context.createDelay();
        var feedback = mainControls.context.createGain();
        var delayAmountGain = mainControls.context.createGain();
        delayAmountGain.connect(_self.delay);
        _self.delay.connect(feedback);
        feedback.connect(_self.delay);
        _self.delay.connect(mainControls.masterVolume);
        _self.delay.delayTime.value = 0;
        delayAmountGain.gain.value = 0;
        feedback.gain.value = 0;
        var handleDelayAmountChange = function () {
            delayAmountGain.gain.value = Number(delayAmountControl.value);
            console.log("delayAmountGain.gain.value", delayAmountGain.gain.value);
            var delayAmountControlDisplay = document.querySelector("#display-delay-amount-control");
            delayAmountControlDisplay.innerHTML = delayAmountControl.value; // delayAmountControl.value;
        };
        delayAmountControl.addEventListener("input", handleDelayAmountChange);
        handleDelayAmountChange();
        var handleDelayTimeChange = function () {
            _self.delay.delayTime.value = Number(delayTimeControl.value);
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
        this.getIOFormat = function () {
            return {
                version: "0.0.1",
                globalSettings: {
                    mainSettings: mainControls.values,
                    delaySettings: {
                        time: _self.delay.delayTime.value,
                        feedback: feedback.gain.value,
                        amount: delayAmountGain.gain.value // 0
                    }
                },
                notes: _this.noteSelectHandler.getNotesIOFormat()
            };
        };
        this.setFromIO = function (audioData) {
            if (!audioData) {
                console.warn("[AudioControl] Cannot load settings (no data given)");
                return;
            }
            if (!audioData.globalSettings || !audioData.globalSettings.mainSettings) {
                console.warn("[AudioControl] Cannot apply main settings (no data given)");
            }
            else {
                mainControls.setValues(audioData.globalSettings.mainSettings);
            }
            if (!audioData.notes || !audioData.notes) {
                console.warn("[AudioControl] Cannot load notes (no data given)");
            }
            else {
                setTracks(audioData.notes);
            }
        };
    } // END constructor
    return AudioControl;
}());
exports.AudioControl = AudioControl;
//# sourceMappingURL=AudioControl.js.map