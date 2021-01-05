/**
 * @author Ikaros Kappler
 * @date   2021-04-05
 */
import { drawutils } from "./draw";
import { drawutilsgl } from "./drawgl";
import { Vertex } from "./Vertex";
import { /*IBounds, IDraggable, Config, */ Drawable, DrawConfig } from "./interfaces";
/**
 * Draw all drawables.
 *
 * This function is used by the main draw procedure and some further tools (like svg-draw).
 *
 * @method drawDrawables
 * @param {number} renderTime - The current render time. It will be used to distinct
 *                              already draw vertices from non-draw-yet vertices.
 * @return {void}
 **/
export declare const drawDrawables: (drawables: Array<Drawable>, draw: drawutils | drawutilsgl, fill: drawutils | drawutilsgl, drawConfig: DrawConfig, renderTime: number, _handleColor: (vertex: Vertex, color: string) => string) => void;
