var mysql = require("mysql");

var connection = null;

module.exports = {
    connect: function (opts) {
        connection = mysql.createConnection(opts);
        connection.connect(function (err, conn) {
            if (err) throw err;
        });
    },

    disconnect: function () {
        connection.end();
    },

    parseDeviceQuery: function(query) {
        var userQueryList = [];

        if (query['device_id']) {
            userQueryList.push('id = ' + mysql.escape(query['device_id']));
        }

        if (userQueryList.length != 0) {
            return 'WHERE ' + userQueryList.join(' AND ');
        }
        return '';
    },

    parseMeasurementQuery: function(query) {
        var userQueryList = [];

        if (query['device_id']) {
            userQueryList.push('device_id = ' + mysql.escape(query['device_id']));
        }
        if (query['from']) {
            userQueryList.push("time >= FROM_UNIXTIME(" + mysql.escape(query['from']) + ")");
        }
        if (query['to']) {
            userQueryList.push("time <= FROM_UNIXTIME(" + mysql.escape(query['to']) + ")");
        }

        if (userQueryList.length != 0) {
            return 'WHERE ' + userQueryList.join(' AND ');
        }
        return '';
    },

    query: function (query, cb) {
        connection.query(query, function (err, rows) {
            if (err) throw err;
            cb(rows)
        });
    },

    addDevice: function (data) {
        var query = "INSERT INTO devices (id, description, location) VALUES (?,?,?)";
        var table = [data['id'], data['description'], data['location']];
        connection.query(query, table);
    },

    addMeasurement: function (data) {
        var query = "INSERT INTO measurements (device_id, time, count, type) VALUES (?,?,?,?)"
        var table = [data['device_id'], new Date(Date.parse(data['time'])), data['count'], data['type']]
        connection.query(query, table);
    },

    setLocation: function(id, location) {
        var query = "UPDATE devices SET location=? WHERE id=?";
        connection.query(query, [location, id]);
    },

    setVoltage: function(id, voltage) {
        var query = "UPDATE devices SET voltage=? WHERE id=?";
        connection.query(query, [voltage, id]);
    }
}
