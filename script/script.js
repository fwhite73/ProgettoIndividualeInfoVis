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

const RANGE_CHIOMA = [width/50, width/10]
const RANGE_FRUTTI = [width/250, width/200]
const RANGE_TRONCO = [height/7, height/4]
const RANGE_RADICI = [width/40, width/10]

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
        .domain([0, 5*maxWidth])
        .range([0, width / 1.05]);

    y = d3.scaleLinear()
        .domain([0, maxHeight])
        .range([0, height / 1.05]);

    scaleChioma = d3.scaleLinear()
    .domain([d3.min(dataset, (d) => d.gchioma), d3.max(dataset, (d) => d.gchioma)])
    .range(RANGE_CHIOMA);

    scaleFrutti = d3.scaleLinear()
    .domain([d3.min(dataset, (d) => d.rfrutti), d3.max(dataset, (d) => 2*d.rfrutti)])
    .range(RANGE_FRUTTI);
    
    scaleTronco = d3.scaleLinear()
    .domain([d3.min(dataset, (d) => d.htronco), d3.max(dataset, (d) => 2*d.htronco)])
    .range(RANGE_TRONCO);

    scaleRadici = d3.scaleLinear()
    .domain([d3.min(dataset, (d) => d.radici), d3.max(dataset, (d) => 2*d.radici)])
    .range(RANGE_RADICI);
    

    svg.append("rect")
        .attr("x", 0)
        .attr("y", y(maxHeight / 2 * 1.2))
        .attr("width", "100%")
        .attr("height", y(maxHeight))
        .attr("fill", "green");

}



function drawTrees() {
    const svgAlbero = document.getElementsByClassName('albero')[0];
    startX = maxWidth / 4;
    var step = maxWidth / 2;

    posX = [];
    svg.selectAll('.albero')
        .data(dataset)
        .enter()
        .append(() => svgAlbero.cloneNode(true))
        .attr("class", "albero")
        .attr("style","")
        .each(function (d, i) {
            startY = maxHeight / 2;
            posy = y(startY) + scaleChioma(d.gchioma);

            d3.select(this).select('.radici1')
                .transition()
                .attr('d', "M" + (x(startX) - scaleRadici(d.radici)) + " " + (y(startY) + scaleTronco(1.2*d.htronco)) + " Q " + x(startX) + " " + (y(startY) + scaleTronco(d.htronco)/1.2) + ", " + (x(startX) + scaleRadici(d.radici)) + " " + (y(startY) + scaleTronco(1.2*d.htronco)))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)
                .attr("onclick", "sortBy('radici')");

            d3.select(this).select('.radici2')
                .transition()
                .attr('d', "M" + (x(startX) - scaleRadici(d.radici/3)) + " " + (y(startY) + scaleTronco(1.3*d.htronco)) + " Q " + x(startX) + " " + (y(startY) + scaleTronco(d.htronco)/1.3) + ", " + (x(startX) + scaleRadici(d.radici/3)) + " " + (y(startY) + scaleTronco(1.3*d.htronco)))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)
                .attr("onclick", "sortBy('radici')");

            d3.select(this).select('.radici3')
                .transition()
                .attr('d', "M" + (x(startX) - scaleRadici(d.radici/5)) + " " + (y(startY) + scaleTronco(1.4*d.htronco)) + " Q " + x(startX) + " " + (y(startY) + scaleTronco(d.htronco)/1.4) + ", " + (x(startX) + scaleRadici(d.radici/5)) + " " + (y(startY) + scaleTronco(1.4*d.htronco)))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)
                .attr("onclick", "sortBy('radici')");

            d3.select(this).select('.tronco')
                .transition()
                .attr('x', x(startX)-(scaleTronco(d.htronco)/10))
                .attr('y', y(startY))
                .attr('width', scaleTronco(d.htronco)/5)
                .attr("height", scaleTronco(d.htronco))
                .attr("fill", "#8b4513")
                .attr("onclick", "sortBy('htronco')");

            d3.select(this).select('.cerchioEsterno')
                .transition()
                .attr('cx', x(startX))
                .attr('cy', y(startY) - scaleChioma(d.gchioma))
                .attr("r", scaleChioma(d.gchioma))
                .attr("fill", "lightgreen")
                .attr("onclick", "sortBy('gchioma')");

            d3.select(this).select('.cerchio')
                .transition()
                .attr('cx', x(startX))
                .attr('cy', y(startY) - scaleChioma(d.gchioma))
                .attr("r", scaleChioma(d.gchioma / 1.1))
                .attr("fill", "green")
                .attr("onclick", "sortBy('gchioma')");

            d3.select(this).select('.cerchioInterno')
                .transition()
                .attr('cx', x(startX))
                .attr('cy', y(startY) - scaleChioma(d.gchioma))
                .attr("r", scaleChioma(d.gchioma / 2))
                .attr("fill", "darkgreen")
                .attr("onclick", "sortBy('gchioma')");

            for (let i = 0; i < 8; i++) {
                let cx = Math.floor(Math.random() * d.gchioma) + startX - d.gchioma / 2;
                cy = y(startY) - scaleChioma(d.gchioma) * 2 / 1.2 + y(Math.floor(Math.random() * d.gchioma) / 1.5);
                d3.select(this).select('.frutto' + i)
                    .transition()
                    .attr('cx', x(cx))
                    .attr('cy', cy)
                    .attr("rx", scaleFrutti(d.rfrutti))
                    .attr("ry", scaleFrutti(d.rfrutti))
                    .attr("fill", "red")
                    .attr("onclick", "sortBy('rfrutti')");
            }

            d.pos = i;

            posX[i] = startX;
            startX += step;
        });
}

