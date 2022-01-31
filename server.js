const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

require("dotenv").config();

const APIKEY = `${process.env.API_KEY}`;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index", { weather: null, error: null });
});

app.post("/", function (req, res) {
  let city = req.body.city_name;

  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`;

  request(url, function (err, response, body) {
    if (err) {
      res.render("index", { weather: null, error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);

      console.log(weather);

      if (weather.main == undefined) {
        res.render("index", {
          weather: null,
          error: "Error, please try again",
        });
      } else {
        let location = `${weather.name}, ${weather.sys.country}`;

        let weatherTemp = `${weather.main.temp}`,
          weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          weatherDescription = `${weather.weather[0].description}`,
          clouds = `${weather.clouds.all}`,
          visibility = `${weather.visibility}`,
          main = `${weather.weather[0].main}`,
          weatherFahrenheit;
        weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

        function roundOffToTwoDecimal(num) {
          return +(Math.round(num + "e+2") + "e-2");
        }
        weatherFahrenheit = roundOffToTwoDecimal(weatherFahrenheit);

        res.render("index", {
          weather: weather,
          location: location,
          temp: weatherTemp,
          icon: weatherIcon,
          description: weatherDescription,
          fahrenheit: weatherFahrenheit,
          clouds: clouds,
          visibility: visibility,
          main: main,
          error: null,
        });
      }
    }
  });
});

app.listen(5000, function () {
  console.log("Listening on port 5000!");
});
