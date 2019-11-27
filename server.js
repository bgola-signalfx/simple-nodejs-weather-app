
const tracer = require('signalfx-tracing').init({
  // Optional Smart Agent or Gateway target.  Default is http://localhost:9080/v1/trace
  url: 'http://localhost:9081/v1/trace'
});

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '*****************';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null, traceID: req.sfx.traceId});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again', traceID: req.sfx.traceId});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again', traceID: req.sfx.traceId});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null, traceID: req.sfx.traceId});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
