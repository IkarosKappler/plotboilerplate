window.addEventListener("load", function () {
  var GUP = gup();
  var params = new Params(GUP);
  var isMobile = isMobileDevice();
  if (params.hasParam("isMobile")) {
    if (params.getBoolean("isMobile", true) === false) {
      isMobile = false;
    } else if (params.getBoolean("isMobile", false) === true) {
      isMobile = true;
    }
  }
  console.log("isMobile", isMobile, params.hasParam("isMobile"), params.getBoolean("isMobile", true));
  console.log("NoReact", NoReact);

  var _colorGradientPicker = new ColorGradientPicker("container", isMobile);
});
