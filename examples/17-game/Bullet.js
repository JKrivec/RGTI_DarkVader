import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

export default class Bullet extends Node {

    constructor(mesh,image,options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;
    }

    update(dt) {
    }
    
    shoot() {
        var forward = vec3.set(vec3.create(),
            Math.cos(this.rotation[0]) * -Math.sin(this.rotation[1]), Math.sin(Math.sin(this.rotation[0])), Math.cos(this.rotation[0]) * -Math.cos(this.rotation[1]));
        vec3.normalize(forward, forward);
        vec3.scale(this.velocity, forward, this.acceleration);
    }
}

Bullet.defaults = {
    translation      : [10,5,7],
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 3,
    friction         : 0.2,
    acceleration     : 10
};
