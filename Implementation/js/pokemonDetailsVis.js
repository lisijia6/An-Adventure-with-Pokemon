class PokemonDetailsVis {

    constructor(parentElement, statData, combatData, imageDir) {
        this.parentElement = parentElement;
        this.imageDir = imageDir;
        this.statData = statData;
        this.combatData = combatData;
        this.displayData = statData;

        this.initVis()
    }

    initVis() {

        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        // console.log("width",document.getElementById(vis.parentElement).getBoundingClientRect().width)
        // console.log("height",document.getElementById(vis.parentElement).getBoundingClientRect().height)
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.imageDiv = d3.select("#" + vis.parentElement).append("div")
            .attr("id","pokemon-detail-images-all")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.winDiv = d3.select("#win-over");
        vis.loseDiv = d3.select("#lose-to");

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
        vis.imageDiv.html("");
        vis.winDiv.html("");
        vis.winDiv.append("p").text("WIN OVER:")
        vis.loseDiv.html("");
        vis.loseDiv.append("p").text("LOSE TO:")

        vis.imageDiv.append("img")
            .attr("id",d.data.name)
            .attr("src", vis.imageDir+d.data.image_file)
            .style("margin","10px 10px 10px 10px")
            .attr("width", 200)
            .attr("border-radius","50%")
            .attr("border","1px solid black")
            // .on('mouseover', function (d, i) {
            //     d3.select(this).style("cursor", "pointer");
            // })
            // .on('mouseout', function (d, i) {
            //     d3.select(this).style("cursor", "default");
            // })
        vis.imageDiv.append("p")
            .text(d.data.name.toUpperCase())
            .style("padding","10px")
            .style("margin-left","15px")
            .style("font-size","20px");
        vis.imageDiv.append("p").text("PokeDex: "+d.data.pokedex_number).style("margin-left","15px");
        // vis.imageDiv.append("p").text("Species: " + d.data.species);
        vis.imageDiv.append("p").text("Primary Type: " + d.data.type_1).style("margin-left","15px");
        vis.imageDiv.append("p").text(
            function() {
                if (d.data.type_2==="") {
                    return "Secondary Type: N/A";
                }
                else return "Secondary Type: " + d.data.type_2;
            }

        ).style("margin-left","15px");
        vis.imageDiv.append("p").text("Generation: " + d.data.generation).style("margin-left","15px");


        // add win and lose pokemons
        // find the combats that this pokemon has won
        vis.wins = vis.combatData.filter(function (t) {
            return t.Winner === d.data.name;
        });
        // find the combats that this pokemon has lost
        vis.loses = vis.combatData.filter(function (t) {
            return (t.First_pokemon === d.data.name || t.Second_pokemon === d.data.name) && t.Winner!==d.data.name;
        });


        vis.wins.forEach(function (t, i) {
            vis.winDiv.append("img")
                .attr("src", function(){
                    if (t.First_pokemon!==d.data.name) {
                        return vis.imageDir+t.First_pokemon.toLowerCase()+".png";
                    }
                    else {
                        return vis.imageDir+t.Second_pokemon.toLowerCase()+".png";
                    }

                })
                .style("margin","10px 10px 10px 10px")
                .attr("width", 50)
                .attr("border-radius","50%")
                .attr("border","1px solid black")
        })

        vis.loses.forEach(function (t, i) {
            vis.loseDiv.append("img")
                .attr("src", vis.imageDir+t.Winner.toLowerCase()+".png")
                .style("margin","10px 10px 10px 10px")
                .attr("width", 50)
                .attr("border-radius","50%")
                .attr("border","1px solid black")
        })





    }



}