assignGlobals();
changeSpeed(); // imposta la velocità iniziale
generateGraph();
function generateGraph() {
    try {
        clearLog();
        changeSpeed(); // imposta la velocità iniziale
        log("New graph created");
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
            log(`Generated ${numberOfRouters} routers`);
            generateRouterUI();
            generateConnections();
            log("Generated random router connections");
            generateConnectionsUI();
            log("Generated simulation UI");
            generateTableUI();
            log("Generated distances table");
        }
    } catch (e) {
        console.error(e);
    }
}

function generateConnections() {
    for (let node of nodes) {
        for (let n of nodes) {
            node.connections.push(new Connection(n.name, Infinity));
        }
    }
    chooseDirectConnections();
}

function chooseDirectConnections() {
    for (let node of nodes) {
        // riordina l'array delle distanze visuali tra il router corrente e
        // gli altri router per prediligere connessioni con i router più vicini.
        node.coordinatesDistances.sort((a, b) => a.distance - b.distance);
        node.coordinatesDistances = node.coordinatesDistances.filter(c => c.to != node.name && c.distance != 0);
        const rand = Math.random() * 2 + 1;
        for (let i = 0; i < rand && node.connections.filter(n => n.distance != Infinity).length < rand; i++) {
            let connectTo = node.coordinatesDistances[i];
            if (!connectTo || !nodes.find(n => n.name == connectTo.to)) continue; // Ensure connectTo is defined and valid
            try {
                connectTo.distance = (Math.floor(connectTo.distance / 50));
                let connection = node.connections.find(c => c.to == connectTo.to);
                let reverseConnection = nodes.find(n => n.name == connectTo.to).connections.find(c => c.to == node.name);
                if (connection && reverseConnection) {
                    connection.distance = connectTo.distance;
                    reverseConnection.distance = connectTo.distance;
                }
            } catch (e) {
                console.error("ERRORE SU ROUTER " + node.name + "   " + connectTo.to);
            }
        }
    }
}

async function executeAlgorithm() {
    for (node of nodes) {
        log("##### Evaluated router: " + node.name);
        nodes.forEach(n => {
            n.connections.forEach(c => noHighlightConnection(c))
            if (n.name !== node.name)
                noHighlightNode(n);
        });
        highlightNode(node, 1);
        await delay(animationSpeed);
        await runAlgorithmOnNode(node);
        updateDistancesTable();
    }
    nodes.forEach(n => {
        n.connections.forEach(c => noHighlightConnection(c))
        if (n.name !== node.name)
            noHighlightNode(n);
    });
    updateDistancesTable();
}

async function runAlgorithmOnNode(node) {

    let distances = {};
    let previousNodes = {};
    let nodesToVisit = new MinHeap();

    node.connections.find(d => d.to == node.name).distance = 0;

    nodes.forEach(n => {
        distances[n.name] = Infinity;
        previousNodes[n.name] = null;
        n.finished = false;
    });

    node.connections.sort((a, b) => a.distance - b.distance);

    distances[node.name] = 0;
    nodesToVisit.insert({ node: node, distance: 0 });
    while (!nodesToVisit.isEmpty()) {
        let { node: currentNode, distance: currentDistance } = nodesToVisit.extractMin();
        console.log(currentNode.connections);
        currentNode.connections.sort((a, b) => {
            return 0;
          });
        console.log(currentNode.connections);
        for (let conn of currentNode.connections) {
            if (conn.distance != Infinity) {
                let neighborNode = nodes.find(n => n.name == conn.to);
                if (neighborNode != node) {
                    let newDist = currentDistance + conn.distance;
                    log(`Evaluating connection ${node.name} -> ${currentNode.name} -> ${neighborNode.name} with distance ${newDist}`);
                    if (newDist < distances[neighborNode.name]) {
                        highlightConnection(conn);
                        await delay(animationSpeed / 20);
                        log(`Found shorter path to ${neighborNode.name} through ${currentNode.name}`);
                        updateDistancesTable();
                        if (neighborNode.name != node.name) {
                            highlightNode(neighborNode, 2);
                            await delay(animationSpeed);
                        }
                        if (currentNode.name !== node.name) {
                            highlightNode(currentNode, 2);
                            await delay(animationSpeed);
                        }
                        distances[neighborNode.name] = newDist;
                        previousNodes[neighborNode.name] = currentNode.name;
                        nodesToVisit.insert({ node: neighborNode, distance: newDist });
                    }
                }
            }
        }
    }

    // Update the distances in the original node connections
    for (let [nodeName, distance] of Object.entries(distances)) {
        if (nodeName !== node.name) {
            let connection = node.connections.find(c => c.to == nodeName);
            if (connection) {
                connection.distance = distance;
            }
        }
    }

}

function clearLog() {
    document.getElementById("logs").innerHTML = "";
}

function log(message) {
    const logContainer = document.getElementById("logs");
    const logText = document.createElement("p");
    logs++;
    logText.textContent = logs + ": " + message;
    logContainer.appendChild(logText);
    logContainer.scrollTop = logContainer.scrollHeight;
}