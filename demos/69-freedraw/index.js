/**
 * A script for freedrawing line shapes.
 *
 * @author   Ikaros Kappler
 * @date     2026-03-18
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  _context.addEventListener("load", function () {
    let GUP = gup();
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);
    var isMobile = isMobileDevice();

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );
    // pb.drawConfig.drawHandlePoints = false;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      showVertices: params.getBoolean("showVertices", true),
      lineColor: params.getString("lineColor", "rgb(255,128,0)"),
      lineWidth: params.getNumber("lineWidth", 7.0),
      showHobbyCurves: params.getBoolean("showHobbyCurves", true),
      showLinear: params.getBoolean("showLinear", false),
      showHobbyTangents: params.getBoolean("showHobbyTangents", false)
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var freedrawLines = []; // Array<Polygon>
    var curPolyline = null; // Polygon
    var hobbyCurves = []; // Array< Array<CubicBezierPath> >

    var postDraw = function (draw, _fill) {
      if (curPolyline) {
        draw.polyline(curPolyline.vertices, true, "orange", 2.0);
      }

      if (config.showLinear) {
        for (var i = 0; i < freedrawLines.length; i++) {
          draw.polyline(freedrawLines[i].vertices, true, "blue", 1.0);
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      if (!config.showHobbyCurves) {
        return;
      }
      for (var p = 0; p < hobbyCurves.length; p++) {
        // console.log("hobbyCurves[p]", p, hobbyCurves[p]);
        if (hobbyCurves[p].length === 0) {
          // Empty curve
          return;
        }
        // Convert sequence of CubicBezierCurve to bezier path data for direct draw.
        // This avoid ugly visible micro-gaps between any segments.
        var pathData = hobbyCurves[p].reduce(
          function (accu, nextCubicCurve) {
            accu.push(nextCubicCurve.startControlPoint, nextCubicCurve.endControlPoint, nextCubicCurve.endPoint);
            return accu;
          },
          [hobbyCurves[p][0].startPoint]
        );
        // console.log("pathData", pathData);
        draw.cubicBezierPath(pathData, config.lineColor, config.lineWidth, { lineCap: "round" }, true);
        if (config.showHobbyTangents) {
          for (var i = 0; i < hobbyCurves[p].length; i++) {
            if (config.showHobbyTangents) {
              draw.line(hobbyCurves[p][i].startPoint, hobbyCurves[p][i].startControlPoint, "rgba(0,255,255,1.0)", 2.0);
              draw.line(hobbyCurves[p][i].endPoint, hobbyCurves[p][i].endControlPoint, "rgba(0,255,255,1.0)", 2.0);
            }
          }
        }
      }
    }; // END postDraw

    // +---------------------------------------------------------------------------------
    // | Adds a new Hobby path from the given poly line.
    // | polyline: Array<Vertex>
    // +-------------------------------
    var addHobbyPath = function (polyline) {
      console.log("Add hobby path", polyline);
      // Hobby curve generation will fail if the vertex list contains duplicates.
      var cleanVertices = clearDuplicateVertices(polyline.vertices, 2.0); // epsilon=2.0
      var hobbyPath = new HobbyPath(cleanVertices);
      // Array<CubicBezierCurve>
      var curves = hobbyPath.generateCurve(false, 0.0); // isCircular=false, hobbyOmega=0.0
      var hobbyIndex = hobbyCurves.push(curves) - 1;
      console.log("hobbyIndex", hobbyIndex);
      installHobbyMoveListeners(polyline, hobbyIndex);
    };

    var installHobbyMoveListeners = function (polyline, hobbyIndex) {
      // Todo: update the hobby path when an input vertex changed
      for (var i = 0; i < polyline.vertices.length; i++) {
        polyline.vertices[i].listeners.addDragEndListener(function (event) {
          console.log("hobby curve changes", hobbyIndex);
          recaululateHobbyPath(polyline, hobbyIndex);
        });
      }
    };

    var recaululateHobbyPath = function (polyline, hobbyIndex) {
      var cleanVertices = clearDuplicateVertices(polyline.vertices, 2.0); // epsilon=2.0
      var updatedHobbyPath = new HobbyPath(cleanVertices);
      var updatedCurves = updatedHobbyPath.generateCurve(false, 0.0); // isCircular=false, hobbyOmega=0.0
      hobbyCurves.splice(hobbyIndex, 1, updatedCurves);
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Installs a mouse listener.
    // +-------------------------------
    new MouseHandler(pb.eventCatcher)
      .down(function (event) {
        if (!event.params.leftButton || event.params.wasDragged) {
          return;
        }
        // Check if there is a movable vertex at the location
        var vertAtPos = pb.getVertexNear(
          event.params.pos,
          isMobile ? PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE : PlotBoilerplate.DEFAULT_CLICK_TOLERANCE
        );
        console.log("Vert clicked? ", vertAtPos);

        if (vertAtPos && config.showVertices) {
          console.log("Vert clicked.");
          // There is a line vertex at the given position AND those are visible
          // --> better do nothing here.
          return;
        }
        var relPos = new Vertex(pb.transformMousePosition(event.params.pos.x, event.params.pos.y));
        curPolyline = new Polygon([relPos], true); // isOpen=true
        relPos.attr.visible = config.showVertices;
        // pb.add([curPolyline, relPos], true); // triggerRedraw=true
        // freedrawLines.push(curPolyline);
        pb.add(relPos, true); // triggerRedraw=true
      })
      .drag(function (event) {
        if (!curPolyline) {
          // Probably a visible vertex was clicked to move.
          return;
        }
        var relPos = new Vertex(pb.transformMousePosition(event.params.pos.x, event.params.pos.y));
        relPos.attr.visible = config.showVertices;
        curPolyline.vertices.push(relPos);
        pb.add(relPos);
      })
      // Event Type: XMouseEvent (an extension of the regular MouseEvent)
      .up(function (event) {
        if (!event.params.leftButton) {
          return;
        }
        if (!curPolyline) {
          // Probably a visible vertex was clicked to move.
          return;
        }
        freedrawLines.push(curPolyline);
        addHobbyPath(curPolyline);
        curPolyline = null;
        pb.redraw();
      });

    var toggleVertexVisibility = function () {
      freedrawLines.forEach(function (polyline) {
        polyline.vertices.forEach(function (vertex) {
          vertex.attr.visible = config.showVertices;
        });
      });
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "showVertices").title("Draw the vertices?").onChange(function () { toggleVertexVisibility(); pb.redraw(); });
      // prettier-ignore
      gui.addColor(config, "lineColor").title("The line's color to draw with.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "lineWidth").min(0).max(20.0).step(0.5).title("The lines' with.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "showHobbyCurves").min(0).max(20.0).step(0.5).title("Draw the respective hobby curves.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "showLinear").title("Draw the linear elements?").onChange(function () { pb.redraw(); } );
      // prettier-ignore
      gui.add(config, "showHobbyTangents").title("Draw the linear Hobby curve tangents?").onChange(function () { pb.redraw(); } );
    }

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    var contentList = new PBContentList(pb);

    // reinit();
    // updateGUI();
    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();

    humane.log("Draw a line with your mouse / finger");
  });
})(globalThis);
