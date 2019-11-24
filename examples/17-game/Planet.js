import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

export default class Planet extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;

    }


    update(dt) {
        const c = this;


        //rotacija planeta
        const kot = (0.05) * (Math.PI/180);

        const rotatedX = Math.cos(kot) * (c.translation[0]) - Math.sin(kot) * (c.translation[2]);
        c.translation[0] = rotatedX;

        const rotatedZ = Math.sin(kot) * (c.translation[0]) + Math.cos(kot) * (c.translation[2]);
        c.translation[2] = rotatedZ;

        


    }


}

Planet.defaults = {
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
