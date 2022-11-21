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

        // vis.numPage = Math.ceil(vis.displayData.length / 12)
        // console.log("displayData",vis.displayData)
        // console.log("displayData length", vis.displayData.length)
        // console.log("numPage", vis.numPage)
        // vis.numRowFinal = 4
        //
        // if (vis.displayData.length % 12 !== 0) {
        //     vis.numRowFinal = Math.ceil(vis.displayData.length % 12 / 4)
        // }
        //
        // for (let i = 0; i < vis.numRowFinal; i++){
        //     vis.imageDiv.append("div")
        //         .attr("width","500px")
        //         .attr("class", "pokemon-details-image-row")
        //         .attr("id",`image-row-${i}`);
        // }

        vis.displayData.forEach(function (e, i) {
            // console.log("i",i)
            vis.imageDiv.append("img")
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
                    vis.selectedName = event['path'][0].id;
                    vis.pokemon = vis.displayData.filter(function (d) {
                        return d.image_name === vis.selectedName;
                    });
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

                    vis.detailDiv = d3.select("#pokemon-details-box").append("div")
                        // .style("margin-left","10px")
                        //.style("margin-top","10px")
                        .style("height", "500px")
                        .style("width", "400px")
                        .attr("id","pokemon-detail-area")
                        //.style("background-color","lightgray");

                    vis.detailDiv.append("p")
                        .style("padding","10px")
                        .style("margin-left","15px")
                        .text(vis.selectedName.toUpperCase())
                        .style("font-size","20px")
                        .attr("id","pokemon-detail-name");

                    vis.detailSvg = vis.detailDiv.append("svg")
                        .attr("width", 300)
                        .attr("height", 200)
                        .attr('transform', `translate (100, 0)`);

                    vis.radialScale = d3.scaleLinear()
                        .domain([0,150])
                        .range([0,80]);

                    vis.ticks = [30,60,90,120,150];

                    vis.ticks.forEach(t =>
                        vis.detailSvg.append("circle")
                            .attr("cx", 100)
                            .attr("cy", 100)
                            .attr("fill", "none")
                            .attr("stroke", "gray")
                            .attr("r", vis.radialScale(t))
                    );

                    vis.ticks.forEach(t =>
                        vis.detailSvg.append("text")
                            .attr("x", 105)
                            .attr("y", 100 - vis.radialScale(t))
                            .text(t.toString())
                    );
                    //console.log(vis.angleToCoordinate(vis.radialScale, 10, 10, 100))

                    for (let i = 0; i < features.length; i++) {
                        let ft_name = features[i];
                        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
                        let line_coordinate = vis.angleToCoordinate(vis,angle, 150,100);
                        let label_coordinate = vis.angleToCoordinate(vis, angle, 155, 100);

                        //draw axis line
                        vis.detailSvg.append("line")
                            .attr("x1", 100)
                            .attr("y1", 100)
                            .attr("x2", line_coordinate.x)
                            .attr("y2", line_coordinate.y)
                            .attr("stroke","black");

                        //draw axis label
                        vis.detailSvg.append("text")
                            .attr("x", label_coordinate.x-15)
                            .attr("y", label_coordinate.y-5)
                            .text(ft_name);

                        vis.line = d3.line()
                            .x(d => d.x)
                            .y(d => d.y);

                        vis.coordinates = vis.getPathCoordinates(vis, vis.pokemon, 100);

                        console.log(vis.coordinates)

                        //draw the path element
                        vis.detailSvg.append("path")
                            .datum(vis.coordinates)
                            .attr("d",vis.line)
                            .attr("stroke-width", 3)
                            .attr("stroke", "orange")
                            .attr("fill", "orange")
                            .attr("stroke-opacity", 1)
                            .attr("opacity", 0.2);

                    }

                    vis.detailTable = vis.detailDiv.append("table")
                        .attr("class","table table-striped table-sm")
                        .style("width","200px")
                        .attr("id","pokemon-detail-table")
                        .style("margin-left","100px");

                    vis.thead = vis.detailTable.append("thead");
                    vis.tbody = vis.detailTable.append("tbody");


                    for (let i = 0; i < features.length; i++) {
                        let ft_name = features[i];

                        let row = vis.tbody.append("tr")
                            .attr("class", `info-row-${i}`);

                        row.append("td")
                            .text(ft_name)
                            .attr("class", "table-header");

                        row.append("td")
                            .text(vis.pokemon[0][ft_name])
                            .attr("class", "table-content");
                    }
                });
        })
    }

    angleToCoordinate(vis, angle, value, padding) {
        let x = Math.cos(angle) * vis.radialScale(value);
        let y = Math.sin(angle) * vis.radialScale(value);
        return {"x": padding + x, "y": padding - y};
    }

    getPathCoordinates(vis, data_point, padding){
        console.log(data_point[0]["sp_attack"])
        let coordinates = [];
        for (let i = 0; i < features.length; i++){
            let ft_name = features[i];
            console.log(ft_name, data_point[0][ft_name])
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            let coor = vis.angleToCoordinate(vis, angle, data_point[0][ft_name], padding)
            console.log(coor)
            coordinates.push(coor);
        }
        console.log(coordinates)
        return coordinates;
    }

}