const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var _ = require('underscore');
var PAGES = [
  {
    name: 'liquorLicenses',
    anchor: '#liquor_licenses',
    component: require('./liquor_maps.jsx')
  },
  {
    name: 'heatMap',
    anchor: '#heat_map',
    component: require('./UBHeatMap.jsx')
  },
  {
    name: 'sankey',
    anchor: '#sankey',
    component: require('./sankey.jsx')
  }
]
var Router = require('react-router');

var OnePager = React.createClass({
  mixins: [ Router.Navigation, Router.State ],

  handleScroll(props){
    if(!this.moving){
      this.moving = true;
      var slug = this.getParams().slug || PAGES[0].name;
      var currentIndex;
      _.each(PAGES, (element, index, array) => {
        if(element.name === slug){
          currentIndex = index;
        }
      });
      var nextIndex;
      if (props.deltaY > 0 && currentIndex < PAGES.length - 1) nextIndex = currentIndex + 1;
      if (props.deltaY < 0 && currentIndex > 0) nextIndex = currentIndex - 1;
      if(_.isUndefined(nextIndex)) nextIndex = currentIndex;
      var comp = PAGES[nextIndex];
      var that = this;
      if(nextIndex !== currentIndex){
        this.transitionTo('activity-feed',   {slug: comp.name });
      }
     _.delay(() => {
        this.moving = false; 
      }, 2000);
    }
  },

  onTouchEnd(e){
  },

  onTouchStart(e){
    this.startY = e.changedTouches[0].clientY;
  },

  render(){
    var sectionHeight = window.innerHeight;
    var sectionWidth = window.innerWidth;
    var pages = _.map(PAGES, (obj, i) => {
      var key = 'page_' + i;
      var Page = obj.component;
      return (
        <section key={key} style={{height: sectionHeight, width: sectionWidth, position: "relative"}}>
          <a id={obj.name} />
          <Page ref={obj.name} />
        </section>
      )
    });
    var pageScoller = {
      height: sectionHeight,
      width: sectionWidth
    };
    var slug = this.getParams().slug || PAGES[0].name;
    var ref = this.refs[slug];
    var slug = this.getParams().slug || PAGES[0].name;
    var currentIndex;
    _.each(PAGES, (element, index, array) => {
      if(element.name === slug){
        currentIndex = index;
      };
    });
    pageScoller.bottom =  currentIndex * sectionHeight;
    return(
      <div className='pages-container' style={{height: sectionHeight, width: sectionWidth, position: "relative"}} onWheel={this.handleScroll} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}> 
       <div className='pages-scroller' style={pageScoller}> 
         {pages}
       </div>
     </div>
    )
  }
});

module.exports = OnePager;
