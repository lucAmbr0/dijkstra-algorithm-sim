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
    distances = [];
}

let nodes = [];
let numberOfRouters = 0;
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];


generateGraph();
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
            generateDistancesTable();
            generateTableUI();
        }
    } catch (e) {
        console.error(e);
    }
}

function generateConnections() {
    for (let node of nodes) {
        const numOfConn = Math.floor(Math.random() * 3) + 1; // da 1 a 3 connessioni per ogni router
        const potentialConnections = nodes
            .filter(n => n.name !== node.name)
            .map(n => {
                const dx = node.routerElement.getBoundingClientRect().left - n.routerElement.getBoundingClientRect().left;
                const dy = node.routerElement.getBoundingClientRect().top - n.routerElement.getBoundingClientRect().top;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return { node: n, distance: distance };
            })
            .sort((a, b) => a.distance - b.distance); // ordina per distanza crescente

        for (let i = node.connections.length; i < numOfConn; i++) {
            let destNode;
            do { // evita connessioni con se stesso e connessioni duplicate
                destNode = potentialConnections.shift().node;
            } while (node.connections.find(c => c.to == destNode.name) != undefined);

            const distance = Math.floor(Math.random() * 13 + 2);
            node.connections.push(new Connection(destNode.name, distance));
            destNode.connections.push(new Connection(node.name, distance));
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
            return distance - 100 < circleDiameter; // evita che i router siano troppo vicini tra loro o ai bordi
        });
    }

    for (node of nodes) {
        let x, y;
        let attempts = 0;
        do {
            // sceglie casualmente la posizione dei router nello spazio
            x = Math.random() * (containerWidth - circleDiameter - 2 * margin) + radius + margin;
            y = Math.random() * (containerHeight - circleDiameter - 2 * margin) + radius + margin;
            attempts++;
            if (attempts > 1000) break;
        } while (isOverlapping(x, y));

        if (attempts <= 1000) {
            // calcolo posizione e dimensioni dei cerchi da disegnare
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
            if (nodes.find(n => n.name == conn.to)) { // se il router cercato ha una connessione con il nome del router corrente aggiungi una connessione
                drawConnection(node, nodes.find(n => n.name == conn.to));
            }
        }
    }
}

function drawConnection(node1, node2) {
    if (!node1 || !node2) return;
    // se esiste già un collegamento tra i due router, non crearne un altro
    if (node1.connections.find(c => c.to == node2.name).linkElement) return;
    if (node2.connections.find(c => c.to == node1.name).linkElement) return;

    const node1Element = node1.routerElement;
    const node2Element = node2.routerElement;

    const rect1 = node1Element.getBoundingClientRect();
    const rect2 = node2Element.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2; // trova il centro x del router 1
    const y1 = rect1.top + rect1.height / 2; // trova il centro y del router 1
    const x2 = rect2.left + rect2.width / 2; // x2
    const y2 = rect2.top + rect2.height / 2; // y2

    const dx = x2 - x1; // calcola la distanza x tra i router
    const dy = y2 - y1; // calcola la distanza y tra i router
    const length = Math.sqrt(dx * dx + dy * dy); // calcola la lunghezza del collegamento
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // calcola l'angolo del collegamento in gradi

    const line = document.createElement("div"); // elemento linea
    line.classList.add("connectionLine");
    line.id = `line_${node1Element.id}_${node2Element.id}`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    // gli estremi della linea terminano al centro dei router
    line.style.left = `${x1 - 50}px`;
    line.style.top = `${y1 - 25}px`;

    // assegna l'elemento linea all'array di connessioni dei router
    node1.connections.find(c => c.to == node2.name).linkElement = line;
    node2.connections.find(c => c.to == node1.name).linkElement = line;

    simContainer.appendChild(line);
}

function generateDistancesTable() {
    for (node of nodes) {
        node.distances = [];
        nodes.forEach(n => {
            if (n.connections.find(c => c.to == node.name) != undefined) {
                // per ogni nodo, se trova una connessione (diretta) esistente la ricopia nella tabella delle distanze
                node.distances.push(n.connections.find(c => c.to == node.name));
            } else {
                // per tutti gli altri nodi aggiunge una distanza infinita provvisoria
                node.distances.push(new Connection(n.name, Infinity));
            }
            });
    }
}

function generateTableUI() {
    const table = document.getElementById("distancesTable");
    const x = nodes.length;
    table.innerHTML = '';
    for (let row = 0; row < x + 1; row++) {
      const tr = document.createElement('tr');
      tr.id = `row_${row}`;
      tr.classList.add('row');
      for (let col = 0; col < x + 1; col++) {
        const td = document.createElement('td'); // Create a new cell
        td.id = `cell_${row}_${col}`;
        tr.appendChild(td); // Append the cell to the row
      }
      table.appendChild(tr); // Append the row to the table
    }
    document.getElementById('cell_0_0').textContent = ''; // svuota l'angolo in alto a sinistra
    // scrive le intestazioni di righe e colonne
    for (let i = 1; i <= x; i++) {
        document.getElementById(`cell_${0}_${i}`).textContent = letters[i - 1];
        document.getElementById(`cell_${i}_${0}`).textContent = letters[i - 1];
    }
    // scrive le distanze nella tabella
    updateDistancesTable();
  }

function updateDistancesTable() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            let cellContent = nodes[i].distances[j].distance;
            cellContent = cellContent == Infinity ? "∞" : cellContent;
            document.getElementById(`cell_${i + 1}_${j + 1}`).textContent = cellContent;
        }
    }
}

async function executeAlgorithm() {
    for (node of nodes)
        highlightNode(node);
        await runAlgorithmOnNode(node);
        noHighlightNode(node);
}

async function runAlgorithmOnNode(node) {
        for (conn of node.connections) {
            highlightConnection(conn);
        }
}

function highlightNode(node) {
    node.routerElement.classList.add("highlightedRouter");
}
function highlightConnection(connection) {
    connection.linkElement.classList.add("highlightedConnection");
}
function NohighlightNode(node) {
    node.routerElement.classList.remove("highlightedRouter");
}
function NohighlightConnection(connection) {
    connection.linkElement.classList.remove("highlightedConnection");
}