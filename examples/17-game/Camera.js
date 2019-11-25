import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

var dx = 0;
var dy = 0;
var dx_prev = 0;
var dy_prev = 0;

export default class Camera extends Node {

    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);

        this.projection = mat4.create();
        this.updateProjection();

        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keys = {};
    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }

    update(dt) {
        const c = this;

        const forward = vec3.set(vec3.create(),
            -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
        const right = vec3.set(vec3.create(),
            Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            vec3.sub(acc, acc, right);
        }

        // 2: update velocity
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            vec3.scale(c.velocity, c.velocity, 1 - c.friction);
        }

        // 4: limit speed
        const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }
        
        // (Klemen) updata mouse movement na podlagi dx in dy iz mousemoveHandler ter prejsnjih sprememb pomnozenih s pospeskom
        var dx_update = dx + dx_prev * this.mouseAcceleration;
        var dy_update = dy + dy_prev * this.mouseAcceleration;
        if (dx_update > this.maxMouseSpeed) { dx_update = this.maxMouseSpeed; }
        if (dx_update < -this.maxMouseSpeed) { dx_update = -this.maxMouseSpeed; }
        if (dy_update > this.maxMouseSpeed) { dy_update = this.maxMouseSpeed; }
        if (dy_update < -this.maxMouseSpeed) { dy_update = -this.maxMouseSpeed; }
        c.rotation[1] -= dx_update;
        c.rotation[0] -= dy_update;
        dx_prev = dx_update;
        dy_prev = dy_update;
    }

    enable() {
        document.addEventListener('mousemove', this.mousemoveHandler);
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    disable() {
        document.removeEventListener('mousemove', this.mousemoveHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    mousemoveHandler(e) {
        const c = this;

        dx = e.movementX * c.mouseSensitivity;
        dy = e.movementY * c.mouseSensitivity;


        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        if (c.rotation[0] > halfpi) {
            c.rotation[0] = halfpi;
        }
        if (c.rotation[0] < -halfpi) {
            c.rotation[0] = -halfpi;
        }

        c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

    getRotation() {
        return vec3.set(vec3.create(), this.rotation[0], this.rotation[1], 0);
    }
    
    getLocation() {
        return vec3.set(vec3.create(), this.translation[0], this.translation[1], this.translation[2]);
    }
}

Camera.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.0000075,
    maxSpeed         : 3,
    friction         : 0.2,
    acceleration     : 20,
    mouseAcceleration: 0.97,
    maxMouseSpeed    : 0.01
};
