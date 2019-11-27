import Mesh from './Mesh.js';

import Node from './Node.js';
import Model from './Model.js';
import Camera from './Camera.js';
import Planet from './Planet.js';
import Light from './Light.js';

import Scene from './Scene.js';

export default class SceneBuilder {

    constructor(spec) {
        this.spec = spec;
    }

    createNode(spec) {
        //console.log(spec);
        switch (spec.type) {
            case 'camera': return new Camera(spec);
            case 'light' : return new Light();
            case 'model': {
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];
                return new Model(mesh, texture, spec);
            }
            case 'planet': {
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];
                return new Planet(mesh, texture, spec);
            }
            default: return new Node(spec);
        }
    }

    build() {
        let scene = new Scene();
        this.spec.nodes.forEach(spec => scene.addNode(this.createNode(spec)));
        return scene;
    }

}
