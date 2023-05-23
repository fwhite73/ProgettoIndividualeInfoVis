// Mostra consegna
const iconConsegna = document.getElementById("consegna");
const consegnaContainer = document.getElementById("consegnaContainer");

iconConsegna.addEventListener("click", function () {
    if (consegnaContainer.style.display === "none") {
        consegnaContainer.style.display = "block";
    } else {
        consegnaContainer.style.display = "none";
    }
});

const iconDataset = document.getElementById("dataset");
const popupDataset = document.getElementById("datasetContainer");

iconDataset.addEventListener("click", function () {
    if (popupDataset.style.display === "none") {
        popupDataset.style.display = "block";
    } else {
        popupDataset.style.display = "none";
    }
});

var posX;
var posX, dataset, maxWidth, maxHeight, sumWidth, maxHtronco, x, y, svgAlbero;

d3.json("data/dataset.json")
    .then(function (data) {
        dataset = data;
        setupDrawing();
        popupDataset.innerHTML = JSON.stringify(data);
        
        fetch("../templates/albero.svg")
        .then(response => response.text())
        .then(data => {
            svgAlbero = new DOMParser().parseFromString(data, "image/svg+xml").documentElement;
            // Disegno
            drawTrees();
        })
    })
    .catch(function (error) {
        console.log(error);
    });

// Imposta le dimensioni dell'area di disegno
const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
const height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

document.getElementById('alberi').setAttribute('width', width / 1.05);
document.getElementById('alberi').setAttribute('height', height / 1.05);

// Preparazione area di disegno con sfondo
const svg = d3.select("#alberi");
svg.attr("fill", "lightblue");
svg.attr("style", "background: lightblue; border: 1px solid black;");

function setupDrawing() {
    // Calcolo parametri
    maxWidth = d3.max(dataset, (d) => 2 * d.gchioma);
    maxHeight = d3.max(dataset, (d) => 2 * d.gchioma + d.htronco);
    sumWidth = d3.sum(dataset, (d) => 2 * d.gchioma);
    maxHtronco = d3.max(dataset, (d) => d.htronco);

    x = d3.scaleLinear()
        .domain([0, sumWidth])
        .range([0, width / 1.05]);

    y = d3.scaleLinear()
        .domain([0, maxHeight])
        .range([0, height / 1.05]);



    svg.append("rect")
        .attr("x", 0)
        .attr("y", y(maxHeight / 2 * 1.5))
        .attr("width", "100%")
        .attr("height", y(maxHeight))
        .attr("fill", "green");
}



function drawTrees() {
    const svgAlbero = document.getElementsByClassName('albero')[0];
    console.log(svgAlbero);
    startX = maxWidth / 2;

    posX = [];
    svg.selectAll('.albero')
        .data(dataset)
        .enter()
        .append(() => svgAlbero.cloneNode(true))
        .attr("class", "albero")
        .attr("style","")
        .each(function (d, i) {
            startY = maxHeight / 2 + (maxHtronco - d.htronco);
            posy = y(startY) + x(d.gchioma);

            d3.select(this).select('.radici1')
                .transition()
                .attr('d', "M" + x(startX - d.radici) + " " + y(startY + d.htronco + d.htronco / 10) + " Q " + x(startX) + " " + y(startY + d.htronco * 3 / 4) + ", " + x(startX + d.radici) + " " + y(startY + d.htronco + d.htronco / 10))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)
                .attr("onclick", "sortBy('radici')");

            d3.select(this).select('.radici2')
                .transition()
                .attr('d', "M" + x(startX - d.radici / 2) + " " + y(startY + d.htronco + d.htronco / 6) + " Q " + x(startX) + " " + y(startY + d.htronco / 2) + ", " + x(startX + d.radici / 2) + " " + y(startY + d.htronco + d.htronco / 6))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)
                .attr("onclick", "sortBy('radici')");

            d3.select(this).select('.radici3')
                .transition()
                .attr('d', "M" + x(startX - d.radici / 3) + " " + y(startY + d.htronco + d.htronco / 8) + " Q " + x(startX) + " " + y(startY + d.htronco / 2) + ", " + x(startX + d.radici / 3) + " " + y(startY + d.htronco + d.htronco / 8))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)
                .attr("onclick", "sortBy('radici')");

            d3.select(this).select('.tronco')
                .transition()
                .attr('x', x(startX - d.gchioma / 8))
                .attr('y', y(startY))
                .attr('width', x(d.gchioma * 2 / 8))
                .attr("height", y(d.htronco))
                .attr("fill", "#8b4513")
                .attr("onclick", "sortBy('htronco')");

            d3.select(this).select('.cerchioEsterno')
                .transition()
                .attr('cx', x(startX))
                .attr('cy', y(startY) - x(d.gchioma))
                .attr("r", x(d.gchioma))
                .attr("fill", "lightgreen")
                .attr("onclick", "sortBy('gchioma')");

            d3.select(this).select('.cerchio')
                .transition()
                .attr('cx', x(startX))
                .attr('cy', y(startY) - x(d.gchioma))
                .attr("r", x(d.gchioma / 1.1))
                .attr("fill", "green")
                .attr("onclick", "sortBy('gchioma')");

            d3.select(this).select('.cerchioInterno')
                .transition()
                .attr('cx', x(startX))
                .attr('cy', y(startY) - x(d.gchioma))
                .attr("r", x(d.gchioma / 2))
                .attr("fill", "darkgreen")
                .attr("onclick", "sortBy('gchioma')");

            for (let i = 0; i < 8; i++) {
                let cx = Math.floor(Math.random() * d.gchioma) + startX - d.gchioma / 2;
                cy = y(startY) - x(d.gchioma) * 2 / 1.2 + y(Math.floor(Math.random() * d.gchioma) / 1.5);
                d3.select(this).select('.frutto' + i)
                    .transition()
                    .attr('cx', x(cx))
                    .attr('cy', cy)
                    .attr("rx", x(d.rfrutti))
                    .attr("ry", x(d.rfrutti))
                    .attr("fill", "red")
                    .attr("onclick", "sortBy('rfrutti')");
            }

            d.pos = i;

            posX[i] = startX;
            startX += maxWidth / 2;
        });
}

