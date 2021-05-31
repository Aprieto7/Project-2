var queryUrlStates = `https://api.covidactnow.org/v2/states.json?apiKey=${API_KEY}`
var queryUrlCounties = `https://api.covidactnow.org/v2/counties.json?apiKey=${API_KEY}`
var queryUrlCbsas = `https://api.covidactnow.org/v2/cbsas.json?apiKey=${API_KEY}`

var state = []

function percentage(a, b) {
  var percent = a * 100 / b;
  return percent
}

function gaugeChart(value) {
  d3.json("/stateData").then((Data) => {
    var resultArray = Data.filter(d => d.state == value);
    var result = resultArray[0];

    //assign the otu_ids, sample_values, and otu_labels to variables to use in plots
    var states = result.state;
    var vaccinationsCompleted = result.vaccinationsCompleted;
    var vaccinationsDistributed = result.vaccinesDistributed;
    var vaccinationsAdministered = result.vaccinesAdministered;
    var population = parseFloat(result.population.replace(',', '').replace(',', ''));

    var percent = percentage(vaccinationsCompleted, population)
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
    var unused = vaccinationsDistributed - vaccinationsAdministered;
    var trace1 = [{
      values: [vaccinationsAdministered, unused],
      labels: ["Vaccinations Administered", "Unused Vaccines"],
      type: 'pie'
    }];
    var layout = {
      height: 600,
      width: 600
    };

    Plotly.newPlot('myAreaChart', trace1, layout);

  })
}


function myBarChart(value) {

  var svgArea = d3.select("#myBarChart").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth - 50;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3
    .select("#myBarChart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.json("/historicalData").then((Data) => {
    var filterArray = Data.filter(d => d.state == value);
    filterArray.forEach(function (data) {
      data.date = Date.parse(data.date);
    });

    var xScale = d3.scaleTime()
      .domain(d3.extent(filterArray, d => d.date))
      .range([0, width]);

    var yLinearScale1 = d3.scaleLinear()
      .domain([0, d3.max(filterArray, d => d.vaccinesAdministered)])
      .range([height, 0]);

    var yLinearScale2 = d3.scaleLinear()
      .domain([0, d3.max(filterArray, d => d.newCases)])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%b"));
    var leftAxis = d3.axisLeft(yLinearScale1);
    var rightAxis = d3.axisRight(yLinearScale2);

    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

    // Add leftAxis to the left side of the display
    chartGroup.append("g").call(leftAxis);

    // Add rightAxis to the right side of the display
    chartGroup.append("g").attr("transform", `translate(${width}, 0)`).call(rightAxis);

    var line1 = d3
      .line()
      .x(d => xScale(d.date))
      .y(d => yLinearScale1(d.vaccinesAdministered));

    var line2 = d3
      .line()
      .x(d => xScale(d.date))
      .y(d => yLinearScale2(d.newCases));


    // Append a path for line1
    chartGroup
      .append("path")
      .data([filterArray])
      .attr("d", line1)
      .attr("fill", "none")
      .attr("stroke", "green");

    // Append a path for line2
    chartGroup
      .append("path")
      .data([filterArray])
      .attr("d", line2)
      .attr("fill", "none")
      .attr("stroke", "red");
  });
}

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
  });

  d3.json("/stateData").then((Data) => {
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

