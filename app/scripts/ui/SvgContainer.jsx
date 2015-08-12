
var SvgContainer = React.createClass({
  componentDidMount(){
    var containerSelected = '.default-svg-container.'+this.props.className;
    var sectionHeight = window.innerHeight;
    var sectionWidth = window.innerWidth;
    var viewBox = '0 0 ' + sectionWidth + ' ' + sectionHeight;
    d3.select(containerSelected)
                  .append('svg')
                  .attr('viewBox', viewBox)
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

    return (
      <div className={containerClass} >
        {this.props.children}
      </div>
    );
  },
});

module.exports = SvgContainer;
