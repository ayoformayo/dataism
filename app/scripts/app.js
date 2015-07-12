global.React = require('react/addons');
global._ = require('underscore');
global.$ = global.jQuery = require('jquery');
global.Router = require('react-router');
global.Reflux = require('reflux');
global.d3 = require('d3');


var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var LiquorMap = require("./ui/liquor_maps.jsx"),
    Sankey = require("./ui/sankey.jsx"),
    mountNode = document.getElementById("app"),
    DefaultLayout = require("./ui/layout.jsx"),
    OnePager = require("./ui/OnePager.jsx");

var RouteHandler = Router.RouteHandler;

var Handler = React.createClass({
  render () {
    return (
      <RouteHandler/>
    )
  }
});
    // <Route path="liquor_map" handler={LiquorMap}/>
    // <Route path="sankey" handler={Sankey}/>
var routes = (
  <Route handler={DefaultLayout}>
    <Route name='activity-feed' path="/?:slug?" handler={OnePager}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root/>, document.getElementById("app"));
});

