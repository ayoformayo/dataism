'use strict';

var React = require('react');
var d3 = require('d3');
var topojson = require('topojson');

var LiquorMaps = React.createClass({
  componentDidMount(){
    var height = $('section').height(),
    width = $('section').width();
    var color = d3.scale.category20();
    var svg = d3.select('.svg-container')
              .append('svg')
              .attr('height', height)
              .attr('width', width);
              console.log(110000 / height);
    var scale = height * 92.43697478991596

    var textField = svg.append('text')
                     .attr("x", -10 )
                     .attr("y", 0)
                     .text("ASDASDSD")
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "20px")
                     .attr("fill", "red");

    d3.xhr('http://localhost:3000/maps/new_york.json', (error, success) => {
      var newYork;
      var projection = d3.geo.mercator()
                  .center([-73.94, 40.70])
                  .scale(scale)
                  .translate([(width) / 2, (height)/2]);
      
        var path = d3.geo.path().pointRadius(1)
            .projection(projection);

        var g = svg.append("g");

      newYork = JSON.parse(success.response);
      // var stores = JSON.parse(succ.response);
        g.append("g")
          .attr("id", "stores")
          .selectAll(".stores")
          .data(newYork.stores)
          .enter().append("path")
          .attr("id", function(d){ return d.properties.name; })
          .attr("class", 'new-york-store')
          .style("fill", (d) => { return d.color = color(d.properties.name.replace(/ .*/, ""))})
          .attr("d", path);

        // path.pointRadius(1)

        g.append("g")
          .attr("id", "boroughs")
          .selectAll(".state")
          .data(newYork.features)
          .enter().append("path")
          .attr("class", function(d){ return d.properties.name; })
          .attr("class", 'new-york-unit')
          .attr("d", path);

        
        
        // g.append("g")
        // .attr('class', 'store')
        // .data(newYork.stores)
        // .enter().append("path")
        // .attr("class", function(d){ return d.properties.name; })
        // .attr("class", 'new-york-store')
        // .attr("d", path)
        // .style('stroke', 'blue');
    });
  },

  render() {
    return (
      <div className="svg-container default-svg-container" ref="container" />
    );
  }
});


module.exports = LiquorMaps;
