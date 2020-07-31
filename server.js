// This is where signalfx-tracing is initialized.
// All supported packages required() afterwards are going to be automatically instrumented.
// Refer to https://github.com/signalfx/signalfx-nodejs-tracing for details.

const tracer = require('signalfx-tracing').init({
  url: 'http://localhost:9080/v1/trace',
  service: 'sample-weather-app'
});

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const apiKey = process.env.OWM_KEY;

if (!apiKey) {
  console.log('OWM_KEY not set. Make sure to set it to a valid https://openweathermap.org/ API key.');
  process.exit(1)
}

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.set('signalfx-trace', req.sfx.traceId); // <-- pass-on the trace ID in the header field for synthetic monitoring
  next();
});

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null, traceID: req.sfx.traceId}); // <-- this is where trace ID is passed on to the view layer
});

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if (err) {
      res.render('index', {weather: null, error: 'Error, please try again', traceID: req.sfx.traceId});
    } else {
      let weather = JSON.parse(body)
      if (weather.main === undefined) {
        res.render('index', {weather: null, error: 'Error, please try again', traceID: req.sfx.traceId});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null, traceID: req.sfx.traceId});
      }
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
