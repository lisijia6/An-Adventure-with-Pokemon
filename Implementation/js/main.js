
// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%m/%d/%Y"); // d3.timeParse("%Y-%m-%d");
let dateParser2 = d3.timeParse("%Y");

// (1) Load data with promises

let promises = [
    d3.csv("data/pokemonStats_basic.csv"),
    d3.csv("data/films.csv"),
    d3.csv("data/tvSeries.csv"),
    d3.csv("data/videoGames.csv"),
    d3.csv("data/pokemonCombats_basic.csv"),
    d3.json("data/pokemonGoGeoData.json"),
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"),
    d3.csv("data/pokemonGoGeoCountData.csv"),
    d3.csv("data/digimon_films.csv"),
    d3.csv("data/digimon_videoGames.csv")
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
    let digimonFilmData = data[8]
    let digimonVideoGamesData = data[9]

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
    // clean and sort the digimon film data
    digimonFilmData = digimonFilmData.map(function(d) {
        d.boxOfficeUS = +d.boxOfficeUS;
        d.imageID = "img/movieImages/" + d.imageID + ".jpg";
        d.releaseDateUS = dateParser(d.releaseDateUS);
        return d
    })
    digimonFilmData.sort((a,b)=>{return a.releaseDateUS - b.releaseDateUS})
    // clean and sort video game data
    videoGamesData = videoGamesData.map(function(d) {
        d.unitsSold = +d.unitsSold;
        d.year = dateParser2(d.year);
        d.imageID = "img/videoGamesImages/" + d.imageID + ".jpg";
        return d;
    })
    videoGamesData.sort((a,b)=>{return a.year - b.year})
    // clean and sort digimon video game data
    digimonVideoGamesData = digimonVideoGamesData.map(function(d) {
        d.unitsSold = +d.unitsSold;
        d.year = dateParser(d.year);
        d.imageID = "img/videoGamesImages/" + d.imageID + ".jpg";
        return d;
    })
    digimonVideoGamesData.sort((a,b)=>{return a.year - b.year})


    // clean world
    pokemonGoGeoCountData = pokemonGoGeoCountData.map(function(d) {
        d.pokemonCount = +d.pokemonCount;
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        return d
    })
    console.log("pokemonGoGeoCountData", pokemonGoGeoCountData)

    pokemonCompareVis1 = new PokemonComparisonVis("pokemon-comparison-1",
        "pokemon-comparison-1-img", "pokemon-comparison-1-name", pokemonStatsData, 1);
    pokemonCompareVis2 = new PokemonComparisonVis("pokemon-comparison-2",
        "pokemon-comparison-2-img",  "pokemon-comparison-2-name", pokemonStatsData,2);

    boxOffice = new BoxOffice("film-box-office", filmData, digimonFilmData);
    videoGames = new VideoGame("video-game-revenue", videoGamesData, digimonVideoGamesData);

    pokemonGoMapVis = new PokemonGoMapVis("pokemon-go-map", "pokemon-go-map-pokemons", pokemonGoGeoData, worldGeoData, pokemonGoGeoCountData);

    // pokeCluster = new newCluster(data[5])
    pokeCluster = new Cluster("pokemon-clusters", pokemonStatsData);

    document.getElementById("genButtons").innerHTML +=
        ' <img src="img/utils/numAll.jpg" alt="All" width="54" height="53" class="bounce" onclick="pokeCluster.wrangleData(0); document.getElementById(\'genNum\').innerText=\'All\';" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">\n' +
        '            <img src="img/utils/numOne.jpg" alt="One" class="bounce" width="54" height="53" onclick="pokeCluster.wrangleData(1); document.getElementById(\'genNum\').innerText=1;" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">\n' +
        '            <img src="img/utils/numTwo.jpg" alt="Two" class="bounce" width="54" height="53" onclick="pokeCluster.wrangleData(2); document.getElementById(\'genNum\').innerText=2;" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">\n' +
        '            <img src="img/utils/numThree.jpg" alt="Three" class="bounce" width="54" height="53" onclick="pokeCluster.wrangleData(3); document.getElementById(\'genNum\').innerText=3;" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">\n' +
        '            <img src="img/utils/numFour.jpg" alt="Four" class="bounce" width="54" height="53" onclick="pokeCluster.wrangleData(4); document.getElementById(\'genNum\').innerText=4;" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">\n' +
        '            <img src="img/utils/numFive.jpg" alt="Five" class="bounce" width="54" height="53" onclick="pokeCluster.wrangleData(5); document.getElementById(\'genNum\').innerText=5;" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">\n' +
        '            <img src="img/utils/numSix.jpg" alt="Six" class="bounce" width="54" height="53" onclick="pokeCluster.wrangleData(6); document.getElementById(\'genNum\').innerText=6;" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">\n' +
        '            <img src="img/utils/numSeven.jpg" alt="Seven" class="bounce" width="54" height="53" onclick="pokeCluster.wrangleData(7); document.getElementById(\'genNum\').innerText=7;" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">\n' +
        '            <img src="img/utils/numEight.jpg" alt="Eight" class="bounce" width="54" height="53" onclick="pokeCluster.wrangleData(8); document.getElementById(\'genNum\').innerText=8;" ' +
        'onmouseover="d3.select(this).style(\'cursor\', \'pointer\');" onmouseout="d3.select(this).style(\'cursor\', \'default\');">'

    pokeDetails = new PokemonDetailsVis("pokemon-details-features", battleData, "img/pokemonImages_basic/");
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

let features = ["hp","speed","attack","sp_attack","defense","sp_defense"]
let featureNames = ["HP","Speed","Attack","Special Attack","Defense","Special Defense"]

function closePanel() {
    document.getElementById('centerDIV').style.display = 'none';
}