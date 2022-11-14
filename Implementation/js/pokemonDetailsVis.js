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

        vis.wrangleData();

    }

    wrangleData() {
        let vis = this;

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.numPage = Math.ceil(vis.displayData.length / 12)
        console.log("displayData",vis.displayData)
        console.log("displayData length", vis.displayData.length)
        console.log("numPage", vis.numPage)
        vis.numRowFinal = 4

        if (vis.displayData.length % 12 !== 0) {
            vis.numRowFinal = Math.ceil(vis.displayData.length % 12 / 4)
        }

        for (let i = 0; i < vis.numRowFinal; i++){
            vis.imageDiv.append("div")
                .attr("width","500px")
                .attr("class", "pokemon-details-image-row")
                .attr("id",`image-row-${i}`);
        }

        let n = 0;
        vis.displayData.forEach(function (e, i) {
            // console.log("i",i)
            d3.select(`#image-row-${n}`).append("img")
                .attr("id",e['image_name'])
                .attr("src", vis.imageDir+e['image_file'])
                .style("margin","10px 10px 10px 10px")
                .attr("width", 100)
                .attr("border-radius","50%")
                .attr("border","1px solid black")
                .on('mouseover', function (d, i) {
                    d3.select(this).style("cursor", "pointer");
                })
                .on('mouseout', function (d, i) {
                    d3.select(this).style("cursor", "default");
                })
                .on("click", function(event){
                    vis.selectedName = event['path'][0].id
                    d3.selectAll("#pokemon-detail-area").remove();
                    // d3.selectAll("#pokemon-details").remove();
                    // d3.selectAll("#pokemon-details-box").remove();

                    // vis.svg = vis.imageDiv.append("svg")
                    //     .attr("id","pokemon-details")
                    //     .attr("width", vis.width)
                    //     .attr("height", vis.height)
                    //     .attr('transform', `translate (0, ${vis.margin.top})`);
                    //
                    // vis.svg.append("rect")
                    //     .attr("id","pokemon-detail-box")
                    //     .attr("x", 10)
                    //     .attr("y", 20)
                    //     .attr("height", 300)
                    //     .attr("width", 460)
                    //     .style("fill", 'lightgray');

                    vis.detailDiv = vis.imageDiv.append("div")
                        .style("margin-left","10px")
                        .style("margin-top","20px")
                        .style("height", "300px")
                        .style("width", "460px")
                        .attr("id","pokemon-detail-area")
                        .style("background-color","lightgray");

                    vis.detailDiv.append("p")
                        .style("padding","20px")
                        .style("margin-left","15px")
                        .text(vis.selectedName.toUpperCase())
                        .style("font-size","20px")
                        .attr("id","pokemon-detail-name");

                    vis.detailTable = vis.detailDiv.append("table")
                        .attr("id","pokemon-detail-table")
                        .attr("background-color","lightgray");

                    vis.detailTable.append("thead");
                    vis.detailTable.append("tbody");


                });
            console.log("n",n)
            if ((i+1) % 4 === 0){
                n = n + 1
            }
        })
    }

}