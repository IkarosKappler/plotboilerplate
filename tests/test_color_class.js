// Test Color:
var colorStrings = [
  "rgba(0,0,0,0.5)",
  "rgba(255,255,255,1.0)",
  "rgba(0,28,64,0)",
  "rgba(1,2,3,1)",
  "rgba( 1 , 2 , 3 , 0.5 )",
  "rgba( 2, 3,4, .5)",

  "rgb(0,0,0)",
  "rgb(255,255,255)",
  "rgb(0,28,64)",
  "rgb(1,2,3)",
  "rgb( 1 , 2 , 3  )",
  "rgb( 2, 3,4)"
];
for (var i = 0; i < colorStrings.length; i++) {
  console.log("string: " + colorStrings[i]);
  console.log("color:" + Color.parse(colorStrings[i]));
}
