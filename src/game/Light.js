import Node from './Node.js';

export default class Light extends Node {

    constructor(options) {
        super();
        this.translation = options.translation;

        Object.assign(this, {
            ambient          : 0.5,
            diffuse          : 10000,
            specular         : 0,
            shininess        : 1,
            color            : [255, 255, 255],
            attenuation      : [0.5, 0.005, 0]
        });
    }

}