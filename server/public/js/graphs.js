function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var measurements;
function drawOnLoad() {
    $("#chartLoadingMessage").removeClass('hidden');
    $("#chartErrorMessage").addClass('hidden');
    // Find the measurements associated with the current device
    $.get("api/devices/" + d_id + "/measurements", function (m) {
        measurements = m;
        drawLineGraph(m);
        drawDonutGraph(m);
    });
};

var annotationChart;
function drawLineGraph(measurements) {
    $("#chartLoadingMessage").addClass('hidden');
    if (measurements.length < 2) {
        $("#chartErrorMessage").removeClass('hidden');
        return;
    }

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    dataTable.addColumn('number', 'Happy Presses');
    dataTable.addColumn('number', 'Neutral Presses');
    dataTable.addColumn('number', 'Sad Presses');

    for (var i = 0; i < measurements.length; i++) {
        dataTable.addRow([new Date(Date.parse(measurements[i].time)),
            measurements[i].happy_count, measurements[i].neutral_count, measurements[i].sad_count]);
    }

    var options = {
        pointSize: 5,
        colors: ['orange', 'grey', 'red'],
        chartArea: {'width': '90%', 'height': '80%'},
        displayZoomButtons: true,
        fill: 10,
        zoomStartTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
    };

    annotationChart = new google.visualization.AnnotationChart(document.getElementById('feedback_chart'));
    annotationChart.draw(dataTable, options);

    google.visualization.events.addListener(annotationChart, 'rangechange', function(range) { drawDonutGraph(measurements); });

};

function drawDonutGraph(measurements) {
    var range = annotationChart.getVisibleChartRange();
    var totals = [0, 0, 0];
    for (var i = 0; i < measurements.length; i++) {
        if (Date.parse(measurements[i].time) < range.start.getTime() ||
            Date.parse(measurements[i].time) > range.end.getTime()) {
            continue;
        }

        totals[0] += measurements[i].happy_count;
        totals[1] += measurements[i].neutral_count;
        totals[2] += measurements[i].sad_count;
    }

    var data = google.visualization.arrayToDataTable([
        ['Press type', 'Total'],
        ['Happy', totals[0]],
        ['Neutral', totals[1]],
        ['Sad', totals[2]],
    ]);

    var options = {
        colors: ['orange', 'grey', 'red'],
        chartArea: {'width': '95%', 'height': '90%'},
        legend: {position: 'bottom'},
        pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
}

function initMap() {
    if (d_id != '') {
        return;
    }

    var center = { lat: -37.8141, lng: 144.9633 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: center,
        disableDefaultUI: true
    });

    $.get("api/devices", function (devices) {
        for (var i = 0; i < devices.length; ++i) {
            if (devices[i].location == null) {
                continue;
            }

            var position = devices[i].location.split(',');
            var marker = new google.maps.Marker({
                position: { lat: parseFloat(position[0]), lng: parseFloat(position[1]) },
                map: map,
                title: devices[i].description
            });

            marker.addListener('click', setLocationCallback(devices[i].id));
        }
    });
}

function setLocationCallback(id) {
    return function () { window.location.href += '?d_id=' + id };
}