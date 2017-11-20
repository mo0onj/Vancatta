// modules =================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var morgan = require('morgan');
// configuration ===========================================



// CREATED BY NABEEL JAVED

// config files
var db = require('./config/db');

var port = process.env.PORT || 80; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded


//configure our app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Origgin', 'X-Requested-With,content-type, \Authorization');

    next();

});

//log all requests to the console
app.use(morgan('dev'));

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
// require('./app/routes')(app); // pass our application into our routes


//Routes for API
//===============
var apiRoutes = require('./app/routes')(app,express);

app.use('/api', apiRoutes);

// frontend routes =========================================================
// route to handle all angular requests
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// start app ===============================================
app.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app