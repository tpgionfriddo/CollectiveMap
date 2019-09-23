const { gui, webgl, assets } = require('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading
//const gltfKey = assets.queue({
//const gltfKey = assets.queue({
//    url: 'assets/models/honeycomb.gltf'
//});

module.exports = class Honeycomb extends THREE.Object3D {
    constructor () {
        super();

        // now fetch the loaded resource
       // const gltf = assets.get(gltfKey);


        this.touchTime = 0


        const PlanetTexture = new THREE.TextureLoader().load( "assets/textures/Planets/moon-4k.png" );
        const PlanetGeom = new THREE.SphereGeometry(550,32,32);
        const PlanetMat = new THREE.MeshLambertMaterial({color:PlanetTexture, map:PlanetTexture });
       // const PlanetMat = new THREE.MeshBasicMaterial({color:0x350CA5});
        this.Planet = new THREE.Mesh(PlanetGeom, PlanetMat);
        this.Planet.position.set(0,0,800);
        this.add(this.Planet);

        if (gui) { // assume it can be falsey, e.g. if we strip dat-gui out of bundlee
            // attach dat.gui stuff here as usual

        }
    }

    onAppDidUpdate (oldProps, oldState, newProps, newState) {

    }

    animateIn (opt = {}) {

        animate.fromTo(this.rotation, 2.0, {
            x: -Math.PI / 4
        }, {
            ...opt,
            x: 0,
            ease: Expo.easeOut
        });
    }

    update (dt = 0, time = 0) {

    }

    onTouchStart (ev, pos) {


        if (this.touchTime == 0){
            this.touchTime = new Date().getTime();
        }
        else {
            if (((new Date().getTime()) - this.touchTime)< 800) {
                // double click occurred
                console.log("double clicked");
                this.touchTime = 0;
                const coords = new THREE.Vector2().set(
                    pos[0] / webgl.width * 2 - 1,
                    -pos[1] / webgl.height * 2 + 1
                );
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(coords, webgl.camera);
                const hits = raycaster.intersectObject(this, true);
                let thisHit  = null;
                if(hits.length > 0){
                    console.log(this.Planet)
                    console.log(hits[0].object.position)
                    let moveTarget = hits[0].object.position
                    if (hits[0].object == this.Planet ){
                        webgl.controls.target.set(moveTarget.x, moveTarget.y, moveTarget.z);
                    }
                }
                console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');

            } else {
                // not a double click so set as a new first click
                this.touchTime = new Date().getTime();
            }
        }


    }

    onTouchMove (ev, pos) {
    }

    onTouchEnd (ev, pos) {
    }
};
