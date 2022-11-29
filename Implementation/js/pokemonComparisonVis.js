
/*
 * PokemonComparisonVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data
 */

class PokemonComparisonVis {

    constructor(_parentElement, _imgElement, _nameElement, _data, _pokemonFlag) {
        this.parentElement = _parentElement;
        this.imgElement = _imgElement;
        this.nameElement = _nameElement;
        this.data = _data;
        this.pokemonFlag = _pokemonFlag;
        // Comparison Horizontal Bar configurations: data keys and bar titles
        this.configs = [
            {key: "hp", title: "Hit Points"},
            {key: "attack", title: "Normal Attack"},
            {key: "defense", title: "Normal Defense"},
            {key: "sp_attack", title: "Special Attack"},
            {key: "sp_defense", title: "Special Defense"},
            {key: "speed", title: "Speed"}
        ];

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;
        // console.log(vis.data);

        vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };

        // SVG drawing area for Pokemon Image
        vis.widthImg = document.getElementById(vis.imgElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.heightImg = 500 - vis.margin.top - vis.margin.bottom;
        vis.svgImg = d3.select("#" + vis.imgElement);

        // SVG drawing area for Pokemon Title
        vis.widthTitle = document.getElementById(vis.nameElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.heightTitle = 500 - vis.margin.top - vis.margin.bottom;
        vis.svgTitle = d3.select("#" + vis.nameElement);

        // For Pokemon Stats
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.width = 500 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area for Pokemon Stats
        if (vis.pokemonFlag === 1) {
            vis.svg = d3.select("#" + vis.parentElement).append("svg")
                .attr("width", vis.width + vis.margin.left + vis.margin.right)
                .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + -170 + "," + vis.margin.top + ")");
        } else if (vis.pokemonFlag === 2) {
            vis.svg = d3.select("#" + vis.parentElement).append("svg")
                .attr("width", vis.width + vis.margin.left + vis.margin.right)
                .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
        }


        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleBand()
            .domain(["Hit Points", "Normal Attack", "Normal Defense",
                "Special Attack", "Special Defense", "Speed"])
            .range([0, vis.height]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        vis.filteredData = []

        vis.data.forEach((row, idx) => {
            let pokemonInfo = {
                "Name": row["name"],
                "Stats": [
                    {"key": "Hit Points", "value": +row["hp"]},
                    {"key": "Normal Attack", "value": +row["attack"]},
                    {"key": "Normal Defense", "value": +row["defense"]},
                    {"key": "Special Attack", "value": +row["sp_attack"]},
                    {"key": "Special Defense", "value": +row["sp_defense"]},
                    {"key": "Speed", "value": +row["speed"]}
                ],
                "Image Name": row["image_name"]
            }
            vis.filteredData.push(pokemonInfo);
        })

        // console.log(vis.filteredData);

        // Update the visualization
        vis.updateVis("pichu");
    }



    /*
     * The drawing function
     */

    updateVis(selectedPokemon) {
        let vis = this;

        // get data based on select box
        selectedPokemon = selectedPokemon.toLowerCase();
        selectedPokemon = selectedPokemon[0].toUpperCase() + selectedPokemon.slice(1);
        let obj;
        Object.keys(vis.filteredData).forEach(
            x => obj = vis.filteredData[x].Name === selectedPokemon ? vis.filteredData[x]: obj);
        vis.selectedData = obj


        // Image
        vis.svgImg.selectAll("img").remove()
        // console.log(vis.filteredData["Image Name"])
        vis.svgImg.append("img")
            .attr("src", "img/pokemonImages_basic/"+vis.selectedData["Image Name"]+".png")
            .attr("class", function(){
                if (vis.pokemonFlag===1){
                    return "comparison-pokemon-image-left fade-in-image compareImg";
                }
                else return "comparison-pokemon-image-right fade-in-image compareImg";

            })
            .attr("width", 150)

        // Draw Rectangles
        vis.rect = vis.svg.selectAll("rect").data(vis.selectedData["Stats"])
        vis.rect.enter()
            .append("rect")
            .merge(vis.rect)
            .transition()
            .duration(1000)
            .attr("x", d => {
                if (vis.pokemonFlag === 1) {
                    return vis.width - (d.value * 2-20)
                } else if (vis.pokemonFlag === 2) {
                    return 100
                }
            })
            .attr("y", d => vis.y(d.key))
            .attr("width", d => {
                return d.value*2;
            })
            .attr("start", 10)
            .attr("height", 30)
            .attr("fill", "#4ca3bd")
        vis.rect.exit().remove();

        // Draw Title of Bar Chart
        vis.svgTitle.selectAll('text').remove();
        vis.rectTitle = vis.svgTitle.append("text")
            .attr("class", "pokemon-comparison-title")
            .text(d => {
                if (vis.pokemonFlag === 1) {
                    return "Winner:   " + vis.selectedData["Name"];   //"\xa0".repeat(40)
                } else if (vis.pokemonFlag === 2) {
                    return "Loser:   " + vis.selectedData["Name"];   //"\xa0".repeat(70)
                }
            })
            .attr("x", 50)
            .attr("y", 0)
            // .style("font", "24px times")

        // Draw labels of the rectangles
        vis.svg.selectAll(".stats-labels").remove()
        vis.rectValueLabels = vis.svg.selectAll(".text")
            .data(vis.selectedData["Stats"])
        vis.rectValueLabels
            .enter()
            .append("text")
            .attr("x", d => {
                if (vis.pokemonFlag === 1) {
                    return vis.width - (d.value*2+10)
                } else if (vis.pokemonFlag === 2) {
                    return d.value*2+150
                }
            })
            .merge(vis.rectValueLabels)
            .transition()
            .duration(1000)
            .attr("x", d => {
                if (vis.pokemonFlag === 1) {
                    return vis.width - (d.value*2+10)
                } else if (vis.pokemonFlag === 2) {
                    return d.value*2+150
                }
            })
            .attr("y", d => vis.y(d.key)+20)
            .text(d => d.value)
            .attr("fill", "black")
            .attr("text-anchor", "end")
            // .style("font", "16px times")
            .attr("class", "stats-labels")
        vis.rectValueLabels.exit().remove();

        // Draw category labels of the rectangles
        if (vis.pokemonFlag === 2) {
            vis.svg.selectAll(".stats-category-labels").remove()
            vis.rectCategoryLabels = vis.svg.selectAll(".text")
                .data(vis.selectedData["Stats"])
            vis.rectCategoryLabels
                .enter()
                .append("text")
                .merge(vis.rectCategoryLabels)
                .attr("x", 33)
                .attr("y", d => vis.y(d.key)+20)
                .text(d => d.key)
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                // .style("font", "16px times")
                .attr("class", "stats-category-labels")
            vis.rectCategoryLabels.exit().remove();
        }

    }

}