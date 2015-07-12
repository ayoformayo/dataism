const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var _ = require('underscore');
var PAGES = [
  {
    name: 'liquor_licenses',
    anchor: '#liquor_licenses',
    component: require('./liquor_maps.jsx')
  },
  {
    name: 'heat_map',
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

  getInitialState() {
    var slug = this.getParams().slug;
    return { slug: slug, page: 0 };
  },

  moveDown(){
    if(this.state.page >= PAGES.length -1) return true;
    var pageIndex = this.state.page;
    var $this = $(this.getDOMNode());
    pageIndex++
    this.setState({page: pageIndex}, () =>{
      var index = this.state.page >= PAGES.length ? PAGES.length -1 : this.state.page;

      var anchor = PAGES[index].anchor;
      var top = $this.find(anchor).offset().top;


      $("html,body").animate(
       {
         scrollTop: top,
       }, 2000, 'easeOutExpo');
    })
    
  },

  moveUp(){
    if(this.state.page <= 0 ) return true;
    var pageIndex = this.state.page;
    var $this = $(this.getDOMNode());
    pageIndex--
    this.setState({page: pageIndex}, () =>{
      var index = this.state.page >= PAGES.length ? PAGES.length -1 : this.state.page;

      var anchor = PAGES[index].anchor;
      var top = $this.find(anchor).offset().top;
      $("html,body").animate(
       {
           scrollTop: top,
       }, 2000, 'easeOutExpo');
    })
  },

  handleScroll(props){
    if(!this.moving) {
      this.moving = true;
        if (props.deltaY > 0){
    
          this.moveDown();
        }
        if (props.deltaY < 0){
    
          this.moveUp();
        }
      _.delay(() => {
        this.moving = false; 
      }, 2000);
    }else {
      props.preventDefault();
      props.stopPropagation();
    }
  },

  onTouchEnd(e){
    // e.preventDefault();
    //   e.stopPropagation();
    // var lastY = this.startY;
    // if(!this.moving) {
    //   this.moving = true;
    //   if(lastY){
    //     if(e.changedTouches[0].clientY < lastY){
    //       this.moveDown();
    //     }else{
    //       this.moveUp()
    //     }
    //   }

    //   this.lastY = e.changedTouches[0].clientY;

    //   _.delay(() => {
    //     this.moving = false; 
    //   }, 2000);
    // }else {
    // }
      // e.preventDefault();
      // e.stopPropagation();
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

    return(
      <div className='pages-container' style={{height: sectionHeight, width: sectionWidth, position: "relative"}} onWheel={this.handleScroll} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}> 
        <ReactCSSTransitionGroup transitionName="page" transitionAppear={true}>
          {pages}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
});

module.exports = OnePager;
