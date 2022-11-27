class PokemonDetailsVis {

    constructor(parentElement, combatData, imageDir) {
        this.parentElement = parentElement;
        this.imageDir = imageDir;
        this.combatData = combatData;

        this.initVis()
    }

    initVis() {

        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        // console.log("width",document.getElementById(vis.parentElement).getBoundingClientRect().width)
        // console.log("height",document.getElementById(vis.parentElement).getBoundingClientRect().height)
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;


        // vis.wrangleData();

    }

    wrangleData(d) {
        let vis = this;

        vis.updateVis(d)
    }

    updateVis(d) {
        let vis = this;
        console.log("d", d)
        // clear for new click

        d3.select("#win-over").html("");
        d3.select("#lose-to").html("");

        // add chat boxes
        vis.chat1 = new Typed(".detail-chat-1", {
            strings: ["How strong this Pokemon is?"],
            typeSpeed: 50,
            backSpeed: 150,
            loop: false
        })
        vis.chat2 = new Typed(".detail-chat-2", {
            strings: ["Check out the Pokemon card for details, including its name, type(s), strength scores, and more!"],
            typeSpeed: 50,
            backSpeed: 150,
            loop: false
        })
        vis.chat3 = new Typed(".detail-chat-3", {
            strings: ["This is so cool! I'm also wondering how it compares with other Pokemons."],
            typeSpeed: 50,
            backSpeed: 150,
            loop: false
        })
        vis.chat4 = new Typed(".detail-chat-4", {
            strings: ["You can click on Pokemons it loses to or win over to compare them!"],
            typeSpeed: 50,
            backSpeed: 150,
            loop: false
        })

        let winBoxMarginLeft = 60,
            loseBoxMarginLeft = 180,
            boxMarginTop = 30,
            boxHeight = 260,
            boxWidth = 325;

        let pokeMarginTop = 20,
            titleHeight = 50;

        vis.winDiv = d3.select("#win-over").append("div")
            .style("width",`${boxWidth}px`)
            .style("margin-top",`${boxMarginTop}px`)
            // .style("margin-left",`${winBoxMarginLeft}px`)
            .style("height",`${boxHeight}px`)
            .style("background-color","#F6F5E1")
            .style("border-radius","25px");

        vis.loseDiv = d3.select("#lose-to")
            .style("width",`${boxWidth}px`)
            .style("margin-top",`${boxMarginTop}px`)
            .style("margin-left",`10px`)
            .style("height",`${boxHeight}px`)
            .style("background-color","#FFF0F3")
            .style("border-radius","25px");


        // add win and lose pokemons
        // find the combats that this pokemon has won
        vis.wins = vis.combatData.filter(function (t) {
            return t.Winner === d.data.name;
        });
        // find the combats that this pokemon has lost
        vis.loses = vis.combatData.filter(function (t) {
            return (t.First_pokemon === d.data.name || t.Second_pokemon === d.data.name) && t.Winner!==d.data.name;
        });

        if (vis.wins.length !== 0){
            vis.winTitle = vis.winDiv.append("div")
                .style("class","win-over-title")
                .style("height","50px");

            vis.winPokemon = vis.winDiv.append("div")
                .style("class","winner-pokemons")
                .style("height",`${boxHeight-pokeMarginTop-titleHeight}px`)
                .style("overflow","scroll")
                .style("margin-top",`${pokeMarginTop}`)
                .style("margin-left","20px");

            vis.winTitle.append("p").text("WIN OVER")
                .style("font-size","18px")
                .style("padding","20px")
                .style("margin-left","100px")
                .style("color","#5579C6");

            let winOverList = [];

            vis.wins.forEach(function (t, i) {
                let firstPoke = t.First_pokemon,
                    secondPoke = t.Second_pokemon;

                if (firstPoke!==d.data.name){
                    if (!winOverList.includes(firstPoke)){
                        winOverList.push(firstPoke)
                    }
                } else {
                    if (!winOverList.includes(secondPoke)){
                        winOverList.push(secondPoke)
                    }
                }
            })

            winOverList.forEach(function(t,i){
                vis.winPokemon.append("img")
                    .attr("src", `${vis.imageDir}${t.toLowerCase()}.png`)
                    .style("margin","10px 10px 10px 10px")
                    .attr("width", 50)
                    .on("click", function() {
                        pokemonCompareVis1.updateVis(d.data.name);
                        pokemonCompareVis2.updateVis(t.toLowerCase());
                        document.getElementById('centerDIV').style.display = 'block';
                    })
                    .on('mouseover', function (d, i) {
                        d3.select(this).style("cursor", "pointer");
                    })
                    .on('mouseout', function (d, i) {
                        d3.select(this).style("cursor", "default");
                    })
            })
        } else {
            vis.winDiv.append("div")
                .style("id","no-win-data")
                .append("p")
                .text("Sorry, there is no combat data available for this pokemon :(");
        };

        if (vis.loses.length !== 0) {
            vis.loseTitle = vis.loseDiv.append("div")
                .style("class","lose-to-title")
                .style("height","50px");

            vis.losePokemon = vis.loseDiv.append("div")
                .style("class","loser-pokemons")
                .style("height",`${boxHeight-pokeMarginTop-titleHeight}px`)
                .style("overflow","scroll")
                .style("margin-top",`${pokeMarginTop}`)
                .style("margin-left","10px");

            vis.loseTitle.append("p").text("LOSE TO")
                .style("font-size","18px")
                .style("padding","20px")
                .style("margin-left","100px")
                .style("color","#FF5349");

            let loseToList = [];

            vis.loses.forEach(function (t, i) {
                let firstPoke = t.First_pokemon,
                    secondPoke = t.Second_pokemon;

                if (firstPoke!==d.data.name){
                    if (!loseToList.includes(firstPoke)){
                        loseToList.push(firstPoke)
                    }
                } else {
                    if (!loseToList.includes(secondPoke)){
                        loseToList.push(secondPoke)
                    }
                }
            })

            loseToList.forEach(function(t,i){
                vis.losePokemon.append("img")
                    .attr("src", `${vis.imageDir}${t.toLowerCase()}.png`)
                    .style("margin","10px 10px 10px 10px")
                    .attr("width", 50)
                    .on("click", function() {
                        pokemonCompareVis1.updateVis(d.data.name);
                        pokemonCompareVis2.updateVis(t.toLowerCase());
                        document.getElementById('centerDIV').style.display = 'block';
                    })
                    .on('mouseover', function (d, i) {
                        d3.select(this).style("cursor", "pointer");
                    })
                    .on('mouseout', function (d, i) {
                        d3.select(this).style("cursor", "default");
                    })
            })
        } else {
            vis.loseDiv.append("div")
                .style("id","no-lose-data")
                .append("p")
                .text("Sorry, there is no combat data available for this pokemon :(");
        };

        const overlay = document.getElementById("overlay");





    }



}