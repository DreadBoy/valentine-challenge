import {parseCoordinates, Point} from "./utils";
import {Map} from 'leaflet';

const L = require('leaflet');

const coordinatesInput = document.querySelector<HTMLInputElement>('#coordinates');
const button = document.querySelector<HTMLButtonElement>('#show');
const places = document.querySelector<HTMLSelectElement>('[title=select-place]');
const distanceInput = document.querySelector<HTMLInputElement>('#distance');
const link = document.querySelector<HTMLAnchorElement>('#geojson-link');
const showRadius = document.querySelector<HTMLInputElement>('#show_radius');

let heart = [[0, -0.4461538461538462], [0.20307692307692307, -0.2523076923076923], [0.34923076923076923, -0.13692307692307693], [0.4323076923076923, -0.046153846153846156], [0.4753846153846154, 0.04], [0.4938461538461538, 0.11846153846153847], [0.4938461538461538, 0.19538461538461538], [0.48, 0.27384615384615385], [0.43846153846153846, 0.34615384615384615], [0.39076923076923076, 0.39384615384615385], [0.32461538461538464, 0.42615384615384616], [0.26461538461538464, 0.44153846153846155], [0.20153846153846153, 0.44153846153846155], [0.1523076923076923, 0.42923076923076925], [0.09692307692307692, 0.40307692307692305], [0.05076923076923077, 0.3630769230769231], [0, 0.2692307692307692], [-0.05076923076923077, 0.3630769230769231], [-0.09692307692307692, 0.40307692307692305], [-0.1523076923076923, 0.42923076923076925], [-0.20153846153846153, 0.44153846153846155], [-0.26461538461538464, 0.44153846153846155], [-0.32461538461538464, 0.42615384615384616], [-0.39076923076923076, 0.39384615384615385], [-0.43846153846153846, 0.34615384615384615], [-0.48, 0.27384615384615385], [-0.4938461538461538, 0.19538461538461538], [-0.4938461538461538, 0.11846153846153847], [-0.4753846153846154, 0.04], [-0.4323076923076923, -0.046153846153846156], [-0.34923076923076923, -0.13692307692307693], [-0.20307692307692307, -0.2523076923076923], [0, -0.4461538461538462]]
    .map(i => [i[0] * 0.75, i[1] * 0.75 + 0.1])
    .map(p => new Point(p[0], p[1]));
let arrow = [[0.25, 0.25], [-0.45, -0.05], [-0.35, 0.05], [-0.45, -0.05], [-0.30, -0.05]]
    .map(p => new Point(p[0], p[1]));
let iLoveYou = [
    [[3, 0], [3, 40]],
    [[33, 0], [33, 40], [51, 40]],
    [[74, 0], [86, 7], [88, 19], [85, 33], [73, 40], [62, 34], [58, 21], [61, 8], [74, 0]],
    [[98, 0], [112, 40], [127, 0]],
    [[157, 0], [138, 0], [138, 20], [157, 20], [138, 20], [138, 40], [157, 40]],
    [[179, 0], [191, 20], [203, 0], [191, 20], [191, 40]],
    [[227, 0], [239, 7], [241, 19], [238, 33], [226, 40], [215, 34], [211, 21], [214, 8], [227, 0]],
    [[256, 0], [256, 30], [260, 36], [268, 40], [276, 36], [280, 30], [280, 0]],
]
    .map(line => line.map(p => [(p[0] / 285 - 0.5) / 2, -p[1] / 40 / 8 - 0.27]).map(p => new Point(p[0], p[1])));


let map = L.map('map').setView(parseCoordinates(coordinatesInput.value), 15);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);
let geoJsonLayer = L.geoJSON({
    type: "FeatureCollection",
    features: []
}, {
    style: (geoJsonFeature: any) => {
        return {
            color: '#FF4136',
            weight: 3,
            fillOpacity: 0.1
        }
    }
}).addTo(map);

function calculate(map: Map) {
    let start = parseCoordinates(coordinatesInput.value);
    let distance = parseFloat(distanceInput.value);
    let origin = new Point(0, 0);
    let data = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        heart
                            .map(point => {
                                let bearing = origin.bearingTo(point);
                                let dist = origin.distanceTo(point);
                                return start.destinationPoint(dist * 2 * distance, bearing);
                            })
                            .map(latLong => {
                                return [latLong.lon, latLong.lat]
                            })
                    ]
                }
            },
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Polygon",
                    coordinates: showRadius.checked ? [[...Array(36).keys()]
                        .map((i: number) =>
                            start.destinationPoint(distance, i * 10)
                        )
                        .map(latLong =>
                            [latLong.lon, latLong.lat]
                        )] : []
                }
            },
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates:
                        arrow
                            .map(point => {
                                let bearing = origin.bearingTo(point);
                                let dist = origin.distanceTo(point);
                                return start.destinationPoint(dist * 2 * distance, bearing);
                            })
                            .map(latLong => {
                                return [latLong.lon, latLong.lat]
                            })
                }
            },
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "MultiLineString",
                    coordinates:
                        iLoveYou
                            .map(line => line
                                .map(point => {
                                    let bearing = origin.bearingTo(point);
                                    let dist = origin.distanceTo(point);
                                    return start.destinationPoint(dist * 2 * distance, bearing);
                                })
                                .map(latLong => {
                                    return [latLong.lon, latLong.lat]
                                })
                            )
                }
            }
        ]
    };
    geoJsonLayer.clearLayers();
    geoJsonLayer.addData(data);
    map.setView({lat: start.lat, lng: start.lon}, map.getZoom());
    link.href = `http://geojson.io#data=data:application/json,${encodeURIComponent(JSON.stringify(data))}`;
}

calculate(map);

button.addEventListener('click', () => {
    calculate(map);
});

places.addEventListener('change', () => {
    coordinatesInput.value = places.value;
});
