/**
 * @date 2025-08-05
 **/
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

  const colorGradientDialog = new ColorGradientPickerDialog(new Modal({ closeOnBackdropClick: true }), {
    isMobileMode: isMobile
  });
  var displayPicker = function () {
    const inputColorGradient = ColorGradient.createDefault();

    colorGradientDialog.show({
      onAcceptGradient: function (updatedColorGradient) {
        const outputGradientString = updatedColorGradient.toColorGradientString();
        console.log(outputGradientString);
        document.body.style["background"] = outputGradientString;
      },
      inputGradient: inputColorGradient
    });
  };

  document.getElementById("btn-open-dialog").addEventListener("click", function () {
    displayPicker();
  });
});
