var queryUrlStates = `https://api.covidactnow.org/v2/states.json?apiKey=${API_KEY}`
var queryUrlCounties = `https://api.covidactnow.org/v2/counties.json?apiKey=${API_KEY}`
var queryUrlCbsas = `https://api.covidactnow.org/v2/cbsas.json?apiKey=${API_KEY}`

// The code for the chart is wrapped inside a function that automatically resizes the char
function makeResponsive() {

    // Import data from the csv file
    d3.csv("link").then(function(data) {
        
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);