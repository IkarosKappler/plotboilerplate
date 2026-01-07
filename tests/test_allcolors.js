/**
 * Test the Color class: show all colors.
 *
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2026-01-07
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  window.addEventListener("load", function () {
    var GUP = gup();
    var config = {
      guiDoubleSize: false,
      color: GUP["color"] || "rgba(0,167,185,1)"
    };

    var colorGroups = [
      {
        name: "Pink colors",
        colorNames: ["MediumVioletRed", "DeepPink", "PaleVioletRed", "HotPink", "LightPink", "Pink"]
      },
      {
        name: "Red colors",
        colorNames: ["DarkRed", "Red", "Firebrick", "Crimson", "IndianRed", "LightCoral", "Salmon", "DarkSalmon", "LightSalmon"]
      },
      {
        name: "Orange colors",
        colorNames: ["OrangeRed", "Tomato", "DarkOrange", "Coral", "Orange"]
      },
      {
        name: "Yellow colors",
        colorNames: [
          "DarkKhaki",
          "Gold",
          "Khaki",
          "PeachPuff",
          "Yellow",
          "PaleGoldenrod",
          "Moccasin",
          "PapayaWhip",
          "LightGoldenrodYellow",
          "LemonChiffon",
          "LightYellow"
        ]
      },
      {
        name: "Brown colors",
        colorNames: [
          "Maroon",
          "Brown",
          "Sienna",
          "Chocolate",
          "DarkGoldenrod",
          "Peru",
          "RosyBrown",
          "Goldenrod",
          "SandyBrown",
          "Tan",
          "Burlywood",
          "Wheat",
          "NavajoWhite",
          "Bisque",
          "BlanchedAlmond",
          "Cornsilk"
        ]
      },
      {
        name: "Purple, violet, and magenta colors",
        colorNames: [
          "Indigo",
          "Purple",
          "DarkMagenta",
          "DarkViolet",
          "DarkSlateBlue",
          "BlueViolet",
          "DarkOrchid",
          "Fuchsia",
          "Magenta",
          "SlateBlue",
          "MediumSlateBlue",
          "MediumOrchid",
          "MediumPurple",
          "Orchid",
          "Violet",
          "Plum",
          "Thistle",
          "Lavender"
        ]
      },
      {
        name: "Blue colors",
        colorNames: [
          "MidnightBlue",
          "Navy",
          "DarkBlue",
          "MediumBlue",
          "Blue",
          "RoyalBlue",
          "SteelBlue",
          "DeepSkyBlue",
          "CornflowerBlue",
          "SkyBlue",
          "LightSkyBlue",
          "LightSteelBlue",
          "LightBlue",
          "PowderBlue"
        ]
      },
      {
        name: "Cyan colors",
        colorNames: [
          "Teal",
          "DarkCyan",
          "LightSeaGreen",
          "CadetBlue",
          "DarkTurquoise",
          "MediumTurquoise",
          "Turquoise",
          "Aqua",
          "Cyan",
          "Aquamarine",
          "PaleTurquoise",
          "LightCyan"
        ]
      },
      {
        name: "Green colors",
        colorNames: [
          "DarkGreen",
          "Green",
          "DarkOliveGreen",
          "ForestGreen",
          "SeaGreen",
          "Olive",
          "OliveDrab",
          "MediumSeaGreen",
          "LimeGreen",
          "Lime",
          "SpringGreen",
          "MediumSpringGreen",
          "DarkSeaGreen",
          "MediumAquamarine",
          "YellowGreen",
          "LawnGreen",
          "Chartreuse",
          "LightGreen",
          "GreenYellow",
          "PaleGreen"
        ]
      },
      {
        name: "White colors",
        colorNames: [
          "MistyRose",
          "AntiqueWhite",
          "Linen",
          "Beige",
          "WhiteSmoke",
          "LavenderBlush",
          "OldLace",
          "AliceBlue",
          "Seashell",
          "GhostWhite",
          "Honeydew",
          "FloralWhite",
          "Azure",
          "MintCream",
          "Snow",
          "Ivory",
          "White"
        ]
      },
      {
        name: "Gray and black colors",
        colorNames: [
          "Black",
          "DarkSlateGray",
          "DimGray",
          "SlateGray",
          "Gray",
          "LightSlateGray",
          "DarkGray",
          "Silver",
          "LightGray",
          "Gainsboro"
        ]
      }
    ];

    var container = document.getElementById("color-wrapper");
    for (var g = 0; g < colorGroups.length; g++) {
      var groupNode = document.createElement("div");
      var group = colorGroups[g];
      var node = document.createElement("div");
      groupNode.style["width"] = "17vw";
      node.innerHTML = group.name;
      groupNode.appendChild(node);
      for (var c = 0; c < group.colorNames.length; c++) {
        var node = document.createElement("div");
        node.style["width"] = "17vw";
        node.style["height"] = "20px";
        const colorName = group.colorNames[c];
        const color = Color.CSS_COLORS[colorName];
        node.style["background-color"] = color.cssRGB();
        node.innerHTML = colorName;
        groupNode.appendChild(node);
      }
      container.appendChild(groupNode);
    }
  });
})(window);
