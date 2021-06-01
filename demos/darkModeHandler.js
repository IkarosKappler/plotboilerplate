/**
 * Detect dark/light mode and changes.
 *
 * This is a mix of:
 *    https://www.ajaypalcheema.com/dark-mode-js/
 *    https://usefulangle.com/post/318/javascript-check-dark-mode-activated
 *
 * @author Ikaros Kappler
 * @date 2021-06-01
 * @version 1.0.0
 */
(function () {
  var DarkModeHandler = function (callback) {
    var darkModeListener = function (event) {
      if (event.matches) {
        // this is dark mode
        callback(true);
      } else {
        // this is not dark mode
        callback(false);
      }
    };

    var match = window.matchMedia("(prefers-color-scheme: dark)");
    match.addEventListener("change", darkModeListener);

    if (match) {
      callback(true);
    } else {
      callback(false);
    }
  };

  window.DarkModeHandler = DarkModeHandler;
})();
