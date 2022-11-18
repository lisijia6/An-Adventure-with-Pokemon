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
    d3.json("data/flare.json")
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
    // clean and sort film data
    filmData = filmData.map(function(d) {
        d.boxOfficeUS = +d.boxOfficeUS;
        d.imageID = "img/movieImages/" + d.imageID + ".jpg";
        d.releaseDateUS = dateParser(d.releaseDateUS);
        return d
    })
    filmData.sort((a,b)=>{return a.releaseDateUS - b.releaseDateUS})
    console.log("film data", filmData)
    // stack the film data for area path
    filmStackedData = []
    for (let i=0; i<filmData.length; i++) {
        ret = {}
        let d = filmData[i].boxOfficeUS;
        for (let j=0; j<i; j++) {
            d += filmData[j].boxOfficeUS;
        }
        ret.boxOfficeUS = d;
        ret.releaseDateUS = filmData[i].releaseDateUS
        filmStackedData.push(ret);
    }
    console.log("stacked", filmStackedData)

    // (3) Create event handlers
    // *** TO-DO ***

    // (4) Create visualization instances
    // *** TO-DO ***
    // Example: let countVis = new CountVis("countvis", allData);
    pokemonCompareVis1 = new PokemonComparisonVis("pokemon-comparison-1",
        "pokemon-comparison-1-img", "pokemon-comparison-1-name", pokemonStatsData, 1);
    pokemonCompareVis2 = new PokemonComparisonVis("pokemon-comparison-2",
        "pokemon-comparison-2-img",  "pokemon-comparison-2-name", pokemonStatsData,2);

    boxOffice = new BoxOffice("film-box-office", filmData, filmStackedData)

    // pokeCluster = new newCluster(data[5])
    pokeCluster = new Cluster("pokemon-clusters", data[5]);

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