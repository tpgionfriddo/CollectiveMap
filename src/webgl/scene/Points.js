const {
    gui,
    webgl,
    assets
} = require('../../context');
const App = require('../../framework/App')
const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const honeyShader = require('../shaders/honey.shader');
const animate = require('@jam3/gsap-promise');
const Landing = require('../../sections/Landing/Landing');

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading
//const gltfKey = assets.queue({
//const gltfKey = assets.queue({
//    url: 'assets/models/honeycomb.gltf'
//});


const OLDPOIS = [{
    name: "Asteroid1",
    icon: 'assets/textures/Icons/Asteroid.svg',
    color: 255,
    description: "The first one" ,
    position: {
        x: 650,
        y: 0,
        z: 0
    },

},
    {
        name: "Asteroid2",
        icon: 'assets/textures/Icons/Asteroid.svg',
        color: 0xff0000,
        description: "The second one",
        position: {
            x: 600,
            y: 0,
            z: 600
        },
    }
];
const POIS = require('../JSON/POIS.json');





module.exports = class Honeycomb extends THREE.Object3D {
    constructor() {
        super();
        console.log(POIS.length)
        // now fetch the loaded resource
        // const gltf = assets.get(gltfKey);
        for (let i = 0; i < POIS.length; i++) {
            const AsteroidTexture = new THREE.TextureLoader().load(POIS[i].icon, function() {
                console.log("loaded")
            });
            const AsteroidMat = new THREE.SpriteMaterial({
                map: AsteroidTexture,
                color: POIS[i].color
            });
            let Sprite = new THREE.Sprite(AsteroidMat);
            console.log(POIS[i].position);
            Sprite.name = POIS[i].name;
            Sprite.isPOI = true;
            Sprite.Data = POIS[i];
            Sprite.position.set(POIS[i].position.x, POIS[i].position.y, POIS[i].position.z);
            Sprite.scale.set(100, 100, 100);
            this.add(Sprite);

        }

        this.maxScale = 50
        this.minScale = 1



        console.log(this.children)

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
        let amount = 10
        let scale = null;

        for(let i = 0; i < this.children.length; i++) {
            //console.log("e")
            let distance = this.children[i].position.distanceTo(webgl.camera.position);
            if(distance/amount >= this.maxScale){scale = this.maxScale}
            else if(distance/amount <= this.minScale){scale = this.minScale}
            else{scale = distance/amount}
            this.children[i].scale.set(scale,scale,scale);
             //console.log(scale)
        }
    }

    onTouchStart(ev, pos) {
        if (this.touchTime === 0) {
            this.touchTime = new Date().getTime();
            SingleClick(ev, pos, this);
        } else {
            if (((new Date().getTime()) - this.touchTime) < 200) {
                // double click occurred
                console.log("double clicked");
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
    const [x, y] = pos;
    //console.log('Touchstart / mousedown: (%d, %d)', x, y);

    // For example, raycasting is easy:
    const coords = new THREE.Vector2().set(
        pos[0] / webgl.width * 2 - 1,
        -pos[1] / webgl.height * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(coords, webgl.camera);
    const hits = raycaster.intersectObject(webgl.scene, true);
    let thisHit = null;
    if (hits.length > 0) {
        //console.log(hits[0].object)
        let moveTarget = hits[0].object.position;
        if (hits[0].object.isPOI) {
            //console.log("he");
            webgl.controls.target.set(moveTarget.x, moveTarget.y, moveTarget.z);
        }
    }
    console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');

}

function SingleClick(ev, pos, the) {

    const [x, y] = pos;
    // For example, raycasting is easy:
    const coords = new THREE.Vector2().set(
        pos[0] / webgl.width * 2 - 1,
        -pos[1] / webgl.height * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(coords, webgl.camera);
    const hits = raycaster.intersectObject(webgl.scene, true);
    let thisHit = null;
    if (hits.length > 0) {
        //console.log(hits[0].object)
        let moveTarget = hits[0].object.position;
        if (hits[0].object.isPOI) {
            DisplayInfo(hits[0].object)
            Landing.Selected = hits[0].object;
            console.log(Landing.Selected.name)
            //({name:"eeee"})
        }
    }
    console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');
}

function DisplayInfo(POI) {
console.log(POI.Data)

}