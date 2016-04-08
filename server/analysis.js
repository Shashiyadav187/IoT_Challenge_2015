/**
 * http://usejsdoc.org/
 */

var express = require('express');
var http = require('http');
var GoogleMapsAPI = require('googlemaps');
var router = express.Router();

var gmapConfig = {
	key : 'AIzaSyDg49XUoL5i46And9dnL5hMAjBKGbJK0yQ',
	stagger_time : 1000, // for elevationPath
	encode_polylines : false,
	secure : true, // use https
};

// middleware that is specific to this router
/*
 * router.use(function timeLog(req, res, next) { console.log('Time: ',
 * Date.now()); next(); });
 */
// define the home page route
router.get('/', function(req, res) {

	if (req.query.q) {

		var qry = 'q=' + req.query.q + '&start=' + req.query.start;
		if (req.query.end) {
			qry += "&end=" + req.query.end;
		}
		if (req.query.snt) {
			qry += "&snt=" + req.query.snt;
		}
		requestTwitterData(res, qry);
	} else if (req.query.latlng) {

		var gm = new GoogleMapsAPI(gmapConfig);
		gm.reverseGeocode({
			latlng : req.query.latlng,
			language : 'en'
		}, function(err, results) {

			// console.log(results);

			if (results.results.length == 0) {
				response.send("No data");
				return;
			}

			var qp = "";
			for (i = 1; i < Math.min(
					results.results[0].address_components.length, 3); i++) {
				qp += results.results[0].address_components[i].long_name + " ";
			}

			var qry = 'q=' + qp.trim() + '&start=' + req.query.start;
			if (req.query.end) {
				qry += "&end=" + req.query.end;
			}
			if (req.query.snt) {
				qry += "&snt=" + req.query.snt;
			}

			// console.log(qry);

			requestTwitterData(res, encodeURI(qry));
		});

		/*
		 * http.request(options, function(response) {
		 * response.setEncoding('utf8'); var data = ""; response.on('data',
		 * function(chunk) { data += chunk; }); response.on('end', function() {
		 * var dt =JSON.parse(data); var q = ""; for (i = 1; i<
		 * min(dt.results.address_components.length,3);i++){
		 * q+=dt.results.address_components[i].long_name+" "; }
		 * requestTwitterData(res,q.trim()); }); }).end();
		 */
	}

});

function requestTwitterData(res, qry) {
	var options = {
		// host : "52.34.201.208",
		host : "localhost",
		port : 8080,
		path : '/tw/api/analyze?' + qry,
		method : 'GET'
	};
	// console.log(qry);
	http.request(options, function(response) {
		response.setEncoding('utf8');
		var data = "";
		response.on('data', function(chunk) {
			data += chunk;
		});
		response.on('end', function() {
			res.send(data);
		});
	}).end();
}

module.exports = router;