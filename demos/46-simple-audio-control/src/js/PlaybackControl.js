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
 * @author   Ikaros Kappler
 * @date     2023-02-24
 * @version  1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybackControl = void 0;
var noteValues_1 = require("./noteValues");
var PlaybackControl = /** @class */ (function () {
    function PlaybackControl(audioControl, _mainControls, _noteSelectHandler) {
        this.currentNoteIndex = 0;
        this.isPlaying = false;
        this.mainControls = _mainControls;
        this.noteSelectHandler = _noteSelectHandler;
        var _self = this;
        // const delay = this.mainControls.context.createDelay();
        var singleLoopControl = document.querySelector("#single-loop-only");
        // LOOP CONTROLS
        var resetButton = document.querySelector("#reset-button");
        var startButton = document.querySelector("#start-button");
        var stopButton = document.querySelector("#stop-button");
        resetButton.addEventListener("click", function () {
            _self.resetLoop();
        });
        var updatePlayingDisplay = function () {
            if (_self.isPlaying) {
                startButton.classList.remove("d-none");
                stopButton.classList.add("d-none");
            }
            else {
                startButton.classList.add("d-none");
                stopButton.classList.remove("d-none");
            }
        };
        startButton.addEventListener("click", function () {
            if (!_self.isPlaying) {
                updatePlayingDisplay();
                _self.isPlaying = true;
                noteLoop();
            }
        });
        stopButton.addEventListener("click", function () {
            if (_self.isPlaying) {
                updatePlayingDisplay();
            }
            _self.isPlaying = false;
        });
        function noteLoop() {
            var secondsPerBeat = 60.0 / _self.mainControls.values.tempo;
            if (_self.isPlaying) {
                for (var curTrackIndex = 0; curTrackIndex < _self.noteSelectHandler.trackCount; curTrackIndex++) {
                    // console.log("Play note in track", curTrackIndex);
                    // if (_self.noteSelectHandler.isTrackMuted[curTrackIndex]) {
                    if (_self.noteSelectHandler.tracks[curTrackIndex].isMuted) {
                        // Don't play muted tracks.
                        continue;
                    }
                    playCurrentNote(curTrackIndex);
                }
                nextNote();
                if (_self.currentNoteIndex === 0 && singleLoopControl.checked) {
                    singleLoopControl.checked = false;
                    _self.isPlaying = false;
                    updatePlayingDisplay();
                }
                else {
                    window.setTimeout(function () {
                        noteLoop();
                    }, secondsPerBeat * 1000);
                }
            }
        }
        function nextNote() {
            _self.noteSelectHandler.setPlayingNoteDisplay(_self.currentNoteIndex);
            //   _self.currentNoteIndex = (_self.currentNoteIndex + 1) % NoteSelectHandler.DEFAULT_NOTE_INPUT_COUNT;
            _self.currentNoteIndex = (_self.currentNoteIndex + 1) % _self.noteSelectHandler.noteInputCount;
        }
        function playCurrentNote(curTrackIndex) {
            var curTrack = _self.noteSelectHandler.tracks[curTrackIndex];
            var curNote = curTrack.currentNotes[_self.currentNoteIndex];
            // delayAmountGain.value = curTrack.delayValues.amount;
            console.log("curTrack.vibratoValues", curTrack.vibratoValues); // , vibratoAmount, vibratoSpeed);
            console.log("curNote", curNote);
            if (!curNote || curNote.noteIndex < 1 || curNote.noteIndex >= Object.keys(noteValues_1.noteValues).length) {
                console.info("Note at index " + _self.currentNoteIndex + " not set.");
                return;
            }
            var noteLengthFactor = curNote.lengthFactor;
            if (noteLengthFactor <= 0.0) {
                return;
            }
            var osc = _self.mainControls.context.createOscillator();
            var noteGain = _self.mainControls.context.createGain();
            noteGain.gain.setValueAtTime(0, 0);
            noteGain.gain.linearRampToValueAtTime(curTrack.envelope.sustainLevel, _self.mainControls.context.currentTime + curTrack.envelope.noteLength * curTrack.envelope.attackTime * noteLengthFactor);
            // console.log("this.envelopeHandler.envelope", this.envelopeHandler.envelope, "noteLengthFactor", noteLengthFactor);
            noteGain.gain.setValueAtTime(curTrack.envelope.sustainLevel, _self.mainControls.context.currentTime +
                (curTrack.envelope.noteLength - curTrack.envelope.noteLength * curTrack.envelope.releaseTime) * noteLengthFactor);
            noteGain.gain.linearRampToValueAtTime(0, _self.mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor);
            var lfoGain = _self.mainControls.context.createGain();
            lfoGain.gain.setValueAtTime(curTrack.vibratoValues.amount, 0);
            lfoGain.connect(osc.frequency);
            var lfo = _self.mainControls.context.createOscillator();
            if (curTrack.vibratoValues.modulation === "gaussian") {
                // This changes the tremo frequency over time :)
                var tuneLength = curTrack.envelope.noteLength * noteLengthFactor;
                lfo.frequency.setValueAtTime(curTrack.vibratoValues.speed / 4, 0);
                lfo.frequency.setValueAtTime(curTrack.vibratoValues.speed / 2, tuneLength / 4);
                lfo.frequency.setValueAtTime(curTrack.vibratoValues.speed / 1, (tuneLength / 4) * 2);
                lfo.frequency.setValueAtTime(curTrack.vibratoValues.speed / 2, (tuneLength / 4) * 3);
                lfo.frequency.setValueAtTime(curTrack.vibratoValues.speed / 4, tuneLength);
            }
            else {
                // Just play a constant frequency-
                lfo.frequency.setValueAtTime(curTrack.vibratoValues.speed, 0);
            }
            lfo.start(0);
            // lfo.stop(context.currentTime + this.envelopeHandler.envelope.noteLength);
            lfo.stop(_self.mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor);
            lfo.connect(lfoGain);
            osc.type = curTrack.oscillator.waveform;
            // console.log("curNote", curNote);
            osc.frequency.setValueAtTime(Object.values(noteValues_1.noteValues)["" + curNote.noteIndex], 0);
            osc.start(0);
            osc.stop(_self.mainControls.context.currentTime + curTrack.envelope.noteLength * noteLengthFactor);
            osc.connect(noteGain);
            noteGain.connect(_self.mainControls.masterVolume);
            // noteGain.connect(delay);
            noteGain.connect(audioControl.delay);
        }
        // ### END SYNTH
    } // END constructor
    PlaybackControl.prototype.resetLoop = function () {
        this.currentNoteIndex = 0;
        this.noteSelectHandler.setPlayingNoteDisplay(-1);
    };
    return PlaybackControl;
}());
exports.PlaybackControl = PlaybackControl;
//# sourceMappingURL=PlaybackControl.js.map