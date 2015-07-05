var _ = require('underscore');
var PAGES = {
  liquor_licenses: {
    component: require('./liquor_maps.jsx')
  },
  sankey: {
    component: require('./sankey.jsx')
  },
  heat_map: {
    component: require('./UBHeatMap.jsx')
  }
}
var Router = require('react-router');

module.exports = React.createClass({
  mixins: [ Router.Navigation, Router.State ],

  getInitialState() {
    var slug = this.getParams().slug;
    return { slug: slug };
  },

  render(){
    var pages = _.map(PAGES, (obj, key) => {
      var Page = obj.component;
      return <Page />;
    });
    var comp = this.state.slug ? this.state.slug : 'liquor_licenses'
    var Page = PAGES[comp]['component'];
        // <PageTwo />
    return(
      <div> 
        {pages}
      </div>
    )
  }
});
// module.exports = OnePager;
