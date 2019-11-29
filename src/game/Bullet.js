import Utils from './Utils.js';
import Node from './Node.js';
import Mesh from './Mesh.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

var zadel = false;
var zadetek = null;
var forward = null;
export default class Bullet extends Node {

    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = new Mesh(options.meshes[1]);
        this.image = options.textures[12];
        this.scale = [0.05,0.05,0.05];
        this.aabb[0] = [-0.2, -0.2, -0.2];
        this.aabb[1] = [0.2, 0.2, 0.2];
    }

    update(dt) {
    }
    
    shoot() {
        forward = vec3.set(vec3.create(),
            Math.cos(this.rotation[0]) * -Math.sin(this.rotation[1]), Math.sin(Math.sin(this.rotation[0])), Math.cos(this.rotation[0]) * -Math.cos(this.rotation[1]));
        vec3.normalize(forward, forward);
        vec3.scale(this.velocity, forward, this.acceleration*2);
    }
}

Bullet.defaults = {
    id               : 99,
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    acceleration     : 10
    
};
