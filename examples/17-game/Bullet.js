import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

export default class Bullet extends Node {

    constructor( options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = "../../common/images/laserTexture.jpg" ;
        this.image = "../../common/models/cube.json" ;

    }


    update(dt) {
        const c = this;
        //rotacija planeta
        //treba bo z vec3 narest da bo speedy kao???
        const kot = (0.005) * (Math.PI/180);
        const rotatedX = Math.cos(kot) * (c.translation[0]) - Math.sin(kot) * (c.translation[2]);
        c.translation[0] = rotatedX;
        const rotatedZ = Math.sin(kot) * (c.translation[0]) + Math.cos(kot) * (c.translation[2]);
        c.translation[2] = rotatedZ;
        c.rotation[1] -= kot;
    }


}

Bullet.defaults = {
    //texture          : "../../common/images/laserTexture.jpg",
    //mesh             : "../../common/models/cube.json", 
    translation      : [10,0,0],
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
