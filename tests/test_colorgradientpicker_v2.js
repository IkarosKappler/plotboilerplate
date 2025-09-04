window.addEventListener("load", function () {
  var GUP = gup();
  var params = new Params(GUP);
  var isMobile = isMobileDevice();
  isMobile = params.getBoolean("isMobile", isMobile);
  console.log("isMobile", isMobile, params.hasParam("isMobile"), params.getBoolean("isMobile", true));
  console.log("NoReact", NoReact);

  var _colorGradientPicker = new ColorGradientPicker("container", isMobile);
});
