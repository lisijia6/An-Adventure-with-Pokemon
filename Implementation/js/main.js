// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

// (1) Load data with promises

let promises = [
    d3.csv("data/pokemonStats_basic.csv"),
    d3.csv("data/films.csv"),
    d3.csv("data/tvSeries.csv"),
    d3.csv("data/videoGames.csv"),
    d3.csv("data/pokemonCombats_basic.csv")
];

Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function createVis(data) {
    let pokemonStatsData = data[0]
    let filmData = data[1]
    let tvSeriesData = data[2]
    let videoGamesData = data[3]
    let battleData = data[4]
    // let pokemonGoData = data[5]

    // error, perDayData, metaData
    // if(error) { console.log(error); }
    console.log(data)

    // (2) Data Cleaning
    // *** TO-DO ***

    // (3) Create event handlers
    // *** TO-DO ***

    // (4) Create visualization instances
    // *** TO-DO ***
    // Example: let countVis = new CountVis("countvis", allData);
    pokemonCompareVis1 = new PokemonComparisonVis("pokemon-comparison-1",
        "pokemon-comparison-1-img", "pokemon-comparison-1-name", pokemonStatsData, 1);
    pokemonCompareVis2 = new PokemonComparisonVis("pokemon-comparison-2",
        "pokemon-comparison-2-img",  "pokemon-comparison-2-name", pokemonStatsData,2);

    // *** TO-DO ***
    //  pass event handler to CountVis, at constructor of CountVis above


    // (5) Bind event handler

    // *** TO-DO ***
    // eventHandler.bind("selectionChanged", function(event){ ...

}

// change comparison pokemon based on select box
function pokemonChange(value) {
    if (value === 1) {
        selectedPokemon =  document.getElementById('pokemon-comparetest-1').value;
        pokemonCompareVis1.wrangleData();
    } else {
        selectedPokemon =  document.getElementById('pokemon-comparetest-2').value;
        pokemonCompareVis2.wrangleData();
    }
}