'use strict';

const React = require('react');
const d3 = require('d3');
const topojson = require('topojson');
const SVGContainer = require('./SvgContainer.jsx');

const NicksBeers = React.createClass({
  drawMe(){},
  render(){
    d3.xhr('/nicks_drinking_problem.json', (error, success)=>{
      const beers = JSON.parse(success.response);
      const height = $('section').height(),
      width = $('section').width();
      var projection = d3.geo.mercator()
          .center([-87.62, 41.86])
          .translate([width / 1.4, height / 2.3]);
      const path = d3.geo.path().pointRadius(1)
          .projection(projection);
    });
    return <h3>HEY</h3>
  }
});

module.exports = NicksBeers;
