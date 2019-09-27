/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

const MaterialButton = require('../../components/MaterialButton/MaterialButton');
const Header = require('../../components/Header/Header');
const InfoBox = require('../../components/Info/Info');



class Landing extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
        name:"Test Asteroid",

    };




  }

    updateState(text){
      console.log("redoing")
        this.setState(text)

    }

  animateIn () {
    return Promise.all([
      this.header.animateIn({ delay: 0.25 }),
      this.button.animateIn({ delay: 0.5 }),
        this.InfoBox.animateIn({delay: 2})
    ]);
  }

  animateOut () {
    return Promise.all([
      this.header.animateOut()
    ]);
  }

  render () {
    const classes = classnames({
      'Landing': true
    });

    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <Header ref={ c => { this.header = c; } }>
          StarMap
        </Header>

          <InfoBox  ref={ c => { this.InfoBox = c; } }
                    Name = {this.state.name}
                    Coordinates = {[10000,20000,30000]}
          >
          </InfoBox>


          <MaterialButton
          onClick={() => {this.updateState({name:"Button Clicked"})}}
          ref={ c => { this.button = c; } }>
          PlaceHolder
        </MaterialButton>
      </div>
    );
  }
}

Landing.defaultProps = {
  onMaterialSwap: () => {}
};

module.exports = Landing;

