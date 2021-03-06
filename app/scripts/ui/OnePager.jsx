'use strict';
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
const Glyphicon = require('react-bootstrap').Glyphicon;
const Popover = require('react-bootstrap').Popover;
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var _ = require('underscore');
var PAGES = [
  [
    {
      displayName: 'Where to Get a Drink in NYC',
      displayText: "Check out a map of all of the Big Apple's drinking establishments",
      name: 'liquorLicenses',
      anchor: '#liquor_licenses',
      component: require('./liquor_maps.jsx')
    },
    {
      displayName: 'Interactive Language Map of Chicago',
      displayText: 'Explore the popularity of foreign languages in Chicago on a neighborhood basis.',
      name: 'chicagoLanguages',
      anchor: '#languages',
      component: require('./ChicagoLanguages.jsx')
    },
  ],
  [
    {
      displayName: 'Heat Map of UB moves',
      displayText: 'Popular Moves.',
      name: 'heatMap',
      anchor: '#heat_map',
      component: require('./UBHeatMap.jsx')
    },
    {
      displayName: 'Slack Chat Room experience',
      displayText: 'A visualization of UB Slack users and their chat room activity.',
      name: 'sankey',
      anchor: '#sankey',
      component: require('./sankey.jsx')
    }
  ],
];
var Router = require('react-router');

var OnePager = React.createClass({
  mixins: [ Router.Navigation, Router.State ],
  getInitialState(){
    return {row: 0, col: 0, direction: 'down'};
  },

  transitionViz(args){
    if(!this.moving){
      this.moving = true;
      var col = args.column;
      var row = args.row;

      switch(args.direction){
        case 'right':
          col++;
          break;
        case 'left':
          col--;
          break;
        case 'up':
          row--;
          break;
        case 'down':
          row++;
          break;
      }
      _.delay(() => {
        this.moving = false;
      }, 2000);
      if(row < 0) return;
      if(PAGES.length < row + 1) return;
      if(PAGES[row].length < col + 1) return;
      if(col < 0) return;

      var nextComp = PAGES[row][col];
      this.setState({direction: args.direction}, ()=>{
        this.transitionTo('activity-feed',   {slug: nextComp.name });
      });
    }
  },

  renderComp(args){
    var obj = PAGES[args.row][args.col];
    var Page = obj.component;
    return (
      <section key={obj.name} style={{height: '100%', width: '100%', display: 'inline-block'}}>
        <a id={obj.name} />
        <Page ref={obj.name} />
      </section>
    );
  },

  renderArrows(args){
    const colIndex = args.colIndex;
    const rowIndex = args.rowIndex;
    var arrows = [];
    if(colIndex > 0) arrows.push({direction: 'left', name: 'chevron-left'});
    if(colIndex + 1 < PAGES[rowIndex].length) arrows.push({direction: 'right', name: 'chevron-right'});
    if(rowIndex > 0) arrows.push({direction: 'up', name: 'chevron-up'});
    if(rowIndex + 1 < PAGES.length) arrows.push({direction: 'down', name: 'chevron-down'});
    var arrowIcons = _.map(arrows, (arrow)=>{
      var options = {
        direction: arrow.direction,
        column: colIndex,
        row: rowIndex
      }
      let title;
      let description;
      let placement;
      switch(arrow.direction){
        case 'up':
          placement = 'bottom';
          title = PAGES[rowIndex-1][colIndex].displayName;
          description = PAGES[rowIndex-1][colIndex].displayText;
          break;
        case 'down':
          placement = 'top';
          title = PAGES[rowIndex+1][colIndex].displayName;
          description = PAGES[rowIndex+1][colIndex].displayText;
          break;
        case 'left':
          placement = 'right';
          title = PAGES[rowIndex][colIndex-1].displayName;
          description = PAGES[rowIndex][colIndex-1].displayText;
          break;
        case 'right':
          placement = 'left';
          title = PAGES[rowIndex][colIndex+1].displayName;
          description = PAGES[rowIndex][colIndex+1].displayText;
          break;
      }
      let popover = <Popover title={title}>{description}</Popover>
      return(
        <OverlayTrigger placement={placement} overlay={popover}>
          <Glyphicon glyph={arrow.name} onClick={this.transitionViz.bind(this, options)}/>
        </OverlayTrigger>
      );
    });
    return arrowIcons;
  },

  render(){
    var sectionHeight = window.innerHeight;
    var sectionWidth = window.innerWidth;
    var pageScoller = {
      perspective: sectionHeight +'px',
      '-moz-perspective': sectionHeight +'px',
      '-webkit-perspective': sectionHeight +'px'
    };
    var direction = 'scroll-' + this.state.direction;
    var pageScollerHash = { 'pages-scroller': true };
    pageScollerHash[direction] = true;
    var pageScollerClass = classNames(pageScollerHash);
    var slug = this.getParams().slug || PAGES[0].name;
    var ref = this.refs[slug];
    var colIndex;
    var rowIndex;
    if(!this.getParams().slug){
      colIndex = 0;
      rowIndex = 0;
    }
    _.each(PAGES, (row, rowI, array) => {

      _.each(row, (element, colI) => {
        if(element.name === slug){
          colIndex = colI;
          rowIndex = rowI;
        };
      });

    });
    var arrowIcons = this.renderArrows({colIndex: colIndex, rowIndex: rowIndex});
    var page = this.renderComp({col: colIndex, row: rowIndex});

    return(
      <div className='pages-container' style={{height: '100%', width: '100%', position: "fixed"}} onWheel={this.handleScroll} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
       <div className={pageScollerClass} style={pageScoller}>
         <div className='arrow-container' style={{width: '100%', height: '100%', position: 'absolute'}}>
           {arrowIcons}
         </div>
         <ReactCSSTransitionGroup transitionName='viz'>
           {page}
         </ReactCSSTransitionGroup>
       </div>
     </div>
    )
  }
});

module.exports = OnePager;
