var SECONDS_IN_DAY = 86400;
var ANIMATION_DURATION = 1;

var TIME_INTERVAL = SECONDS_IN_DAY / 100;

var SIZE = 30;

var currentTime;
var currentData = [];

var map;
var devices = [];

function animateScale(x, interval) {
    return 1 - Math.pow((x - (interval / 2)) / (interval / 2), 2);
}

function newEvent(id, type, time) {
    return { deviceId: id, type: type, time: time };
}

function start() {
    /*
    socket = io();
    socket.on('event', function (msg) {
        console.log(msg);
    });
    */

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({ source: new ol.source.OSM() })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([144.9633, -37.8141]),
            zoom: 11
        })
    });

    devices.push([144.9333, -37.8141]);
    devices.push([144.9633, -37.8141]);
    devices.push([144.8633, -37.8041]);
    devices.push([144.9533, -37.8041]);
    devices.push([144.8533, -37.7841]);
    devices.push([144.9233, -37.7841]);
    devices.push([144.8233, -37.7641]);
    devices.push([144.8033, -37.7641]);
    devices.push([144.8033, -37.8341]);
    devices.push([144.9033, -37.8341]);
    devices.push([144.9033, -37.8041]);

    document.getElementById('file_field').addEventListener('change', handleFileSelect, false);
    document.getElementById('file_field').value = null;
}

var eventList = [];
function playReplay() {
    for (var i = 0; i < currentData.length; ++i) {
        var elem = currentData[i];
        eventList.push(newEvent(parseInt(elem[0]), elem[2].trim(), parseInt(elem[1])));
    }

    var start = 0;
    var startTime = new Date().getTime();

    map.on('postcompose', function (event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;
        var time = currentTime + (frameState.time - startTime);

        for (; start < eventList.length; ++start) {
            if (eventList[start].time > time) {
                break;
            }
        }

        for (var i = start; i < eventList.length; ++i) {
            var data = eventList[i];

            if (data.time - time > TIME_INTERVAL) {
                break;
            }

            var point = new ol.geom.Point(ol.proj.fromLonLat(devices[data.deviceId]));
            var radius = 20 * animateScale(data.time - time, TIME_INTERVAL);

            var fill;

            console.log(data.type);
            if (data.type == "HAPPY") {
                fill = new ol.style.Fill({ color: 'yellow' });
            }
            else if (data.type == "SAD") {
                fill = new ol.style.Fill({ color: 'red' });
            }
            else if (data.type == "NEUTRAL") {
                fill = new ol.style.Fill({ color: 'grey' });
            }

            var circleStyle = new ol.style.Circle({
                radius: radius,
                snapToPixel: false,
                fill: fill,
                stroke: new ol.style.Stroke({ color: 'red', width: 1 })
            });

            vectorContext.setImageStyle(circleStyle);
            vectorContext.drawMultiPointGeometry(point, null);
        }

        frameState.animate = true;
    });
    map.render();
}

function handleFileSelect(evt) {
    var files = evt.target.files;

    if (files[0] == null) {
        return;
    }

    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            currentData = [];
            var rows =  e.target.result.split('\n');
            for (var i = 0; i < rows.length; ++i) {
                currentData.push(rows[i].split(','));
            }

            console.log("Loaded file, start time is: " + currentData[0][1]);
            currentTime = parseInt(currentData[0][1]);
            playReplay();
        };
    })(files[0]);

    reader.readAsText(files[0]);
}