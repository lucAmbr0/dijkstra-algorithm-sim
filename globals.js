class Connection {
    constructor(to = "unknown connection", distance = -1) {
        this.to = to;
        this.distance = distance;
    }
    linkElement = null;
}

class Node {
    constructor(name = "unknown router") {
        this.name = name;
    }
    routerElement;
    connections = [];
    coordinatesDistances = [];
    finished = false;
}

const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
let nodes;
let numberOfRouters;
let animationSpeed;
let logs;

function assignGlobals() {
    nodes = [];
    numberOfRouters = 0;
    animationSpeed = 50;
    logs = 0;
}