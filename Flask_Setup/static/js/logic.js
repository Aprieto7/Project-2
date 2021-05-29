var queryUrlStates = `https://api.covidactnow.org/v2/states.json?apiKey=${API_KEY}`
var queryUrlCounties = `https://api.covidactnow.org/v2/counties.json?apiKey=${API_KEY}`
var queryUrlCbsas = `https://api.covidactnow.org/v2/cbsas.json?apiKey=${API_KEY}`

// Create functions to make d3.json works
// Create a map object
var myMap = L.map("map", {
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
  return cases / 10000;
}

function percentage(a,b) {
  var percent = a*100/b;
  return percent
}

// Create colorScale() function to get the color
function colorScale(x) {
  return  x > 0.25 ? "#ff5f65" :
  x > 0.2 ? "#fca35d" :
  x > 0.15 ? "#fdb72a" :
  x > 0.1 ? "#f7db11" :
  x > 0.05 ? "#dcf400" :
  x > 0 ? "#a3f600" :
      "#FFEDA0"
};


// Each city object contains the city's name, location and population
d3.json("/stateData").then(
  function(coordinateData) {
  coordinateData.forEach(function(data) {
      data.lat = +data.lat;
      data.long = +data.long;
      data.cases = +data.cases;
      data.deaths = +data.deaths;
      data.population = parseFloat(data.population.replace(',','').replace(',',''));
      data.population = +(data.population);
      //console.log(data.population) 
  });
  console.log(coordinateData);
  // Loop through the cities array and create one marker for each city object
  for (var i = 0; i < coordinateData.length; i++) {
    var latlong = [coordinateData[i].lat,coordinateData[i].long];
    var casePer = percentage(coordinateData[i].cases,coordinateData[i].population);
    //console.log(casePer);
    var deathPer = percentage(coordinateData[i].deaths,coordinateData[i].population);
    //console.log(deathPer);
    L.circleMarker(latlong, {
      fillOpacity: 0.4,
      color: "gray",
      fillColor: colorScale(deathPer),
      // Adjust radius
      radius: casePer
    }).bindPopup("<h3>" + coordinateData[i].state + "</h3> <hr> <h4>Cases Percent: " + casePer.toFixed(2) + "%</h4> <r> <h4>Death Percent: " + deathPer.toFixed(2) + "%</h4>").addTo(myMap);
  }

  // Create legend 
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {
      var div = L.DomUtil.create('div','legend');
      var depth = [0,0.05,0.1,0.15,0.2,0.25];
      var labels = [];
          // Loop through data to push the label of each info
          for (var i=0; i < depth.length; i++){
              if (i===5) {
                  labels.push("<tr><td style = 'text-align: center; padding:3px; margin:3px; background-color:" + colorScale(depth[i]) + "'>" + depth[i] + '%+' + "</td></tr>");
              } 
              else {
                  labels.push("<tr><td style = 'text-align: center; padding:3px; margin:3px; background-color:" + colorScale(depth[i]) + "'>" + depth[i] + '% - ' + depth[i+1] + "%</td></tr>");
              }
          }
      div.innerHTML += "<table style ='background-color: white; border-radius: 4px'><th'></th>" + labels.join("") + "</table>";
      
      return div;
  };
  // Add the legend to myMap
  legend.addTo(myMap);
});
