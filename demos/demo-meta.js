/**
 * Adds some meta info/readme features to the demo pages.
 * Requires a 'readme.md' file to be present in the demo's directory to work.
 * 
 * This script will expose a function called `displayDemoMeta`.
 *
 * @require marked^12.0.1 (a markdown compiler)
 *
 * @author  Ikaros Kappler
 * @date    2024-03-10
 * @version 0.0.1
 */

(function(context) {

    var modal = null; 

    var fetchReadme = function() {
        return new Promise( function(accept,reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "readme.md");
            xhr.responseType = 'text/markdown';

            xhr.onload = function () {
                // saveAs(xhr.response, name, opts);
                accept(xhr.response);
            };

            xhr.onerror = function (error) {
                console.error("could not download file 'readme.md'.");
                reject("could not download file 'readme.md'. " + error);
            };

            xhr.send();
        } );
    };


    // +---------------------------------------------------------------------------------
    // | Displays the readme content inside a scrollable modal.
    // +-------------------------------
    var displayReadme = function (htmlCode) {
        var modalBody = document.createElement("div");
        // modalBody.style.setProperty("background-color", "red");
        // modalBody.style.setProperty("overflow-y", "scroll");
        modalBody.innerHTML = htmlCode;
        modal.setTitle("Readme.md");
        modal.setFooter("");
        modal.setActions([Modal.ACTION_CLOSE]);
        modal.setBody(modalBody);
        modal.open();
    };

    var handleDOMReady = function () {
        // TODO: make public!
        modal = new Modal( { closeOnBackdropClick : true } );
    };

    context.displayDemoMeta = function() {
        fetchReadme().then( function(markdown) {
            // var markdown = "# Marked in browser\n\nRendered by **marked**.";
            var htmlOutput = marked.parse(markdown);
            console.log("htmlOut", htmlOutput)
            // document.getElementById("content").innerHTML = htmlOutput;
            displayReadme(htmlOutput);
        } ).catch( function(error) {
            modal.setTitle("Error");
            modal.setFooter("");
            modal.setActions([Modal.ACTION_CLOSE]);
            modal.setBody("Failed to load readme.md: " + error);
            modal.open();
        } );
    }

    document.addEventListener("DOMContentLoaded", handleDOMReady);
})(globalThis);
