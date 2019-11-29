import Utils from './Utils.js';
import Node from './Node.js';
import Mesh from './Mesh.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

export default class Explosion extends Node {

    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = new Mesh(options.meshes[2]);
        this.image = options.textures[13];
        
    }

    update(dt) {
        this.rotation[1] += 0.0007;
        this.rotation[2] += 0.0007;
    }
}

Explosion.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 3,
    friction         : 0.2,
    acceleration     : 20
};
 