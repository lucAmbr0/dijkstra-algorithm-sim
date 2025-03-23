
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
    for (node of nodes) {
        for (n of nodes) {
            const XYdist = Math.sqrt(Math.pow(Math.abs(node.routerElement.getBoundingClientRect().left - n.routerElement.getBoundingClientRect().left), 2) + Math.pow(Math.abs(node.routerElement.getBoundingClientRect().top - n.routerElement.getBoundingClientRect().top), 2));
            // XYdist misura la distanza visuale tra il router corrente e il router n
            node.coordinatesDistances.push(new Connection(n.name, (Math.floor(XYdist))));
        }
    }
    for (node of nodes) {
        makeNodeDraggable(node);
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
    for (node of nodes) {
        for (n of nodes) {
            const XYdist = Math.sqrt(Math.pow(Math.abs(node.routerElement.getBoundingClientRect().left - n.routerElement.getBoundingClientRect().left), 2) + Math.pow(Math.abs(node.routerElement.getBoundingClientRect().top - n.routerElement.getBoundingClientRect().top), 2));
            // XYdist misura la distanza visuale tra il router corrente e il router n
            node.coordinatesDistances.push(new Connection(n.name, (Math.floor(XYdist))));
        }
    }
    for (node of nodes) {
        makeNodeDraggable(node);
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
    if (node1.connections.find(c => c.to == node2.name).linkElement != null) return;
    if (node1.connections.find(c => c.to == node2.name).distance == Infinity) return;
    if (node2.connections.find(c => c.to == node1.name).distance == Infinity) return;

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
    const lineDistance = document.createElement("p"); // elemento label
    line.classList.add("connectionLine");
    lineDistance.classList.add(`label_${node1Element.id}_${node2Element.id}`);
    line.id = `line_${node1Element.id}_${node2Element.id}`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    // gli estremi della linea terminano al centro dei router
    line.style.left = `${x1 - 50}px`;
    line.style.top = `${y1 - 25}px`;
    lineDistance.classList.add("distanceLabel");
    lineDistance.innerHTML = `${node1.connections.find(c => c.to == node2.name).distance}`;

    // assegna l'elemento linea all'array di connessioni dei router
    node1.connections.find(c => c.to == node2.name).linkElement = line;
    node2.connections.find(c => c.to == node1.name).linkElement = line;

    // Calcola la posizione della label al centro della linea
    const midX = (x1 + x2 - 25) / 2;
    const midY = (y1 + y2 - 12) / 2;
    lineDistance.style.position = 'absolute';
    lineDistance.style.left = `calc(${midX - 25}px - 2.5vw)`; // Adjust for label width
    lineDistance.style.top = `calc(${midY - 12}px - 2.5vh)`; // Adjust for label height

    // assegna l'elemento linea all'array di connessioni dei router
    node1.connections.find(c => c.to == node2.name).linkElement = line;
    node2.connections.find(c => c.to == node1.name).linkElement = line;

    simContainer.appendChild(line);
    simContainer.appendChild(lineDistance);
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
            try {
                const distance = nodes[i].connections.find(c => c.to == nodes[j].name).distance;
                document.getElementById(`cell_${i + 1}_${j + 1}`).textContent = distance == Infinity ? '∞' : distance;
            } catch {
                console.log("ERRORE SU " + nodes[i].name + " " + nodes[j].name);
            }
        }
    }
}

function toggleHighlightRow(node, defined) {
    const row = document.getElementById(`row_${nodes.findIndex(n => n.name == node.name) + 1}`);
    if (defined !== undefined) {
        row.classList.toggle("highlightedRow", defined);
    } else {
        row.classList.toggle("highlightedRow");
    }
}

function highlightNode(node, priority) {
    if (node.routerElement) {
        switch (priority) {
            case 1:
                node.routerElement.classList.add("highlightedRouter");
                break;
            case 2:
                node.routerElement.classList.add("lightHighlightedRouter");
                break;
            default:
                break;
        }
    }
}

function changeSpeed() {
    const speedSlider = document.getElementById("animationSpeed");
    animationSpeed = 5000 - (speedSlider.value - 1) * 45;
    log(`Animation speed set to ${animationSpeed}ms`);
}

async function delay(ms) {
    await new Promise(r => setTimeout(r, ms));
}
function highlightConnection(connection) {
    if (connection.linkElement) {
        connection.linkElement.classList.add("highlightedConnection");
    }
}
function noHighlightNode(node) {
    if (node.routerElement) {
        node.routerElement.classList = "routerElement";
    }
}
function noHighlightConnection(connection) {
    if (connection.linkElement) {
        connection.linkElement.classList.remove("highlightedConnection");
    }
}

function makeNodeDraggable(node) {
    let offsetX, offsetY;
    let isDragging = false;

    node.routerElement.addEventListener("mouseover", () => {
        toggleHighlightRow(node, true);
    });

    node.routerElement.addEventListener("mouseout", () => {
        toggleHighlightRow(node, false);
    });

    node.routerElement.addEventListener('mousedown', (e) => {
        offsetX = e.clientX - node.routerElement.getBoundingClientRect().left;
        offsetY = e.clientY - node.routerElement.getBoundingClientRect().top;
        isDragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Remove existing connection lines and distance labels
        for (let conn of node.connections) {
            if (conn.linkElement) {
                conn.linkElement.remove();
                conn.linkElement = null;
            }
            const label = document.querySelector(`.label_${node.routerElement.id}_${nodes.find(n => n.name == conn.to).routerElement.id}`);
            if (label) {
                label.remove();
            }
        }
        // Remove reverse connections and labels
        for (let otherNode of nodes) {
            if (otherNode === node) continue;
            const reverseConn = otherNode.connections.find(c => c.to === node.name);
            if (reverseConn && reverseConn.linkElement) {
                reverseConn.linkElement.remove();
                reverseConn.linkElement = null;
            }
            const reverseLabel = document.querySelector(`.label_${otherNode.routerElement.id}_${node.routerElement.id}`);
            if (reverseLabel) {
                reverseLabel.remove();
            }
        }
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        node.routerElement.style.left = `${e.clientX - offsetX}px`;
        node.routerElement.style.top = `${e.clientY - offsetY}px`;
    }

    function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        generateConnectionsUI();
    }
}
