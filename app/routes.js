var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var cors = require('cors');
var request = require("request");

module.exports = function (app, express) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes


	var apiRouter = express.Router();

	app.use(cors());

	var authCheck = jwt({
		secret: jwks.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: "https://vancatta1.eu.auth0.com/.well-known/jwks.json"
		}),
		aud: 'vancatauth',
		issuer: "https://vancatta1.eu.auth0.com/",
		algorithms: ['RS256']
	});

	
	apiRouter.route('/f/airlines')
	.get(function (req, res) {
			var options = {
					method: 'GET',
					url: 'https://api.skypicker.com/airlines',
					//            async:true,
					//            dataType: 'json',
			}
			request(options, function (error, response, body) {
					if (error) return new Error(error);
					var ret = JSON.parse(body);
					//    console.log(ret);
					res.json(ret);
			});
	})
	apiRouter.route('/user/loc')
		.get(function (req, res) {
			var options = {
				method: 'GET',
				url: 'https://freegeoip.net/json/?',
				//            async:true,
				//            dataType: 'json',
			}
			request(options, function (error, response, body) {
				if (error) return new Error(error);
				var ret = JSON.parse(body);
				//            console.log(ret);
				res.json(ret);
			});
		})
	apiRouter.route('/sear/:key')
		.get(function (req, res) {
			console.log(req.params.key);
			var options = {
				method: 'GET',
				url: 'https://locations.skypicker.com/?term=' + req.params.key + '&locale=en-US&limit=100',
				//            async:true,
				//            dataType: 'json',
			}
			request(options, function (error, response, body) {
				if (error) throw new Error(error);
				var ret = JSON.parse(body);
				//console.log(ret.locations);
				res.json(ret.locations);
			});
		})
	apiRouter.route('/flights/chk/')
		.post(function (req, res) {
			// console.log('**********************************')
			// console.log(req.body.tk);
			// console.log('**********************************')
			var options = {
				method: 'GET',
				url: 'https://api.skypicker.com/api/v0.1/check_flights?v=2&booking_token=' + req.body.tk + '&bnum=0&pnum=1&affily=otto_%7Bmarket%7D&currency=USD',
				//            async:true,
				//            dataType: 'json',
			}
			request(options, function (error, response, body) {
				if (error) return new Error(error);
				var ret = JSON.parse(body);
				// console.log(ret);
				// console.log(response);
				// console.log(body);
				res.json(ret);
			});
		})
	apiRouter.route('/flight/search/')
		.post(function (req, res, next) {
			console.log(req.body);

			var options = {
				method: 'GET',
				url: 'https://api.skypicker.com/flights?flyFrom=' + req.body.from + '&to=' + req.body.to + '&dateFrom=' + req.body.dateFrom + '&dateTo=' + req.body.dateTo + '&directFlights=' + req.body.ftype + '&partner=picky&partner_market=us&curr=PKR&locale=ae',
				//            async:true,
				//            dataType: 'json',
			}
			request(options, function (error, response, body) {
				if (error) {
					res.json(error);
					next();
					//                return;
				}
				var ret = JSON.parse(body);
				          //  console.log(body);
				res.json(ret);
			});
		})


	apiRouter.get('/public', function (req, res) {
		res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
	});

	apiRouter.get('/private', authCheck, function (req, res) {
		res.json({ message: "Hello from a private endpoint! You DO need to be authenticated to see this." });
	});




	return apiRouter;

};