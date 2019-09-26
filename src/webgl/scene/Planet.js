const {
    gui,
    webgl,
    assets
} = require('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading
const PlanetTextureKey = assets.queue({
    url: 'assets/textures/Planets/moon-4k.png'
});




module.exports = class Planet extends THREE.Object3D {
    constructor() {
        super();

        // now fetch the loaded resource
        // const gltf = assets.get(gltfKey);

        this.maxScale = 1
        this.minScale = null
        this.touchTime = 0


        const PlanetTexture = new THREE.TextureLoader().load(PlanetTextureKey);
        const PlanetGeom = new THREE.SphereGeometry(550, 32, 32);
        const PlanetMat = new THREE.MeshLambertMaterial({
            color: PlanetTexture,
            map: PlanetTexture
        });
        // const PlanetMat = new THREE.MeshBasicMaterial({color:0x350CA5});
        this.Planet = new THREE.Mesh(PlanetGeom, PlanetMat);
        this.Planet.name = "Planet";
        this.Planet.position.set(0, 0, 0);
        this.add(this.Planet);

        if (gui) { // assume it can be falsey, e.g. if we strip dat-gui out of bundlee
            // attach dat.gui stuff here as usual

        }
    }

    onAppDidUpdate(oldProps, oldState, newProps, newState) {

    }

    animateIn(opt = {}) {

        animate.fromTo(this.rotation, 2.0, {
            x: -Math.PI / 4
        }, {
            ...opt,
            x: 0,
            ease: Expo.easeOut
        });
    }

    update(dt = 0, time = 0) {
        let amount = 750;
        let scale = null;
        let distance = this.Planet.position.distanceTo(webgl.camera.position);
        // console.log(this.Planet.position);
        if (distance / amount >= this.maxScale) {
            scale = this.maxScale
        } else if (distance / amount <= this.minScale) {
            scale = this.minScale
        } else {
            scale = distance / amount
        }
         this.Planet.scale.set(scale,scale,scale);
        //console.log(scale)
    }

    onTouchStart(ev, pos) {
        if (this.touchTime === 0) {
            this.touchTime = new Date().getTime();
            SingleClick(ev, pos, this);
        } else {
            if (((new Date().getTime()) - this.touchTime) < 200) {
                // double click occurred
                DoubleClick(ev, pos, this);
                this.touchTime = 0;
            } else {
                // not a double click so set as a new first click
                this.touchTime = new Date().getTime();
                SingleClick(ev, pos, this);
            }
        }
    }

    onTouchMove(ev, pos) {}

    onTouchEnd(ev, pos) {}
};

function DoubleClick(ev, pos, the) {
    const coords = new THREE.Vector2().set(
        pos[0] / webgl.width * 2 - 1,
        -pos[1] / webgl.height * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(coords, webgl.camera);
    const hits = raycaster.intersectObject(webgl.scene, true);
    let thisHit = null;
    if (hits.length > 0) {
        // console.log(the.Planet);
        // console.log(hits[0].object.position);
        let moveTarget = hits[0].object.position;
        if (hits[0].object === the.Planet) {
            webgl.controls.target.set(moveTarget.x, moveTarget.y, moveTarget.z);
        }
    }
    //console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');

}

function SingleClick(ev, pos, the) {

}