function updateTrees() {
    let transitionDuration = 2000;
    document.getElementById('movimento1').setAttribute('style', 'display:block');
    document.getElementById('movimento2').setAttribute('style', 'display:block');
    svg.selectAll('.albero')
        .each(function (d) {
            startX = posX[d.pos];

            startY = maxHeight / 2;
            
            d3.select(this).select('.radici1')
                .transition()
                .duration(transitionDuration)
                .attr('d', "M" + (x(startX) - scaleRadici(d.radici)) + " " + (y(startY) + scaleTronco(1.2*d.htronco)) + " Q " + x(startX) + " " + (y(startY) + scaleTronco(d.htronco)/1.2) + ", " + (x(startX) + scaleRadici(d.radici)) + " " + (y(startY) + scaleTronco(1.2*d.htronco)))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)
                .attr("onclick", "sortBy('radici')");

            d3.select(this).select('.radici2')
                .transition()
                .duration(transitionDuration)
                .attr('d', "M" + (x(startX) - scaleRadici(d.radici/3)) + " " + (y(startY) + scaleTronco(1.3*d.htronco)) + " Q " + x(startX) + " " + (y(startY) + scaleTronco(d.htronco)/1.3) + ", " + (x(startX) + scaleRadici(d.radici/3)) + " " + (y(startY) + scaleTronco(1.3*d.htronco)))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)
                .attr("onclick", "sortBy('radici')");

            d3.select(this).select('.radici3')
                .transition()
                .duration(transitionDuration)
                .attr('d', "M" + (x(startX) - scaleRadici(d.radici/5)) + " " + (y(startY) + scaleTronco(1.4*d.htronco)) + " Q " + x(startX) + " " + (y(startY) + scaleTronco(d.htronco)/1.4) + ", " + (x(startX) + scaleRadici(d.radici/5)) + " " + (y(startY) + scaleTronco(1.4*d.htronco)))
                .attr("stroke", "#8b4513")
                .attr("stroke-width", 4)

            d3.select(this).select('.tronco')
                .transition()
                .duration(transitionDuration)
                .attr('x', x(startX)-(scaleTronco(d.htronco)/10))
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
                    .attr("rx", scaleFrutti(d.rfrutti))
                    .attr("ry", scaleFrutti(d.rfrutti));
            }

        }
        );
        setTimeout(() => {
            document.getElementById('movimento1').setAttribute('style', 'display:none');
            document.getElementById('movimento2').setAttribute('style', 'display:none');    
        }, 2000);
    
}

function sortBy(parameter) {
    dataset.sort((a, b) => a[parameter] - b[parameter]);

    dataset.map(function (d, i) { d.pos = i });
    updateTrees();
}