export default class Scene {

    constructor() {
        this.nodes = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    removeNode(node) {
        this.nodes.pop(node);
    }

    traverse(before, after) {
        this.nodes.forEach(node => node.traverse(before, after));
    }

}
