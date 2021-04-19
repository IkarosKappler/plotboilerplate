// Found at
//   https://github.com/3daddict/js-stl-parser/blob/master/index.js

// const express = require('express');
// const fs = require('fs');
// const app = express();
// const port = process.env.PORT || 3000;

(function (context) {
  function Vertex(v1, v2, v3) {
    this.v1 = Number(v1);
    this.v2 = Number(v2);
    this.v3 = Number(v3);
  }

  // Vertex Holder
  function VertexHolder(vertex1, vertex2, vertex3) {
    this.vert1 = vertex1;
    this.vert2 = vertex2;
    this.vert3 = vertex3;
  }

  // transforming a Node.js Buffer into a V8 array buffer
  function _toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length),
      view = new Uint8Array(ab);

    for (var i = 0; i < buffer.length; ++i) {
      // for (var i = 0; i < buffer.byteLength; ++i) {
      // if (i < 32) console.log(buffer[i]);
      view[i] = buffer.charCodeAt(i); // buffer[i];
    }
    return ab;
  }

  function _toUin8Array(buffer) {
    var ab = new ArrayBuffer(buffer.length),
      view = new Uint8Array(ab);

    for (var i = 0; i < buffer.length; ++i) {
      // for (var i = 0; i < buffer.byteLength; ++i) {
      view[i] = buffer[i];
    }
    return view; // ab;
  }

  // calculation of the triangle volume
  // source: http://stackoverflow.com/questions/6518404/how-do-i-calculate-the-volume-of-an-object-stored-in-stl-files
  // function _triangleVolume(vertexHolder) {
  //   var v321 = Number(vertexHolder.vert3.v1 * vertexHolder.vert2.v2 * vertexHolder.vert1.v3),
  //     v231 = Number(vertexHolder.vert2.v1 * vertexHolder.vert3.v2 * vertexHolder.vert1.v3),
  //     v312 = Number(vertexHolder.vert3.v1 * vertexHolder.vert1.v2 * vertexHolder.vert2.v3),
  //     v132 = Number(vertexHolder.vert1.v1 * vertexHolder.vert3.v2 * vertexHolder.vert2.v3),
  //     v213 = Number(vertexHolder.vert2.v1 * vertexHolder.vert1.v2 * vertexHolder.vert3.v3),
  //     v123 = Number(vertexHolder.vert1.v1 * vertexHolder.vert2.v2 * vertexHolder.vert3.v3);
  //   return Number(1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
  // }

  /**
   * @param {function} handleVert function(x,y,z)
   * @param {function} handleFace function(i,j,k)
   * */
  // var STLParser = function (handleVert, handleFace) {
  var STLParser = function (handleFacet) {
    // this.handleVert = handleVert;
    // this.handleFace = handleFace;
    this.handleFacet = handleFacet;
  };

  // parsing an STL ASCII string
  STLParser.prototype._parseSTLString = function (stl) {
    var totalVol = 0;
    // yes, this is the regular expression, matching the vertexes
    // it was kind of tricky but it is fast and does the job
    var vertexes = stl.match(
      /facet\s+normal\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+outer\s+loop\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+endloop\s+endfacet/g
    );

    var _handleFacet = this.handleFacet;
    vertexes.forEach(function (vert) {
      var preVertexHolder = new VertexHolder();
      vert
        .match(
          /vertex\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s+([-+]?\b(?:[0-9]*\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\b)\s/g
        )
        .forEach(function (vertex, i) {
          var tempVertex = vertex.replace("vertex", "").match(/[-+]?[0-9]*\.?[0-9]+/g);
          var preVertex = new Vertex(tempVertex[0], tempVertex[1], tempVertex[2]);
          preVertexHolder["vert" + (i + 1)] = preVertex;
        });
      // var partVolume = _triangleVolume(preVertexHolder);
      _handleFacet(preVertexHolder.vert1, preVertexHolder.vert2, preVertexHolder.vert3);
      // totalVol += Number(partVolume);
    });

    var volumeTotal = Math.abs(totalVol) / 1000;
    // return {
    //     volume: volumeTotal,        // cubic cm
    //     weight: volumeTotal * 1.04  // gm
    // }
    console.log("ASCII:", volumeTotal * 1.25);
  };

  // parsing an STL Binary File
  // (borrowed some code from here: https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/STLLoader.js)
  STLParser.prototype._parseSTLBinary = function (buf) {
    // buf = _toArrayBuffer(buf);
    // console.log(buf);

    var headerLength = 80,
      dataOffset = 84,
      faceLength = 12 * 4 + 2,
      le = true; // is little-endian

    var dvTriangleCount = new DataView(buf, headerLength, 4),
      numTriangles = dvTriangleCount.getUint32(0, le),
      totalVol = 0;
    console.log("_parseSTLBinary buf", buf.length, buf.byteLength, "headerLength", headerLength, "numTriangles", numTriangles);

    for (var i = 0; i < numTriangles; i++) {
      var dv = new DataView(buf, dataOffset + i * faceLength, faceLength),
        normal = new Vertex(dv.getFloat32(0, le), dv.getFloat32(4, le), dv.getFloat32(8, le)),
        vertHolder = new VertexHolder();
      for (var v = 3; v < 12; v += 3) {
        var vert = new Vertex(dv.getFloat32(v * 4, le), dv.getFloat32((v + 1) * 4, le), dv.getFloat32((v + 2) * 4, le));
        vertHolder["vert" + v / 3] = vert;
      }
      // totalVol += _triangleVolume(vertHolder);
      this.handleFacet(vertHolder.vert1, vertHolder.vert2, vertHolder.vert3);
    }

    var volumeTotal = Math.abs(totalVol) / 1000;
    // return {
    //     volume: volumeTotal,        // cubic cm
    //     weight: volumeTotal * 1.04  // gm
    // }
    // console.log("BINARY:", volumeTotal * 1.25);
  };

  /**
   *
   * @param {ArrayBuffer} buf
   * @returns
   */
  STLParser.prototype.parse = function (buf) {
    var isAscii = true;

    // var buf = _toArrayBuffer(buf);

    console.log("buf.byteLength", buf.byteLength, buf.length);
    for (var i = 0, len = buf.length; i < len && isAscii; i++) {
      // for (var i = 0, len = buf.byteLength; i < len; i++) {
      // if (i < 127) console.log(buf.charCodeAt(i));
      // if (buf[i] < 0 || buf[i] > 127) {
      if (buf.charCodeAt(i) > 127) {
        isAscii = false;
        break;
      }
    }

    console.log("isAscii", isAscii, "buf", buf.length, buf.byteLength);
    if (isAscii) {
      // console.log(buf.toString());
      // var enc = new TextDecoder("utf-8"); // ascii");
      // var arr = _toUin8Array(buf);
      // console.log(enc.decode(arr));
      // console.log(new String(_toUin8Array(buf)));
      // console.log(_toArrayBuffer(buf));
      // console.log(buf.toString());
      this._parseSTLString(buf.toString());
    } else {
      buf = _toArrayBuffer(buf);
      // buf = _toUin8Array(buf);
      console.log("binary");
      this._parseSTLBinary(buf);
    }
    console.log("isAscii", isAscii);
  };

  // function NodeStl(stlPath) {
  //   var buf = fs.readFileSync(stlPath),
  //     isAscii = true;

  //   for (var i = 0, len = buf.length; i < len; i++) {
  //     if (buf[i] > 127) {
  //       isAscii = false;
  //       break;
  //     }
  //   }

  //   if (isAscii) return _parseSTLString(buf.toString());
  //   else return _parseSTLBinary(buf);
  // }

  // NodeStl("./stl/3DBenchy.stl");
  // NodeStl("./stl/square-ascii.STL");
  // NodeStl("./stl/square-binary.STL");

  // app.listen(port, () => {
  //   console.log("Server listening on port " + port);
  // });
  context.STLParser = STLParser;
})(globalThis || window);
