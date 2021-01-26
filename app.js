const canvas = document.getElementById('canvas');

canvas.width = 1000;
canvas.height = 800;
canvas.style.width = '1000px';
canvas.style.height = '800px';


function drawPixel (x, y, canvas, color = 'black'){
    const ctx2d = canvas.getContext('2d');
    ctx2d.strokeStyle = color;
    ctx2d.strokeRect(x, y, 1, 1);
}

function clearCanvas (canvas) {
    const ctx2d = canvas.getContext('2d');
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
}

class LineCoordinates {
    constructor (x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

function drawLine(coords, gradient = false) {
    const { dx, dy } = calculateDeltas(coords);
    const stepX = (coords.x1 < coords.x2) ? 1 : -1;
    const stepY = (coords.y1 < coords.y2) ? 1 : -1;
    let err = dx - dy;
    
    const lineLength = Math.sqrt(dx*dx + dy*dy);
    let iterations = 0;

    drawPixel(coords.x1, coords.y1, canvas);

    while(!((coords.x1 === coords.x2) && (coords.y1 === coords.y2))) {
        iterations ++;
        const doubleErr = err * 2;
        const color = gradient ? 'rgba(0,0,0,X)'.replace('X', (1 - iterations/lineLength).toFixed(5)) : 'rgb(0,0,0)';
        if (doubleErr > -dy) {
            err -= dy;
            coords.x1 += stepX;
        }

        if (doubleErr < dx) {
            err += dx;
            coords.y1 += stepY;
        }

        drawPixel(coords.x1, coords.y1, canvas, color);
    }
}


function calculateDeltas(coords) {
    return { dx: Math.abs(coords.x1 - coords.x2), dy: Math.abs(coords.y1 - coords.y2) }
}

let clickCount = 0;
let firstClickCoords; 
canvas.addEventListener("mousedown", (event) => {
    clickCount ++;

    if (clickCount === 1) {
        drawPixel(event.offsetX, event.offsetY, canvas, 'blue');
        firstClickCoords = {x: event.offsetX, y: event.offsetY}
    }
    if (clickCount === 2) {
        coords = new LineCoordinates(firstClickCoords.x, firstClickCoords.y, event.offsetX, event.offsetY);
        drawLine(coords, true);
        clickCount = 0;
        firstClickCoords = {};
    }
})