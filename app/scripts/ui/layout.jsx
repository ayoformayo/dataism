var AppBar = mui.AppBar;
var RaisedButton = mui.RaisedButton;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

var Layout = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    console.log(ThemeManager.getCurrentTheme())
    console.log(ThemeManager.getCurrentTheme())
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount() {
    ThemeManager.setTheme(ThemeManager.types.DARK);
  },

  render(){
    var sectionHeight = window.innerHeight;
    var sectionWidth = window.innerWidth;
    return (
      <div>
        <AppBar showMenuIconButton={false} title="Visuals" style={{position: "fixed" }} className="app-bar"/>
        <section style={{height: sectionHeight, width: sectionWidth, position: "relative"}}>
          <Router.RouteHandler {...this.props}/>
        </section>
      </div>
    )
  }
});

module.exports = Layout;
