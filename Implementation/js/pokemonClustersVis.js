

class Cluster {
    constructor(_parentElement, _statsData) {
        this.parentElement = _parentElement;
        this.statsData = _statsData;
        this.displayData = _statsData;

        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.margin = { top: 20, right: 0, bottom: 200, left: 60 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 980 - vis.margin.top - vis.margin.bottom;


        vis.diameter = 980    // d3.min([vis.height, vis.width]);
        // SVG drawing area
        vis.realSvg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        vis.svg = vis.realSvg
            .append("g")
            .attr("transform", "translate(" + vis.diameter/2 + "," + vis.diameter/2  + ")");

        vis.color = d3.scaleOrdinal()
            .domain(["pokemon", "Water", "Electric", "Ice",
                "Grass", "Normal", "Fairy", "Ground",
                "Fighting", "Dark", "Psychic", "Rock",
                "Poison", "Bug", "Steel", "Dragon",
                "Fire", "Ghost", "Flying", ""])
            .range(["#efeded","#c3f0f5", "#dbbbbb", "#08d0ea",
                "#a5ea4a", "#fcd5a7", "#80b1d3", "#858959",
                "#d79595", "#909090", "#c2e2bb", "#a6c2e2",
                "#d38da9", "#EBD58D", "#9ab1c1", "#ffed6f",
                "#f18787", "#ddb7ec", "#89e2e7", "#ffc5da"])  //

        vis.pack = d3.pack()
            .size([vis.diameter - vis.margin.top, vis.diameter - vis.margin.top])
            .padding(2);

        // add chat boxes
        vis.typed1 = new Typed(".auto-type-1", {
            strings: ["How many generations does Pokemon have?"],
            typeSpeed: 50,
            backSpeed: 150,
            loop: false
        })
        vis.typed2 = new Typed(".auto-type-2", {
            strings: ["There are eight generations."],
            typeSpeed: 50,
            backSpeed: 150,
            startDelay:7550,
            loop: false
        })
        vis.typed3 = new Typed(".auto-type-3", {
            strings: ["Wow! You guys have evolved so many generations."],
            typeSpeed: 50,
            backSpeed: 150,
            startDelay:10000,
            loop: false
        })
        vis.typed4 = new Typed(".auto-type-4", {
            strings: ["Exactly! You can click on the pokemon ball on the left to see each generation of us : )"],
            typeSpeed: 50,
            backSpeed: 150,
            startDelay:15000,
            loop: false
        })
        vis.typed5 = new Typed(".auto-type-5", {
            strings: ["The pokemons are grouped by their primary types and secondary types, how cool!"],
            typeSpeed: 50,
            backSpeed: 150,
            startDelay:23000,
            loop: false
        })



        vis.wrangleData(0);
    }





    wrangleData(gen) {
        let vis = this;

        // re-structure the stats data for drawing clusters
        vis.groupedData = d3.group(vis.statsData, d=>d.type_1, d=>d.type_2)
        vis.hierarchyData = {}
        vis.hierarchyData.name = "pokemon"
        vis.hierarchyData.children = []
        for (let [k,v] of vis.groupedData) {
            let child = {}
            child.name = k
            child.children = v
            vis.hierarchyData.children.push(child)
        }
        for (let i of vis.hierarchyData.children) {
            let ichildren = []
            for (let[k,v] of i.children) {
                let child = {}
                child.name = k
                child.children = v
                ichildren.push(child);
            }
            i.children = ichildren;
        }

        // filter the data according to generation
        if (gen!==0) {
            for (let i of vis.hierarchyData.children) {
                for (let j of i.children) {
                    for (let [idx,k] of j.children.entries()) {
                        if (+k.generation!==gen) {
                            j.children.splice(idx,idx);
                        }
                    }
                }
            }
        }




        vis.root = d3.hierarchy(vis.hierarchyData)
            .sum(function(d) {
                return d.size
            })
            .sort(function(a, b) { return b.value - a.value; });

        vis.focus = vis.root
        vis.nodes = vis.pack(vis.root).descendants()
        vis.view;

        vis.updateVis();
    }

    showDetails(d) {
        let vis = this;
        vis.selectedName = d.data.name;

        vis.pokemon = vis.displayData.filter(function (d) {
            return d.name === vis.selectedName;
        });
        d3.selectAll("#pokemon-detail-area").remove();
        vis.detailDiv = d3.select("#pokemon-details-box").append("div")
            .style("height", "500px")
            .style("width", "400px")
            .attr("id","pokemon-detail-area")
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
    }

    angleToCoordinate(vis, angle, value, padding) {
        let x = Math.cos(angle) * vis.radialScale(value);
        let y = Math.sin(angle) * vis.radialScale(value);
        return {"x": padding + x, "y": padding - y};
    }

    getPathCoordinates(vis, data_point, padding){
        let coordinates = [];
        for (let i = 0; i < features.length; i++){
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            let coor = vis.angleToCoordinate(vis, angle, data_point[0][ft_name], padding)
            coordinates.push(coor);
        }
        return coordinates;
    }

    updateVis() {
        let vis = this;

        vis.svg.selectAll(".node").remove();
        vis.svg.selectAll(".node")
            .data(vis.nodes)
            .enter()
            .append("g")
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node" : "node node--root"; })


        vis.circle = vis.svg.selectAll(".node").append("circle")
            // .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            // .style("fill", function(d) {return d.children ? vis.color(d.data.name) : "#fff";})
            .style("fill", function(d) {

                return d.children ? vis.color(d.data.name) : "transparent";
            })   //vis.color(d.depth)
            .on("click", function(event, d) {
                if (focus !== d) {
                    vis.zoom(d, event); event.stopPropagation();
                }
            });


        vis.icons = vis.svg.selectAll(".node").append("image")
            .attr("class", "pokeIcon")
            .attr("xlink:href", function(d) {

                if (!d.children) {
                    return "img/pokemonImages_basic/"+d.data.image_file;
                }
            })
            .attr("x", function(d){
                if (!d.children) {
                    return -13;
                }
               else return d.x;
            })
            .attr("y", function(d){
                if (!d.children) {
                    return -14;
                }
                else return d.y;
            })
            .attr("width", function(d){
                if (!d.children) return 2*d.r;
            })
            .attr("height", function(d){
                if (!d.children) return 2*d.r;
            })
            .on("click", function(event, d) {
                if (!d.children) {
                    console.log("click the leaf")
                    vis.showDetails(d);
                    pokeDetails.wrangleData(d);
                    // smoothScroll(document.getElementById('pokemon-details-box'))
                    // window.location("https://www.google.com");
                }
            });

        // vis.svg.selectAll(".node--leaf").on("click", function(event){
        //     return vis.showDetails(event)}
        // );

        vis.svg.selectAll(".label").remove();
        vis.text = vis.svg.selectAll(".label")
            .data(vis.nodes)
            .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", function(d) { return d.parent === vis.root ? 1 : 0; })
            .style("display", function(d) { return d.parent === vis.root ? "inline" : "none"; })
            .text(function(d) {
                if (d.data.name !== "") {
                    return d.data.name;
                }
                else {return "Others"}

            })
            .style("font-family", "DynaPuff")
            // .style("font-size", "10px");

        // vis.text.exit().remove()

        vis.node = vis.svg.selectAll("circle,text");
        vis.node2 = vis.svg.selectAll(".pokeIcon");

        vis.realSvg.style("background", "transparent")   //vis.color(-1)
            .on("click", function(event) { vis.zoom(vis.root, event); });

        vis.zoomTo([vis.root.x, vis.root.y, vis.root.r * 2 + vis.margin.top]);

    }

    zoom(d, event) {
        let vis = this;
        var focus0 = focus; focus = d;

        var transition = d3.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
                var i = d3.interpolateZoom(vis.view, [focus.x, focus.y, focus.r * 2 + vis.margin.top]);
                return function(t) { vis.zoomTo(i(t)); };
            });

        transition.selectAll(".label")
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    zoomTo(v) {
        let vis = this;

        var k = vis.diameter / v[2]; vis.view = v;
        vis.node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        vis.node2.attr("transform", function(d) { return "translate(" + (d.x - v[0]-3.5) * k + "," + (d.y - v[1]-3.5) * k + ")"; });
        vis.circle.attr("r", function(d) { return d.r * k; });
        vis.icons.attr("width", function(d){return 2*d.r*k})
            .attr("height", function(d){return 2*d.r*k});
    }

}