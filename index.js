class Connection {
    constructor(to = "unknown connection") {
        this.to = to;
    }
    distance;
    linkId;
}

class Node {
    constructor(name = "unknown router") {
        this.name = name;
    }
    routerElementId;
    routerLabelId;
    connections = [];
}

let nodes = [];
let numberOfRouters = 0;
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L"];

function generateGraph() {
    try {
        numberOfRouters = document.getElementById("numberOfRouters").value;
        if (numberOfRouters >= 2 && numberOfRouters <= 10) {
            nodes = [];
            for (let i = 0; i < numberOfRouters; i++) {

                routerElement = `routerElement_${letters[i]}`;
                routerLabel = `routerLabel_${letters[i]}`;

                const element = `
                <div class="routerElement" id="${routerElement}">
                    <p class="routerLabel" id="${routerLabel}">${letters[i]}</p>
                    </div>`
                nodes[i] = new Node(letters[i]);
                nodes[i].routerElementId = routerElement;
                nodes[i].routerLabelId = routerLabel;
            }
            generateConnections();

        }
    } catch (e) {
        console.error(e);
    }
}

function generateConnections() {
    for (node of nodes) {
        const numOfConn = Math.floor(Math.random() * 3) + 1; // da 1 a 3 connessioni per ogni router
        for (let i = 0; i < numOfConn; i++) {
            let dest;
            do {
                dest = letters[Math.floor(Math.random() * numberOfRouters)];
            } while (dest == node.name);
            node.connections.push(new Connection());
        }
    }
    console.log(nodes);
    
}