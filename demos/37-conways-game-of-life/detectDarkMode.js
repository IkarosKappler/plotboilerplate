function detectDarkMode() {
  var hours = new Date().getHours();
  var isDayTime = hours > 6 && hours < 20;
  return !isDayTime;
}

globalThis.isDarkMode = detectDarkMode();
