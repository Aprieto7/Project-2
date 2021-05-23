var queryUrlStates = `https://api.covidactnow.org/v2/states.json?apiKey=${API_KEY}`
var queryUrlCounties = `https://api.covidactnow.org/v2/counties.json?apiKey=${API_KEY}`
var queryUrlCbsas = `https://api.covidactnow.org/v2/cbsas.json?apiKey=${API_KEY}`

// Create functions to make d3.json works
// Create a map object
var myMap = L.map("myMap", {
  center: [37.09, -95.71],
  zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom:6,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY_map
}).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(cases) {
  return cases / 50000;
}

// function createMarkers(response) {
//   var covid = [];

//   // Loop through the cities array and create one marker for each city object
//   for (var i = 0; i < response.length; i++) {
//     var latlong = [response[i].lat,response[i].long];
//     var markers = L.circleMarker(latlong, {
//       fillOpacity: 0.2,
//       color: "gray",
//       fillColor: "green",
//       // Adjust radius
//       radius: 10 //coordinateData[i].cases/50000
//     }).bindPopup("<h3>" + response[i].state + "</h3> <hr> <h4>Cases: " + response[i].cases + "</h4> <r> <h4>Death: " + response[i].deaths + "</h4>");
//     covid.push(markers);
//     L.layerGroup(markers);
//   }
// }

function percentage(a,b) {
  var percent = a*100/b;
  return percent
}


// Each city object contains the city's name, location and population
d3.csv("static/data/df.csv").then(
  function(coordinateData) {
  coordinateData.forEach(function(data) {
      data.lat = +data.lat;
      data.long = +data.long;
      data.cases = +data.cases;
      data.deaths = +data.deaths;
      data.population = +data.population 
  });
  console.log(coordinateData);
  // Loop through the cities array and create one marker for each city object
  for (var i = 0; i < coordinateData.length; i++) {
    var latlong = [coordinateData[i].lat,coordinateData[i].long];
    var casePer = percentage(coordinateData[i].cases,coordinateData[i].population);
    var deathPer = percentage(coordinateData[i].deaths,coordinateData[i].population)
    L.circleMarker(latlong, {
      fillOpacity: 0.2,
      color: "gray",
      fillColor: "green",
      // Adjust radius
      radius: casePer
    }).bindPopup("<h3>" + coordinateData[i].state + "</h3> <hr> <h4>Cases Percent: " + casePer.toFixed(2) + "%</h4> <r> <h4>Death Percent: " + deathPer.toFixed(2) + "%</h4>").addTo(myMap);
  }
});

// d3.json("link").then(function(response) {
//   createMarkers(response);
// });