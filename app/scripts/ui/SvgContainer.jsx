
var SvgContainer = React.createClass({
  componentDidMount(){
    var containerSelected = '.default-svg-container.'+this.props.className;
    d3.select(containerSelected)
                  .append('svg')
                  .attr('viewBox', '0 0 1200 700')
                  .attr('height', '100%')
                  .attr('width', '100%');
    this.props.onMount();
  },

  render(){
    var classHash = {
      'default-svg-container': true,
    };
    classHash[this.props.className]  = true;
    var containerClass = classNames(classHash);

    return <div className={containerClass} />;
  },
});

module.exports = SvgContainer;
