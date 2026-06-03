/**
 * An experimental function to create demo-guis.
 *
 * @author  Ikaros Kappler
 * @date    2026-04-15
 * @version 1.0.0
 */

(function (_context) {
  _context.initDemoUI = function (appContext) {
    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = appContext.pb.createGUI();
      var foldFreedraw = gui.addFolder("Free draw");
      // prettier-ignore
      foldFreedraw.add(appContext.config, "showVertices").title("Draw the vertices?").onChange(function () { appContext.toggleVertexVisibility(); appContext.pb.redraw(); });
      // prettier-ignore
      foldFreedraw.addColor(appContext.config, "lineColor").title("The line's color to draw with.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldFreedraw.add(appContext.config, "lineWidth").min(0).max(20.0).step(0.5).title("The lines' with.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldFreedraw.add(appContext.config, "showHobbyCurves").title("Draw the respective hobby curves.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldFreedraw.add(appContext.config, "showLinear").title("Draw the linear elements?").onChange(function () { appContext.pb.redraw(); } );
      // prettier-ignore
      foldFreedraw.add(appContext.config, "showHobbyTangents").title("Draw the linear Hobby curve tangents?").onChange(function () { appContext.pb.redraw(); } );
      // prettier-ignore
      var foldFuzzy = gui.addFolder("Fuzzy draw settings");
      // prettier-ignore
      foldFuzzy.add(appContext.config, "isFuzzyDrawEnabled").title("Enable/disable experimental fuzzy draw.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldFuzzy.add(appContext.config, "fuzzySamplePointDistance").min(5).max(100).step(5).title("The average sample point distance.").onChange(function () { appContext.rebuildAllFuzzyPaths(); });
      // prettier-ignore
      foldFuzzy.add(appContext.config, "fuzzyAmplitudeFactor").min(0).max(20.0).step(0.5).title("The amplitude amplification factor – depending the sampling length.").onChange(function () {appContext.rebuildAllFuzzyPaths(); });
      // prettier-ignore
      foldFuzzy.add(appContext.config, "fuzzLineCount").min(1).max(100).step(1).title("Number of fuzzy lines to use.").onChange(function () { appContext.rebuildAllFuzzyPaths(); });
      // prettier-ignore
      foldFuzzy.add(appContext.config, "fuzzyLineWidth").min(0).max(20.0).step(0.5).title("The line width of the fuzzy components.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldFuzzy.add(appContext.config, "randomizeFuzzy").title("Randomize the fuzzy path.");
      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show readme.md");
    }
  };
})(globalThis);
