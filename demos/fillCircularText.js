// +---------------------------------------------------------------------------------
// | Simple approach to draw a text on a circular path.
// |
// | @author   Ikaros Kappler
// | @date     2026-04-15
// | @version  1.0.0
// +-------------------------------
var fillCircularText = function (fill, text, circle, color, fontSizePx, startAngle) {
  startAngle = startAngle || -Math.PI / 2.0;
  var curAngle = startAngle;
  var textLen = text.length;
  var charatcterAngle = (Math.PI / 180.0 / (circle.radius / fontSizePx / 25)) * 2;
  // var totalAngle = charatcterAngle * textLen;

  for (var i = 0; i < textLen; i++) {
    var character = text.charAt(i);
    var pointOnCircle = circle.vertAt(curAngle);
    var angleOnCircle = curAngle + Math.PI / 2.0;
    fill.text(character, pointOnCircle.x, pointOnCircle.y, {
      color: color,
      fontFamily: "Monospace",
      fontSize: fontSizePx, // number;
      // fontStyle?: FontStyle;
      // fontWeight?: FontWeight;
      lineHeight: fontSizePx * 2.2,
      // textAlign?: CanvasRenderingContext2D["textAlign"];
      rotation: angleOnCircle
    });
    curAngle += charatcterAngle;
  }
};