function updateTrees() {
    let transitionDuration = 2000;
    svg.selectAll('.albero')
        .each(function (d) {
            startX = posX[d.pos];

            startY = maxHeight / 2 + (maxHtronco - d.htronco);
            posy = y(startY) + x(d.gchioma);

            d3.select(this).select('.radici1')
                .transition()
                .duration(transitionDuration)
                .attr('d', "M" + x(startX - d.radici) + " " + y(startY + d.htronco + d.htronco / 10) + " Q " + x(startX) + " " + y(startY + d.htronco * 3 / 4) + ", " + x(startX + d.radici) + " " + y(startY + d.htronco + d.htronco / 10))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)

            d3.select(this).select('.radici2')
                .transition()
                .duration(transitionDuration)
                .attr('d', "M" + x(startX - d.radici / 2) + " " + y(startY + d.htronco + d.htronco / 6) + " Q " + x(startX) + " " + y(startY + d.htronco / 2) + ", " + x(startX + d.radici / 2) + " " + y(startY + d.htronco + d.htronco / 6))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)

            d3.select(this).select('.radici3')
                .transition()
                .duration(transitionDuration)
                .attr('d', "M" + x(startX - d.radici / 3) + " " + y(startY + d.htronco + d.htronco / 8) + " Q " + x(startX) + " " + y(startY + d.htronco / 2) + ", " + x(startX + d.radici / 3) + " " + y(startY + d.htronco + d.htronco / 8))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)

            d3.select(this).select('.tronco')
                .transition()
                .duration(transitionDuration)
                .attr('x', x(startX - d.gchioma / 8))
            d3.select(this).select('.cerchioEsterno')
                .transition()
                .duration(transitionDuration)
                .attr('cx', x(startX))
            d3.select(this).select('.cerchio')
                .transition()
                .duration(transitionDuration)
                .attr('cx', x(startX))
            d3.select(this).select('.cerchioInterno')
                .transition()
                .duration(transitionDuration)
                .attr('cx', x(startX))

            for (let i = 0; i < 8; i++) {
                let cx = Math.floor(Math.random() * d.gchioma) + startX - d.gchioma / 2;
                d3.select(this).select('.frutto' + i)
                    .transition()
                    .duration(transitionDuration)
                    .attr('cx', x(cx))
                    .attr("rx", x(d.rfrutti))
                    .attr("ry", x(d.rfrutti));
            }

        }
        );
}

function sortBy(parameter) {
    dataset.sort((a, b) => a[parameter] - b[parameter]);

    dataset.map(function (d, i) { d.pos = i });
    updateTrees();
}