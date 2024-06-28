/* lil.GUI copies the prototype of superclass Controller to all other controllers, so it is not enough to add it only to 
the super class as the reference is not maintained */

(function () {
  var eachController = function (fnc) {
    // Only in super controller required (?)
    fnc(lil.Controller);
    fnc(lil.BooleanController);
    fnc(lil.ColorController);
    fnc(lil.FunctionController);
    fnc(lil.OptionController);
    fnc(lil.NumberController);
    fnc(lil.StringController);
  };

  var setTitle = function (v) {
    // __li is the root dom element of each controller
    // console.log("Controller", v, this);
    if (v) {
      this.domElement.setAttribute("title", v);
    } else {
      this.domElement.removeAttribute("title");
    }
    return this;
  };

  eachController(function (controller) {
    if (!controller.prototype.hasOwnProperty("title")) {
      console.log("x");
      controller.prototype.title = setTitle;
    }
  });
})();
