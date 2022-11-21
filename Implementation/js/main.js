// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

// (1) Load data with promises

let promises = [
    d3.csv("data/pokemonStats_basic.csv"),
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
    let battleData = data[1]
    // let filmData = data[1]
    // let tvSeriesData = data[2]
    // let videoGamesData = data[3]
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
    let pokeDetails = new PokemonDetailsVis("pokemon-details-images", pokemonStatsData.slice(0, 12), battleData, "img/pokemonImages_basic/");
    // *** TO-DO ***
    //  pass event handler to CountVis, at constructor of CountVis above


    // (5) Bind event handler

    // *** TO-DO ***
    // eventHandler.bind("selectionChanged", function(event){ ...

}

let features = ["hp","speed","attack","sp_attack","defense","sp_defense"]
