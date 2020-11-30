/**
 * TypeScript port by Ikaros Kappler.
 *
 * Original file https://github.com/w8r/GreinerHormann/blob/master/src/clip.leaflet.js
 *
 * @date 2020-11-30
 */

import Polygon from './polygon';

/**
 * Clip driver
 * @param  {L.Polygon} polygonA
 * @param  {L.Polygon} polygonB
 * @param  {Boolean} sourceForwards
 * @param  {Boolean} clipForwards
 * @return {Array.<L.LatLng>|null}
 */
// TODO: types?
// TODO: as arrow function
export default function (polygonA:any, polygonB:any, sourceForwards:boolean, clipForwards:boolean) {
    let sourceArr = [], clipArr = [];

    let latlngs = polygonA['_latlngs'][0];
    for (let i = 0, len = latlngs.length; i < len; i++) {
	sourceArr.push([latlngs[i]['lng'], latlngs[i]['lat']]);
    }
    latlngs = polygonB['_latlngs'][0];
    for (let i = 0, len = latlngs.length; i < len; i++) {
	clipArr.push([latlngs[i]['lng'], latlngs[i]['lat']]);
    }

    let source = new Polygon(sourceArr);
    let clip = new Polygon(clipArr);

    const result = source.clip(clip, sourceForwards, clipForwards);
    if (result && result.length > 0) {
	for (let i = 0, len = result.length; i < len; i++) {
	    result[i] = toLatLngs(result[i]);
	}

	if (result) {
	    if (result.length === 1) return result[0];
	    else                     return result;
	} else return null;
    } else return null;
}

// TODO: as arrow function
function toLatLngs(poly) {
    let result = poly;

    if (result) {
	if (result[0][0] === result[result.length - 1][0] &&
            result[0][1] === result[result.length - 1][1]) {
	    result = result.slice(0, result.length - 1);
	}

	for (let i = 0, len = result.length; i < len; i++) {
	    result[i] = [result[i][1], result[i][0]];
	}
	return result;
    } else {
	return null;
    }
}
