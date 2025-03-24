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
let animationSpeed = 2350;
let logs = 0;
