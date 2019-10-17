/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');
const PreactTransitionGroup = require('preact-transition-group');

// DOM Sections
const Landing = require('../sections/Landing/Landing');
const Preloader = require('../sections/Preloader/Preloader');
const InfoBox = require('../components/Info/Info');

// WebGL canvas component
const WebGLCanvas = require('../components/WebGLCanvas/WebGLCanvas');

// WebGL scenes
const Planet = require("../webgl/scene/Planet");
const Lighting = require("../webgl/scene/Lighting");

const POIS = require("../webgl/scene/Points");

const { assets, webgl } = require('../context');

class App extends BaseComponent {
  constructor (props) {
    super(props);


    this.state = {
      isLoaded: false,
      isAltMaterial: false,
      section: 'Preloader',
      object: {
        "name": "ullamco",
        "icon": "assets/textures/Icons/Asteroid.svg",
        "color": [
          0.3616,
          0.7175,
          0.7789
        ],
        "type": "Other",
        "description": "Nisi est Lorem sint minim laborum fugiat. Excepteur voluptate ut nostrud non. Laborum ea ea nisi non eiusmod et proident mollit nostrud ipsum sint ad et.",
        "position": {
          "x": -3321,
          "y": -7903,
          "z": -4621
        },
        "data":{
          "name": "ullamco",
          "icon": "assets/textures/Icons/Asteroid.svg",
          "color": [
            0.3616,
            0.7175,
            0.7789
          ],
          "type": "Other",
          "description": "Nisi est Lorem sint minim laborum fugiat. Excepteur voluptate ut nostrud non. Laborum ea ea nisi non eiusmod et proident mollit nostrud ipsum sint ad et.",
          "position": {
            "x": -3321,
            "y": -7903,
            "z": -4621
          }
        }
      }
    };
  }



  handlePreventDefault = ev => {
    this.setState({object:this.ScenePOIS.selectedPOI})
    console.log(this.state.object.data.description)
    ev.preventDefault();

  }

  componentDidUpdate (oldProps, oldState) {
    if (this.state.isLoaded && oldState.isLoaded !== this.state.isLoaded) {
      // start animation loop
      webgl.start();

      // draw a frame so that its correct on first DOM render
      webgl.draw();

      // trigger initial animation in of content
      webgl.animateIn({ delay: 0.5 });
    }

    // propagate through entire scene graph any app changes
    webgl.onAppDidUpdate(oldProps, oldState, this.props, this.state);
  }

  componentDidMount () {
    // To avoid page pulling, text highlighting and such
    webgl.canvas.addEventListener('touchstart', this.handlePreventDefault);
    webgl.canvas.addEventListener('mousedown', this.handlePreventDefault);

    this.loadWebGL();
  }

  componentWillUnmount () {
    webgl.canvas.removeEventListener('touchstart', this.handlePreventDefault);
    webgl.canvas.removeEventListener('mousedown', this.handlePreventDefault);
  }

  loadWebGL () {
    // Preload any queued assets
    assets.loadQueued(() => {
      // Do some fake delay for demo purposes
      setTimeout(() => {
        // Once loading is complete, swap to Landing section and ensure WebGL displays
        this.setState({ section: 'Landing', isLoaded: true });
      }, this.props.fakePreloadTime);

      // Add any "WebGL components" here...

      webgl.scene.add(new Planet());
      webgl.scene.add(new Lighting());
      webgl.scene.add(this.ScenePOIS = new POIS());

    });
  }

  handelMaterialSwap = () => {
    this.setState({ isAltMaterial: !this.state.isAltMaterial });
  }

  getContent (section) {
    // You are probably better off using a real "Router" for history push etc.
    // NB: Ensure there is a 'key' attribute so transition group can create animations
    switch (section) {
      case 'Preloader': return <Preloader key='Preloader' />;

      default:
      case 'Landing': return <Landing key='Landing'  selected = {this.state.object} name = {this.state.object.name}  coordinates = {[1002,20000,30000]}/>;
    }
  }

  render () {
    const classes = classnames({
      'App': true
    });

    const section = this.state.section;
    const content = this.getContent(section);

    // Render the WebGL if loaded
    // And also render the current UI section on top, with transitions
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        { this.state.isLoaded && <WebGLCanvas />}

        <PreactTransitionGroup className='content'>
          { content }

        </PreactTransitionGroup>

      </div>

    );
  }
}

App.defaultProps = {
  // Artificially inflate preload time so
  // we can see it for demo purposes
  fakePreloadTime: 0
};

module.exports = App;
