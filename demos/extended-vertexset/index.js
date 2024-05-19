/**
 * A script for demonstrating the basic usage of the Vertex class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2020-05-18
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  _context.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys({ canvas: document.getElementById("my-canvas"), fullSize: true }, GUP)
    );
    var modal = new Modal();
    // prettier-ignore
    var vertexData = [{ x: -231, y: -30 }, { x: -225, y: -72 }, { x: -180, y: -93 }, { x: -136, y: -131 }, { x: -86, y: -106 }, { x: -41, y: -130 }, { x: 42, y: -158 }, { x: 108, y: -145 }, { x: 193, y: -105 }, { x: 232, y: -61 }, { x: 214, y: -4 }, { x: 252, y: 37 }, { x: 291, y: 68 }, { x: 311, y: 120 }, { x: 273, y: 163 }, { x: 127, y: 209 }, { x: 103, y: 143 }, { x: 81, y: 67 }, { x: 9, y: 54 }, { x: -69, y: 80 }, { x: -80, y: 124 }, { x: -97, y: 162 }, { x: -201, y: 179 }, { x: -308, y: 128 }];
    var polygon = null;

    var config = {
      pointCount: vertexData.length,
      makeCircle: function () {
        makeCircle();
      },
      exportJSON: function () {
        exportVertexData();
      },
      readme: function () {
        // modal.showDocumentInfo();
        globalThis.displayDemoMeta();
      }
    };

    // +---------------------------------------------------------------------------------
    // | Set the vertex data and add/replace the polygon with the (new) data.
    // +-------------------------------
    var setVertexData = function (vertData) {
      var poly = new Polygon(
        vertData.map(function (coords) {
          return new Vertex(coords);
        }),
        false
      );
      // Remove old polygon
      if (polygon) {
        pb.remove(polygon, false, true); // Do not redraw & remove with vertices
      }
      // Add it to your canvas
      pb.add(poly);
      polygon = poly;
      vertexData = vertData;
    };

    setVertexData(vertexData);

    var exportVertexData = function () {
      var jsonString = Vertex.utils.arrayToJSON(polygon.vertices);
      saveAs(new Blob([jsonString], { type: "application/json" }), "vertices.json");
    };

    // Install DnD
    var fileDrop = new FileDrop(pb.eventCatcher);
    fileDrop.onFileJSONDropped(function (jsonObject) {
      // console.log("jsonObject", jsonObject);
      setVertexData(jsonObject);
    });

    function updatePointCount() {
      var newPoly = new Polygon(
        polygon.vertices.map(function (coords) {
          return new Vertex(coords);
        })
      ).getEvenDistributionPolygon(config.pointCount);
      setVertexData(newPoly.vertices);
    }

    function makeCircle() {
      var verts = [];
      var radius = Math.min(pb.canvasSize.width, pb.canvasSize.height) / 3;
      for (var i = 0; i < config.pointCount; i++) {
        var vert = new Vertex(radius, 0).rotate((Math.PI / config.pointCount) * i * 2);
        verts.push(vert);
      }
      setVertexData(verts);
    }

    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "pointCount").min(3).max(100).step(1).listen().onChange( updatePointCount );
      gui.add(config, "makeCircle");
      gui.add(config, "exportJSON");
      gui.add(config, "readme");
    }
  });
})(globalThis);
