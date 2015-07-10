React.initializeTouchEvents(true)
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

module.exports = React.createClass({
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
           // easing: 'easeOutQuint'
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
      console.log('easeOutQuint');
      $("html,body").animate(
       {
           scrollTop: top,
       }, 2000, 'easeOutExpo');
    })
  },

  handleMove(e){
    // console.log(e.changedTouches[0].clientY)
    // console.log(e.changedTouches[0].clientY)
    var lastY = this.lastY;
    if(!this.moving) {
      this.moving = true;
      if(lastY){
        if(e.changedTouches[0].clientY < lastY){
          this.moveDown();
          // console.log('this.moveDown()')
        }else{
          this.moveUp()
          // console.log('this.moveUp()')
        }
      }

      this.lastY = e.changedTouches[0].clientY;

      _.delay(() => {
        this.moving = false; 
      }, 2000);
    }else {

      // e.preventDefault();
      e.stopPropagation();
      
    }
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
    // var moveDown = _.delay(this.moveDown(), 1000);
  },

  render(){
    var sectionHeight = window.innerHeight;
    var sectionWidth = window.innerWidth;
    var pages = _.map(PAGES, (obj) => {
      var Page = obj.component;
      return (
        <section style={{height: sectionHeight, width: sectionWidth, position: "relative"}}>
          <a id={obj.name} />
          <Page />
        </section>
      )
    });


    return(
      <div onWheel={this.handleScroll} onTouchMove={this.handleMove}> 
        {pages}
      </div>
    )
  }
});
// module.exports = OnePager;
