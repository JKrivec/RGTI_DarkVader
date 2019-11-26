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

    deleteNode(node){
        var indexPlaneta = this.nodes.indexOf(node);
        //splice vrne -1 in zdeleta pol scene kot result
        if ( indexPlaneta !== -1 ){
            this.nodes.splice(indexPlaneta, 1);
        }
    }

    traverse(before, after) {
        this.nodes.forEach(node => node.traverse(before, after));
    }

}
