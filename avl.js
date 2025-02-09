let tree = null;

// AVL Tree Node
class Node {

    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// AVL Tree Class
class AVLTree {
    constructor() {
        this.root = null;
    }

    // Get the height of a node
    height(node) {
        return node ? node.height : 0;
    }

    // Get balance factor
    getBalance(node) {
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }

    // Right rotation
    rotateRight(y) {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = 1 + Math.max(this.height(y.left), this.height(y.right));
        x.height = 1 + Math.max(this.height(x.left), this.height(x.right));
        return x;
    }

    // Left rotation
    rotateLeft(x) {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = 1 + Math.max(this.height(x.left), this.height(x.right));
        y.height = 1 + Math.max(this.height(y.left), this.height(y.right));
        return y;
    }

    // Insert node
    insert(node, value) {
        if (!node) return new Node(value);

        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node; // Duplicate values not allowed
        }

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        let balance = this.getBalance(node);

        // Left Heavy (LL)
        if (balance > 1 && value < node.left.value) return this.rotateRight(node);
        
        // Right Heavy (RR)
        if (balance < -1 && value > node.right.value) return this.rotateLeft(node);

        // Left Right (LR)
        if (balance > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Left (RL)
        if (balance < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    // Find the node with minimum value
    minValueNode(node) {
        while (node.left) node = node.left;
        return node;
    }

    // Delete a node
    delete(node, value) {
        if (!node) return node;

        if (value < node.value) {
            node.left = this.delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.delete(node.right, value);
        } else {
            if (!node.left || !node.right) {
                node = node.left || node.right;
            } else {
                let temp = this.minValueNode(node.right);
                node.value = temp.value;
                node.right = this.delete(node.right, temp.value);
            }
        }

        if (!node) return node;

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        let balance = this.getBalance(node);

        // Left Heavy
        if (balance > 1 && this.getBalance(node.left) >= 0) return this.rotateRight(node);
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Heavy
        if (balance < -1 && this.getBalance(node.right) <= 0) return this.rotateLeft(node);
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }
}

// Handle UI interactions
function insertNode() {
    let value = parseInt(document.getElementById("nodeValue").value);
    if (!isNaN(value)) {
        if (!tree) tree = new AVLTree();
        tree.root = tree.insert(tree.root, value);
        redraw();
    }
}

function deleteNode() {
    let value = parseInt(document.getElementById("nodeValue").value);
    if (!isNaN(value) && tree) {
        tree.root = tree.delete(tree.root, value);
        redraw();
    }
}

function resetTree() {
    tree = null;
    redraw();
}

// Visualization using p5.js
function setup() {
    createCanvas(800, 500);
}

function draw() {
    background(255);
    if (tree && tree.root) {
        drawTree(tree.root, width / 2, 50, 150);
    }
}

function drawTree(node, x, y, gap) {
    if (node.left) {
        line(x, y, x - gap, y + 70);
        drawTree(node.left, x - gap, y + 70, gap / 1.5);
    }
    if (node.right) {
        line(x, y, x + gap, y + 70);
        drawTree(node.right, x + gap, y + 70, gap / 1.5);
    }
    
    fill('lightblue'); // Node color
    ellipse(x, y, 50, 50); // Node size
    
    fill(0); // Text color
    textSize(18); // Increase text size (default is ~12)
    textAlign(CENTER, CENTER);
    text(node.value, x, y);
}

