var https = require('https');
var faye = require('faye');

var HOST = 'iotchallenge30.telstra-iot.com'
var AUTH_KEY = 'SW9UQ2hhbGxlbmdlMzA6ZXZvbHV0aW9uczQ5ZWN0b3pvYW5z';

var GPS_EVENT_ID = '111';
var VOLTAGE_EVENT_ID = '103';
var COUNT_EVENT_ID = '500';

module.exports = {
	// / Poll the REST api in cumulocity for measurement data.
	getMeasurements : function(query, handler) {
		var GET_MEASUREMENTS = {
			host : HOST,
			path : '/measurement/measurements?' + query,
			headers : {
				'Authorization' : ('Basic ' + AUTH_KEY)
			}
		};

		https.get(GET_MEASUREMENTS, function(res) {
			handleResponse(res, handler)
		});
	},

	// / Poll the REST api in cumulocity for device data.
	getDevices : function(handler) {
		var GET_DEVICES = {
			host : HOST,
			path : '/inventory/managedObjects?fragmentType=c8y_IsDevice',
			headers : {
				'Authorization' : ('Basic ' + AUTH_KEY)
			}
		};

		https.get(GET_DEVICES, function(res) {
			handleResponse(res, handler)
		});
	},

	// / Poll the REST api in cumulocity for information about a specific device
	getDeviceInfo : function(deviceId, handler) {
		var GET_DEVICE = {
			host : HOST,
			path : '/inventory/managedObjects/' + deviceId,
			headers : {
				'Authorization' : ('Basic ' + AUTH_KEY)
			}
		};

		https.get(GET_DEVICE, function(res) {
			handleResponse(res, handler)
		});
	},

	connect : function() {
		var client = new faye.Client('https://' + HOST + '/cep/realtime');
		client.setHeader('Authorization', 'Basic ' + AUTH_KEY);
		client.connect();
		return client;
	},

	writeEvent : function(db, data) {
		var payload = data.c8y_ActilityUplinkRequest.payload.split(',');
		if (payload[0] == GPS_EVENT_ID) {
			var lon = payload[1];
			var lat = payload[2];
			db.setLocation(data.source.id, lon + ',' + lat);
		}
        else if (payload[0] == COUNT_EVENT_ID) {
			var countArray = payload.slice(1);
			for (var i = 0; i < countArray.length; ++i) {
				var measurement = {
					device_id : data.source.id,
					time : data.time,
					count : countArray[i],
					type : i
				};
				db.addMeasurement(measurement);
			}
		}
        else if (payload[0] == VOLTAGE_EVENT_ID) {
            db.setVoltage(data.source.id, payload[1]);
        }
        else {
			console.log("Unsupported event: " + payload[0]);
		}
	}
}

function handleResponse(res, handler) {
	var data = '';
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		data += chunk;
	});
	res.on('end', function() {
		handler(JSON.parse(data));
	});
}
