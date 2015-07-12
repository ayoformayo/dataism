

var Layout = React.createClass({
  render(){
    return (
      <div>
        <Router.RouteHandler {...this.props}/>
      </div>
    )
  }
});

module.exports = Layout;
