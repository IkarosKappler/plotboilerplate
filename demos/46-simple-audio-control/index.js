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

    var envelopeHandler = new EnvelopeHandler("envelope-canvas", GUP, isDarkmode ? "#000000" : "#ffffff");

    // WAVEFORM SELECT
    const waveforms = document.getElementsByName("waveform");
    let waveform = "sine";

    function setWaveform() {
      for (var i = 0; i < waveforms.length; i++) {
        if (waveforms[i].checked) {
          waveform = waveforms[i].value;
        }
      }
      console.log("waveform", waveform);
    }

    waveforms.forEach(waveformInput => {
      waveformInput.addEventListener("change", function () {
        setWaveform();
      });
    });

    var updateWaveformDisplay = function () {
      for (var i = 0; i < waveforms.length; i++) {
        waveforms[i].checked = Boolean(waveforms[i].value === waveform);
      }
    };

    var setOscillatorValues = function (options) {
      if (options && typeof options.waveform !== "undefined") {
        waveform = options.waveform;
        updateWaveformDisplay();
      }
    };

    let currentNoteIndex = 0;
    let isPlaying = false;

    console.log("exports", globalThis.noteValues);

    // NOTE SELECTS
    var initialPreset = getDefaultPreset();
    var currentPreset = initialPreset;
    var noteSelectHandler = new NoteSelectHandler(initialPreset, 2);

    var mainControls = new MainControls();
    mainControls.setValues(initialPreset.mainValues);
    envelopeHandler.setValues(initialPreset.envelope);
    setOscillatorValues(initialPreset.oscillator);

    var resetLoop = function () {
      currentNoteIndex = 0;
    };

    var setTrackCount = function (newTrackCount) {
      if (noteSelectHandler.trackCount === newTrackCount) {
        console.log("setTrackCount: no change.");
        return;
      }
      noteSelectHandler.setTrackCount(currentPreset, newTrackCount);
      setTrackCountDisplay();
    };
    var setTrackCountDisplay = function () {
      document.querySelector("#display-track-count").innerHTML = noteSelectHandler.trackCount;
    };
    setTrackCountDisplay();

    new PresetSelector(function (selectedPreset) {
      noteSelectHandler.setFromPreset(selectedPreset);
      console.log("selectedPreset.envelope", selectedPreset.envelope);
      envelopeHandler.setValues(selectedPreset.envelope);
      mainControls.setValues(selectedPreset.mainValues);
      setOscillatorValues(selectedPreset.oscillator);
      currentPreset = selectedPreset;
      resetLoop();
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

    const singleLoopControl = document.querySelector("#single-loop-only");
    singleLoopControl.addEventListener("input", function () {
      // ???
    });

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
    var resetButton = document.querySelector("#reset-button");
    var startButton = document.querySelector("#start-button");
    var stopButton = document.querySelector("#stop-button");

    resetButton.addEventListener("click", function () {
      resetLoop();
    });

    var updatePlayingDisplay = function () {
      if (isPlaying) {
        startButton.classList.remove("d-none");
        stopButton.classList.add("d-none");
      } else {
        startButton.classList.add("d-none");
        stopButton.classList.remove("d-none");
      }
    };

    startButton.addEventListener("click", function () {
      if (!isPlaying) {
        // startButton.classList.add("d-none");
        // stopButton.classList.remove("d-none");
        updatePlayingDisplay();
        isPlaying = true;
        noteLoop();
      }
    });

    stopButton.addEventListener("click", function () {
      if (isPlaying) {
        // startButton.classList.remove("d-none");
        // stopButton.classList.add("d-none");
        updatePlayingDisplay();
      }
      isPlaying = false;
    });

    function noteLoop() {
      const secondsPerBeat = 60.0 / mainControls.values.tempo;
      if (isPlaying) {
        for (var curTrackIndex = 0; curTrackIndex < noteSelectHandler.trackCount; curTrackIndex++) {
          // console.log("Play note in track", curTrackIndex);
          playCurrentNote(curTrackIndex);
        }
        // playCurrentNote(0);
        nextNote();
        if (currentNoteIndex === 0 && singleLoopControl.checked) {
          singleLoopControl.checked = false;
          isPlaying = false;
          updatePlayingDisplay();
        } else {
          window.setTimeout(function () {
            noteLoop();
          }, secondsPerBeat * 1000);
        }
      }
    }

    function nextNote() {
      noteSelectHandler.setPlayingNoteIndex(currentNoteIndex);
      currentNoteIndex = (currentNoteIndex + 1) % NoteSelectHandler.NOTE_INPUT_COUNT;
    }

    function playCurrentNote(curTrackIndex) {
      // var curTrackIndex = 0;
      // console.log("mainControls.masterVolume.gain.value", mainControls.masterVolume.gain.value);
      var curNote = noteSelectHandler.currentNotes[curTrackIndex][currentNoteIndex];
      console.log("curNote", curNote);
      if (!curNote || curNote.noteIndex < 1 || curNote.noteIndex >= noteValues.length) {
        console.info("Note at index " + currentNoteIndex + " not set.");
        return;
      }
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
      // console.log("envelopeHandler.envelope", envelopeHandler.envelope, "noteLengthFactor", noteLengthFactor);
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
      console.log("curNote", curNote);
      osc.frequency.setValueAtTime(Object.values(noteValues)[`${curNote.noteIndex}`], 0);
      // osc.frequency.setValueAtTime(curNote.frequency, 0);

      osc.start(0);
      osc.stop(mainControls.context.currentTime + envelopeHandler.envelope.noteLength * noteLengthFactor);
      osc.connect(noteGain);

      noteGain.connect(mainControls.masterVolume);
      noteGain.connect(delay);
    }
    // ### END SYNTH

    // BEGIN DIALOGS AND OTHER INPUT
    var modal = new Modal();
    // +---------------------------------------------------------------------------------
    // | This is the callback to use when the user wants to insert
    // | path data into the dialog (modal).
    // +-------------------------------
    var showTrackCountDialog = function () {
      var trackCountInput = document.createElement("input");
      trackCountInput.setAttribute("id", "track-count-input");
      // trackCountInput.style.fontSize = "42pt";
      // trackCountInput.style.width = "50%";
      // trackCountInput.style.textAlign = "center";
      trackCountInput.setAttribute("type", "number");
      trackCountInput.value = noteSelectHandler.trackCount;
      modal.setTitle("Track count");
      modal.setFooter("");
      modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Change",
          action: function () {
            setTrackCount(trackCountInput.value);
            modal.close();
          }
        }
      ]);
      modal.setBody(trackCountInput);
      if (modal.modalElements.modal.body.content) {
        modal.modalElements.modal.body.content.style.display = "flex";
        modal.modalElements.modal.body.content.style.justifyContent = "center";
      }
      modal.open();
    };
    // insertPathJSON();
    var editTrackCountButton = document.querySelector("#edit-track-count-button");
    console.log("editTrackCountButton", editTrackCountButton);
    editTrackCountButton.addEventListener("click", showTrackCountDialog);
    // BEGIN DIALOGS AND OTHER INPUT
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
