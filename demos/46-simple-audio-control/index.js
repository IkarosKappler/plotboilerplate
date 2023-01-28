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
    var isDarkmode = detectDarkMode(GUP);
    if (isDarkmode) {
      document.getElementsByTagName("body")[0].classList.add("darkmode");
    }

    var envelopeHandler = new EnvelopeHandler("envelope-canvas", GUP, isDarkmode ? "#000000" : "#ffffff");

    const NOTE_INPUT_COUNT = 16;

    // Close encounters: https://johnloomis.org/ece303L/notes/music/Close_Encounters.html
    // G-A-F-F-C

    // This config MUST have 16 entries
    var initialConfig = [
      { value: "G4", lengthFactor: 1.0 },
      { value: "A4", lengthFactor: 1.0 },
      { value: "F4", lengthFactor: 1.0 },
      { value: "F3", lengthFactor: 3.0 },
      { value: "C4", lengthFactor: 0.0 },
      { value: "C4", lengthFactor: 2.0 },
      { value: "C4", lengthFactor: 0.0 },
      { value: "C4", lengthFactor: 0.0 },
      // 8/16
      { value: "G4", lengthFactor: 1.0 },
      { value: "A4", lengthFactor: 1.0 },
      { value: "F4", lengthFactor: 1.0 },
      { value: "F3", lengthFactor: 3.0 },
      { value: "C4", lengthFactor: 0.0 },
      { value: "C4", lengthFactor: 2.0 },
      { value: "C4", lengthFactor: 0.0 },
      { value: "C4", lengthFactor: 0.0 }
    ];

    // NOTE SELECTS
    renderNoteSelectTable(NOTE_INPUT_COUNT, setCurrentNotes, setCurrentNoteLengths, handleNoteSelectChange);

    // let currentNotes = [0, 3, 0, 7, 8, 7, 3, 2];
    var currentNotes = new Array(NOTE_INPUT_COUNT).fill(0, 0, NOTE_INPUT_COUNT).map(function (value, index) {
      // Pick a note in the 4th or 5th ocate
      // C4 is at index 48
      // return 48 + Math.floor(Math.random() * 12);
      return { noteIndex: locateNoteByIdentifier(initialConfig[index].value), lengthFactor: initialConfig[index].lengthFactor };
    });
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

    setCurrentNoteLengthInputs();
    setNoteSelects();

    // CONTEXT AND MASTER VOLUME
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    const context = new AudioContext();
    const masterVolume = context.createGain();
    masterVolume.connect(context.destination);
    masterVolume.gain.value = 0.2;

    const volumeControl = document.querySelector("#volume-control");
    var handleMasterVolumeChange = function () {
      masterVolume.gain.value = volumeControl.value;
      document.querySelector("#display-master-volume-control").innerHTML = `${(Number(volumeControl.value) * 100).toFixed(0)}%`;
    };
    volumeControl.addEventListener("input", handleMasterVolumeChange);
    handleMasterVolumeChange();

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

    // EFFECTS CONTROLS
    // Envelope
    const attackControl = document.querySelector("#attack-control");
    const releaseControl = document.querySelector("#release-control");
    const noteLengthControl = document.querySelector("#note-length-control");
    const sustainLevelControl = document.querySelector("#sustain-level-control");

    attackControl.addEventListener("input", function () {
      // attackTime = Number(this.value);
      envelopeHandler.envelope.attackTime = Number(this.value);
      envelopeHandler.update();
    });

    releaseControl.addEventListener("input", function () {
      // releaseTime = Number(this.value);
      envelopeHandler.envelope.releaseTime = Number(this.value);
      envelopeHandler.update();
    });

    noteLengthControl.addEventListener("input", function () {
      // noteLength = Number(this.value);
      envelopeHandler.envelope.noteLength = Number(this.value);
      envelopeHandler.update();
    });

    sustainLevelControl.addEventListener("input", function () {
      // noteLength = Number(this.value);
      envelopeHandler.envelope.sustainLevel = Number(this.value);
      envelopeHandler.update();
    });

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
    const delay = context.createDelay();
    const feedback = context.createGain();
    const delayAmountGain = context.createGain();

    delayAmountGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterVolume);

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
    const startButton = document.querySelector("#start-button");
    const stopButton = document.querySelector("#stop-button");
    const tempoControl = document.querySelector("#tempo-control");
    let tempo = 120.0;
    let currentNoteIndex = 0;
    let isPlaying = false;

    var handleTempChange = function () {
      tempo = Number(tempoControl.value);
      document.querySelector("#display-tempo-control").innerHTML = `${tempo}bpm`;
    };
    tempoControl.addEventListener("input", handleTempChange, false);
    handleTempChange();

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
      const secondsPerBeat = 60.0 / tempo;
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
      var curNote = currentNotes[currentNoteIndex];
      const noteLengthFactor = curNote.lengthFactor;
      if (noteLengthFactor <= 0.0) {
        return;
      }
      const osc = context.createOscillator();
      const noteGain = context.createGain();
      noteGain.gain.setValueAtTime(0, 0);
      noteGain.gain.linearRampToValueAtTime(
        envelopeHandler.envelope.sustainLevel,
        context.currentTime + envelopeHandler.envelope.noteLength * envelopeHandler.envelope.attackTime * noteLengthFactor
      );
      noteGain.gain.setValueAtTime(
        envelopeHandler.envelope.sustainLevel,
        context.currentTime +
          (envelopeHandler.envelope.noteLength - envelopeHandler.envelope.noteLength * envelopeHandler.envelope.releaseTime) *
            noteLengthFactor
      );
      noteGain.gain.linearRampToValueAtTime(0, context.currentTime + envelopeHandler.envelope.noteLength * noteLengthFactor);

      var lfoGain = context.createGain();
      lfoGain.gain.setValueAtTime(vibratoAmount, 0);
      lfoGain.connect(osc.frequency);

      var lfo = context.createOscillator();
      lfo.frequency.setValueAtTime(vibratoSpeed, 0);
      lfo.start(0);
      // lfo.stop(context.currentTime + envelopeHandler.envelope.noteLength);
      lfo.stop(context.currentTime + envelopeHandler.envelope.noteLength * noteLengthFactor);
      lfo.connect(lfoGain);

      osc.type = waveform;
      // osc.frequency.setValueAtTime(Object.values(noteValues)[`${currentNotes[currentNoteIndex]}`], 0);
      osc.frequency.setValueAtTime(Object.values(noteValues)[`${curNote.noteIndex}`], 0);

      osc.start(0);
      osc.stop(context.currentTime + envelopeHandler.envelope.noteLength * noteLengthFactor);
      osc.connect(noteGain);

      noteGain.connect(masterVolume);
      noteGain.connect(delay);
    }
    // ### END SYNTH

    // +---------------------------------------------------------------------------------
    // | Add stats.
    // +-------------------------------
    // var stats = {
    //   mouseXTop: 0,
    //   mouseYTop: 0
    // };
    // var uiStats = new UIStats(stats);
    // stats = uiStats.proxy;
    // uiStats.add("mouseXTop").precision(1);
    // uiStats.add("mouseYTop").precision(1);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    // {
    //   var gui = pbEnvelope.createGUI();
    //   // prettier-ignore
    //   gui.add(config, 'animate').listen().onChange(function(prm) { if(prm) { startAnimation(); } }).name("animate").title("animate");
    //   // prettier-ignore
    //   gui.add(config, 'showPath').listen().onChange(function() { togglePath() }).name("showPath").title("showPath");
    // }

    // pbEnvelope.config.preDraw = predraw;
    // pbEnvelope.redraw();
    // pbEnvelope.canvas.focus();
    // startAnimation();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
