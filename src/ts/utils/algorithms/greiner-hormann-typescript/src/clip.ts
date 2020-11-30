/**
 * TypeScript port by Ikaros Kappler.
 *
 * Original file https://github.com/w8r/GreinerHormann/blob/master/src/clip.js
 *
 * @date 2020-11-30
 */

import Polygon from './polygon';

/**
 * Clip driver
 * @param  {Array.<Array.<Number>>} polygonA
 * @param  {Array.<Array.<Number>>} polygonB
 * @param  {Boolean}                sourceForwards
 * @param  {Boolean}                clipForwards
 * @return {Array.<Array.<Number>>}
 */
// TODO: types?
export default function (polygonA:any, polygonB:any, eA:boolean, eB:boolean) {
    const source : Polygon = new Polygon(polygonA);
    const clip : Polygon = new Polygon(polygonB);
    return source.clip(clip, eA, eB);
}
