# Getting Started with PlotBoilerplate

## HTML prerequisites

### Canvas use

```html
<canvas id="my-canvas"> Your browser does not support the canvas tag. </canvas>
```

### SVG use

```html
<svg id="my-canvas"></svg>
```

## Simple Javascript setup

```javascript
var pb = new PlotBoilerplate({
  canvas: document.getElementById("my-canvas"),
  fullSize: true
});

// Create two points:
//   The origin is at the visual center by default.
var pointA = new Vertex(-100, -100);
var pointB = new Vertex(100, 100);
pb.add(new Line(pointA, pointB));

// When point A is moved by the user
//   then move point B in the opposite direction
pointA.listeners.addDragListener(function (e) {
  pointB.sub(e.params.dragAmount);
  pb.redraw();
});

// and when point B is moved
//   then move point A
pointB.listeners.addDragListener(function (e) {
  pointA.sub(e.params.dragAmount);
  pb.redraw();
});
```

## Same example with Typescript

```typescript
// Usage with Typescript could look like this
import { PlotBoilerplate, Vertex, Line } from "plotboilerplate";

globalThis.addEventListener("load", () => {
  const pointA: Vertex = new Vertex(100, -100);
  const pointB: Vertex = new Vertex(-100, 100);
  console.log(pointA, pointB);

  const line: Line = new Line(pointA, pointB);

  const pb: PlotBoilerplate = new PlotBoilerplate({
    canvas: document.getElementById("my-canvas"),
    fullSize: true
  });

  pb.add(line);

  // The VertEvent is an abstraction of regular MouseEvent/TouchEvent and wraps all
  // desired properties plus additional vertex info.
  pointA.listeners.addDragListener((e: VertEvent) => {
    pointB.sub(e.params.dragAmount);
    pb.redraw();
  });

  pointB.listeners.addDragListener((e: VertEvent) => {
    pointA.sub(e.params.dragAmount);
    pb.redraw();
  });
});
```

## Adding pre-draw and post-draw hook functions

```javascript
// If you want to draw anything _before_ anything else of the scene is drawn (except the background color)
// use this hook function.
//
// Use the passed `draw` and `fill` instances here if you want your post-drawing to
// be exported when images are saved.
//
// This is part of the current draw cycle.
pb.config.postDraw = function (draw, fill) {
  // Draw vertex numbers
  for (var i in pb.vertices) {
    var vert = pb.vertices[i];
    fill.text("" + i, vert.x + 5, vert.y, { color: "blue", fontSize: 11 / draw.scale.x });
  }
};

// The same works with postDraw: this hook function is called after the scene was drawn.
//
// This is part of the current draw cycle.
pb.config.postDraw = function (draw, fill) {
  // ... Draw your stuff after everything else was drawn ...
};
```

## Dynamically add new elements

```javascript
new MouseHandler(pb.eventCatcher)
  // Event Type: XMouseEvent (an extension of the regular MouseEvent)
  .click(function (event) {
    if (!event.params.leftButton) {
      return;
    }
    // First param: the vertex to add
    // Second param: automatic redraw?
    pb.add(new Vertex(pb.transformMousePosition(event.params.pos.x, event.params.pos.y)), false);
    pb.redraw();
  });

// For touch handling we use a third-party library which is shipped by default with this one.
new AlloyFinger(this.pb.eventCatcher, {
  // Event type: TouchEvent
  touchEnd: function (event) {
    pb.add(new Vertex(pb.transformMousePosition(event.params.pos.x, event.params.pos.y)), false);
    pb.redraw();
  }
});
```
