/*
 * PokemonGoMapVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data
 */

class PokemonGoMapVis {

    constructor(_parentElement, _parentElement2, _pokemonGoGeoData, _worldGeoData, _worldGeoCountData) {
        this.parentElement = _parentElement;
        this.parentElement2 = _parentElement2;
        this.worldGeoData = _worldGeoData;
        this.pokemonGoGeoData = _pokemonGoGeoData;
        this.pokemonGoGeoCountData = _worldGeoCountData;

        this.initVis()
    }

    initVis() {
        let vis = this;


        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 750 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'chart-title')
            .attr('id', 'map-title')
            .append('text')
            .text('Pokemon Go Sightings')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        vis.projection = d3.geoEquirectangular()
            // d3.geoEqualEarth() //geoStereographic() //geoOrthographic()
            .scale(220)
            .translate([vis.width / 2, vis.height / 2 + 30])

        vis.path = d3.geoPath()
            .projection(vis.projection);

        // Add sphere and graticule to mimic the ocean and the globe
        // vis.svg.append("path")
        //     .datum({type: "Sphere"})
        //     .attr("class", "graticule")
        //     .attr('fill', '#ADDEFF')
        //     .attr("stroke","rgba(129,129,129,0.35)")
        //     .attr("d", vis.path);

        // Add the countries
        vis.world = topojson.feature(vis.worldGeoData, vis.worldGeoData.objects.countries).features

        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path)

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');

        // Add points
        // create a point radius scale
        vis.pointScale = d3.scaleLinear()
            .domain([0, d3.max(vis.pokemonGoGeoCountData, d => d.pokemonCount)])
            .range([2, 10])

        vis.pokemonCities = vis.svg.selectAll(".pokemonCities")
            .data(vis.pokemonGoGeoCountData)
            .enter().append("circle")
            .attr("r", d => vis.pointScale(d.pokemonCount))
            .attr('cx', d => vis.projection([d.longitude, d.latitude])[0])
            .attr('cy', d => vis.projection([d.longitude, d.latitude])[1])
            .attr("fill", "#55aaff")
            .attr("stroke", "black")
            .attr('class', 'pokemonCities')
            .attr("d", vis.path)


        // init drawing area for pokemons selected
        vis.svgImg = d3.select("#" + vis.parentElement2)
        vis.tooltip2 = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapPokemonTooltip');

        // add chat boxes
        vis.typed1 = new Typed(".auto-type-10", {
            strings: ["I heard about the popular Pokemon Go game. Where can I find Pokemons around the world?"],
            typeSpeed: 50,
            backSpeed: 150,
            loop: false
        })
        vis.typed2 = new Typed(".auto-type-11", {
            strings: ["Yeah! You can find us almost anywhere around the world. New York, Chicago, and LA are " +
            "the three places that we are seen the most."],
            typeSpeed: 50,
            backSpeed: 150,
            startDelay:7550,
            loop: false
        })
        vis.typed3 = new Typed(".auto-type-12", {
            strings: ["Wonderful!"],
            typeSpeed: 50,
            backSpeed: 150,
            startDelay:10000,
            loop: false
        })
        vis.typed4 = new Typed(".auto-type-13", {
            strings: ["Have fun with the game!"],
            typeSpeed: 50,
            backSpeed: 150,
            startDelay:15000,
            loop: false
        })

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        // create random data structure with information for each land
        vis.countryInfo = {};
        vis.worldGeoData.objects.countries.geometries.forEach(d => {
            let randomCountryValue = Math.random() * 4
            vis.countryInfo[d.properties.name] = {
                name: d.properties.name,
                category: 'category_' + Math.floor(randomCountryValue)
            }
        })

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // console.log(vis.countryInfo)
        vis.countries
            .attr('fill', "#D3D3D3")
            .attr('stroke', '#656565')
        //     .attr("fill", d => {return vis.countryInfo[d.properties.name].color})

        // Append paths
        vis.pokemonCities
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', "black")
                    .attr('fill', "#d6604d")
                    // .attr('fill', d => {return vis.countryInfo[d.properties.name].color})
                let filteredData = vis.pokemonGoGeoData['nodes'].filter(function(c){ return c.city === d.city })
                let uniquePokemons = d3.map(filteredData, function(d){return d.name;})
                    .filter(function(elem, pos,arr) {
                        return arr.indexOf(elem) === pos;
                    })
                // console.log(filteredData)
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: #ECEAC3; padding: 20px">
                             <h4 class="chart-title-bold"> ${d.city}</h4>
                             <h6 class="chart-title-small"> City: ${d.city}</h6>
                             <h6 class="chart-title-small"> Continent: ${filteredData[0].continent}</h6>
                             <h6 class="chart-title-small"> Total Number of Pokemons Spotted: ${d.pokemonCount}</h6>
                             <h6 class="chart-title-small"> Unique Types Pokemons Spotted: ${uniquePokemons.length}</h6>
                         </div>`)
                    .style("background",'#BCC5F7')

                // Image
                vis.svgImg.selectAll("img").remove()
                // console.log(vis.filteredData["Image Name"])
                for (let i = 0; i < uniquePokemons.length; i++) {
                    uniquePokemons[i] = uniquePokemons[i].toLowerCase()
                }

                vis.images = vis.svgImg.selectAll("img").data(uniquePokemons)
                vis.images.enter()
                    .append("img")
                    .merge(vis.images)
                    .attr("src", d => "img/pokemonImages_basic/"+d+".png")
                    .attr("class", "map-pokemon-image")
                    .attr("width", 43)
                    .attr("x", (d,i) => 10*i)
                    .attr("y", 10)
                vis.images.exit().remove();

                vis.images = vis.svgImg.selectAll(".map-pokemon-image")
                vis.images
                    .on('mouseover', function(event, d){
                        d3.select(this)
                            .attr('stroke-width', '2px')
                            .attr('stroke', "black")
                            .attr('fill', "#d6604d")
                        // .attr('fill', d => {return vis.countryInfo[d.properties.name].color})
                        // console.log(d)
                        vis.tooltip2
                            .style("opacity", 1)
                            .style("left", event.pageX + 20 + "px")
                            .style("top", event.pageY + "px")
                            .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: #ECEAC3; padding: 20px">
                             <h4> ${d}</h4>
                         </div>`)
                            .style("background",'#BCC5F7')

                    })
                    .on('mouseout', function(event, d){
                        d3.select(this)
                            .attr('stroke-width', '1px')
                            // .attr('stroke', '#656565')
                            .attr('fill', "#55aaff")
                        // .attr("fill", d => {return vis.countryInfo[d.properties.name].color})

                        vis.tooltip2
                            .style("opacity", 0)
                            .style("left", 0)
                            .style("top", 0)
                            .html(``);
                    });
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '1px')
                    // .attr('stroke', '#656565')
                    .attr('fill', "#55aaff")
                    // .attr("fill", d => {return vis.countryInfo[d.properties.name].color})

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
    }
}