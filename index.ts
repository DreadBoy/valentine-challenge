import {parseCoordinates, Point} from "./utils";
import {Map} from 'leaflet';

const L = require('leaflet');

const coordinatesInput = document.querySelector<HTMLInputElement>('#coordinates');
const button = document.querySelector<HTMLButtonElement>('#show');

let distance = 124.8;
let heart = [new Point(1, 0), new Point(0, 0.6), new Point(-1, 0)];

let map = L.map('map').setView(parseCoordinates(coordinatesInput.value), 17);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);
let geoJsonLayer = L.geoJSON().addTo(map);

function calculate(map: Map) {
    let start = parseCoordinates(coordinatesInput.value);
    let origin = new Point(0, 0);
    let points = heart
        .map(point => {
            let bearing = origin.bearingTo(point);
            return start.destinationPoint(distance, bearing);
        })
        .map(latLong => {
            return [latLong.lon, latLong.lat]
        });
    points.push(points[0]);
    let data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        points
                    ]
                }
            }
        ]
    };
    geoJsonLayer.clearLayers();
    geoJsonLayer.addData(data);
}

calculate(map);

button.addEventListener('click', () => {
    calculate(map);
});