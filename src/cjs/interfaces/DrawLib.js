"use strict";
/**
 * @author Ikaros Kappler
 * @modified 2021-01-10 Added the `CanvasWrapper` interface.
 * @modified 2021-01-20 Added the `UID` type.
 * @modified 2021-01-25 Added the `DrawLib.setCurrentId` and `DrawLib.setCurrentClassName` functions.
 * @modified 2021-01-25 Fixed the `PBParams` interface (inluding DrawConfig).
 * @modified 2021-02-08 Changed the `PBParams` interface: no longer sub-interface of `DrawConfig` (all those attributes were un-used).
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Added the `rotation` param to the DrawLib.ellipse(...) function.
 * @modified 2021-03-02 Added the `VEllipseSector` as to the `Drawable` type.
 * @modified 2021-03-29 Added the `draw` and `fill` params to the `preDraw` and `postDraw` function (required for full svg export support).
 * @modified 2021-03-30 Added the `endDrawCycle` function to `DrawLib`.
 * @modified 2021-05-31 Added the `drawLib.setConfiguration` function.
 * @modified 2021-05-31 Splitted the large interfaces.ts file into this one and others.
 * @modified 2021-11-12 Added `text()` params fontSize, fontFamily, rotation, textAlign.
 * @modified 2021-11-16 Added `text()` params fontWeight and fontStyle.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 **/
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=DrawLib.js.map