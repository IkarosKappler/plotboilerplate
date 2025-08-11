/**
 * @date 2025-08-08
 */

/**
 *
 * @param {Params} params
 * @returns
 */
function detectMobileMode(params) {
  var isMobile = isMobileDevice();

  // Check for overrides.
  if (params.hasParam("isMobile")) {
    if (params.getBoolean("isMobile", true) === false) {
      isMobile = false;
    } else if (params.getBoolean("isMobile", false) === true) {
      isMobile = true;
    }
  }
  return isMobile;
}
