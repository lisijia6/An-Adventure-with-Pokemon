// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%m/%d/%Y"); // d3.timeParse("%Y-%m-%d");

// (1) Load data with promises

let promises = [
    d3.csv("data/pokemonStats_basic.csv"),
    d3.csv("data/films.csv"),
    d3.csv("data/tvSeries.csv"),
    d3.csv("data/videoGames.csv"),
    d3.csv("data/pokemonCombats_basic.csv"),
    d3.json("data/pokemonGoGeoData.json"),
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"),
    d3.csv("data/pokemonGoGeoCountData.csv")
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
    let pokemonGoGeoData = data[5]
    let worldGeoData = data[6]
    let pokemonGoGeoCountData = data[7]

    // error, perDayData, metaData
    // if(error) { console.log(error); }
    console.log("all data", data)

    // (2) Data Cleaning
    // *** TO-DO ***
    // clean and sort film data
    filmData = filmData.map(function(d) {
        d.boxOfficeUS = +d.boxOfficeUS;
        d.imageID = "img/movieImages/" + d.imageID + ".jpg";
        d.releaseDateUS = dateParser(d.releaseDateUS);
        return d
    })
    filmData.sort((a,b)=>{return a.releaseDateUS - b.releaseDateUS})
    console.log("film data", filmData)

    // clean world
    pokemonGoGeoCountData = pokemonGoGeoCountData.map(function(d) {
        d.pokemonCount = +d.pokemonCount;
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        return d
    })
    console.log("pokemonGoGeoCountData", pokemonGoGeoCountData)

    // (3) Create event handlers
    // *** TO-DO ***

    // (4) Create visualization instances
    // *** TO-DO ***
    // Example: let countVis = new CountVis("countvis", allData);
    pokemonCompareVis1 = new PokemonComparisonVis("pokemon-comparison-1",
        "pokemon-comparison-1-img", "pokemon-comparison-1-name", pokemonStatsData, 1);
    pokemonCompareVis2 = new PokemonComparisonVis("pokemon-comparison-2",
        "pokemon-comparison-2-img",  "pokemon-comparison-2-name", pokemonStatsData,2);

    boxOffice = new BoxOffice("film-box-office", filmData);

    pokemonGoMapVis = new PokemonGoMapVis("pokemon-go-map", "pokemon-go-map-pokemons", pokemonGoGeoData, worldGeoData, pokemonGoGeoCountData);

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