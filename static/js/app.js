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

function buildCharts(vaccination) {
    d3.json("data/covid.db").then((Data) => {
    //Point to the vaccination portion of the data file
        var vaccinations = Data.vaccinations;

        var resultArray = vaccinations.filter(vaccination => vaccination == vaccinations);
        var result = resultArray[0];

    //assign the otu_ids, sample_values, and otu_labels to variables to use in plots
        var state = result.state;   
        var vaccinationsCompleted = result.VaccinationsCompleted;
        var vaccinesDistributed = result.vaccinesDistributed.reverse();
        var vaccinesAdministered = result.vaccinessAdministered;
    

    //Create Gauge Chart 
    var data = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: vaccinationsCompleted,
        title: { text: 'Fully Vaccinated Percentage'},
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
            axis: { range: [null, 100] },
            steps: [
            { range: [0, 25], color: 'red',
                range: [25, 50], color: 'orange',
                range: [50, 75], color: 'yellow',
                range: [75, 100], color: 'green'}
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
    
    Plotly.newPlot('myGuage', data, layout);
    
    //Stacked Bar Chart

    var trace1 = {
        x: state,
        y: vaccinesAdministered,
        name: 'Vaccinations Administered',
        type: 'bar'
    };
    
    var trace2 = {
        x: state,
        y: vaccinesDistributed,
        name: 'Vaccinations Distributed',
        type: 'bar'
    };
    
    var data = [trace1, trace2];
    
    var layout = {barmode: 'stack'};
    
    Plotly.newPlot('myAreaChart', data, layout);
    })
};

function init() {  
        // call the functions to display the data and the plots to the page
        buildCharts(Data.vaccinations[0]);
};
  
init();