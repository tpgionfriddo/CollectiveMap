const { gui, webgl, assets } = require('../../context');


const animate = require('@jam3/gsap-promise');



module.exports = class Lighting extends THREE.Object3D {
    constructor () {
        super();

        const AmbientLighting = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.add( AmbientLighting );
    }

    onAppDidUpdate (oldProps, oldState, newProps, newState) {

    }

    animateIn (opt = {}) {

    }

    update (dt = 0, time = 0) {

    }

    onTouchStart (ev, pos) {

    }

    onTouchMove (ev, pos) {
    }

    onTouchEnd (ev, pos) {
    }
};
