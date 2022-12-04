

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
                "#f18787", "#ddb7ec", "#89e2e7", "rgba(255,197,218,0.83)"])  //

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


        // initialize the card with charmander
        vis.showDetails({data:{name: "Charmander", generation:"1", image_file: "charmander.png",type_1:"Fire", type_2:"",
                hp: "39",speed: "65",attack:"52",sp_attack:"60",defense:"43",sp_defense: "50", pokedex_number: 4}});

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
        console.log("card-d",d);

        d3.select("#pokemon-details-features").html("");

        vis.detailDiv = d3.select("#pokemon-details-features").append("div")
            .attr("id","#card-details")
            .style("height","850px");


        let cardMarginLeft = 0,
            cardMarginTop = 60;

        vis.cardSvg = vis.detailDiv.append("svg")
            .attr("id","card-svg-area")
            .attr("width",400)
            .attr("height",600)
            .attr("transform",`translate(${cardMarginLeft},${cardMarginTop})`);

        vis.cardSvg
            .append("image")
            .attr("class","pokemon-image-svg")
            .attr("xlink:href", "img/utils/pokemonCard.png")
            .attr("width","100%");

        vis.cardSvg
            .append("image")
            .attr("xlink:href",'img/pokemonImages_basic/'+d.data.image_file)
            .attr("class", "grow")
            .attr("x",120)
            .attr("y",100)
            .attr("width",150);

        vis.cardSvg
            .append("text")
            .text(d.data.name.toUpperCase())
            .attr("transform",`translate(${cardMarginLeft+150},${cardMarginTop-8})`)
            .attr("font-size","24px")
            .attr("fill","#00003B");

        vis.cardSvg
            .append("text")
            .text(`G${d.data.generation}`)
            .attr("transform",`translate(${cardMarginLeft+23},${cardMarginTop+10})`)
            .attr("font-size","30px")
            .attr("fill","#00003B");

        let featureValues = [];
        for (let i = 0; i < features.length; i++) {
            let ft_name = features[i];
            featureValues.push(+d.data[ft_name])
        }
        let featureMax = Math.max(...featureValues);
        console.log("featureMax",featureMax);

        let domainMax = 100;
        if (featureMax >= 100 && featureMax < 150) {
            domainMax = 150
        } else if (featureMax >= 150 && featureMax < 200) {
            domainMax = 200
        } else if (featureMax >= 200 && featureMax < 250) {
            domainMax = 250
        }

        vis.radarSvg = vis.detailDiv.append("svg")
            .attr("id","radar-svg-area")
            .attr("width", 300)
            .attr("height", 200)
            .attr('transform', `translate(${100+cardMarginLeft}, ${-280+cardMarginTop})`);

        vis.radialScale = d3.scaleLinear()
            .domain([0,domainMax])
            .range([0,80]);

        let initialValue = domainMax/5;
        vis.ticks = [];

        for (let n = initialValue; n <= domainMax; n += initialValue) {
            vis.ticks.push(n);
        }
        console.log("ticksArray",vis.ticks);

        let radarCX = 100;
        let radarCY = 100;

        vis.ticks.forEach(t =>
            vis.radarSvg.append("circle")
                .attr("cx", radarCX)
                .attr("cy", radarCY)
                .attr("fill", "none")
                .attr("stroke", "#2E5984")
                .attr("stroke-width","2px")
                .attr("opacity",0.3)
                .attr("r", vis.radialScale(t))
        );

        vis.radarRange = vis.radarSvg.append("g")
            .attr("class","radar-range-labels")
            .attr("text-anchor","middle");



        // vis.ticks.forEach(t =>
        //     vis.radarRange.append("text")
        //         .attr("x", radarCX)
        //         .attr("y", radarCY - vis.radialScale(t))
        //         .text(t.toString())
        // );

        vis.line = d3.line()
            .x(d => d.x)
            .y(d => d.y);

        vis.coordinates = vis.getPathCoordinates(vis, d.data, 100);
        console.log("coordinates",vis.coordinates)

        for (let i = 0; i < features.length; i++) {
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            let line_coordinate = vis.angleToCoordinate(vis, angle, domainMax,100);

            //let label_coordinate = vis.angleToCoordinate(vis, angle, domainMax+5, 100);

            //draw axis line
            vis.radarSvg.append("line")
                .attr("x1", 100)
                .attr("y1", 100)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("stroke","#2E5984")
                .attr("stroke-width","2px")
                .attr("opacity",0.3);

        }

        //draw the path element
        vis.radarSvg.append("path")
            .attr("id", "radar-path")
            .datum(vis.coordinates)
            .attr("d",vis.line)
            .attr("fill", "#FFD700")
            .attr("opacity", 0.6);

        vis.radarTooltips = vis.radarSvg.append("g")
            .attr("class","feature-tooltips");

        vis.featureValueLabels = vis.radarSvg.append("g")
            .attr("class","feature-values")
            .attr("text-anchor","middle")
            .attr("fill","white")
            .attr("font-size","10px");

        for (let i = 0; i < features.length; i++) {
            vis.radarTooltips.append("circle")
                .attr("cx", vis.coordinates[i].x)
                .attr("cy", vis.coordinates[i].y)
                .attr("r", 8)
                .attr("fill", "#EC9706");

            vis.featureValueLabels.append("text")
                .text(featureValues[i])
                .attr("x", vis.coordinates[i].x)
                .attr("y", vis.coordinates[i].y+3);
        }

        if (d.data.type_2 === "") {
            vis.cardSvg.append("image")
                .attr("xlink:href", `img/typeImages/${d.data.type_1.toLowerCase()}.png`)
                .attr("x",275)
                .attr("y",260)
                .attr("width",70)
        } else {
            vis.cardSvg.append("image")
                .attr("xlink:href", `img/typeImages/${d.data.type_1.toLowerCase()}.png`)
                .attr("x",275)
                .attr("y",230)
                .attr("width",70)

            vis.cardSvg.append("image")
                .attr("xlink:href", `img/typeImages/${d.data.type_2.toLowerCase()}.png`)
                .attr("x",275)
                .attr("y",260)
                .attr("width",70)
        }
        console.log("Pokemon primary type",d.data.type_1)

        vis.cardSvg.append("text")
            .text(`Pokedex No. ${d.data.pokedex_number}`)
            .attr("x",160)
            .attr("y",313)
            .attr("font-size","10px")
            .attr("fill","#012231");

        vis.tooltipSvg = vis.detailDiv.append("svg")
            .attr("id","tooltip-svg-area")
            .attr("width",400)
            .attr("height",600)
            .attr("transform",`translate(0,-740)`);

        vis.radarNames = vis.tooltipSvg.append("g")
            .attr("class","feature-names")
            .attr("text-anchor","start")
            .attr("fill","#012231");

        let radarNamesCX = [170, 275, 275, 160, 75, 30]
        let radarNamesCY = [335, 380, 470, 515, 470, 380]

        // append tooltip
        vis.tooltip = vis.detailDiv.append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');

        for (let i = 0; i < features.length; i++) {
            vis.radarNames
                .append("text")
                .attr("class","feature-name")
                .attr("id",`feature-${featureNames[i]}`)
                .text(featureNames[i])
                .attr("x",radarNamesCX[i])
                .attr("y",radarNamesCY[i])
                .attr("font-size","12px")
                .on('mouseover', function(event, d){
                    let name = d3.select(this)._groups[0][0].innerHTML;
                    //console.log("card tooltip", d3.select(this)._groups[0][0].innerHTML)
                    d3.select(this)
                        .attr("fill", "#0055B3")
                        .attr("stroke", "white")
                        .attr("font-size","13px")
                        .attr("stroke-width","0.3px");

                    let html = ""

                    if (name === "Hit Points") {
                        html = `
                         <div style="border-radius: 5px; padding: 20px; width: 200px;">
                             <h6 class="chart-title-tiny"> A value that determines how much damage a Pokémon can receive. </h6>
                         </div>`
                    }

                    if (name === "Speed") {
                        html = `
                         <div style="border-radius: 5px; padding: 20px; width: 200px;">
                             <h6 class="chart-title-tiny"> A value that determines which Pokémon will act first during battle. </h6>
                         </div>`
                    }

                    if (name === "Attack") {
                        html = `
                         <div style="border-radius: 5px; padding: 20px; width: 200px;">
                             <h6 class="chart-title-tiny"> A value that determines how much damage a Pokémon will cause to the opponent while using a physical move. </h6>
                         </div>`
                    }

                    if (name === "Special Attack") {
                        html = `
                         <div style="border-radius: 5px; padding: 20px; width: 200px;">
                             <h6 class="chart-title-tiny"> A value that determines how much damage a Pokémon can cause while using a special move. </h6>
                         </div>`
                    }

                    if (name === "Defense") {
                        html = `
                         <div style="border-radius: 5px; padding: 20px; width: 200px;">
                             <h6 class="chart-title-tiny"> A value that determines how much damage a Pokémon will resist when hit by a physical move. </h6>
                         </div>`
                    }

                    if (name === "Special Defense") {
                        html = `
                         <div style="border-radius: 5px; padding: 20px; width: 200px;">
                             <h6 class="chart-title-tiny"> A value that determines how much damage a Pokémon will resist when hit by a special move. </h6>
                         </div>`
                    }

                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX - 160 + "px")
                        .style("top", event.pageY - 160 + "px")
                        .html(html)
                        .style("background",'#012231')})

                .on('mouseout', function(event, d){
                    d3.select(this)
                        .attr('fill', "#012231")
                        .attr("stroke","none")
                        .attr("font-size","12px");

                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``);
                });
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
            let coor = vis.angleToCoordinate(vis, angle, data_point[ft_name], padding)
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