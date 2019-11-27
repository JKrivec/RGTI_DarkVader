import Node from './Node.js';

export default class Light extends Node {

    constructor() {
        super();

        Object.assign(this, {
            position         : [0, 0, 0],
            ambient          : 0.5,
            diffuse          : 1,
            specular         : 0,
            shininess        : 1,
            color            : [255, 255, 255],
            attenuation     : [0.5, 0.005, 0]
        });
    }

}