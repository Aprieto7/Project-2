var queryUrlStates = `https://api.covidactnow.org/v2/states.json?apiKey=${API_KEY}`
var queryUrlCounties = `https://api.covidactnow.org/v2/counties.json?apiKey=${API_KEY}`
var queryUrlCbsas = `https://api.covidactnow.org/v2/cbsas.json?apiKey=${API_KEY}`

// // // The code for the chart is wrapped inside a function that automatically resizes the char
// // function makeResponsive() {

// //     // Import data from the csv file
// //     d3.csv('link').then(function(data) {

// // },

// // // When the browser loads, makeResponsive() is called.
// // makeResponsive();

// // // When the browser window is resized, makeResponsive() is called.
// // d3.select(window).on('resize', makeResponsive);

// function buildCharts(vaccination) {
//     d3.json("data/covid.db").then((Data) => {
//         //Point to the vaccination portion of the data file
//         var vaccinations = Data.vaccinations;

//         var resultArray = vaccinations.filter(vaccination => vaccination == vaccinations);
//         var result = resultArray[0];

//         //assign the otu_ids, sample_values, and otu_labels to variables to use in plots
//         var states = result.state;
//         var vaccinationsCompleted = result.VaccinationsCompleted;
//         var vaccinationsDistributed = result.vaccinationsDistributed.reverse();
//         var vaccinationsAdministered = result.vaccinationsAdministered;
//         var cases = result.cases;

//         //Create Gauge Chart 
//         var data = [
//             {
//                 domain: { x: [0, 1], y: [0, 1] },
//                 value: vaccinationsCompleted,
//                 title: { text: 'Fully Vaccinated Percentage' },
//                 type: 'indicator',
//                 mode: 'gauge+number',
//                 gauge: {
//                     axis: { range: [null, 100] },
//                     steps: [
//                         {
//                             range: [0, 25], color: 'red',
//                             range: [25, 50], color: 'orange',
//                             range: [50, 75], color: 'yellow',
//                             range: [75, 100], color: 'green'
//                         }
//                     ],
//                     threshold: {
//                         line: { color: 'gold', width: 4 },
//                         thickness: 0.75,
//                         value: 99
//                     }
//                 }
//             }
//         ];

//         var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

//         Plotly.newPlot('myGuage', data, layout);

//         //Stacked Bar Chart

//         var trace1 = {
//             x: state,
//             y: vaccinationsAdministered,
//             name: 'Vaccinations Administered',
//             type: 'bar'
//         };

//         var trace2 = {
//             x: state,
//             y: vaccinationsDistributed,
//             name: 'Vaccinations Distributed',
//             type: 'bar'
//         };

//         var data = [trace1, trace2];

//         var layout = { barmode: 'stack' };

//         Plotly.newPlot('myAreaChart', data, layout);

//         // Double Line Vaccination rate and cases vs data
//         //   var trace3 = {
//         //     x: date,
//         //     y: vaccinationsAdministered,
//         //     name: 'Vaccinations Administered',
//         //     type: 'line'
//         //   };

//         //   var trace4 = {
//         //     x: date,
//         //     y: cases,
//         //     name: 'Cases',
//         //     type: 'line'
//         //   };

//         //   var data = [trace3, trace4];

//         //   var layout = {
//         //       title: "Vaccination Rate vs. Case Rate",
//         //       xaxis: { title: "date"}
//         //   };

//         //   Plotly.newPlot('myBarChart', data, layout);

        function init() {
            // call the functions to display the data and the plots to the page
            buildCharts(Data.vaccinations[0]);
        };

        init();


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

        function buildCharts(cases) {
            var vaccinations = Data.vaccinesAdministered;
            var date = Data.date
            d3.json("/historicalData").then(function (Data) {
                //Point to the vaccination portion of the data file


                Data.forEach(function (Data) {
                    var resultArray = vaccinesAdministered.filter(state => state == state);
                    var result = resultArray[0];

                    //assign the otu_ids, sample_values, and otu_labels to variables to use in plots
                    var states = result.state;
                    var vaccinesAdministered = result.vaccinesAdministered;
                    var cases = result.cases;
                    var date = result.date;
                });

                var xLinearScale = d3.scaleLinear()
                    .domain(d3.max(Data, d => d.date))
                    .range([0, width]);

                var yLinearScale1 = d3.scaleLinear()
                    .domain([0, d3.max(Data, d => d.vaccinesAdministered)])
                    .range([height, 0]);

                var yLinearScale2 = d3.scaleLinear()
                    .domain([0, d3.max(Data, d => d.cases)])
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
                    .x(d => xLinearScale(d.date))
                    .y(d => yLinearScale1(d.vaccinesAdministered));

                var line2 = d3
                    .line()
                    .x(d => xLinearScale(d.date))
                    .y(d => yLinearScale2(d.cases));


                // Append a path for line1
                chartGroup.append("#myBarChart")
                    .data([Data])
                    .attr("d", line1)
                    .attr("color", "green")

                // Append a path for line2
                chartGroup.append("myBarChart")
                    .data([Data])
                    .attr("d", line2)
                    .attr("color", "red")

            }).catch(function (error) {
                console.log(error);
            })
    }
