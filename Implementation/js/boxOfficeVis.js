class BoxOffice {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

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

        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.data, d=>d.releaseDateUS))
            .nice(vis.data.length);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([0, d3.max(vis.data, d=>d.boxOfficeUS)]);

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
        // draw the area path
        // vis.areaPath = vis.svg.append("path");

        // initialize tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'movieTooltip')

        // add line chart title
        vis.svg.append("g")
            .attr("class","linechart-title")
            .attr("transform", `translate(${vis.width/2},10)`)
            .append("text")
            .text("US Box Office Per Movie")
            .style("fill","black")
            .style("text-anchor","middle");

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

        // vis.tipMovie = d3.tip()
        //     .attr('class', 'd3-tip')
        //     .html(function(d) {return d})
        //     // .offset([-10, 0]);
        //
        // vis.tipMovie.html(function(d) {
        //     // append corresponding movie names
        //     // let movieNames = "<ul>"
        //     // for(name of Object.values(d.name)) {
        //     //     movieNames += "<li>"
        //     //     movieNames += name
        //     //     movieNames += "</li>"
        //     // }
        //     // if(movieNames == "<ul>") {
        //     //     movieNames = "None<br>";
        //     // }
        //     // else {
        //     //     movieNames += "</ul>";
        //     // }
        //
        //     return d.name;
        // })
        // vis.svg.call(vis.tipMovie);

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



        // average line
        // vis.boxOfficeMean = d3.mean(vis.data.map(function(d){return d.boxOfficeUS;}))
        // vis.avgLine = vis.svg.append("g")
        // vis.avgLine.append("line")
        //     .attr("class", "avgLine")
        //     .style("stroke", "#CFD2CC")
        //     .style("stroke-width", 3)
        //     .style("stroke-dasharray", ("10,3"))
        //     .attr("x1", 0)
        //     .attr("y1", vis.boxOfficeMean)
        //     .attr("x2", vis.width)
        //     .attr("y2", vis.boxOfficeMean);
        //
        // vis.avgLine.style("opacity", 0.0)
        //     .transition()
        //     .duration(1500)
        //     .style("opacity", 1);
        //
        // vis.avgLine.append("text")
        //     .attr('text-anchor', 'middle')
        //     .attr("x", 80)
        //     .attr("y", vis.boxOfficeMean-10)
        //     .attr("class", "linechart-annotation")
        //     .text("Average Box Office")


        vis.circles = vis.svg.selectAll("circle")
        vis.circles  = vis.circles .data(vis.data)
            .enter()
            .append("circle")
            .merge(vis.circles)
        vis.circles.attr("cx", d=>vis.x(d.releaseDateUS))
            .attr("cy", d=>vis.y(d.boxOfficeUS))
            .attr("r", 5)
            // .attr("stroke", "green")
            .attr("fill", "#12B9F5")
            // .on("click", function(event, d){
            // vis.showEdition(d);
            // vis.circles.attr("fill", "#12B9F5")
            // d3.select(this).attr("fill", "#F5ED12")
            // })
            .on('mouseover', function(event, d){
                d3.select(this).attr("fill", "#F5ED12");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY - 200 + "px")
                    .html(`
         <div style="background: transparent; padding: 10px">
            
             <div class="row">
             <div class="col padding-0 imgContainer">
             <img src='img/pokemon-board2.jpg' alt="box office" class="center revenue-board">
             <div class="center text-centered dyna">$${d.boxOfficeUS}</div>
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
        // .on("mouseover", vis.tipMovie.show)
        // .on("mouseout", vis.tipMovie.hide);


        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }

    showEdition(d) {
        let vis = this;
    }
}

