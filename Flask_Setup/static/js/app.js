
var queryUrlStates = `https://api.covidactnow.org/v2/states.json?apiKey=${API_KEY}`
var queryUrlCounties = `https://api.covidactnow.org/v2/counties.json?apiKey=${API_KEY}`
var queryUrlCbsas = `https://api.covidactnow.org/v2/cbsas.json?apiKey=${API_KEY}`

// // The code for the chart is wrapped inside a function that automatically resizes the char
// function makeResponsive() {

//     // Import data from the csv file
//     d3.csv('link').then(function(data) {

// },

// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // When the browser window is resized, makeResponsive() is called.
// d3.select(window).on('resize', makeResponsive);

var state = []

function percentage(a,b) {
  var percent = a*100/b;
  return percent
}

function gaugeChart(value) {
  d3.json("/stateData").then ((Data) => {
    //Point to the vaccination portion of the data file
    // var vaccinations = Data.vaccinesAdministered;
    // console.log(vaccinations)
    // function(coordinateData) {
    //   coordinateData.forEach(function(data) {
    //     data.lat = +data.lat;
    //     data.long = +data.long;
    //     data.cases = +data.cases;
    //     data.deaths = +data.deaths;
    //     data.population = parseFloat(data.population.replace(',','').replace(',',''));
    //     data.population = +(data.population);
       
    //   });
    
    var resultArray = Data.filter(d => d.state == value);
    var result = resultArray[0];

    // var stateList = Data.state;
    // var dropdownMenu = d3.selectAll("#selDataset");
    // stateList.forEach(function (state) {
    //   dropdownMenu.append("option").text(state)
    //     .property("value", state)
    // });

    // myBarChart(stateList[0])
    // myAreaChart(stateList[0])
    // gaugeChart(stateList[0])
    // myMap(stateList[0])

    //assign the otu_ids, sample_values, and otu_labels to variables to use in plots
    var states = result.state;
    var vaccinationsCompleted = result.vaccinationsCompleted;
    var vaccinationsDistributed = result.vaccinesDistributed;
    var vaccinationsAdministered = result.vaccinesAdministered;
    var population = parseFloat(result.population.replace(',','').replace(',',''));
    
    var percent = percentage(vaccinationsCompleted,population)
  // var percentage
    //Create Gauge Chart 
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: percent,
        title: { text: 'Fully Vaccinated Percentage' },
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          bar: { color: "blue" },
          axis: {
            range: [null, 100],
            tickwidth: 2,
            tickmode: "linear",
            dtick: 10
          },
          steps: [
            { range: [0, 25], color: 'red' },
            { range: [25, 50], color: 'orange' },
            { range: [50, 75], color: 'yellow' },
            { range: [75, 100], color: 'green' }
          ],
          threshold: {
            line: { color: 'gold', width: 4 },
            thickness: 0.75,
            value: 99
          }
        }
      }
    ];

    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

    Plotly.newPlot('myGauge', data, layout);
  })
}
//Stacked Bar Chart

function myAreaChart(value) {
  d3.json("/stateData").then((Data) => {
    var resultArray = Data.filter(d => d.state == value);
    var result = resultArray[0];
    var state = result.state
    var vaccinationsCompleted = result.vaccinationsCompleted;
    var vaccinationsDistributed = result.vaccinesDistributed;
    var vaccinationsAdministered = result.vaccinesAdministered;
    var unused = vaccinationsDistributed-vaccinationsAdministered;
    var trace1 = [{
      values: [vaccinationsAdministered, unused],
      labels: ["Vaccinations Administered", "Unused Vaccines"],
      type: 'pie'
    }];

    // var trace2 = {
    //   x: state,
    //   y: vaccinationsDistributed,
    //   text: state,
    //   name: 'Vaccinations Distributed',
    //   type: 'bar'
    // };

  
    var layout = { 
      height: 500,
       width: 500 };

    Plotly.newPlot('myAreaChart', trace1, layout);

  })}






    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
      top: 20,
      right: 40,
      bottom: 60,
      left: 50
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Step 2: Create an SVG wrapper,
    // append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    // =================================
    var svg = d3
      .select("#myBarChart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // d3.csv("donuts.csv").then(function(donutData) { 

    function myBarChart(value) {

      d3.json("/historicalData").then((Data) => {
        var resultArray = Data.filter(d => d.state == value);
        var result = resultArray[0];
        var state = result.state
        var vaccinations = result.vaccinesAdministered;
        console.log(vaccinations)

          //assign the otu_ids, sample_values, and otu_labels to variables to use in plot
          var newCases = result.newCases;
          var date = (result.date).parse;
        

        var xLinearScale = d3.scaleLinear()
          .domain(d3.max(date))
          .range([0, width]);

        var yLinearScale1 = d3.scaleLinear()
          .domain([0, d3.max(vaccinations)])
          .range([height, 0]);

        var yLinearScale2 = d3.scaleLinear()
          .domain([0, d3.max(newCases)])
          .range([height, 0]);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale1);
        var rightAxis = d3.axisRight(yLinearScale2);

        chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

        // Add leftAxis to the left side of the display
        chartGroup.append("g").call(leftAxis);

        // Add rightAxis to the right side of the display
        chartGroup.append("g").attr("transform", `translate(${width}, 0)`).call(rightAxis);

        var line1 = d3
          .line()
          .x(d => xLinearScale(date))
          .y(d => yLinearScale1(vaccinations));

        var line2 = d3
          .line()
          .x(d => xLinearScale(date))
          .y(d => yLinearScale2(newCases));


        // Append a path for line1
        chartGroup.append("myBarChart")
          .data([Data])
          .attr("d", line1)
          .attr("color", "green")

        // Append a path for line2
        chartGroup.append("myBarChart")
          .data([Data])
          .attr("d", line2)
          .attr("color", "red")
          

      }
      )}
    
    function optionChanged(value) {
      filteredState = myStateData.filter(d => d.state == value)
      console.log(filteredState)
      // myBarChart(filteredState)
      myAreaChart(value)
      gaugeChart(value)
      myBarChart(value)


    }
    myStateData = [];

    function init() {
      // call the functions to display the data and the plots to the page
      d3.json("/historicalData").then(function (Data) {
        //Point to the vaccination portion of the data file
        myStateData = Data;
        filteredState = myStateData.filter(d => d.state == "TX")
        gaugeChart("TX");
        myBarChart("TX")
        myAreaChart("TX")
        // myMap();

      }
      );
      d3.json("/stateData").then((Data) => {
        //Point to the vaccination portion of the data file
        // var vaccinations = Data.vaccinesAdministered;
        // console.log(vaccinations)

        // var resultArray = vaccinations.filter(vaccination => vaccination == vaccinations);
        // var result = resultArray[0];
        console.log(Data)
        var stateList = Data.map(d => d.state);
        var dropdownMenu = d3.selectAll("#selDataset");
        stateList.forEach(function (state) {
          dropdownMenu.append("option").text(state)
            .property("value", state)
        });
      });
    }


    init();

