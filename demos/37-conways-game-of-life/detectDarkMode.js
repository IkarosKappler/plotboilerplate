function detectDarkMode(GUP) {
  // Respect overrides
  console.log("GUP", GUP);
  if (typeof GUP !== "undefined" && GUP.hasOwnProperty("darkmode") && GUP["darkmode"]) {
    console.log("v");
    var overrideValue = GUP["darkmode"];
    console.log("overrideValue", overrideValue);
    if (overrideValue === "0" || overrideValue.toLowerCase() === "false") {
      console.log("Disable dark mode");
      return false;
    }
  }
  var hours = new Date().getHours();
  var isDayTime = hours > 6 && hours < 20;
  return !isDayTime;
}

// globalThis.isDarkMode = detectDarkMode();
