"use strict";
/**
 * A simple wavefront OBJ parser.
 *
 * Inspired by
 *    https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html
 *
 * @param {*} handleVert
 * @param {*} handleFace
 *
 * @author Ikaros Kappler
 * @date 2021-04-21
 * @version 0.0.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBJParser = void 0;
var OBJParser = /** @class */ (function () {
    function OBJParser(handleVert, handleFace) {
        this.handleVert = handleVert;
        this.handleFace = handleFace;
    }
    OBJParser.prototype._seekEOL = function (byteView, curPosition) {
        // Seek line break character (13)
        while (curPosition < byteView.length && byteView[curPosition] !== 13 && byteView[curPosition] !== 10) {
            curPosition++;
        }
        return curPosition;
    };
    OBJParser.prototype._handleLine = function (line, lineNo) {
        if (line === "" || line.startsWith("#")) {
            return;
        }
        var split = line.split(/\s+/g);
        if (split[0] === "v") {
            // Parse string of form
            // 'v x y z'
            if (split.length < 4) {
                console.warn("Parse error in line " + lineNo + ": too few arguments", line);
                return;
            }
            // Assume all params are proper numbers.
            this.handleVert(Number(split[1]), Number(split[2]), Number(split[3]));
        }
        else if (split[0] === "f") {
            // Parse string of form
            // 'f vA vB vC' or 'f vA/tA vB/tB vC/tC' or 'f vA/tA/nA vB/tB/nB vC/tC/nC'
            if (split.length < 4) {
                console.warn("Parse error in line " + lineNo + ": too few arguments", line);
                return;
            }
            // Split each face argument into parts (vert-index/texture-coordindate/normal)
            var faceParams = [];
            for (var i = 1; i < 4; i++) {
                var faceSplit = split[i].split("/");
                faceParams.push(Number(faceSplit[0]));
            }
            this.handleFace(faceParams[0], faceParams[1], faceParams[2]);
        }
    };
    OBJParser.prototype.parse = function (arrayBuffer) {
        var byteView = new Int8Array(arrayBuffer);
        var curStart = 0;
        var curEnd = 0;
        var lineNo = 0;
        do {
            curEnd = this._seekEOL(byteView, curStart);
            var lineBuffer = byteView.slice(curStart, curEnd); // .toString();
            var line = String.fromCharCode.apply(null, lineBuffer);
            this._handleLine(line.trim(), lineNo);
            curStart = curEnd + 1;
            lineNo++;
        } while (curEnd < arrayBuffer.byteLength);
    };
    return OBJParser;
}());
exports.OBJParser = OBJParser;
//# sourceMappingURL=OBJParser.js.map