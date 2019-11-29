import Application from '../../common/Application.js';
import Utils from './Utils.js';
import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import Planet from './Planet.js';
import Bullet from './Bullet.js';
import Explosion from './Explosion.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';
import Light from './Light.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

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
var explosionObjectArray = [];
var explosionObjectArrayCounter = 0;

var random = function (min, max) {
    return Math.random() * (max - min) + min;
}

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

        // Find first camera.
        this.camera = null;
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
        for(i in this.scene.nodes){
            var node = this.scene.nodes[i];
            if(node instanceof Planet){
                //random rotacije planetov(1,2 ,3 so manj da ne zginejo za sonce)
                var stopinje = random(-180,180);
                if(i == 0 ||i == 1 || i == 2 ||i == 3)  stopinje = random(-38,100);          
                const kot = (stopinje) * (Math.PI/180);
                const rotatedX = Math.cos(kot) * (node.translation[0]) - Math.sin(kot) * (node.translation[2]);
                const rotatedZ = Math.sin(kot) * (node.translation[0]) + Math.cos(kot) * (node.translation[2]);
                node.translation[0] = rotatedX;
                node.translation[2] = rotatedZ;
                node.rotation[1] -= kot;    
                node.id = i;
                planets.push(node);
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
        if ( start ) {
            const t = this.time = Date.now();
            const dt = (this.time - this.startTime) * 0.001;
            this.startTime = this.time;
            if (this.camera) {
                this.camera.update(dt);
            }

            var planet;
            for (var i in planets){
                planet = planets[i];
                if(planet) planet.update(dt);
            }

            if (explosionObjectArray.length){
                for(var i in explosionObjectArray){
                    if  (explosionObjectArray[i])
                        explosionObjectArray[i].update(dt);
                }
            }
    
            
            if (this.physics) {
                this.physics.update(dt);
            }
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
document.body.onkeyup = function(e) {
    //shoot 'spacebar'
    if (e.keyCode == 32) {
        if (canShoot) {
            canShoot = false;
            metek = new Bullet(builder.spec);
            metek.translation = camera.getLocation();
            metek.rotation = camera.getRotation();
            metek.zadel = false;
            metek.zadetek = null;
            metek.scale = [0.05, 0.05, 0.05];
            metek.aabb[0] = [-0.2, -0.2, -0.2];
            metek.aabb[1] = [0.2, 0.2, 0.2];
            scene.addNode(metek);
            renderer.prepareNode(metek);
            metek.shoot();
            var cooldownHUD = document.querySelector("#cooldown");
            cooldownHUD.innerHTML = "Charging...";
            //poslusa ce bo metek mogoce zadel
            var check = setInterval( function () {
                poslusanje();
            }, 17);
            var poslusanje = function () {
                if (metek.zadel) {
                    scene.deleteNode(metek);
                    clearInterval(check);
                    animirajEksplozijo(metek.zadetek);
                }
            }
            setTimeout(function() {
                //console.log(metek.zadel);
                cooldownHUD.innerHTML = "";
                scene.deleteNode(metek);
                metek = null;
                canShoot = true;
                clearInterval(check);
            }, 3000);

        }
    }
    //play 'p'
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
    //const gui = new dat.GUI();
    //gui.add(app, 'enableCamera');

    audio1 = document.getElementById("audio1");
    audio2 = document.getElementById("audio2");
    intro = document.getElementById("introOverlay"); 
    audio1.volume = 0.3;
    audio1.play();
    
    document.onclick = function() {
        app.enableCamera();
    };
    /*setTimeout(function() {
        for (let i = 0; i < 3; i++) {
            gui.add(app.camera.translation, i, -20, 20).name('translation.' + String.fromCharCode('x'.charCodeAt(0) + i));
        }
    }, 3000);*/
});

///////////////////Animacija eksplozije planeta///////////////////
/////////////////////////////////////////////////////////////////
var animirajEksplozijo = function (unicenPlanet){
    var eksplozija = null;
    var scalePlaneta = unicenPlanet.scale[0];
    var id = metek.zadetek.id;
    --id;
    setTimeout(function() {
        uniciPlanet(unicenPlanet);
    }, 500);

    setTimeout(function() {
        eksplozija = eksplodiraj(unicenPlanet);
        planets[id] = null;
         //odstranim planet iz arraya planetov, da se eksplozija neha vrtet okoli sonca
    }, 1200);
    
    setTimeout(function() {
        //console.log(skalirajDo);
        povecujEksplozijo(eksplozija, scalePlaneta);
    }, 1250);

    setTimeout(function() {
        zmanjsujEksplozijo(eksplozija);
    }, 2000);
    
}

var eksplodiraj = function (unicenPlanet) {
    //doda se novi planet za eksplozijo
    var explozija = new Explosion(builder.spec);
    //explozija.parent = unicenPlanet;
    explozija.translation = unicenPlanet.translation;
    explozija.scale = [0.05, 0.05,0.05];
    explozija.id = explosionObjectArrayCounter;
    explosionObjectArray[explosionObjectArrayCounter] = explozija;
    ++explosionObjectArrayCounter;
    scene.addNode(explozija);
    renderer.prepareNode(explozija);
    
    return explozija;
}

var povecujEksplozijo = function (explozija, scalePlaneta) {
    //pazi pri igranju s stevilkami...Linearna funkcija ne zgleda glih lepo
    //tole se pa hitr zgodi da se zacikla(te cifre so lih ok da se ne)
    var a = 1.5;  
    var boom = function (){
        //console.log(explozija.scale[0]);
        vec3.scale(explozija.scale,explozija.scale, a);
        a = Math.pow(a,0.891);
        if(explozija.scale[0] > scalePlaneta*1.2){clearInterval(povecajKroglo); console.log("good")};
    }
    var povecajKroglo = setInterval( function () {
        boom();
    }, 16);
}
var zmanjsujEksplozijo = function (explozija) {
    var a = 0.9999;  
    var antiBoom = function (){
        vec3.scale(explozija.scale,explozija.scale, a);
        a = Math.pow(a,1.01);
        if(explozija.scale[0] < 0.01){clearInterval(zmanjsajKroglo);scene.deleteNode(explozija); explosionObjectArray[explozija.id] = null;};
    }
    var zmanjsajKroglo = setInterval( function () {
        antiBoom();
    }, 16);
}


var uniciPlanet = function (unicenPlanet) {
    var skrciPlanet = setInterval( function () {
        kolaps();
    }, 16);
    var a = 0.999;
    var kolaps = function (){
        //console.log(a);
        vec3.scale(unicenPlanet.scale,unicenPlanet.scale,a);
        a = Math.pow(a,1.1);
        if(unicenPlanet.scale[0] < 0.01){scene.deleteNode(unicenPlanet); clearInterval(skrciPlanet);};
    }
}
/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
