'use strict';

var React = require('react');
var d3 = require('d3');
var topojson = require('topojson');
var SVGContainer = require('./SvgContainer.jsx');

var LiquorMaps = React.createClass({
  drawMe(){
    var height = $('section').height(),
    width = $('section').width();
    var color = d3.scale.category20();
    var svg = d3.select('.default-svg-container.liquor-map svg')
    var scaleRatio = width < height ? 50 : 92.43;
    var scale = height * scaleRatio;

    d3.xhr('/maps/new_york.json', (error, success) => {
      var newYork;
      var projection = d3.geo.mercator()
                  .center([-73.94, 40.70])
                  .scale(scale)
                  .translate([(width) / 2, (height)/2]);
      
        var path = d3.geo.path().pointRadius(1)
            .projection(projection);

        var g = svg.append("g");

      newYork = JSON.parse(success.response);
      g.append("g")
        .attr("id", "boroughs")
        .selectAll(".state")
        .data(newYork.features)
        .enter().append("path")
        .attr("class", function(d){ return d.properties.name; })
        .attr("class", 'new-york-unit')
        .attr("d", path);
      g.append("g")
        .attr("id", "stores")
        .selectAll(".stores")
        .data(newYork.stores)
        .enter().append("path")
        .attr("id", function(d){ return d.properties.name; })
        .attr("class", 'new-york-store')
        .style("fill", (d) => { return d.color = color(d.properties.name.replace(/ .*/, ""))})
        .attr("d", path);
    });
  },

  render() {
    return (
      <SVGContainer className='liquor-map' onMount={this.drawMe}/>
    );
  }
});


module.exports = LiquorMaps;
