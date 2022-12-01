class BoxOffice {
    constructor(_parentElement, _data, _extraData) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.digimonData = _extraData
        console.log("box office data", this.data)
        console.log("digimon box office data", this.digimonData)

        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        let maxX = d3.max([d3.max(vis.data, d=>d.releaseDateUS), d3.max(vis.digimonData, d=>d.releaseDateUS)])
        let minX = d3.min([d3.min(vis.data, d=>d.releaseDateUS), d3.min(vis.digimonData, d=>d.releaseDateUS)])
        let maxY = d3.max([d3.max(vis.data, d=>d.boxOfficeUS), d3.max(vis.digimonData, d=>d.boxOfficeUS)])
        let minY = d3.min([d3.min(vis.data, d=>d.boxOfficeUS), d3.min(vis.digimonData, d=>d.boxOfficeUS)])

        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain([minX, maxX])
            .nice(vis.data.length);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([0, maxY]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            // .tickValues(vis.data.map(d=>d.releaseDateUS))
            // .tickFormat(dateFormatter)
            // .ticks(21);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(function(d) {return '$ ' + d + "M"})

        // draw the line path
        vis.line = vis.svg.append("path");
        vis.digiLine = vis.svg.append("path");
        // draw the area path
        // vis.areaPath = vis.svg.append("path");

        // initialize tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'movieTooltip')


        // add line chart title
        vis.svg.append("g")
            .attr("class","chart-title dyna")
            .attr("transform", `translate(${vis.width/2},10)`)
            .append("text")
            .text("US Box Office Per Movie")
            .style("fill","black")
            .style("text-anchor","middle");

        // add legends
        vis.svg.append("circle")
            .attr("cx", 80)
            .attr("cy", 60)
            .attr("r", 5)
            .attr("fill", "#12B9F5")
        vis.svg.append("circle")
            .attr("cx", 80)
            .attr("cy", 90)
            .attr("r", 5)
            .attr("fill", "#ef2a45")
        vis.svg.append("text")
            .attr("x", 100)
            .attr("y", 65)
            .text("Pokemon Movie")
            .attr("class", "dyna")
        vis.svg.append("text")
            .attr("x", 100)
            .attr("y", 95)
            .text("Digimon Movie")
            .attr("class", "dyna")
        // add annotations
        // get the coordinate of detective pikachu
        let hitPointX = vis.x(vis.data[21].releaseDateUS)
        let hitPointY = vis.y(vis.data[21].boxOfficeUS)
        const annotations = [
            {
                type: d3.annotationCalloutCircle,
                note: {
                    label: "Detective Pikachu is a big hit",
                    wrap: 150
                },
                subject: {
                    radius: 15,
                    // radiusPadding: 5
                },
                x: hitPointX,
                y: hitPointY,
                dx: -50,
                dy: 50,
            }

        ].map(function(d){ d.color = "#FF1493"; return d})

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations)


        vis.annotationsOnPlot = vis.svg.append("g")
            .attr("class", "annotation-group dyna")
            .call(makeAnnotations);

        vis.annotationsOnPlot.style("opacity", 0.0)
            .transition()
            .duration(1500)
            .style("opacity", 1.0);

        // add chat boxes
        // vis.typed1 = new Typed(".auto-type-6", {
        //     strings: ["Hey, what about Pokemon movies and tv series? Is there a big collection as well?"],
        //     typeSpeed: 50,
        //     backSpeed: 150,
        //     loop: false
        // })
        // vis.typed2 = new Typed(".auto-type-7", {
        //     strings: ["Of course! We have 24 movies and 26 tv series over the last two decades. " +
        //     " Especially 'Detective Pikachu' in 2019 is such a greater hit!"],
        //     typeSpeed: 50,
        //     backSpeed: 150,
        //     startDelay:7550,
        //     loop: false
        // })
        // vis.typed3 = new Typed(".auto-type-8", {
        //     strings: ["That's amazing Charmander, how proud of you!"],
        //     typeSpeed: 50,
        //     backSpeed: 150,
        //     startDelay:18000,
        //     loop: false
        // })
        // vis.typed4 = new Typed(".auto-type-9", {
        //     strings: ["I'm flattered hhhh"],
        //     typeSpeed: 50,
        //     backSpeed: 150,
        //     startDelay:21000,
        //     loop: false
        // })

        vis.wrangleData();

    }


    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // draw d3 line chart
        let lineFunc = d3.line()
            .x(d=>vis.x(d.releaseDateUS))
            .y(d=>vis.y(d.boxOfficeUS))
            .curve(d3.curveLinear);
        vis.line.datum(vis.data)
            .attr("class", "line")
            .attr("d", lineFunc)   // line stroke updated in style.css

        vis.digiLine.datum(vis.digimonData)
            .attr("class", "digiLine")
            .attr("d", lineFunc)
        // vis.areaPath.datum(vis.stackedData)
        //     .attr("fill", "#69b3a2")
        //     .attr("fill-opacity", .3)
        //     .attr("stroke", "none")
        //     .attr("d", d3.area()
        //         .x(function(d) { return vis.x(d.releaseDateUS) })
        //         .y0(vis.height)
        //         .y1(function(d) {
        //
        //             return vis.y(d.boxOfficeUS) })
        //     )


        vis.circles = vis.svg.selectAll(".pokeCircle")
        vis.digiCircles = vis.svg.selectAll(".digiCircle")

        vis.circles  = vis.circles.data(vis.data)
            .enter()
            .append("circle")
            .attr("class", "pokeCircle")
            .merge(vis.circles)
        vis.digiCircles = vis.digiCircles.data(vis.digimonData)
            .enter()
            .append("circle")
            .attr("class", "digiCircle")
            .merge(vis.digiCircles)

        vis.circles.attr("cx", d=>vis.x(d.releaseDateUS))
            .attr("cy", d=>vis.y(d.boxOfficeUS))
            .attr("r", 5)
            .attr("fill", "#12B9F5")
            .on('mouseover', function(event, d){
                d3.select(this).attr("fill", "#F5ED12");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY - 200 + "px")
                    .html(`
         <div style="background: transparent; padding: -10px">
            
             <div class="row">
             <div class="col padding-0 imgContainer">
             <img src='img/utils/pokemon-board2.jpg' alt="box office" class="center revenue-board">
             <div class="center text-centered dyna" style="padding-left: 30px">$${d.boxOfficeUS}M</div>
             <img src=${d.imageID} alt="movie image" class="center movie-image">
             <h6 class="movie-name center dyna">${d.name}</h6>
             </div>
             </div>    
             </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this).attr("fill", "#12B9F5");
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        vis.digiCircles.attr("cx", d=>vis.x(d.releaseDateUS))
            .attr("cy", d=>vis.y(d.boxOfficeUS))
            .attr("r", 5)
            .attr("fill", "#ef2a45")
            .on('mouseover', function(event, d){
                d3.select(this).attr("fill", "#F5ED12");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY - 200 + "px")
                    .html(`
         <div style="background: transparent; padding: -10px">
            
             <div class="row">
             <div class="col padding-0 imgContainer">
             <img src='img/utils/pokemon-board2.jpg' alt="box office" class="center revenue-board">
             <div class="center text-centered dyna" style="padding-left: 50px">$${d.boxOfficeUS}M</div>
             <img src=${d.imageID} alt="movie image" class="center digi-movie-image">
             <h6 class="digi-movie-name center dyna">${d.name}</h6>
             </div>
             </div>    
             </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this).attr("fill", "#ef2a45");
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
        // .on("mouseover", vis.tipMovie.show)
        // .on("mouseout", vis.tipMovie.hide);

        // average line
        // vis.boxOfficeMean = d3.mean(vis.data.map(function(d){
        //     if (d.name==="Detective Pikachu") return 0;
        //     else return d.boxOfficeUS;
        // }));
        // vis.avgLine = vis.svg.append("g")
        // vis.avgLine.append("line")
        //     .attr("class", "avgLine")
        //     .style("stroke", "#CFD2CC")
        //     .style("stroke-width", 3)
        //     .style("stroke-dasharray", ("10,3"))
        //     .attr("x1", 0)
        //     .attr("y1", vis.y(vis.boxOfficeMean))
        //     .attr("x2", vis.width)
        //     .attr("y2", vis.y(vis.boxOfficeMean));
        //
        //
        // vis.avgLine.append("text")
        //     .attr('text-anchor', 'middle')
        //     .attr("x", 200)
        //     .attr("y", vis.y(vis.boxOfficeMean)-10)
        //     .attr("class", "linechart-annotation dyna")
        //     .text("Average Box Office except 'Detective Pikachu'")
        //     .style("fill", "gray")
        //
        // vis.avgLine.style("opacity", 0.0)
        //     .transition()
        //     .duration(1500)
        //     .style("opacity", 1);


        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}

