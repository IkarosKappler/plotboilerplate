/**
 * @date 2025-08-05
 **/
window.addEventListener("load", function () {
  const cgpd = new ColorGradientPickerDialog(new Modal({ closeOnBackdropClick: true }));
  var displayPicker = function () {
    var inputString =
      "linear-gradient( 90deg,  rgba(97,53,131,1) 0% , rgba(0,0,255,1) 21% , rgba(38,162,105,1) 40% , rgba(0,255,0,1) 60% , rgba(0,0,255,1) 80% , rgba(136,0,255,1) 100% )";
    const inputColorGradient = ColorGradient.parse(inputString);

    cgpd.show({
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
