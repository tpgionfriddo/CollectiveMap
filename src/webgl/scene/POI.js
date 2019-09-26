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




        this.maxScale = 50
        this.minScale = 0.1


        const AsteroidTexture = new THREE.TextureLoader().load( 'assets/textures/Icons/Asteroid.svg', function(){console.log("loaded")} );
       const AsteroidMat = new THREE.SpriteMaterial({map:AsteroidTexture});
        this.Sprite = new THREE.Sprite(AsteroidMat);
        this.Sprite.position.set(0,0,0);
        this.Sprite.scale.set(100,100,100)
        this.add(this.Sprite);



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
        let amount = 10
        let scale = null;
      let distance = this.Sprite.position.distanceTo(webgl.camera.position);
        if(distance/amount >= this.maxScale){scale = this.maxScale}
        else if(distance/amount <= this.minScale){scale = this.minScale}
        else{scale = distance/amount}
        this.Sprite.scale.set(scale,scale,scale);
        console.log(scale)
       }

    onTouchStart (ev, pos) {
        const [ x, y ] = pos;
        console.log('Touchstart / mousedown: (%d, %d)', x, y);

        // For example, raycasting is easy:
        const coords = new THREE.Vector2().set(
            pos[0] / webgl.width * 2 - 1,
            -pos[1] / webgl.height * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(coords, webgl.camera);
        const hits = raycaster.intersectObject(this, true);
        let thisHit  = null;
        if(hits.length > 0){
            console.log(this.Sprite)
            console.log(hits[0].object.position)
            let moveTarget = hits[0].object.position
            if (hits[0].object == this.Sprite ){
                webgl.controls.target.set(moveTarget.x, moveTarget.y, moveTarget.z);
            }
        }
        console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');

    }

    onTouchMove (ev, pos) {
    }

    onTouchEnd (ev, pos) {
    }
};
