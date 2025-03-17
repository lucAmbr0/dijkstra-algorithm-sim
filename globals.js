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

let nodes = [];
let numberOfRouters = 0;
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
let animationSpeed = 50;
let logs = 0;