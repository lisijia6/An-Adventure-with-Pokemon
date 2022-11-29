class VideoGame {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        console.log("video game", this.data)

        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };
        vis.width =  900 - vis.margin.left - vis.margin.right;  //document.getElementById(vis.parentElement).getBoundingClientRect().width
        console.log("container", vis.parentElement)
        console.log("svg width", vis.width)
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
            .domain(d3.extent(vis.data, d=>d.year))
            .nice(vis.data.length);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([0, d3.max(vis.data, d=>d.unitsSold)]);

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
            .attr("class","chart-title dyna")
            .attr("transform", `translate(${vis.width/2},10)`)
            .append("text")
            .text("Units Sold Per Video Game in US")
            .style("fill","black")
            .style("text-anchor","middle");

        // add annotations
        // get the coordinate of detective pikachu
        // let hitPointX = vis.x(vis.data[21].releaseDateUS)
        // let hitPointY = vis.y(vis.data[21].boxOfficeUS)
        // const annotations = [
        //     {
        //         type: d3.annotationCalloutCircle,
        //         note: {
        //             label: "Detective Pikachu is a big hit",
        //             wrap: 150
        //         },
        //         subject: {
        //             radius: 15,
        //             // radiusPadding: 5
        //         },
        //         x: hitPointX,
        //         y: hitPointY,
        //         dx: -50,
        //         dy: 50,
        //     }
        //
        // ].map(function(d){ d.color = "#FF1493"; return d})
        //
        // const makeAnnotations = d3.annotation()
        //     .type(d3.annotationLabel)
        //     .annotations(annotations)
        //
        //
        // vis.annotationsOnPlot = vis.svg.append("g")
        //     .attr("class", "annotation-group dyna")
        //     .call(makeAnnotations);
        //
        // vis.annotationsOnPlot.style("opacity", 0.0)
        //     .transition()
        //     .duration(1500)
        //     .style("opacity", 1.0);

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
            .x(d=>vis.x(d.year))
            .y(d=>vis.y(d.unitsSold))
            .curve(d3.curveLinear);
        vis.line.datum(vis.data)
            .attr("class", "line")
            .attr("d", lineFunc)   // line stroke updated in style.css


        vis.circles = vis.svg.selectAll("circle")
        vis.circles  = vis.circles .data(vis.data)
            .enter()
            .append("circle")
            .merge(vis.circles)
        vis.circles.attr("cx", d=>vis.x(d.year))
            .attr("cy", d=>vis.y(d.unitsSold))
            .attr("r", 5)
            // .attr("stroke", "green")
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
             <div class="center text-centered dyna" style="padding-left: 25px;padding-top: 10px">$${d.unitsSold}</div>
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


        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}

