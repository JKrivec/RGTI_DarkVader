import Application from '../../common/Application.js';

import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import Planet from './Planet.js';
import Bullet from './Bullet.js';
import Mesh from './Mesh.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';
const planets = [];
const bullets = [];
var builder = null;
var scene = null;
var renderer = null;
var xxxx = 0;
var metek = null;
class App extends Application {

    

    start() {
        const gl = this.gl;

        renderer = new Renderer(gl);
        this.renderer = new Renderer(gl);
        renderer = this.renderer;
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('scene.json');
    }

    async load(uri) {
        scene = await new SceneLoader().loadScene('scene.json');
        builder = new SceneBuilder(scene);        
        this.scene = builder.build();
        scene = this.scene;
        this.physics = new Physics(this.scene);
        console.log(this.scene);

        // Find first camera.
        this.camera = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }
        });

        
        //nafila array "planeti" s vsemi nodi v sceni k so tipa "planet"
        var i;
        for(i in this.scene.nodes){
            if(this.scene.nodes[i] instanceof Planet){
                planets.push(this.scene.nodes[i]);
            }
        }
        
        
        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);


    }

    enableCamera() {
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
        } else {
            this.camera.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        

        if (this.camera) {
            this.camera.update(dt);
        }
        
        var planet;
        for(var i in planets){
            planet = planets[i];
            planet.update(dt);
        }
        
        if (this.physics) {
            this.physics.update(dt);
        }
    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}
//strelanje 
document.body.onkeyup = function(e){
    //spacebar
    console.log(e.keyCode);
    if(e.keyCode == 32){
        console.log(xxxx);
        var mesh = new Mesh(builder.spec.meshes[0]);
        var texture = builder.spec.textures[5];
        var planet = new Planet(mesh, texture, builder.spec);
        planet.scale[0] = 0.1;
        planet.scale[1] = 0.1;
        planet.translation[0] = 15;
        planet.translation[2] = xxxx;
        metek = planet;
        xxxx -= 3;
        scene.addNode(planet);
        renderer.prepareNode(planet);;
    }

    if(e.keyCode == 88){
        console.log("x");
        renderer.prepareNode(metek);
        scene.removeNode(metek);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new dat.GUI();
    gui.add(app, 'enableCamera');

    const audio1 = document.getElementById("audio1");
    const audio2 = document.getElementById("audio2");
    audio1.muted = true; 
    audio2.muted = true;
    audio1.volume = 0.5;
    audio2.volume = 0.2;
    //audio1.play();
    //audio2.play();
    //audio1.muted = false;
    //audio2.muted = false;
});