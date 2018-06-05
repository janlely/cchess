class TreeNode {
    constructor(data){
        this.parent = null;
        this.children = [];
        this.data = data;
    }
    parent() {
        return this.parent;
    }
    children() {
        return this.children;
    }
    getData() {
        return this.data;
    }
    addChild(tree) {
        tree.parent = this;
        this.children.push(tree);
    }
}

export default TreeNode;
