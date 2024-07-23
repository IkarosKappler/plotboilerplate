/**
 * A script to demonstrate how to animate beziers and curvature.
 *
 * I used this neat quick-tutorial of how to build a simple synthesizer:
 *    https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
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

    var audioControl = new AudioControl(GUP, isDarkmode);

    // ### BEGIN DIALOGS AND OTHER INPUT
    var modal = new Modal();
    // +---------------------------------------------------------------------------------
    // | This is the callback to use when the user wants to change the track count
    // | (using a modal dialog).
    // +-------------------------------
    var showTrackCountDialog = function () {
      var trackCountInput = document.createElement("input");
      trackCountInput.setAttribute("id", "track-count-input");
      trackCountInput.setAttribute("type", "number");
      trackCountInput.value = audioControl.noteSelectHandler.trackCount;
      modal.setTitle("Track count");
      modal.setFooter("");
      modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Change",
          action: function () {
            // setTrackCount(trackCountInput.value);
            audioControl.setTrackCount(Number(trackCountInput.value));
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
    var editTrackCountButton = document.querySelector("#edit-track-count-button");
    editTrackCountButton.addEventListener("click", showTrackCountDialog);
    // ### END DIALOGS AND OTHER INPUT

    // +---------------------------------------------------------------------------------
    // | This is the callback to use when the user wants to change the note input count
    // | (using a modal dialog).
    // +-------------------------------
    var showNoteInputCountDialog = function () {
      var noteInputCountInput = document.createElement("input");
      noteInputCountInput.setAttribute("id", "note-input-count-input");
      noteInputCountInput.setAttribute("type", "number");
      noteInputCountInput.value = audioControl.noteSelectHandler.noteInputCount;
      modal.setTitle("Note count (each track)");
      modal.setFooter("");
      modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Change",
          action: function () {
            // setTrackCount(trackCountInput.value);
            audioControl.setNoteInputCount(Number(noteInputCountInput.value));
            modal.close();
          }
        }
      ]);
      modal.setBody(noteInputCountInput);
      if (modal.modalElements.modal.body.content) {
        modal.modalElements.modal.body.content.style.display = "flex";
        modal.modalElements.modal.body.content.style.justifyContent = "center";
      }
      modal.open();
    };
    var editNoteInputCountButton = document.querySelector("#edit-note-input-count-button");
    // console.log("editNoteInputCountButton", editNoteInputCountButton);
    editNoteInputCountButton.addEventListener("click", showNoteInputCountDialog);
    // ### END DIALOGS AND OTHER INPUT

    var buttonExport = document.querySelector("#button-export");
    var buttonImport = document.querySelector("#button-import");
    var fileInputHidden = document.querySelector("#file-input-hidden");

    buttonExport.addEventListener("click", function () {
      var jsonString = JSON.stringify(audioControl.getIOFormat(), 0, 2); // Vertex.utils.arrayToJSON(polygon.vertices);
      saveAs(new Blob([jsonString], { type: "application/json" }), "audio-samples.json");
    });

    var importFile = function (audioData) {
      audioControl.setFromIO(audioData);
    };

    var handleImportFile = function (file) {
      // console.log("Import file:", file);
      const fr = new FileReader();
      fr.addEventListener("load", e => {
        console.log(e.target.result);
        var audioData = JSON.parse(fr.result);
        importFile(audioData);
      });
      fr.readAsText(file);
    };

    fileInputHidden.addEventListener("change", function (event) {
      console.log("Changed", event);
      var files = event.target.files;
      if (!files || !files.length) {
        console.log("Cancel import: no files selected.");
        return;
      }
      handleImportFile(files[0]);
    });
    buttonImport.addEventListener("click", function () {
      fileInputHidden.click();
    });

    // Install DnD
    var fileDrop = new FileDrop(document.querySelector("body"));
    fileDrop.onFileJSONDropped(function (svgDocument) {
      // console.log("Document:", svgDocument);
      importFile(svgDocument);
    });
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
