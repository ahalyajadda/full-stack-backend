const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// 30 cities names.
const cityNames = [
  'ongole',
  'guntur',
  'kurnool',
  'chennai',
  'tamilnadu',
  'karnataka',
  'mumbai',
  'delhi',
  'bhopal',
  'jaipur',
  'hyderabad',
  'kolkata',
  'pune',
  'lucknow',
  'indore',
  'bhopal',
  'chandigarh',
  'guwahati',
  'agartala',
  'kadapa',
  'kakinada',
  'pondicherry',
  'nandyal',
  'srikakulam',
  'haryana',
  'goa',
  'kerala',
  'bihar',
  'punjab',
  'sikkim',
];

//fetching weather details from openweatherapi.
app.get('/', async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  //calculating start and end indices to show the data.
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // console.log(page, limit, startIndex, endIndex);
  const weatherApiData = [];
  const unit = 'metric';
  await Promise.all(
    cityNames.map(async (cityname) => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${process.env.API_KEY}&units=${unit}`
      );
      const json = await response.json();
      //storing our required weather data
      const temperature = json.main.temp;
      const weatherDesc = json.weather[0].description;
      const humidity = json.main.humidity;
      const sea_level = json.main.sea_level;
      const name = json.name;
      const lng = json.coord.lon;
      const lat = json.coord.lat;
      // storing weatherdetails in weatherApiData array
      weatherApiData.push({
        name,
        temperature: temperature,
        weatherDesc: weatherDesc,
        humidity: humidity,
        sea_level: sea_level,
        lng: lng,
        lat: lat,
      });
    })
  )
    .then(() => {
      const results = {};
      //calculating the next page.
      if (endIndex < weatherApiData.length) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }
      // calculating the previous page.
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }
      //extracting the paginatedresults.
      results.paginatedresults = weatherApiData.slice(startIndex, endIndex);

      res.send(results);
    })
    .catch((err) => console.log(err));
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
