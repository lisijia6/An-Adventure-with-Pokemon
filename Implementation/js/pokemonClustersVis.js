class Cluster {
    constructor(_parentElement, _data, _statsData) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.statsData = _statsData;
        // console.log("stats data", this.data)

        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;


        vis.diameter = 500    // d3.min([vis.height, vis.width]);
        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.diameter/2 + "," + vis.diameter/2  + ")");



        vis.color = d3.scaleLinear()
            .domain([-1, 7])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl);

        vis.pack = d3.pack()
            .size([vis.diameter - vis.margin.top, vis.diameter - vis.margin.top])
            .padding(2);


        vis.wrangleData();
    }





    wrangleData() {
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
        console.log("groupdata", vis.groupedData)
        console.log("hierarchyData", vis.hierarchyData)
        console.log("statsData", vis.statsData)

        vis.root = d3.hierarchy(vis.hierarchyData)
            .sum(function(d) { return d.size; })
            .sort(function(a, b) { return b.value - a.value; });

        console.log("vis.root", vis.root)

        vis.focus = vis.root
        vis.nodes = vis.pack(vis.root).descendants()
        vis.view;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.circle = vis.svg.selectAll("circle")
            .data(vis.nodes)
            .enter().append("circle")
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .style("fill", function(d) { return d.children ? vis.color(d.depth) : null; })
            .on("click", function(event, d) { if (focus !== d) vis.zoom(d, event), event.stopPropagation(); });


        vis.text = vis.svg.selectAll(".label")
            .data(vis.nodes)
            .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", function(d) { return d.parent === vis.root ? 1 : 0; })
            .style("display", function(d) { return d.parent === vis.root ? "inline" : "none"; })
            .text(function(d) { return d.data.name; })
            .style("font-family", "DynaPuff")
            // .style("font-size", "10px");

        vis.node = vis.svg.selectAll("circle,text");

        vis.svg.style("background", vis.color(-1))
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
        vis.circle.attr("r", function(d) { return d.r * k; });
    }

}