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
    // var inputString =
    //   "linear-gradient( 90deg,  rgba(97,53,131,1) 0% , rgba(0,0,255,1) 21% , rgba(38,162,105,1) 40% , rgba(0,255,0,1) 60% , rgba(0,0,255,1) 80% , rgba(136,0,255,1) 100% )";
    // const inputColorGradient = ColorGradient.parse(inputString);
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
