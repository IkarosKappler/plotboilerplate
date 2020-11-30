/**
 * TypeScript port by Ikaros Kappler.
 *
 * Original file https://github.com/w8r/GreinerHormann/blob/master/src/clip.leaflet.js
 *
 * @date 2020-11-30
 */

import booleanOperator from './clip';

/**
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>|Null}
 */
export function union (polygonA, polygonB) {
  return booleanOperator(polygonA, polygonB, false, false);
}

/**
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
 */
export function intersection (polygonA, polygonB) {
  return booleanOperator(polygonA, polygonB, true, true);
}

/**
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
 * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
 * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
 */
export function diff (polygonA, polygonB) {
  return booleanOperator(polygonA, polygonB, false, true);
}

export const clip = booleanOperator;
