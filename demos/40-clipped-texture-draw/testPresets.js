/**
 * @date 2022-04-02
 */

(function () {
  var PRESETS = [];

  // Large image settings with the cronholm144 texture
  var imagePath_ch = "girihtexture-500px-2.png";
  var imageWidth = 500.0;
  var imageHeight = 460.0;
  var textureSize_ch = new Bounds(new Vertex(-imageWidth / 2, -imageHeight / 2), new Vertex(imageWidth / 2, imageHeight / 2));
  // Penrose Rhombus (cronholm144)
  var polygon_penrose_ch = new Polygon(
    [
      { x: 2, y: 64 },
      { x: 78, y: 9 },
      { x: 174, y: 9 },
      { x: 97, y: 64 } // Add one more test point
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_ch.width / 2, textureSize_ch.height / 2);
    })
  );
  var polgonCenterOffset = { x: 0, y: 0 };
  PRESETS.push({
    name: "CH_Penrose",
    imagePath: imagePath_ch,
    textureSize: textureSize_ch,
    polygon: polygon_penrose_ch,
    centerOffset: { x: 0, y: 0 }
  });

  // Cronholm144 Hexagon
  var polygon_hexagon_ch = new Polygon(
    [
      { x: 185.5, y: 13 },
      { x: 281, y: 13 },
      { x: 252, y: 103 },
      { x: 173, y: 160 },
      { x: 78, y: 160 },
      { x: 107.5, y: 69 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_ch.width / 2, textureSize_ch.height / 2);
    })
  );
  var polgonCenterOffset = { x: 0, y: -5 };
  PRESETS.push({
    name: "CH_Hexagon",
    imagePath: imagePath_ch,
    textureSize: textureSize_ch,
    polygon: polygon_hexagon_ch,
    centerOffset: { x: 0, y: 0 }
  });

  // Cronholm144 Bowtie
  var polygon_bowtie_ch = new Polygon(
    [
      { x: 319, y: 8.5 },
      { x: 397, y: 65 },
      { x: 493, y: 65 },
      { x: 463, y: 156.5 },
      { x: 386, y: 99.5 },
      { x: 289.5, y: 99.5 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_ch.width / 2, textureSize_ch.height / 2);
    })
  );
  var polgonCenterOffset = { x: 0, y: -5 };
  PRESETS.push({
    name: "CH_Bowtie",
    imagePath: imagePath_ch,
    textureSize: textureSize_ch,
    polygon: polygon_bowtie_ch,
    centerOffset: { x: 0, y: 0 }
  });

  // Cronholm144 Rhombus
  var polygon_rhombus_ch = new Polygon(
    [
      { x: 63.5, y: 190 },
      { x: 158, y: 190 },
      { x: 128.5, y: 280 },
      { x: 33, y: 280 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_ch.width / 2, textureSize_ch.height / 2);
    })
  );
  var polgonCenterOffset = { x: 0, y: -5 };
  PRESETS.push({
    name: "CH_Rhombus",
    imagePath: imagePath_ch,
    textureSize: textureSize_ch,
    polygon: polygon_rhombus_ch,
    centerOffset: { x: 0, y: 0 }
  });

  // Cronholm144 Decadon
  var polygon_decagon_ch = new Polygon(
    [
      { x: 278, y: 142 },
      { x: 375, y: 142 },
      { x: 452.5, y: 198 },
      { x: 482, y: 289.5 },
      { x: 452.5, y: 380 },
      { x: 375, y: 436.5 },
      { x: 278, y: 436.5 },
      { x: 201, y: 380 },
      { x: 171.5, y: 289.5 },
      { x: 201, y: 198 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_ch.width / 2, textureSize_ch.height / 2);
    })
  );
  var polgonCenterOffset = { x: 0, y: -5 };
  PRESETS.push({
    name: "CH_Pentagon",
    imagePath: imagePath_ch,
    textureSize: textureSize_ch,
    polygon: polygon_decagon_ch,
    centerOffset: { x: 0, y: 0 }
  });

  // Cronholm144 Pentagon
  var polygon_pentagon_ch = new Polygon(
    [
      { x: 37, y: 305 },
      { x: 134, y: 305 },
      { x: 164, y: 397 },
      { x: 86, y: 453 },
      { x: 8, y: 397 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_ch.width / 2, textureSize_ch.height / 2);
      // return new Vertex(coords); // .sub(textureSize.width / 2, textureSize.height / 2);
    })
  );
  var polgonCenterOffset = { x: 0, y: -5 };
  PRESETS.push({
    name: "CH_Pentagon",
    imagePath: imagePath_ch,
    textureSize: textureSize_ch,
    polygon: polygon_pentagon_ch,
    centerOffset: { x: 0, y: -5 } // polgonCenterOffset
  });

  var imagePath_lu = "girih-tiles-spatial.jpg";
  var imageWidth = 640;
  var imageHeight = 500;
  var textureSize_lu = new Bounds(new Vertex(-imageWidth / 2, -imageHeight / 2), new Vertex(imageWidth / 2, imageHeight / 2));
  // Lund University Pentagon
  var polygon_pentagon_lu = new Polygon(
    [
      { x: 104, y: 225 },
      { x: 151, y: 191 },
      { x: 198, y: 225 },
      { x: 180, y: 281 },
      { x: 122, y: 281 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_lu.width / 2, textureSize_lu.height / 2);
      // return new Vertex(coords); // .sub(textureSize.width / 2, textureSize.height / 2);
    })
  );
  var polgonCenterOffset = { x: 0, y: 5 };
  PRESETS.push({
    name: "LU_Pentagon",
    imagePath: imagePath_lu,
    textureSize: textureSize_lu,
    polygon: polygon_pentagon_lu,
    centerOffset: polgonCenterOffset
  });

  // Lund University Rhombus
  var polygon_pentagon_lu = new Polygon(
    [
      { x: 6, y: 240 },
      { x: 40, y: 193 },
      { x: 75, y: 240 },
      { x: 40, y: 287 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_lu.width / 2, textureSize_lu.height / 2);
      // return new Vertex(coords); // .sub(textureSize.width / 2, textureSize.height / 2);
    })
  );

  var polgonCenterOffset = { x: 0, y: 0 };
  PRESETS.push({
    name: "LU_Rhombus",
    imagePath: imagePath_lu,
    textureSize: textureSize_lu,
    polygon: polygon_pentagon_lu,
    centerOffset: { x: 0, y: 0 }
  });

  // Lund University Bowtie
  var polygon_pentagon_lu = new Polygon(
    [
      { x: 233, y: 186 },
      { x: 291, y: 186 },
      { x: 273, y: 240 },
      { x: 290, y: 295 },
      { x: 233, y: 295 },
      { x: 250, y: 240 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_lu.width / 2, textureSize_lu.height / 2);
      // return new Vertex(coords); // .sub(textureSize.width / 2, textureSize.height / 2);
    })
  );

  // Lund University Hexagon
  var polygon_pentagon_lu = new Polygon(
    [
      { x: 372, y: 165 },
      { x: 406, y: 211 },
      { x: 406, y: 270 },
      { x: 372, y: 315 },
      { x: 339, y: 270 },
      { x: 339, y: 211 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_lu.width / 2, textureSize_lu.height / 2);
      // return new Vertex(coords); // .sub(textureSize.width / 2, textureSize.height / 2);
    })
  );
  var polgonCenterOffset = { x: 0, y: 0 };

  // Lund University Hexagon
  var polygon_pentagon_lu = new Polygon(
    [
      { x: 514, y: 153 },
      { x: 572, y: 153 },
      { x: 618, y: 186 },
      { x: 636, y: 240.5 },
      { x: 618, y: 295 },
      { x: 571, y: 328.5 },
      { x: 515, y: 328.5 },
      { x: 468.5, y: 295 },
      { x: 450, y: 240.5 },
      { x: 468.5, y: 186 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_lu.width / 2, textureSize_lu.height / 2);
      // return new Vertex(coords); // .sub(textureSize.width / 2, textureSize.height / 2);
    })
  );
  // var polgonCenterOffset = { x: 0, y: 0 };
  PRESETS.push({
    name: "LU_Decagon",
    imagePath: imagePath_lu,
    textureSize: textureSize_lu,
    polygon: polygon_pentagon_lu,
    centerOffset: { x: 0, y: 0 }
  });

  // Lund University Hexagon
  var polygon_bowtie_lu = new Polygon(
    [
      { x: 233.5, y: 186.5 },
      { x: 289, y: 186 },
      { x: 272.5, y: 240 },
      { x: 289, y: 294 },
      { x: 233.5, y: 294 },
      { x: 251.5, y: 240 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_lu.width / 2, textureSize_lu.height / 2);
      // return new Vertex(coords); // .sub(textureSize.width / 2, textureSize.height / 2);
    })
  );
  // var polgonCenterOffset = { x: 0, y: 0 };
  PRESETS.push({
    name: "LU_Bowtie",
    imagePath: imagePath_lu,
    textureSize: textureSize_lu,
    polygon: polygon_bowtie_lu,
    centerOffset: { x: 0, y: 0 }
  });

  // Lund University Hexagon
  var polygon_hexagon_lu = new Polygon(
    [
      { x: 372.5, y: 166 },
      { x: 406, y: 212 },
      { x: 406.5, y: 268.5 },
      { x: 372.5, y: 315 },
      { x: 339, y: 268.5 },
      { x: 339, y: 212 }
    ].map(function (coords) {
      return new Vertex(coords).sub(textureSize_lu.width / 2, textureSize_lu.height / 2);
      // return new Vertex(coords); // .sub(textureSize.width / 2, textureSize.height / 2);
    })
  );
  // var polgonCenterOffset = { x: 0, y: 0 };
  PRESETS.push({
    name: "LU_Hexagon",
    imagePath: imagePath_lu,
    textureSize: textureSize_lu,
    polygon: polygon_hexagon_lu,
    centerOffset: { x: 0, y: 0 }
  });

  // var presetNames = ["CH_Pentagon", "CH_penrose", "LU_Pentagon"];
  function getTestPreset(name) {
    console.log("getTestPreset name", name);
    for (var i = 0; i < PRESETS.length; i++) {
      if (PRESETS[i].name === name) {
        return PRESETS[i];
      }
    }
    return PRESETS[0];
  }

  globalThis.getTestPreset = getTestPreset;
  globalThis.presetNames = PRESETS.map(function (preset) {
    return preset.name;
  }); // presetNames;
  console.log(presetNames);
})();
