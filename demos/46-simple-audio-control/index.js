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
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) {
      return;
    }
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    // Always add darkmode
    var isDarkmode = true || detectDarkMode(GUP);
    if (isDarkmode) {
      document.getElementsByTagName("body")[0].classList.add("darkmode");
    }

    var mainControls = new MainControls();
    var envelopeHandler = new EnvelopeHandler("envelope-canvas", GUP, isDarkmode ? "#000000" : "#ffffff");

    let currentNoteIndex = 0;
    let isPlaying = false;

    // NOTE SELECTS
    var initialPreset = getDefaultPreset();
    var noteSelectHandler = new NoteSelectHandler(initialPreset);

    var resetLoop = function () {
      currentNoteIndex = 0;
    };

    new PresetSelector(function (selectedPreset) {
      noteSelectHandler.setFromPreset(selectedPreset);
      console.log("selectedPreset.envelope", selectedPreset.envelope);
      envelopeHandler.setValues(selectedPreset.envelope);
      mainControls.setValues(selectedPreset.mainValues);
      resetLoop();
    });

    // WAVEFORM SELECT
    const waveforms = document.getElementsByName("waveform");
    let waveform = "sine";

    function setWaveform() {
      for (var i = 0; i < waveforms.length; i++) {
        if (waveforms[i].checked) {
          waveform = waveforms[i].value;
        }
      }
    }

    waveforms.forEach(waveformInput => {
      waveformInput.addEventListener("change", function () {
        setWaveform();
      });
    });

    // // EFFECTS CONTROLS
    // Vibrato
    let vibratoSpeed = 10;
    let vibratoAmount = 0;
    const vibratoAmountControl = document.querySelector("#vibrato-amount-control");
    const vibratoSpeedControl = document.querySelector("#vibrato-speed-control");

    var handleVibratoAmountChange = function () {
      vibratoAmount = vibratoAmountControl.value;
      document.querySelector("#display-vibrato-amount-control").innerHTML = vibratoAmount;
    };
    vibratoAmountControl.addEventListener("input", handleVibratoAmountChange);
    handleVibratoAmountChange();

    var handleVibratoSpeedChange = function () {
      vibratoSpeed = vibratoSpeedControl.value;
      document.querySelector("#display-vibrato-speed-control").innerHTML = vibratoSpeed;
    };
    vibratoSpeedControl.addEventListener("input", handleVibratoSpeedChange);
    handleVibratoSpeedChange();

    // Delay
    const delayAmountControl = document.querySelector("#delay-amount-control");
    const delayTimeControl = document.querySelector("#delay-time-control");
    const feedbackControl = document.querySelector("#feedback-control");
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
      delayAmountGain.value = delayAmountControl.value;
      document.querySelector("#display-delay-amount-control").innerHTML = delayAmountControl.value;
    };
    delayAmountControl.addEventListener("input", handleDelayAmountChange);
    handleDelayAmountChange();

    var handleDelayTimeChange = function () {
      delay.delayTime.value = delayTimeControl.value;
      document.querySelector("#display-delay-time-control").innerHTML = delayTimeControl.value;
    };
    delayTimeControl.addEventListener("input", handleDelayTimeChange);
    handleDelayTimeChange();

    var handleFeedbackChanged = function () {
      feedback.gain.value = feedbackControl.value;
      document.querySelector("#display-feedback-control").innerHTML = feedbackControl.value;
    };
    feedbackControl.addEventListener("input", handleFeedbackChanged);
    handleFeedbackChanged();

    // LOOP CONTROLS
    const resetButton = document.querySelector("#reset-button");
    const startButton = document.querySelector("#start-button");
    const stopButton = document.querySelector("#stop-button");

    resetButton.addEventListener("click", function () {
      resetLoop();
    });

    startButton.addEventListener("click", function () {
      if (!isPlaying) {
        startButton.classList.add("d-none");
        stopButton.classList.remove("d-none");
        isPlaying = true;
        noteLoop();
      }
    });

    stopButton.addEventListener("click", function () {
      if (isPlaying) {
        startButton.classList.remove("d-none");
        stopButton.classList.add("d-none");
      }
      isPlaying = false;
    });

    function noteLoop() {
      const secondsPerBeat = 60.0 / mainControls.values.tempo;
      if (isPlaying) {
        playCurrentNote();
        nextNote();
        window.setTimeout(function () {
          noteLoop();
        }, secondsPerBeat * 1000);
      }
    }

    function nextNote() {
      noteSelectHandler.setPlayingNoteIndex(currentNoteIndex);
      currentNoteIndex = (currentNoteIndex + 1) % NoteSelectHandler.NOTE_INPUT_COUNT;
    }

    function playCurrentNote() {
      console.log("noteGain.gain.value", mainControls.masterVolume.gain.value);
      var curNote = noteSelectHandler.currentNotes[currentNoteIndex];
      const noteLengthFactor = curNote.lengthFactor;
      if (noteLengthFactor <= 0.0) {
        return;
      }
      const osc = mainControls.context.createOscillator();
      const noteGain = mainControls.context.createGain();
      noteGain.gain.setValueAtTime(0, 0);
      noteGain.gain.linearRampToValueAtTime(
        envelopeHandler.envelope.sustainLevel,
        mainControls.context.currentTime +
          envelopeHandler.envelope.noteLength * envelopeHandler.envelope.attackTime * noteLengthFactor
      );
      console.log("envelopeHandler.envelope", envelopeHandler.envelope, "noteLengthFactor", noteLengthFactor);
      noteGain.gain.setValueAtTime(
        envelopeHandler.envelope.sustainLevel,
        mainControls.context.currentTime +
          (envelopeHandler.envelope.noteLength - envelopeHandler.envelope.noteLength * envelopeHandler.envelope.releaseTime) *
            noteLengthFactor
      );
      noteGain.gain.linearRampToValueAtTime(
        0,
        mainControls.context.currentTime + envelopeHandler.envelope.noteLength * noteLengthFactor
      );

      var lfoGain = mainControls.context.createGain();
      lfoGain.gain.setValueAtTime(vibratoAmount, 0);
      lfoGain.connect(osc.frequency);

      var lfo = mainControls.context.createOscillator();
      lfo.frequency.setValueAtTime(vibratoSpeed, 0);
      lfo.start(0);
      // lfo.stop(context.currentTime + envelopeHandler.envelope.noteLength);
      lfo.stop(mainControls.context.currentTime + envelopeHandler.envelope.noteLength * noteLengthFactor);
      lfo.connect(lfoGain);

      osc.type = waveform;
      // osc.frequency.setValueAtTime(Object.values(noteValues)[`${currentNotes[currentNoteIndex]}`], 0);
      osc.frequency.setValueAtTime(Object.values(noteValues)[`${curNote.noteIndex}`], 0);

      osc.start(0);
      osc.stop(mainControls.context.currentTime + envelopeHandler.envelope.noteLength * noteLengthFactor);
      osc.connect(noteGain);

      noteGain.connect(mainControls.masterVolume);
      noteGain.connect(delay);
    }
    // ### END SYNTH
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
