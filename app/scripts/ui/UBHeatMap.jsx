var Router = require('react-router');
var d3 = require('d3');
var topojson = require('topojson');

var UBHeatMap = React.createClass({
  mixins: [ Router.Navigation, Router.State ],

  getInitialState() {
    var slug = this.getParams().slug;
    return { slug: slug };
  },

  componentDidMount(){
    var height = $('section').height(),
    width = $('section').width();

    var svg = d3.select('.heat-map-container')
              .append('svg')
              .attr('height', height)
              .attr('width', width);
    var scale = width * 0.9
    var projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2]);
    var path = d3.geo.path()
        .projection(projection);
    d3.xhr('/maps/ub_heat_map.json', (err, success) => {
      var usBoundaries = JSON.parse(success.response);
      var subunits = topojson.feature(usBoundaries, usBoundaries.objects.units);
      var destination_count = usBoundaries.destination_count;
      console.log([destination_count.max.val, destination_count.min.val])
      var blah = d3.scale.linear()
          .domain([destination_count.max.val, destination_count.min.val])
          .range(["white", "red"]);
          // console(blah(÷200))
          // console(blah)
          var ramp=d3.scale.linear().domain([destination_count.max.val,destination_count.min.val]).range(["red","blue"]);
          console.log(ramp(4))
          


        svg.selectAll('.states')
        .data(subunits.features)
        .enter()
        .append('path')
        .attr('class', (d) => { console.log(d); return 'us-state ' + d.id })
        .style("fill", (d) => { 
          var val = destination_count[d.properties.name] ? destination_count[d.properties.name] : 0
        //   console.log(color); 
        //   console(color(val))
          return ramp(val);})
        .attr("d", path);

      svg.append("path")
          .datum(topojson.mesh(usBoundaries, usBoundaries.objects.units, (a, b) => { return a !== b ; }))
          .attr("d", path)
          .attr("class", "us_subunit-boundary");
      svg.append("path")
          .datum(topojson.mesh(usBoundaries, usBoundaries.objects.units, (a, b) => { return a === b; }))
          .attr("d", path)
          .attr("class", "my_subunit-boundary");
    });
  },


  render(){
    return (
      <div className="heat-map-container default-svg-container" ref="container" />
    )
  }
});

module.exports = UBHeatMap;
