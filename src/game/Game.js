import Application from '../../common/Application.js';
import Utils from './Utils.js';
import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import Light from './Light.js';
import Planet from './Planet.js';
import Bullet from './Bullet.js';
import Mesh from './Mesh.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';

const planets = [];
var camera = null;
var builder = null;
var scene = null;
var renderer = null;
var metek = null;
var canShoot = true;
var start = true;
var audio1 = null;
var audio2 = null;
var intro = null;
var light = null;

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

        // Find first camera. And light
        this.camera = null;
        this.light = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
                camera = node;
            } else if (node instanceof Light) {
                this.light = node;
                light = node;
            }
        });

        //nafila array "planeti" s vsemi nodi v sceni k so tipa "planet"
        var i;
        for (i in this.scene.nodes) {
            var node = this.scene.nodes[i];
            if (node instanceof Planet) {
                //node.rotation[1] =  (2*Math.PI - (2*(Math.atan(node.translation[2] / node.translation[0]))));
                node.id = i;
                planets.push(node);
            }
        }
        
        /*for (var i in this.scene.nodes[14].mesh.normals) {
            if (this.scene.nodes[14].mesh.normals[i] < 0) {
                this.scene.nodes[14].mesh.normals[i] = Math.abs(this.scene.nodes[14].mesh.normals[i]);
            } else {
                this.scene.nodes[14].mesh.normals[i] = 0 - this.scene.nodes[14].mesh.normals[i];
            }
        }
        console.log(this.scene.nodes[14].mesh.normals);*/
        
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
        if ( start ) {
            const t = this.time = Date.now();
            const dt = (this.time - this.startTime) * 0.001;
            this.startTime = this.time;
            
            if (this.camera) {
                this.camera.update(dt);
            }
            
            for (var i in planets) {
                planets[i].update(dt);
            }
            
            if (this.physics) {
                this.physics.update(dt);
            }
        }
    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera, this.light);
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
document.body.onkeyup = function(e) {
    //spacebar
    if (e.keyCode == 32) {
        if (canShoot) {
            canShoot = false;
            var mesh = new Mesh(builder.spec.meshes[2]);
            var texture = builder.spec.textures[11];
            metek = new Bullet(mesh, texture, builder.spec);
            metek.translation = camera.getLocation();
            metek.rotation = camera.getRotation();
            metek.scale = [0.05, 0.05, 0.05];
            metek.aabb[0] = [-0.2, -0.2, -0.2];
            metek.aabb[1] = [0.2, 0.2, 0.2];
            scene.addNode(metek);
            renderer.prepareNode(metek);
            metek.shoot();
            var cooldownHUD = document.querySelector("#cooldown");
            cooldownHUD.innerHTML = "Charging...";
            setTimeout(function() {
                cooldownHUD.innerHTML = "";
                scene.deleteNode(metek);
                metek = null;
                canShoot = true;
            }, 3000);
        }
    }
    
    if (e.keyCode == 80) {
        start = true;
        audio2.volume = 0.1;
        audio2.play();
        intro.classList.toggle('show');
        
        var time = 60;
        var scoreHUD = document.querySelector("#score");
        var timeHUD = document.querySelector("#time");
        var timeInterval = setInterval(function() {
            time--;
            var stPlanetov = 0;
            for (var i in scene.nodes) {
                if (scene.nodes[i].type == "planet") {
                    stPlanetov++;
                }
            }
            scoreHUD.innerHTML = "Planets left: " + stPlanetov;
            timeHUD.innerHTML = "Time left: " + time;
            if (time == 0) {
                document.querySelector("#status").innerHTML = "DEFEAT";
                canShoot = false;
                clearInterval(timeInterval);
            }
            if (stPlanetov == 0) {
                document.querySelector("#status").innerHTML = "VICTORY";
                clearInterval(timeInterval);
            }
        }, 1000);
    }
    
    if (e.keyCode == 77) {
        if (audio1.muted) {
            audio1.muted = false;
            audio2.muted = false;
        } else {
            audio1.muted = true;
            audio2.muted = true;
        }
    }
    
    if (e.keyCode == 82) {
        window.location.reload();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new dat.GUI();

    audio1 = document.getElementById("audio1");
    audio2 = document.getElementById("audio2");
    intro = document.getElementById("introOverlay"); 
    audio1.volume = 0.3;
    audio1.play();
    
    setTimeout(function() {
        gui.add(app.light, 'ambient', 0.0, 1.0);
        gui.add(app.light, 'diffuse', 0.0, 1.0);
        gui.add(app.light, 'specular', 0.0, 1.0);
        gui.add(app.light, 'shininess', 0.0, 1000.0);
        gui.addColor(app.light, 'color');
        for (let i = 0; i < 3; i++) {
            gui.add(app.light.translation, i, -10.0, 10.0).name('translation.' + String.fromCharCode('x'.charCodeAt(0) + i));
        }
        for (let i = 0; i < 3; i++) {
            gui.add(app.light.attenuation, i, 0.0, 1.0).name('attenuation.' + String.fromCharCode('x'.charCodeAt(0) + i));
        }
    }, 5000);
    
    document.onclick = function() {
        app.enableCamera();
    };
});