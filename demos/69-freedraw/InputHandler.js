/**
 * @date 2026-04-13
 */

(function (_context) {
  var InputHandler = function (appContext) {
    this.appContext = appContext;

    // +---------------------------------------------------------------------------------
    // | Installs a mouse listener.
    // +-------------------------------
    var _self = this;
    new MouseHandler(this.appContext.pb.eventCatcher)
      .down(function (event) {
        if (!event.params.leftButton || event.params.wasDragged) {
          return;
        }
        _self.handleInputDownEvent(event.params.pos);
      })
      .drag(function (event) {
        // console.log("Dragging");
        _self.handleInputDragEvent(event.params.pos);
      })
      .up(function (event) {
        // Event Type: XMouseEvent (an extension of the regular MouseEvent)
        if (!event.params.leftButton) {
          return;
        }
        _self.handleInputUpEvent();
      });

    // +---------------------------------------------------------------------------------
    // | Install a touch handler to rotate on mobile device.
    // +-------------------------------
    createAlloyFinger(this.appContext.pb.eventCatcher, {
      touchStart: function (event) {
        _self.handleInputDownEvent({ x: event.touches[0].clientX, y: event.touches[0].clientY });
      },
      touchMove: function (event) {
        if (_self.appContext.pb.getDraggedElementCount() > 1 || event.touches.length == 0) {
          return;
        }
        _self.handleInputDragEvent({ x: event.touches[0].clientX, y: event.touches[0].clientY });
      },
      touchEnd: function (_event) {
        _self.handleInputUpEvent();
      }
    });
  };

  // +---------------------------------------------------------------------------------
  // | Handle touch-start and mouse-down events.
  // +-------------------------------
  InputHandler.prototype.handleInputDownEvent = function (absPos) {
    if (this.appContext.pb.isPanning()) {
      return;
    }
    console.log("absPos", absPos);
    // Check if there is a movable vertex at the location
    var vertAtPos = this.appContext.pb.getVertexNear(
      absPos,
      this.appContext.isMobile ? PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE : PlotBoilerplate.DEFAULT_CLICK_TOLERANCE
    );
    console.log("Vert clicked? ", vertAtPos);

    if (vertAtPos && this.appContext.config.showVertices) {
      console.log("Vert clicked.");
      // There is a line vertex at the given position AND those are visible
      // --> better do nothing here.
      return;
    }
    var relPos = new Vertex(this.appContext.pb.transformMousePosition(absPos.x, absPos.y));
    this.appContext.curPolyline = new Polygon([relPos], true); // isOpen=true
    console.log("curPolyline", this.appContext.curPolyline);
    relPos.attr.visible = this.appContext.config.showVertices;
    this.appContext.pb.add(relPos, true); // triggerRedraw=true
  };

  // +---------------------------------------------------------------------------------
  // | Handle touch-move and mouse-drag events.
  // +-------------------------------
  InputHandler.prototype.handleInputDragEvent = function (absPos) {
    if (!this.appContext.curPolyline) {
      console.log("Drag event ignored. No curPolyline defined.");
      // Probably a visible vertex was clicked to move.
      return;
    }
    var relPos = new Vertex(this.appContext.pb.transformMousePosition(absPos.x, absPos.y));
    relPos.attr.visible = this.appContext.config.showVertices;
    this.appContext.curPolyline.vertices.push(relPos);
    this.appContext.pb.add(relPos);
  };

  // +---------------------------------------------------------------------------------
  // | Handle touch-end and mouse-up events.
  // +-------------------------------
  InputHandler.prototype.handleInputUpEvent = function () {
    if (!this.appContext.curPolyline) {
      // Probably a difference visible vertex was clicked to move.
      return;
    }
    this.appContext.freedrawLines.push(this.appContext.curPolyline);
    console.log("Adding ", this.appContext.curPolyline);
    this.appContext.addHobbyPath(this.appContext.curPolyline);
    this.appContext.curPolyline = null;
    this.appContext.pb.redraw();
  };

  _context.InputHandler = InputHandler;
})(globalThis);
