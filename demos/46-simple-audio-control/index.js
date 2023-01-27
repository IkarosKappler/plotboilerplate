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
    var mousePosition = { x: NaN, y: NaN };

    // // All config params are optional.
    // var pbEnvelope = new PlotBoilerplate(
    //   PlotBoilerplate.utils.safeMergeByKeys(
    //     {
    //       canvas: document.getElementById("envelope-canvas"),
    //       fullSize: false,
    //       fitToParent: true,
    //       backgroundColor: isDarkmode ? "#000000" : "#ffffff",
    //       drawGrid: true,
    //       drawRaster: true,
    //       drawOrigin: true,
    //       autoAdjustOffset: true,
    //       offsetAdjustXPercent: 0,
    //       offsetAdjustYPercent: 100
    //     },
    //     GUP
    //   )
    // );
    var envelopeHandler = new EnvelopeHandler("envelope-canvas", GUP, isDarkmode ? "#000000" : "#ffffff");

    var randColor = function (i, alpha) {
      var color = WebColorsContrast[i % WebColorsContrast.length].clone();
      if (typeof alpha !== undefined) color.a = alpha;
      return color;
    };

    // // {Bounds}
    // var viewport = pbEnvelope.viewport();
    // pbEnvelope.config.scale.x = 1.0 / viewport.width;
    // pbEnvelope.config.scale.y = 1.0 / viewport.height;
    // pbEnvelope.fitToView(new Bounds(new Vertex(0, 0), new Vertex(1, 1)));

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        animate: true,
        showPath: false
      },
      GUP
    );

    // // +---------------------------------------------------------------------------------
    // // | Draw our custom stuff after everything else in the scene was drawn.
    // // +-------------------------------
    // var predraw = function (draw, fill) {
    //   draw.polygon(viewport.toPolygon(), "rgba(192,192,192,0.5)", 1);
    // };

    const notes = {
      "C4": 261.63,
      "Db4": 277.18,
      "D4": 293.66,
      "Eb4": 311.13,
      "E4": 329.63,
      "F4": 349.23,
      "Gb4": 369.99,
      "G4": 392.0,
      "Ab4": 415.3,
      "A4": 440,
      "Bb4": 466.16,
      "B4": 493.88,
      "C5": 523.25
    };

    // NOTE SELECTS
    const noteSelectsDiv = document.querySelector("#note-selects-div");

    const noteInputCount = 16;

    for (let i = 0; i < noteInputCount; i++) {
      const select = document.createElement("select");
      select.id = `note ${i + 1}`;
      select.classList.add("note-select");
      for (let j = 0; j < Object.keys(notes).length; j++) {
        const option = document.createElement("option");
        option.value = j;
        option.innerText = `${Object.keys(notes)[j]}`;
        select.appendChild(option);
        select.addEventListener("change", setCurrentNotes);
      }
      noteSelectsDiv.appendChild(select);
    }

    // let currentNotes = [0, 3, 0, 7, 8, 7, 3, 2];
    var currentNotes = new Array(noteInputCount).fill(0, 0, noteInputCount).map(function () {
      return Math.floor(Math.random() * Object.keys(notes).length);
    });
    // G-A-F-F-C = 7-9-5-5-0
    currentNotes[0] = 7;
    currentNotes[1] = 9;
    currentNotes[2] = 5;
    currentNotes[3] = 5;
    currentNotes[4] = 0;
    console.log("currentNotes", currentNotes);
    const noteSelects = document.querySelectorAll("select");
    function setNoteSelects() {
      for (let i = 0; i < currentNotes.length; i++) {
        noteSelects[i].value = currentNotes[i];
      }
    }

    function setCurrentNotes() {
      for (let i = 0; i < noteSelects.length; i++) {
        currentNotes[i] = noteSelects[i].value;
      }
    }

    setNoteSelects();

    // CONTEXT AND MASTER VOLUME
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    const context = new AudioContext();
    const masterVolume = context.createGain();
    masterVolume.connect(context.destination);
    masterVolume.gain.value = 0.2;

    const volumeControl = document.querySelector("#volume-control");

    volumeControl.addEventListener("input", function () {
      masterVolume.gain.value = this.value;
    });

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
    let attackTime = 0.3;
    let sustainLevel = 0.8;
    let releaseTime = 0.3;
    let noteLength = 1;
    // var attackTimeVert = new Vertex(attackTime * viewport.width, -1.0 * viewport.height);
    // var sustainLevelVert = new Vertex(sustainLevel * viewport.width, -0.7 * viewport.height);
    // var noteLengthVert = new Vertex(noteLength * viewport.width, -0.5 * viewport.height);
    // pbEnvelope.add(attackTimeVert);
    // pbEnvelope.add(sustainLevelVert);
    // pbEnvelope.add(noteLengthVert);
    // pbEnvelope.add(new Polygon([new Vertex(0, 0), attackTimeVert, sustainLevelVert, noteLengthVert], true));
    // pbEnvelope.drawConfig.polygon.lineWidth = 2.0;

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

    vibratoAmountControl.addEventListener("input", function () {
      vibratoAmount = this.value;
    });

    vibratoSpeedControl.addEventListener("input", function () {
      vibratoSpeed = this.value;
    });

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

    delayAmountControl.addEventListener("input", function () {
      delayAmountGain.value = this.value;
    });

    delayTimeControl.addEventListener("input", function () {
      delay.delayTime.value = this.value;
    });

    feedbackControl.addEventListener("input", function () {
      feedback.gain.value = this.value;
    });

    // LOOP CONTROLS
    const startButton = document.querySelector("#start-button");
    const stopButton = document.querySelector("#stop-button");
    const tempoControl = document.querySelector("#tempo-control");
    let tempo = 120.0;
    let currentNoteIndex = 0;
    let isPlaying = false;

    tempoControl.addEventListener(
      "input",
      function () {
        tempo = Number(this.value);
      },
      false
    );

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
      noteSelects[currentNoteIndex].style.background = "yellow";
      if (noteSelects[currentNoteIndex - 1]) {
        noteSelects[currentNoteIndex - 1].style.background = "white";
      } else {
        // noteSelects[7].style.background = "white";
        noteSelects[noteInputCount - 1].style.background = "white";
      }
      // currentNoteIndex++;
      // if (currentNoteIndex === 8) {
      //   currentNoteIndex = 0;
      // }
      currentNoteIndex = (currentNoteIndex + 1) % noteInputCount;
    }

    function playCurrentNote() {
      const osc = context.createOscillator();
      const noteGain = context.createGain();
      noteGain.gain.setValueAtTime(0, 0);
      noteGain.gain.linearRampToValueAtTime(sustainLevel, context.currentTime + noteLength * attackTime);
      noteGain.gain.setValueAtTime(sustainLevel, context.currentTime + noteLength - noteLength * releaseTime);
      noteGain.gain.linearRampToValueAtTime(0, context.currentTime + noteLength);

      var lfoGain = context.createGain();
      lfoGain.gain.setValueAtTime(vibratoAmount, 0);
      lfoGain.connect(osc.frequency);

      var lfo = context.createOscillator();
      lfo.frequency.setValueAtTime(vibratoSpeed, 0);
      lfo.start(0);
      lfo.stop(context.currentTime + noteLength);
      lfo.connect(lfoGain);

      osc.type = waveform;
      osc.frequency.setValueAtTime(Object.values(notes)[`${currentNotes[currentNoteIndex]}`], 0);
      osc.start(0);
      osc.stop(context.currentTime + noteLength);
      osc.connect(noteGain);

      noteGain.connect(masterVolume);
      noteGain.connect(delay);
    }
    // ### END SYNTH

    // +---------------------------------------------------------------------------------
    // | Add stats.
    // +-------------------------------
    var stats = {
      mouseXTop: 0,
      mouseYTop: 0
    };
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseXTop").precision(1);
    uiStats.add("mouseYTop").precision(1);

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
