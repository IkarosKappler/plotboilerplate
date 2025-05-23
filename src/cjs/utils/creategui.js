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
 * @modified 2024-08-25 Added `CSSBackdropEffects` to the GUI (if present).
 * @version  1.2.0
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
 * @return {dat.gui.GUI|lil-gui.GUI|null}
 **/
globalThis.utils.createGUI = (function () {
  var _tryGetFilterGETParams = function () {
    // Rule is:
    // * GET PARAMS first
    // * pre-defnined params second
    // * default values third
    var globalPredefinedValues =
      typeof globalThis["cssBackdropfilterValues"] === "object" ? globalThis["cssBackdropfilterValues"] : {};
    var preDefinedValues = Object.assign(Object.assign({}, CSSBackdropEffects.DEFAULT_FILTER_VALUES), globalPredefinedValues);
    if (typeof gup === "undefined") {
      return preDefinedValues; // CSSBackdropEffects.DEFAULT_FILTER_VALUES;
    }
    var GUP = gup();
    var params = new Params(GUP);
    var initialFilterValues = {
      isBackdropFiltersEnabled: false,
      // This is just for the global effect color
      effectFilterColor: params.getString("filter:effectFilterColor", preDefinedValues.effectFilterColor), // "#204a87",
      isEffectsColorEnabled: params.hasParam("filter:effectFilterColor"),
      // These are real filter values
      opacity: params.getNumber("filter:opacity", preDefinedValues.opacity),
      isOpacityEnabled: params.hasParam("filter:opacity") || preDefinedValues.isOpacityEnabled,
      invert: params.getNumber("filter:invert", preDefinedValues.invert),
      isInvertEnabled: params.hasParam("filter:invert") || preDefinedValues.isInvertEnabled,
      sepia: params.getNumber("filter:sepia", preDefinedValues.sepia),
      isSepiaEnabled: params.hasParam("filter:sepia") || preDefinedValues.isSepiaEnabled,
      blur: params.getNumber("filter:blur", preDefinedValues.blur), // px
      isBlurEnabled: params.hasParam("filter:blur") || preDefinedValues.isBlurEnabled,
      brightness: params.getNumber("filter:brightness", preDefinedValues.brightness),
      isBrightnessEnabled: params.hasParam("filter:brightness") || preDefinedValues.isBrightnessEnabled,
      contrast: params.getNumber("filter:contrast", preDefinedValues.contrast),
      isContrastEnabled: params.hasParam("filter:contrast") || preDefinedValues.isContrastEnabled,
      dropShadow: params.getNumber("filter:dropShadow", preDefinedValues.dropShadow), // px
      dropShadowColor: "#00ffff", // HOW TO DISABLE THIS PROPERLY?
      isDropShadowEnabled: params.hasParam("filter:dropShadow") || preDefinedValues.isDropShadowEnabled,
      grayscale: params.getNumber("filter:grayscale", preDefinedValues.grayscale),
      isGrayscaleEnabled: params.hasParam("filter:grayscale") || preDefinedValues.isGrayscaleEnabled,
      hueRotate: params.getNumber("filter:hueRotate", preDefinedValues.hueRotate), // deg
      isHueRotateEnabled: params.hasParam("filter:hueRotate") || preDefinedValues.isHueRotateEnabled,
      saturate: params.getNumber("filter:saturate", preDefinedValues.saturate),
      isSaturateEnabled: params.hasParam("filter:saturate") || preDefinedValues.isSaturateEnabled
    };
    initialFilterValues.isBackdropFiltersEnabled =
      initialFilterValues.isOpacityEnabled ||
      initialFilterValues.isEffectsColorEnabled ||
      initialFilterValues.isInvertEnabled ||
      initialFilterValues.isSepiaEnabled ||
      initialFilterValues.isBlurEnabled ||
      initialFilterValues.isBrightnessEnabled ||
      initialFilterValues.isContrastEnabled ||
      initialFilterValues.isDropShadowEnabled ||
      initialFilterValues.isGrayscaleEnabled ||
      initialFilterValues.isHueRotateEnabled ||
      initialFilterValues.isSaturateEnabled;

    return initialFilterValues;
  };

  var _tryGetGUIInstance = function (props) {
    if (
      globalThis.hasOwnProperty("lil") &&
      typeof globalThis["lil"] == "object" &&
      globalThis["lil"].hasOwnProperty("GUI") &&
      typeof globalThis["lil"]["GUI"] == "function"
    ) {
      // console.log("Creating lil");
      return new lil.GUI(props);
    } else if (
      globalThis.hasOwnProperty("dat") &&
      typeof globalThis["dat"] == "object" &&
      globalThis["dat"].hasOwnProperty("gui") &&
      typeof globalThis["dat"]["gui"] == "object"
    ) {
      // console.log("Creating dat.gui");
      return new dat.gui.GUI(props);
    } else {
      console.warn("Warning: cannot create GUI. Nor dat.gui not lil-gui seem present.");
      return null;
    }
  };

  var _tryDetectMobileDevice = function () {
    return globalThis.hasOwnProperty("isMobileDevice") && typeof globalThis["isMobileDevice"] == "function" && isMobileDevice();
  };

  var _tryGetGUISizeToggler = function (gui, dummyConfig) {
    if (!gui) {
      return null;
    }
    if (globalThis.hasOwnProperty("guiSizeToggler") && typeof globalThis["guiSizeToggler"] == "function") {
      return guiSizeToggler(gui, dummyConfig, { transformOrigin: "top right" });
    } else {
      console.warn("Warning: cannot create GUI's double size checkbox. guiSizeToggler is not present.");
      return null;
    }
  };

  var createGuiFun = function (pb, props) {
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

    // Try to initialise dat.gui (old demos) or lil-gui (new demos). They have the ~same~ signature.
    var gui = _tryGetGUIInstance(props);
    var mobileDevice = _tryDetectMobileDevice();
    var guiSize = _tryGetGUISizeToggler(gui, dummy);
    if (mobileDevice && guiSize) {
      dummy.guiDoubleSize = true;
      guiSize.update();
    }

    var _self = pb;
    if (guiSize) {
      gui
        .add(dummy, "guiDoubleSize")
        .name("doubleGUISize")
        .onChange(function () {
          guiSize.update();
        });
    }
    var fold0 = gui.addFolder("Editor settings");
    fold0.close(); // important only for lil-gui
    var fold00 = fold0.addFolder("Canvas size");
    fold00.close(); // important only for lil-gui

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

    var fold01 = fold0.addFolder("Draw settings");
    fold01.close(); // important only for lil-gui

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

    const fold0100 = fold01.addFolder("Colors and Lines");
    fold0100.close(); // important only for lil-gui

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
      var foldExport = gui.addFolder("Export");
      foldExport.close(); // important only for lil-gui
      foldExport.add(pb.config, "saveFile").name("SVG Image").title("Save as SVG.");
      globalThis.utils.guiFolders["editor_settings.export"] = foldExport;
    }

    if (typeof CSSBackdropEffects !== "undefined") {
      try {
        var backdropEffects = new CSSBackdropEffects(pb, gui, _tryGetFilterGETParams());
        // CSSBackdropEffects.DEFAULT_FILTER_VALUES);
        globalThis.utils["cssBackdropEffects"] = backdropEffects;
      } catch (e) {
        console.warn("[creategui] Failed to create backdrop effect input for gui.", e);
      }
    }

    globalThis.utils.guiFolders["editor_settings"] = fold0;
    globalThis.utils.guiFolders["draw_settings"] = fold01;

    return gui;
  };

  return createGuiFun;
})(); // END creategui
