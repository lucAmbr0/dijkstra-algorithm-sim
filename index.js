class Connection {
    constructor(to = "unknown connection", distance = -1, linkElement = "") {
        this.to = to;
        this.distance = distance;
        this.linkElement = linkElement;
    }
}

class Node {
    constructor(name = "unknown router") {
        this.name = name;
    }
    routerElement;
    connections = [];
}

let nodes = [];
let numberOfRouters = 0;
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

function generateGraph() {
    try {
        numberOfRouters = document.getElementById("numberOfRouters").value;
        if (numberOfRouters >= 5 && numberOfRouters <= 15) {
            nodes = [];
            simContainer.innerHTML = "";
            for (let i = 0; i < numberOfRouters; i++) {
                routerElement = `routerElement_${letters[i]}`;
                routerLabel = `routerLabel_${letters[i]}`;
                nodes[i] = new Node(letters[i]);
                nodes[i].routerElement = document.createElement("div");
                nodes[i].routerElement.classList.add("routerElement");
                nodes[i].routerElement.id = routerElement;
                nodes[i].routerElement.innerHTML =
                    `<p class="routerLabel" id="${routerLabel}">${letters[i]}</p>`;
                // console.log(nodes[i].routerElement);
            }
            generateRouterUI();
            generateConnections();
            generateConnectionsUI();

        }
    } catch (e) {
        console.error(e);
    }
}

function generateConnections() {
    for (let node of nodes) {
        const numOfConn = Math.floor(Math.random() * 1) + 2; // da 1 a 3 connessioni per ogni router
        for (let i = node.connections.length; i < numOfConn; i++) {
            let dest = 0;
            do { // evita connessioni con se stesso e connessioni duplicate
                dest = letters.filter(l => l != node.name)[Math.floor(Math.random() * (numberOfRouters - 1))];
            } while (node.connections.find(c => c.to == dest) != undefined);
            const distance = Math.floor(Math.random() * 13 + 2);
            const destNode = nodes.find(n => n.name == dest);
            node.connections.push(new Connection(dest, distance));
            if (destNode) {
                destNode.connections.push(new Connection(node.name, distance));
            }
        }
    }
    console.log(nodes);
}

function generateRouterUI() {
    const simContainer = document.getElementById("simContainer");
    const containerRect = simContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    const circleDiameter = containerHeight * 0.1;
    const radius = circleDiameter / 2;
    const margin = radius * 0.2;
    const circles = [];

    function isOverlapping(x, y) {
        return circles.some(circle => {
            const dx = circle.x - x;
            const dy = circle.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance - 100 < circleDiameter; // avoids routers to be too close to each other or to the border
        });
    }

    for (node of nodes) {
        let x, y;
        let attempts = 0;
        do {
            x = Math.random() * (containerWidth - circleDiameter - 2 * margin) + radius + margin;
            y = Math.random() * (containerHeight - circleDiameter - 2 * margin) + radius + margin;
            attempts++;
            if (attempts > 1000) break;
        } while (isOverlapping(x, y));

        if (attempts <= 1000) {
            circles.push({ x, y });
            const circle = node.routerElement;
            circle.style.position = "absolute";
            circle.style.width = `${circleDiameter}px`;
            circle.style.height = `${circleDiameter}px`;
            circle.style.left = `${x - radius}px`;
            circle.style.top = `${y - radius}px`;
            simContainer.appendChild(circle);
        }
    }
}

function generateConnectionsUI() {
    for (node of nodes) {
        for (conn of node.connections) {
            if (nodes.find(n => n.name == conn.to)) {
                drawConnection(node, nodes.find(n => n.name == conn.to));
            }
        }
    }
}

function drawConnection(node1, node2) {
    if (!node1 || !node2) return;
    if (node1.connections.find(c => c.to == node2.name).linkElement) return;
    if (node2.connections.find(c => c.to == node1.name).linkElement) return;

    const node1Element = node1.routerElement;
    const node2Element = node2.routerElement;

    const rect1 = node1Element.getBoundingClientRect();
    const rect2 = node2Element.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const line = document.createElement("div");
    line.classList.add("connectionLine");
    line.id = `line_${node1Element.id}_${node2Element.id}`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${x1 - 50}px`;
    line.style.top = `${y1 - 25}px`;

    node1.connections.find(c => c.to == node2.name).linkElement = line;
    node2.connections.find(c => c.to == node1.name).linkElement = line;

    simContainer.appendChild(line);
}