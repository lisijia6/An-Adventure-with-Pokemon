
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
let featureNames = ["Hit Points","Speed","Attack","Special Attack","Defense","Special Defense"]

function closePanel() {
    document.getElementById('centerDIV').style.display = 'none';
}

/*HOVER OVER THE ZIP ZAG IMAGE AND SHOW TEXT*/
writeText("poke")
function writeText(type){
    let p = document.getElementById("compare-pokemon-digimon-text")
    if (type==="poke") {
        p.innerHTML = "<span style='font-size: 24px'>Pokémon as of 2022:</span> <br>" +
            "Movies: "+
            "<ul>" +
                "<li><span style=\"color: #12B9F5\">23</span> theatrical Pokémon movies, " +
                    "<span style=\"color: #12B9F5\">1</span> live-action movie (Detective Pikachu), " +
                "<li>Average box office per movie: <span style=\"color: #12B9F5\">USD $62.1M</span></li>" +
                "<li>'Detective Pikach' is <span style=\"color: #12B9F5\">the second highest-grossing</span> video game adaptation behind Warcraft</li>" +
            "</ul>"
            +"Video Games: "+
            "<ul>"+
                "<li><span style=\"color: #12B9F5\">20</span> 'core-series' games</li>"+
                "<li>More than <span style=\"color: #12B9F5\">440 million</span> games have been sold worldwide."+
                "The <span style=\"color: #12B9F5\">3rd best-selling</span> video franchise</li>" +
                "<li>The famous 'Pokemon GO' has <span style=\"color: #12B9F5\">1 billion</span> mobile game downloads worldwide</li>"
           +"</ul>"
    }
    else {
        p.innerHTML = "<span style='font-size: 24px'>Digimon as of 2022:</span> <br>" +
            "Movies: "+
            "<ul>" +
                "<li><span style=\"color: #ef2a45\">15</span> movies " +
                "<li>Average boc office per movie: <span style=\"color: #ef2a45\">USD $9.1M</span></li>" +
            "</ul>"
            +"Video Games: " +
            "<ul>"+
            "<li>Several video games have been developed since 1999</li>"+
            "<li><span style=\"color: #ef2a45\">None</span> is nearly as supported as Pokémon based on the units sold per game"+
            +"</ul>"
        // p.innerHTML = "To date, there have been <span style=\"color: #ef2a45\">15</span> movies released in the <span style=\"color: #ef2a45\">Digimon</span> franchise. Among those, Digital Adventure 02: Revenge of Diaboromon has the highest box office <span style=\"color: #ef2a45\">$37.6M</span>, " +
        //     "which is almost <span style=\"color: #ef2a45\">11 times</span> less compared to the highest box office of the Pokémon movies. The average box office is about <span style=\"color: #ef2a45\">$9.1M</span> which is <span style=\"color: #ef2a45\">6 times less</span> than that of the Pokémon's."
    }
    // let p1 = document.getElementById("compare-movie-text")
    // let p2 = document.getElementById("compare-game-text")
    // if (type==="poke") {
    //     p1.innerHTML = "As of 2022, there have been <span style=\"color: #12B9F5\">23</span> theatrical <span style=\"color: #12B9F5\">Pokémon</span> movies and one live-action movie, Detective Pikachu. " +
    //         "The average box office per movie is <span style=\"color: #12B9F5\">$62.1</span> million US dollars and Detective Pikachu in 2019 even made a gross of <span style=\"color: #12B9F5\">$433</span> million, " +
    //         "becoming the second highest-grossing video game film adaptation behind Warcraft. "
    //     p2.innerHTML = "On the video game side, <span style=\"color: #12B9F5\">Pokémon</span> has <span style=\"color: #12B9F5\">20</span> 'core-series' games, each was released in a new generation with different Pokémon, storylines, and characters. " +
    //         "It also has several spin-off games, the famous of which is 'Pokémon Go', which has crossed <span style=\"color: #12B9F5\">1 billion</span> mobile game downloads worldwide. " +
    //         "By 2017, more tha <span style=\"color: #12B9F5\">300 million</span> <span style=\"color: #12B9F5\">Pokémon</span> games had been sold worldwide. As of 2022, the series has sold over <span style=\"color: #12B9F5\">440 million</span> worldwide, making <span style=\"color: #12B9F5\">Pokémon</span> the 3rd best-selling video franchise, behind Mrio and Tetris. "
    // }
    // else {
    //     p1.innerHTML = "To date, there have been <span style=\"color: #ef2a45\">15</span> movies released in the <span style=\"color: #ef2a45\">Digimon</span> franchise. Among those, Digital Adventure 02: Revenge of Diaboromon has the highest box office <span style=\"color: #ef2a45\">$37.6M</span>, " +
    //         "which is almost <span style=\"color: #ef2a45\">11 times</span> less compared to the highest box office of the Pokémon movies. The average box office is about <span style=\"color: #ef2a45\">$9.1M</span> which is <span style=\"color: #ef2a45\">6 times less</span> than that of the Pokémon's."
    //     p2.innerHTML = "There have been several <span style=\"color: #ef2a45\">Digimon</span> video games developed since 1999. Common elements include battle between Digimon, with human 'Tamers' present or otherwise, and the ability to 'Digivolve' back and forth between several evolutionary forms." +
    //         "Despite sveral games have drawn comparisons to that of the Pokémon franchise, the <span style=\"color: #ef2a45\">Digimon</span> video games are <span style=\"color: #ef2a45\">not nearly as supported</span> based on the units sold per game."
    // }
}





// make the css animation happen after reach a certain page section
var scrollpos = window.scrollY; // window scroll position
var wh = window.innerHeight-50; // as soon as element touches bottom with offset event starts
var element = document.querySelector(".slide-left-to-right1"); //element

window.addEventListener('scroll', function(){
    if(scrollpos > (element.offsetTop - wh)){
        element.classList.add("onScroll");
    }
});