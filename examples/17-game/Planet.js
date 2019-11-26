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

        // Hitboxi, problem je ker so kvadratni, 0.8 je ok kompromis
        let planetMin = vec3.create();
        let planetMax = vec3.create();
        vec3.scale( planetMin, this.scale, -0.8 );
        vec3.scale( planetMax, this.scale, 0.8 );
        this.aabb.min = planetMin;
        this.aabb.max = planetMax;
        //var radian = (Math.PI/180);
        //this.rotation[1] += (radian)* (2*Math.PI - (2*(Math.atan(this.translation[2] / this.translation[0]))));
    }


    update(dt) {
        const c = this;
        //rotacija planeta
        //treba bo z vec3 narest da bo speedy kao???
        const kot = (0.01) * (Math.PI/180);
        const rotatedX = Math.cos(kot) * (c.translation[0]) - Math.sin(kot) * (c.translation[2]);
        c.translation[0] = rotatedX;
        const rotatedZ = Math.sin(kot) * (c.translation[0]) + Math.cos(kot) * (c.translation[2]);
        c.translation[2] = rotatedZ;
        c.rotation[1] -= kot;
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
 