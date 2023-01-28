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

    const NOTE_INPUT_COUNT = 16;

    let currentNoteIndex = 0;
    let isPlaying = false;
    var currentNotes = null; // Will be initiallized with the PresetSelector

    // NOTE SELECTS
    renderNoteSelectTable(NOTE_INPUT_COUNT, setCurrentNotes, setCurrentNoteLengths, handleNoteSelectChange);

    var convertPresetToNotes = function (preset) {
      // let currentNotes = [0, 3, 0, 7, 8, 7, 3, 2];
      var notes = new Array(NOTE_INPUT_COUNT).fill(0, 0, NOTE_INPUT_COUNT).map(function (value, index) {
        // Pick a note in the 4th or 5th ocate
        // C4 is at index 48
        // return 48 + Math.floor(Math.random() * 12);
        return { noteIndex: locateNoteByIdentifier(preset[index].value), lengthFactor: preset[index].lengthFactor };
      });
      return notes;
    };

    console.log("currentNotes", currentNotes);
    const noteSelects = document.querySelectorAll("select");
    function setNoteSelects() {
      for (let i = 0; i < currentNotes.length; i++) {
        var noteIndex = currentNotes[i].noteIndex;
        noteSelects[i].value = noteIndex;
        var noteIdentifier = Object.keys(noteValues)[noteIndex];
        var noteFrequency = noteValues[noteIdentifier];
        noteSelects[i].setAttribute("title", `${noteIdentifier} @${noteFrequency}Hz`);
      }
    }
    // const currentNoteLengthFactors = new Array(NOTE_INPUT_COUNT).fill(1, 0, NOTE_INPUT_COUNT);

    function setCurrentNotes() {
      for (let i = 0; i < noteSelects.length; i++) {
        currentNotes[i].noteIndex = noteSelects[i].value;
      }
    }

    function handleNoteSelectChange(event) {
      console.log("event", event, event.target.value);
      var noteIndex = event.target.value;
      var selectIndex = event.target.getAttribute("data-index");
      currentNotes[selectIndex].noteIndex = noteIndex;
      var note = getNoteByIndex(noteIndex);
      noteSelects[selectIndex].setAttribute("title", `${note.identifier} @${note.frequency}Hz`);
    }

    const noteLengthSliders = document.querySelectorAll("input[type=range].note_duration_slider");
    console.log("noteLengthSliders", noteLengthSliders.length);
    function setCurrentNoteLengthInputs() {
      // console.log("setCurrentNoteLengths", setCurrentNoteLengths);
      for (let i = 0; i < noteLengthSliders.length; i++) {
        // currentNoteLengthFactors[i] = Number(noteLengthSliders[i].value);
        noteLengthSliders[i].value = currentNotes[i].lengthFactor;
        document.getElementById(`note-length-display-${i + 1}`).innerHTML = currentNotes[i].lengthFactor;
      }
      console.log("currentNotes", currentNotes);
    }
    function setCurrentNoteLengths() {
      // console.log("setCurrentNoteLengths", setCurrentNoteLengths);
      for (let i = 0; i < noteLengthSliders.length; i++) {
        document.getElementById(`note-length-display-${i + 1}`).innerHTML = noteLengthSliders[i].value;
        // currentNoteLengthFactors[i] = Number(noteLengthSliders[i].value);
        currentNotes[i].lengthFactor = Number(noteLengthSliders[i].value);
      }
      console.log("currentNotes", currentNotes);
    }

    var resetLoop = function () {
      currentNoteIndex = 0;
    };

    new PresetSelector(function (selectedPreset, isInitialSelect) {
      // initialConfig = selectedPreset.noteValues;
      currentNotes = convertPresetToNotes(selectedPreset.noteValues);
      console.log("Applying notes from preset");
      setCurrentNoteLengthInputs();
      setNoteSelects();
      console.log("selectedPreset.envelope", selectedPreset.envelope);
      envelopeHandler.setValues(selectedPreset.envelope);
      mainControls.setValues(selectedPreset.mainValues);
      resetLoop();
    });
    setCurrentNoteLengthInputs();
    setNoteSelects();

    //WAVEFORM SELECT
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
        isPlaying = true;
        noteLoop();
      }
    });

    stopButton.addEventListener("click", function () {
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
      noteSelects[currentNoteIndex].classList.add("note-is-playing");
      if (noteSelects[currentNoteIndex - 1]) {
        noteSelects[currentNoteIndex - 1].classList.remove("note-is-playing");
      } else {
        noteSelects[NOTE_INPUT_COUNT - 1].classList.remove("note-is-playing");
      }
      currentNoteIndex = (currentNoteIndex + 1) % NOTE_INPUT_COUNT;
    }

    function playCurrentNote() {
      console.log("noteGain.gain.value", mainControls.masterVolume.gain.value);
      var curNote = currentNotes[currentNoteIndex];
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
