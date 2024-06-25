/**
 * A utility class used by PlotBoilerplate: creategui.
 * The PlotBoilerplate will try to use this for the initialization of the input GUI.
 *
 * Requires the label() polyfill for dat.gui.GUI.
 *
 * @author   Ikaros Kappler
 * @date     2020-03-30
 * @modified 2020-04-03 Added empty default global object 'utils'. Added createGUI as an optional child.
 * @modified 2023-09-29 Added try-catch for color attributes; invalid values might break construction of whole gui.
 * @modified 2024-06-25 Replacing dat.gui by equivalent lil-gui calls. Collapsing all lil-gui folders (are open by default).
 * @version  1.1.0
 **/
var utils = (globalThis.utils = globalThis.utils || {});

/**
 * Need to access the dat.gui folders of plotboilerplate? You will find them here.
 *
 * Following keys are currently available:
 *  - editor_settings
 *  - editor_settings.export  (if enableSVGExport=true)
 *  - draw_settings
 */
globalThis.utils.guiFolders = globalThis.utils.guiFolders || {};

/**
 * Creates a control GUI (a dat.gui instance) for this
 * plot boilerplate instance.
 *
 * Requires the label() polyfill for dat.gui.GUI.
 *
 * @method createGUI
 * @memberof utils
 * @param {PlotBoilerplate} pb
 * @param {DatGuiProps|LilGuiProps} props
 * @return {dat.gui.GUI|lil-gui.GUI}
 **/
