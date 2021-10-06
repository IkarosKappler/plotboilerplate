/**
 * This is the default draw config. Copied from PlotBoilerplate.ts near Line 456.
 *
 * Think about putting this into a global constant.
 *
 * @author  Ikaros Kappler
 * @date    2021-10-06
 * @version 1.0.0
 **/

var drawConfig = {
  drawVertices: true,
  drawBezierHandleLines: true,
  drawBezierHandlePoints: true,
  drawHandleLines: true,
  drawHandlePoints: true,
  drawGrid: true,
  bezier: {
    color: "#00a822",
    lineWidth: 2,
    handleLine: {
      color: "rgba(180,180,180,0.5)",
      lineWidth: 1
    }
  },
  polygon: {
    color: "#0022a8",
    lineWidth: 1
  },
  triangle: {
    color: "#6600ff",
    lineWidth: 1
  },
  ellipse: {
    color: "#2222a8",
    lineWidth: 1
  },
  ellipseSector: {
    color: "#a822a8",
    lineWidth: 2
  },
  circle: {
    color: "#22a8a8",
    lineWidth: 2
  },
  circleSector: {
    color: "#2280a8",
    lineWidth: 1
  },
  vertex: {
    color: "#a8a8a8",
    lineWidth: 1
  },
  selectedVertex: {
    color: "#c08000",
    lineWidth: 2
  },
  line: {
    color: "#a844a8",
    lineWidth: 1
  },
  vector: {
    color: "#ff44a8",
    lineWidth: 1
  },
  image: {
    color: "#a8a8a8",
    lineWidth: 1
  }
}; // END drawConfig
