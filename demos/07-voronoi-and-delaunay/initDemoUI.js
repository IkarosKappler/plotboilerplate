/**
 * A helper function to create demo-guis – to keep the main script small.
 *
 * @author  Ikaros Kappler
 * @date    2026-09-12
 * @version 1.0.0
 */

(function (_context) {
  _context.initDemoUI = function (appContext) {
    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = appContext.pb.createGUI();

      // prettier-ignore
      gui.add(appContext.config, "rebuild").name("Rebuild all").title("Rebuild all.");

      var f0 = gui.addFolder("Points");
      // prettier-ignore
      f0.add(appContext.config, "pointCount").min(3).max(200).onChange(function () { appContext.config.pointCount = Math.round(appContext.config.pointCount);
        appContext.updatePointCount();
          })
        .title("The total number of points.");
      // prettier-ignore
      f0.add(appContext.config, "randomize").name("Randomize").title("Randomize the point set.");
      // prettier-ignore
      f0.add(appContext.config, "fullCover").name("Full Cover").title("Randomize the point set with full canvas coverage.");
      // prettier-ignore
      f0.add(appContext.config, "animate").onChange(appContext.toggleAnimation).title("Toggle point animation on/off.");
      // prettier-ignore
      f0.add(appContext.config, "animationType", { Linear: "linear", Radial: "radial" }).onChange(function () {
          appContext.toggleAnimation();
        });
      f0.open();

      var f1 = gui.addFolder("Delaunay");
      // prettier-ignore
      f1.add(appContext.config, "drawTriangles")
          .onChange(function () {
            appContext.pb.redraw();
          })
          .title("If checked the triangle edges will be drawn.");
      // prettier-ignore
      f1.add(appContext.config, "drawCircumCircles")
          .onChange(function () {
            appContext.pb.redraw();
          })
          .title("If checked the triangles circumcircles will be drawn.");

      var f2 = gui.addFolder("Voronoi");
      // prettier-ignore
      f2.add(appContext.config, "makeVoronoiDiagram").onChange(appContext.rebuild).title("Make voronoi diagram from the triangle set.");
      // prettier-ignore
      f2.addColor(appContext.config, "voronoiOutlineColor")
          .onChange(function () {
            appContext.pb.redraw();
          })
          .title("Choose Voronoi outline color.");
      // prettier-ignore
      f2.add(appContext.config, "drawCubicCurves").onChange(appContext.rebuild).title("If checked the Voronoi's cubic curves will be drawn.");
      // prettier-ignore
      f2.add(appContext.config, "drawVoronoiOutlines").onChange(appContext.rebuild).title("If checked the Voronoi cells' outlines will be drawn.");
      // prettier-ignore
      f2.add(appContext.config, "drawVoronoiIncircles").onChange(appContext.rebuild).title("If checked the Voronoi cells' incircles will be drawn.");
      // prettier-ignore
      f2.add(appContext.config, "fillVoronoiCells").onChange(appContext.rebuild).title("If checked the Voronoi cells will be filled.");
      // prettier-ignore
      f2.add(appContext.config, "clipVoronoiCells")
          .onChange(appContext.rebuild)
          .title("If checked the Voronoi cells will be clipped by the bounding rectangle.");
      // prettier-ignore
      f2.add(appContext.config, "drawClipBox").onChange(appContext.rebuild).title("If checked the clipbox will be draw.");
      // prettier-ignore
      f2.add(appContext.config, "drawUnclippedVoronoiCells")
          .onChange(appContext.rebuild)
          .title("If checked unclipped Voronoi cells will always be drawn.");
      // prettier-ignore
      f2.addColor(appContext.config, "voronoiCellColor")
          .onChange(function () {
            appContext.pb.redraw();
          })
          .title("Choose Voronoi cell color.");
      // prettier-ignore
      f2.add(appContext.config, "voronoiCubicThreshold")
          .min(0.0)
          .max(1.0)
          .onChange(function () {
            appContext.pb.redraw();
          })
          .title("(Experimental) Specifiy the cubic or cell coefficients.");
      // prettier-ignore
      f2.add(appContext.config, "voronoiCellScale")
          .min(-1.0)
          .max(2.0)
          .onChange(function () {
            appContext.pb.redraw();
          })
          .title("Scale each voronoi cell before rendering.");

      if (appContext.config.animate) {
        appContext.toggleAnimation();
      }
    }
  };
})(globalThis);