globalThis.utils.createGUI = function (pb, props) {
  var dummy = {
    resetOffset: function () {
      var viewport = pb.viewport();
      pb.setOffset({ x: (viewport.width / 2.0) * pb.draw.scale.x, y: (viewport.height / 2.0) * pb.draw.scale.y });
      pb.redraw();
    },
    resetScale: function () {
      pb.setZoom(1.0, 1.0, new Vertex(0, 0));
      pb.redraw();
    },
    guiDoubleSize: false
  };

  // var gui = new dat.gui.GUI(props);
  var gui = new lil.GUI(props);

  var mobileDevice = globalThis.hasOwnProperty("isMobileDevice") && typeof "isMobileDevice" == "function" && isMobileDevice();
  var guiSize = guiSizeToggler(gui, dummy, { transformOrigin: "top right" });
  if (mobileDevice) {
    dummy.guiDoubleSize = true;
    guiSize.update();
  }

  var _self = pb;
  gui
    .add(dummy, "guiDoubleSize")
    .name("doubleGUISize")
    .onChange(function () {
      guiSize.update();
    });
  var fold0 = gui.addFolder("Editor settings").close();
  var fold00 = fold0.addFolder("Canvas size").close();
  fold00
    .add(pb.config, "fullSize")
    .onChange(function () {
      _self.resizeCanvas();
    })
    .title("Toggles the fullpage mode.")
    .listen();
  fold00
    .add(pb.config, "fitToParent")
    .onChange(function () {
      _self.resizeCanvas();
    })
    .title("Toggles the fit-to-parent mode to fit to parent container (overrides fullsize).")
    .listen();
  fold00
    .add(pb.config, "defaultCanvasWidth")
    .min(1)
    .step(10)
    .onChange(function () {
      _self.resizeCanvas();
    })
    .title("Specifies the fallback width.");
  fold00
    .add(pb.config, "defaultCanvasHeight")
    .min(1)
    .step(10)
    .onChange(function () {
      _self.resizeCanvas();
    })
    .title("Specifies the fallback height.");
  fold00
    .add(pb.config, "canvasWidthFactor")
    .min(0.1)
    .step(0.1)
    .max(10)
    .onChange(function () {
      _self.resizeCanvas();
    })
    .title("Specifies a factor for the current width.")
    .listen();
  fold00
    .add(pb.config, "canvasHeightFactor")
    .min(0.1)
    .step(0.1)
    .max(10)
    .onChange(function () {
      _self.resizeCanvas();
    })
    .title("Specifies a factor for the current height.")
    .listen();
  fold00
    .add(pb.config, "cssScaleX")
    .min(0.01)
    .step(0.01)
    .max(1.0)
    .onChange(function () {
      if (_self.config.cssUniformScale) _self.config.cssScaleY = _self.config.cssScaleX;
      _self.updateCSSscale();
    })
    .title("Specifies the visual x scale (CSS).")
    .listen();
  fold00
    .add(pb.config, "cssScaleY")
    .min(0.01)
    .step(0.01)
    .max(1.0)
    .onChange(function () {
      if (_self.config.cssUniformScale) _self.config.cssScaleX = _self.config.cssScaleY;
      _self.updateCSSscale();
    })
    .title("Specifies the visual y scale (CSS).")
    .listen();
  fold00
    .add(pb.config, "cssUniformScale")
    .onChange(function () {
      if (_self.config.cssUniformScale) _self.config.cssScaleY = _self.config.cssScaleX;
      _self.updateCSSscale();
    })
    .title("CSS uniform scale (x-scale equlsa y-scale).");
  fold00.add(pb.config, "setToRetina").name("Set to highres fullsize").title("Set canvas to high-res retina resoultion (x2).");

  var fold01 = fold0.addFolder("Draw settings").close();
  fold01
    .add(pb.drawConfig, "drawBezierHandlePoints")
    .onChange(function () {
      _self.redraw();
    })
    .title("Draw Bézier handle points.");
  fold01
    .add(pb.drawConfig, "drawBezierHandleLines")
    .onChange(function () {
      _self.redraw();
    })
    .title("Draw Bézier handle lines.");
  fold01
    .add(pb.drawConfig, "drawHandlePoints")
    .onChange(function () {
      _self.redraw();
    })
    .title("Draw handle points (overrides all other settings).");
  fold01
    .add(pb.drawConfig, "drawHandleLines")
    .onChange(function () {
      _self.redraw();
    })
    .title("Draw handle lines in general (overrides all other settings).");
  fold01
    .add(pb.drawConfig, "drawVertices")
    .onChange(function () {
      _self.redraw();
    })
    .title("Draw vertices in general.");

  const fold0100 = fold01.addFolder("Colors and Lines").close();
  const _addDrawConfigElement = function (fold, basePath, conf) {
    for (var i in conf) {
      if (typeof conf[i] == "object") {
        if (conf[i].hasOwnProperty("color")) {
          try {
            fold
              .addColor(conf[i], "color")
              .onChange(function () {
                _self.redraw();
              })
              .name(basePath + i + ".color")
              .title(basePath + i + ".color")
              .listen();
          } catch (e) {
            console.error("[createGUI] Invalid color value, gui library cannot recognize.", conf[i]["color"]);
          }
        }
        // console.log("basePath", basePath, i, conf[i], conf[i].hasOwnProperty("lineWidth"));
        if (conf[i].hasOwnProperty("lineWidth")) {
          try {
            // console.log("adding ", basePath, i);
            fold
              .add(conf[i], "lineWidth")
              .min(1)
              .max(10)
              .step(1)
              .onChange(function () {
                _self.redraw();
              })
              .name(basePath + i + ".lineWidth")
              .title(basePath + i + ".lineWidth")
              .listen();
            // console.log("adding 2", basePath, i);
          } catch (e) {
            console.error("[createGUI] Invalid lineWidth value, gui library cannot recognize.", conf[i]["lineWidth"]);
          }
        }
        for (var e in conf[i]) {
          if (conf[i].hasOwnProperty(e) && typeof conf[i][e] == "object") {
            // console.log(e);
            _addDrawConfigElement(fold, (basePath != "" ? basePath + "." : "") + i + "." + e, conf[i]);
          }
        }
      }
    }
  };
  _addDrawConfigElement(fold0100, "", pb.drawConfig);

  fold0
    .add(pb.config, "scaleX")
    .title("Scale x.")
    .min(0.01)
    .max(10.0)
    .step(0.01)
    .onChange(function () {
      _self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX;
      _self.redraw();
    })
    .listen();
  fold0
    .add(pb.config, "scaleY")
    .title("Scale y.")
    .min(0.01)
    .max(10.0)
    .step(0.01)
    .onChange(function () {
      _self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY;
      _self.redraw();
    })
    .listen();
  fold0
    .add(pb.config, "offsetX")
    .title("Offset x.")
    .step(10.0)
    .onChange(function () {
      _self.draw.offset.x = _self.fill.offset.x = _self.config.offsetX;
      _self.redraw();
    })
    .listen();
  fold0
    .add(pb.config, "offsetY")
    .title("Offset y.")
    .step(10.0)
    .onChange(function () {
      _self.draw.offset.y = _self.fill.offset.y = _self.config.offsetY;
      _self.redraw();
    })
    .listen();
  fold0
    .add(pb.config, "drawOrigin")
    .title("Draw the origin (0,0).")
    .onChange(function () {
      _self.redraw();
    })
    .listen();
  fold0
    .add(pb.config, "rasterGrid")
    .title("Draw a fine raster instead a full grid.")
    .onChange(function () {
      _self.redraw();
    })
    .listen();
  fold0
    .add(pb.config, "drawRaster")
    .title("If set to false no raster or grid will be drawn at all.")
    .onChange(function () {
      _self.redraw();
    })
    .listen();
  fold0.add(pb.config, "redrawOnResize").title("Automatically redraw the data if window or canvas is resized.").listen();
  fold0
    .addColor(pb.config, "backgroundColor")
    .onChange(function () {
      _self.redraw();
    })
    .title("Choose a background color.");
  fold0.add(dummy, "resetOffset").title("Reset the draw offset to (0,0).");
  fold0.add(dummy, "resetScale").title("Reset the draw scale to (1.,1.).");

  if (pb.config.enableSVGExport) {
    var foldExport = gui.addFolder("Export").close();
    foldExport.add(pb.config, "saveFile").name("SVG Image").title("Save as SVG.");
    globalThis.utils.guiFolders["editor_settings.export"] = foldExport;
  }

  globalThis.utils.guiFolders["editor_settings"] = fold0;
  globalThis.utils.guiFolders["draw_settings"] = fold01;

  return gui;
}; // END creategui
