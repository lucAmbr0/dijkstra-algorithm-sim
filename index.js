class Node {
    constructor(name = "unknown router") {
        this.name = name;
    }
    node = [];
}

let graph = [];
graph.push(new Node("A"));
graph.push(new Node("B"));
graph.push(new Node());

console.log(graph);