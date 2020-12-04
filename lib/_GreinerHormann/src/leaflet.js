import boolean from './clip.leaflet';


/**
 * @api
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>|Null}
 */
export function union (polygonA, polygonB) {
  return clip(polygonA, polygonB, false, false);
}


/**
 * @api
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
 */
export function intersection (polygonA, polygonB) {
  return clip(polygonA, polygonB, true, true);
}


/**
 * @api
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
 */
export function diff (polygonA, polygonB) {
  return clip(polygonA, polygonB, false, true);
}


export const clip = boolean;
