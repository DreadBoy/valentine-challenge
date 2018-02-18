import {LatLonSpherical} from "geodesy";

const parseDMS = require('parse-dms');
const geodesy = require('geodesy');

const parseCoordinates = (value: string): LatLonSpherical => {
    let parsed = parseDMS(value);
    return geodesy.LatLonSpherical(parsed.lat, parsed.lon);
};

class Point {

    constructor(public x: number, public y: number) {

    }

    bearingTo(point: Point): number {
        return Math.atan2(point.x - this.x, point.y - this.y) * (180 / Math.PI);
    }
}

export {
    parseCoordinates,
    Point
}