

var Layout = React.createClass({
  render(){
    var sectionHeight = window.innerHeight;
    var sectionWidth = window.innerWidth;
    return (
      <div>
        <section style={{height: sectionHeight, width: sectionWidth, position: "relative"}}>
          <Router.RouteHandler {...this.props}/>
        </section>
      </div>
    )
  }
});

module.exports = Layout;
