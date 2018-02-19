import {parseCoordinates, Point} from "./utils";
import {Map} from 'leaflet';

const L = require('leaflet');

const coordinatesInput = document.querySelector<HTMLInputElement>('#coordinates');
const button = document.querySelector<HTMLButtonElement>('#show');
const places = document.querySelector<HTMLSelectElement>('[title=select-place]');
const distanceInput = document.querySelector<HTMLInputElement>('#distance');

let raw = [[0,-0.4461538461538462],[0.20307692307692307,-0.2523076923076923],[0.34923076923076923,-0.13692307692307693],[0.4323076923076923,-0.046153846153846156],[0.4753846153846154,0.04],[0.4938461538461538,0.11846153846153847],[0.4938461538461538,0.19538461538461538],[0.48,0.27384615384615385],[0.43846153846153846,0.34615384615384615],[0.39076923076923076,0.39384615384615385],[0.32461538461538464,0.42615384615384616],[0.26461538461538464,0.44153846153846155],[0.20153846153846153,0.44153846153846155],[0.1523076923076923,0.42923076923076925],[0.09692307692307692,0.40307692307692305],[0.05076923076923077,0.3630769230769231],[0,0.2692307692307692],[-0.05076923076923077,0.3630769230769231],[-0.09692307692307692,0.40307692307692305],[-0.1523076923076923,0.42923076923076925],[-0.20153846153846153,0.44153846153846155],[-0.26461538461538464,0.44153846153846155],[-0.32461538461538464,0.42615384615384616],[-0.39076923076923076,0.39384615384615385],[-0.43846153846153846,0.34615384615384615],[-0.48,0.27384615384615385],[-0.4938461538461538,0.19538461538461538],[-0.4938461538461538,0.11846153846153847],[-0.4753846153846154,0.04],[-0.4323076923076923,-0.046153846153846156],[-0.34923076923076923,-0.13692307692307693],[-0.20307692307692307,-0.2523076923076923],[0,-0.4461538461538462]];
let heart = raw.map(p => new Point(p[0], p[1]));

let map = L.map('map').setView(parseCoordinates(coordinatesInput.value), 18);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);
let geoJsonLayer = L.geoJSON().addTo(map);

function calculate(map: Map) {
    let start = parseCoordinates(coordinatesInput.value);
    let distance = parseFloat(distanceInput.value);
    let origin = new Point(0, 0);
    let points = heart
        .map(point => {
            let bearing = origin.bearingTo(point);
            let dist = origin.distanceTo(point);
            return start.destinationPoint(dist * distance, bearing);
        })
        .map(latLong => {
            return [latLong.lon, latLong.lat]
        });
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
    map.setView({lat: start.lat, lng: start.lon}, map.getZoom());
}

calculate(map);

button.addEventListener('click', () => {
    calculate(map);
});

places.addEventListener('change', () => {
    coordinatesInput.value = places.value;
});
