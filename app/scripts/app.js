global.React = require('react/addons');
global._ = require('underscore');
global.$ = global.jQuery = require('jquery');
global.Router = require('react-router');
global.Reflux = require('reflux');
global.d3 = require('d3');
global.classNames = require('classnames');


var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var LiquorMap = require("./ui/liquor_maps.jsx"),
    Sankey = require("./ui/sankey.jsx"),
    mountNode = document.getElementById("app"),
    DefaultLayout = require("./ui/layout.jsx"),
    SoccerViz = require("./ui/SoccerViz.jsx"),
    OnePager = require("./ui/OnePager.jsx");

var routes = (
  <Route handler={DefaultLayout}>
    <Route name='soccer' path="/soccer" handler={SoccerViz}/>
    <Route name='activity-feed' path="/?:slug?" handler={OnePager}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root/>, document.getElementById("app"));
});
