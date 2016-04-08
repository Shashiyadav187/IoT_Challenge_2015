var cumulocity = require('./cumulocity');
var db = require('./db');

var analysis = require("./analysis");

var express = require('express');

var app = express();
var router = express.Router()

app.get('/', function (req, res) {
    res.sendFile('/public/index.html', { root: __dirname });
});

app.get('/devices', function (req, res) {
    res.sendFile('/public/devices.html', { root: __dirname });
});

app.use('/api', router);

app.use('/api/analyze', analysis);


router.get('/', function (req, res) {
    res.json({ message: 'no data' });
});

router.get('/devices', function (req, res) {
    db.query('SELECT * FROM devices ' + db.parseDeviceQuery(req.query), function (rows) {
        res.json(rows);
    });
});

router.get('/devices/:device_id', function (req, res) {
    req.query['device_id'] = req.params.device_id;
    db.query('SELECT * FROM devices ' + db.parseDeviceQuery(req.query), function (rows) {
        res.json(rows);
    });
});


var MEAUREMENTS_PIVOT_QUERY = ' SELECT time, device_id,\
SUM(CASE WHEN (type=0) THEN count ELSE 0 END) as happy_count,\
SUM(CASE WHEN (type=2) THEN count ELSE 0 END) as sad_count,\
SUM(CASE WHEN (type=1) THEN count ELSE 0 END) as neutral_count \
FROM measurements ';

router.get('/devices/:device_id/measurements', function (req, res) {
    req.query['device_id'] = req.params.device_id;
    db.query(MEAUREMENTS_PIVOT_QUERY + db.parseMeasurementQuery(req.query) + ' GROUP BY time', function (rows) {
        res.json(rows);
    });
});

router.get('/measurements', function (req, res) {
    db.query(MEAUREMENTS_PIVOT_QUERY + db.parseMeasurementQuery(req.query) + ' GROUP BY time', function (rows) {
        res.json(rows);
    });
});

app.use(express.static(__dirname + '/public/'));

var DATABASE_CONFIG = {
    user: 'root',
    host: '52.34.201.208',
    database: 'iotdatabase',
    password: 'password1',
    timezone: '+0000',
    port: '3306',
};
db.connect(DATABASE_CONFIG);

var realTimeClient = cumulocity.connect();
realTimeClient.subscribe('/events/*', function (message) {
    var data = message['data'];
    console.log("Received event:");
    console.log(data);
    if (data.type != 'c8y_ActilityUplinkRequest') {
        return;
    }

    // Check if this devices has been registed in the device table
    db.query('SELECT * FROM devices WHERE id=' + data.source.id, function (rows) {
        if (rows.length == 0) {
            cumulocity.getDeviceInfo(data.source.id, function (res) {
                db.addDevice({
                    id: res['id'],
                    description: res['name'],
                    location: null,
                    voltage: 0
                });
                cumulocity.writeEvent(db, data);
            })
        }
        else {
            cumulocity.writeEvent(db, data);
        }
    })
});

var port = process.argv[2] || 8888;
app.listen(port);

