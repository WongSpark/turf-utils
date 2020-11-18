import bearing from "@turf/rhumb-bearing";
import destination from "@turf/rhumb-destination";
import measureDistance from "@turf/rhumb-distance";
import {Feature, LineString, point, Point, Units} from "@turf/helpers";
import {getGeom} from "@turf/invariant";

/**
 * 计算基于等角航线的线上某位置的点（区别于turf.js默认的along，默认使用大圆航线）
 * @param line
 * @param distance
 * @param options
 */
function rhumbAlong(line:LineString,distance:number,options: {units?: Units} = {}) : Feature<Point>{
    const geom = getGeom(line);
    const coords = geom.coordinates;
    let travelled = 0;

    for (let i = 0; i < coords.length; i++) {
        if (distance >= travelled && i === coords.length - 1) {
            break;
        } else if (travelled >= distance) {
            const overshot = distance - travelled;
            if (!overshot) {
                return point(coords[i]);
            } else {
                const direction = bearing(coords[i], coords[i - 1]);
                const interpolated = destination(coords[i], -overshot, direction, options);
                return interpolated;
            }
        } else {
            travelled += measureDistance(coords[i], coords[i + 1], options);
        }
    }
    return point(coords[coords.length - 1]);
}

/**
 * 计算基于等角航线的线上某位置的点的角度（区别于turf.js默认的along，默认使用大圆航线）
 * @param line
 * @param distance
 * @param options
 * @returns {number}
 */
function rhumbAlongBearing(line:LineString,distance:number,options: {units?: Units} = {}) : number{
    const geom = getGeom(line);
    const coords = geom.coordinates;
    let travelled = 0;
    for (let i = 0; i < coords.length; i++) {
        if (distance >= travelled && i === coords.length - 1) {
            break;
        } else if (travelled >= distance) {
            const direction = bearing(coords[i-1], coords[i]);
            return direction;
        } else {
            travelled += measureDistance(coords[i], coords[i + 1], options);
        }
    }
    const direction = bearing(coords[coords.length - 1], coords[coords.length - 2]);
    return direction;
}

export {
    rhumbAlong, rhumbAlongBearing
}
