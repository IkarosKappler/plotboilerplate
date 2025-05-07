/**
 * A very simple and tiny content manager for PB.
 *
 * @date   2025-05-07
 * @author Ikaros Kappler
 */

(function (_context) {
  var PBContentList = function (pb) {
    this.pb = pb;
    this._addButtons = [];
    this.initComponents(pb);
    this._isToggled = false;
    this._highlightedShapes = [];
  };

  PBContentList.prototype.initComponents = function () {
    var parent = document.body;
    this._mainWrapper = document.createElement("div");
    _setStyles(this._mainWrapper, {
      "position": "absolute",
      left: 0,
      bottom: 0,
      "max-height": "95%",
      width: "20%",
      "border-bottom": "1px solid grey",
      margin: "6px 0px",
      padding: "0px 5px 3px",
      "background-color": "rgba(255,255,255,0.5)",
      "display": "flex",
      "flex-direction": "column"
    });
    parent.appendChild(this._mainWrapper);

    // +---------------------------------------------------------------------------------
    // | Add list wrapper
    // +-------------------------------
    this._listWrapper = document.createElement("div");
    _setStyles(this._listWrapper, {
      display: "flex",
      "flex-direction": "column",
      "font-family": "Arial",
      "font-size": "9pt",
      "justify-content": "space-between",
      "max-height": "50%",
      "overflow": "scroll"
    });
    this._mainWrapper.appendChild(this._listWrapper);

    // +---------------------------------------------------------------------------------
    // | Add a top container to add controls
    // +-------------------------------
    this._controlsForAdding = document.createElement("div");
    _setStyles(this._controlsForAdding, {
      display: "flex",
      "flex-direction": "row",
      "justify-content": "flex-end",
      "flex-basis": "100%",
      "flex-wrap": "wrap"
    });
    var labelAdd = document.createElement("div");
    labelAdd.innerHTML = "Add";
    this._controlsForAdding.appendChild(labelAdd);

    this._createAddButtons();

    this._listWrapper.appendChild(this._controlsForAdding);

    // +---------------------------------------------------------------------------------
    // | The list itself
    // +-------------------------------
    this._list = document.createElement("div");
    _setStyles(this._list, {
      display: "flex",
      "flex-direction": "column",
      //   "max-height": "50%",
      "overflow": "scroll"
    });
    this._listWrapper.appendChild(this._list);

    // +---------------------------------------------------------------------------------
    // | Add toggle button
    // +-------------------------------
    this._toggleButton = document.createElement("button");
    this._toggleButton.innerHTML = "⚙";
    var _self = this;
    this._toggleButton.addEventListener("click", function () {
      _self._isToggled = !_self._isToggled;
      _setStyles(_self._listWrapper, { "display": _self._isToggled ? "none" : "flex" });
    });
    this._mainWrapper.appendChild(this._toggleButton);

    // +---------------------------------------------------------------------------------
    // | Install content change listener
    // +-------------------------------
    var _self = this;
    this.pb.addContentChangeListener(function (event) {
      console.log("Event type (DRAWABLES_ADDED or DRAWABLES_REMOVED)", event.type);
      console.log("Added drawables:", event.addedDrawables);
      console.log("Removed drawables:", event.removedDrawables);

      _self._updateList(event.addedDrawables, event.removedDrawables);
    });
    // +---------------------------------------------------------------------------------
    // | Init the list with current content.
    // +-------------------------------
    this._updateList(this.pb.drawables.concat(this.pb.vertices), []);
  };

  // +---------------------------------------------------------------------------------
  // | Add a buttons for adding
  // +-------------------------------
  PBContentList.prototype._createAddButtons = function () {
    var _self = this;

    // Button for vertices
    this._addNewShapeButton("⊹", "Vertex ⊹", function () {
      _self.pb.add(_self.pb.viewport().randomPoint());
    });

    // Button for lines
    this._addNewShapeButton("╱", "Line ╱", function () {
      _self.pb.add(new Line(_self.pb.viewport().randomPoint(), _self.pb.viewport().randomPoint()));
    });

    // Button for Vectors
    this._addNewShapeButton("⤏", "Vector ⤏", function () {
      _self.pb.add(new Vector(_self.pb.viewport().randomPoint(), _self.pb.viewport().randomPoint()));
    });

    // Button for Polygon
    this._addNewShapeButton("⎔", "Polygon ⎔", function () {
      var polygon = createRandomizedPolygon(6, _self.pb.viewport(), true); // createClockwise=true
      _self.pb.add(polygon);
    });

    // Button for Circle
    this._addNewShapeButton("◯", "Circle ◯", function () {
      var circle = new Circle(_self.pb.viewport().randomPoint(), _self.pb.viewport().getMinDimension() / 4);
      var circleRadiusPoint = circle.vertAt(0.0);
      var circleHelper = new CircleHelper(circle, circleRadiusPoint);
      _self.pb.add([circle, circleRadiusPoint]);
    });

    // Button for Circle Sector
    this._addNewShapeButton("⌔", "Circle Sector ⌔", function () {
      var circleSector = randomCircleSector(_self.pb.viewport());
      // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
      var controlPointA = circleSector.circle.vertAt(circleSector.startAngle);
      var controlPointB = circleSector.circle.vertAt(circleSector.endAngle);
      var cicleSectorHelper = new CircleSectorHelper(circleSector, controlPointA, controlPointB, _self.pb);
      _self.pb.add([circleSector, controlPointA, controlPointB]);
    });

    // Button for VEllipse
    this._addNewShapeButton("⬭", "Ellipse ⬭", function () {
      var ellipse = new VEllipse(
        _self.pb.viewport().randomPoint(),
        _self.pb.viewport().randomPoint(),
        Math.PI - 2 * Math.PI * Math.random()
      );
      var rotationControlPoint = ellipse
        .vertAt(0) // ellipseSector.ellipse.rotation)
        .scale(1.2, ellipse.center);
      var ellipseHelper = new VEllipseHelper(ellipse, rotationControlPoint);
      _self.pb.add([ellipse, rotationControlPoint]);
    });

    // Button for VEllipse Sector
    this._addNewShapeButton("⌒", "Elliptic Sector ⌒", function () {
      var ellipseSector = randomEllipseSector(_self.pb.viewport());
      // We want to change the ellipse's radii and rotation by dragging points around
      var startControlPoint = ellipseSector.ellipse.vertAt(ellipseSector.startAngle);
      var endControlPoint = ellipseSector.ellipse.vertAt(ellipseSector.endAngle);
      var rotationControlPoint = ellipseSector.ellipse.vertAt(0).scale(1.2, ellipseSector.ellipse.center);
      var ellipseSectorHelper = new VEllipseSectorHelper(ellipseSector, startControlPoint, endControlPoint, rotationControlPoint);
      _self.pb.add([ellipseSector, startControlPoint, endControlPoint, rotationControlPoint]);
    });

    // Button for Triangle
    this._addNewShapeButton("△", "Triangle △", function () {
      var triangle = new Triangle(
        _self.pb.viewport().randomPoint(),
        _self.pb.viewport().randomPoint(),
        _self.pb.viewport().randomPoint()
      );
      var triangleHelper = new TriangleHelper(triangle, true);
      _self.pb.add(triangle);
    });

    // Button for BezierPath
    this._addNewShapeButton("∿", "Bezier Path ∿", function () {
      // Create a new randomized Bézier curve.
      var bezierPath = randomBezierPath(_self.pb.viewport());
      var bezierHelper = new BezierPathInteractionHelper(_self.pb, [bezierPath]);
      _self.pb.add(bezierPath);
    });

    _setStyleToAll(this._addButtons, {
      display: "flex",
      "flex-direction": "column",
      "font-family": "Arial",
      "font-size": "9pt",
      "justify-content": "space-between"
    });
  };

  PBContentList.prototype._addNewShapeButton = function (label, title, onClick) {
    // Button for adding a new shape
    var newButton = document.createElement("button");
    newButton.innerHTML = label;
    newButton.setAttribute("title", title);
    newButton.addEventListener("click", onClick);
    this._controlsForAdding.appendChild(newButton);

    this._addButtons.push(newButton);
  };

  // +---------------------------------------------------------------------------------
  // | Add a editors for adding
  // +-------------------------------
  PBContentList.prototype._displayEditorAtIndex = function (index) {
    for (var i = 0; i < this._addEditors.length; i++) {
      _setStyles(this._addEditors[i], { "display": i == index ? "block" : "none" });
    }
  };

  PBContentList.prototype._updateList = function (addedDrawables, removedDrawables) {
    for (var i = 0; i < removedDrawables.length; i++) {
      var drw = removedDrawables[i];
      this._removeListElementByUID(drw.uid);
    }
    // Now add all new
    for (var i = 0; i < addedDrawables.length; i++) {
      var drw = addedDrawables[i];
      this._addListElementByDrawable(drw);
    }
  };

  //   // +---------------------------------------------------------------------------------
  //   // | A helper function to remove all child nodes.
  //   // +-------------------------------
  //   function removeAllChildNodes(node) {
  //     while (node.lastChild) {
  //       node.removeChild(node.lastChild);
  //     }
  //   }

  // +---------------------------------------------------------------------------------
  // | Remvoe list element with given UID.
  // +-------------------------------
  PBContentList.prototype._removeListElementByUID = function (uid) {
    console.log("Remove uid ", uid);
    // Array.from(nodes).find(node => node.isEqualNode(nodeToFind));
    var childNode = Array.from(this._list.childNodes).find(function (node) {
      //   console.log("find node", uid, node);
      return node.dataset["drawable_uid"] === uid;
    });
    if (childNode) {
      this._list.removeChild(childNode);
    } else {
      console.log("Warn child node with uid not found", uid, childNode);
    }
  };

  // +---------------------------------------------------------------------------------
  // | Add list element for given Drawable.
  // +-------------------------------
  PBContentList.prototype._addListElementByDrawable = function (drawable) {
    var _self = this;
    var childNode = document.createElement("div");
    _setStyles(childNode, { display: "flex", "flex-direction": "row" });

    var iconWrapper = document.createElement("div");
    var uidWrapper = document.createElement("div");
    var classNameWrapper = document.createElement("div");
    var actionsWrapper = document.createElement("div");

    _setStyleToAll([iconWrapper, uidWrapper, classNameWrapper, actionsWrapper], {
      display: "flex",
      "flex-direction": "row"
    });
    _setStyles(iconWrapper, {
      "min-width": "24px",
      "max-width": "10%",
      "width": "10%"
    });
    _setStyles(uidWrapper, {
      "text-overflow": "ellipsis",
      "min-width": "24px",
      "max-width": "40%",
      "width": "40%"
    });
    _setStyles(classNameWrapper, {
      "text-overflow": "ellipsis",
      "max-width": "40%",
      "width": "40%"
    });
    _setStyles(actionsWrapper, {
      "min-width": "24px",
      "max-width": "10%",
      "width": "10%"
    });

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗙";
    _setStyles(deleteButton, { "font-size": "6pt", "line-height": "8pt" });
    (function (drw, pb) {
      deleteButton.addEventListener("click", function () {
        // console.log("Removing drawable", drw.className, drw.uid);
        pb.remove(drw, true, true);
      });
    })(drawable, this.pb);

    iconWrapper.innerHTML = getShapeIcon(drawable.className);
    uidWrapper.innerHTML = drawable.uid;
    classNameWrapper.innerHTML = drawable.className;
    actionsWrapper.appendChild(deleteButton);

    childNode.addEventListener("touchstart", function () {
      _self._highlightedShapes = [drawable];
      _setStyles(childNode, { "color": "orange" });
      _self.pb.redraw(); // Request redraw
    });
    childNode.addEventListener("touchend", function () {
      _self._highlightedShapes = [];
      _setStyles(childNode, { "color": "black" });

      _self.pb.redraw(); // Request redraw
    });
    childNode.addEventListener("mouseenter", function () {
      _self._highlightedShapes = [drawable];
      _setStyles(childNode, { "color": "orange" });

      _self.pb.redraw(); // Request redraw
    });
    childNode.addEventListener("mouseout", function () {
      _self._highlightedShapes = [];
      _setStyles(childNode, { "color": "black" });

      _self.pb.redraw(); // Request redraw
    });

    childNode.appendChild(iconWrapper);
    childNode.appendChild(uidWrapper);
    childNode.appendChild(classNameWrapper);
    childNode.appendChild(actionsWrapper);
    childNode.dataset["drawable_uid"] = drawable.uid;

    this._list.appendChild(childNode);
  };

  // +---------------------------------------------------------------------------------
  // | THE ONLY PULIC METHOD: draw the highlighted content
  // +-------------------------------
  PBContentList.prototype.drawHighlighted = function (draw, fill) {
    // console.log("drawHighlighted", this._highlightedShapes);
    for (var i in this._highlightedShapes) {
      var shape = this._highlightedShapes[i];
      if (shape instanceof Vertex) {
        fill.circle(shape, 10, "rgba(192,128,0,0.5)");
      } else if (shape instanceof Line || shape instanceof Vector) {
        draw.line(shape.a, shape.b, "rgba(192,128,0,0.5)", 10);
      } else if (shape instanceof Polygon) {
        draw.polygon(shape, "rgba(192,128,0,0.5)", 10);
      } else if (shape instanceof Triangle) {
        draw.polyline([shape.a, shape.b, shape.c], false, "rgba(192,128,0,0.5)", 10);
      } else if (shape instanceof Circle) {
        draw.circle(shape.center, shape.radius, "rgba(192,128,0,0.5)", 10);
      } else if (shape instanceof CircleSector) {
        draw.circleArc(shape.circle.center, shape.circle.radius, shape.startAngle, shape.endAngle, "rgba(192,128,0,0.5)", 10);
      } else if (shape instanceof VEllipse) {
        draw.ellipse(
          shape.center,
          // Math.abs(d.axis.x-d.center.x), Math.abs(d.axis.y-d.center.y),
          shape.radiusH(),
          shape.radiusV(),
          "rgba(192,128,0,0.5)",
          10,
          shape.rotation
        );
      } else if (shape instanceof VEllipseSector) {
        var svgPathdata = VEllipseSector.ellipseSectorUtils.describeSVGArc(
          shape.ellipse.center.x,
          shape.ellipse.center.y,
          shape.ellipse.radiusH(),
          shape.ellipse.radiusV(),
          shape.startAngle,
          shape.endAngle,
          shape.ellipse.rotation,
          { moveToStart: true }
        );
        draw.path(svgPathdata, "rgba(192,128,0,0.5)", 10);
      } else if (shape instanceof BezierPath) {
        for (var c in shape.bezierCurves) {
          // Restore these settings again in each loop (will be overwritten)
          draw.cubicBezier(
            shape.bezierCurves[c].startPoint,
            shape.bezierCurves[c].endPoint,
            shape.bezierCurves[c].startControlPoint,
            shape.bezierCurves[c].endControlPoint,
            "rgba(192,128,0,0.5)",
            10
          );
        }
      }
    }
  };

  function getShapeIcon(className) {
    switch (className) {
      case "Vertex":
        return "⊹";
      case "Line":
        return "╱";
      case "Vector":
        return "⤏";
      case "Polygon":
        return "⎔";
      case "Circle":
        return "◯";
      case "CircleSector":
        return "⌔";
      case "VEllipse":
        return "⬭";
      case "VEllipseSector":
        return "⌒";
      case "Triangle":
        return "▵";
      case "BezierPath":
        return "∿";
      default:
        return "?";
    }
  }

  // +---------------------------------------------------------------------------------
  // | A helper function for settings custom styles.
  // +-------------------------------
  function _setStyles(elem, propertyObject) {
    for (var property in propertyObject) {
      elem.style[property] = propertyObject[property];
    }
  }

  // +---------------------------------------------------------------------------------
  // | A helper function for settings custom styles.
  // +-------------------------------
  function _setStyleToAll(elements, propertyObject) {
    for (var e in elements) {
      _setStyles(elements[e], propertyObject);
    }
  }

  _context.PBContentList = PBContentList;
})(globalThis);
