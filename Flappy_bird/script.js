const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdY = canvas.height / 2;
let velocity = 0;
const gravity = 0.2;
const jumpStrength = -5;
let gameOver = false;
let score = 0;
let pipeX = canvas.width;
const pipeGap = 150;
const pipeWidth = 50;
const pipeSpeed = 2;
let pipes = [];
let pipePassed = false;
let pipeColor = 'green'; // Initial pipe color

// Clouds properties
const clouds = [];
const cloudSpeed = 0.5;
const cloudHeight = 100;
const cloudWidth = 150;
const maxClouds = 5;

// Generate initial clouds
generateClouds();

function drawWings(dir = 0){
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    if (dir == 1){
        ctx.arc(105, birdY, 10, 0, Math.PI, true); 
    }
    else {
        ctx.arc(105, birdY, 10, 0, Math.PI, false); 
    }
    ctx.fill();
}

function drawBird() {
    // Body
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.arc(110, birdY, 20, 0, Math.PI, false); 
    ctx.fill();
    
    // Head
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.arc(125, birdY, 10, 10, Math.PI, false); 
    ctx.fill();
    
    // Tail
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(95, birdY + 3);
    ctx.lineTo(80, birdY - 7);
    ctx.lineTo(80, birdY + 13);
    ctx.closePath();
    ctx.fill();
  
    // Beak
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(140, birdY);
    ctx.lineTo(130, birdY - 7);
    ctx.lineTo(130, birdY + 7);
    ctx.closePath();
    ctx.fill();
}

function drawPipe(pipeY, reverse = false) {
    ctx.fillStyle = pipeColor; // Set pipe color
    if (!reverse) {
        ctx.fillRect(pipeX, 0, pipeWidth, pipeY - pipeGap / 2);
        ctx.fillRect(pipeX, pipeY + pipeGap / 2, pipeWidth, canvas.height - pipeY - pipeGap / 2);
    } else {
        ctx.fillRect(pipeX, 0, pipeWidth, pipeY - pipeGap / 2);
        ctx.fillRect(pipeX, pipeY + pipeGap / 2, pipeWidth, canvas.height - pipeY - pipeGap / 2);
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function updateBird() {
    velocity += gravity;
    birdY += velocity;
    if (birdY > canvas.height || birdY < 0) {
        gameOver = true;
    }  
    if (velocity >= 0) {
        drawWings(1);
    }
    else {
        drawWings();
    }
}

function updatePipe() {
    pipeX -= pipeSpeed;
    if (pipeX + pipeWidth < 0) {
        pipeX = canvas.width;
        pipePassed = false;
        pipes.shift();
    }
    if (pipeX + pipeWidth > 100 && pipeX < 120 && !pipePassed) {
        score++;
        pipePassed = true;
    }
    if (pipes.length > 0 && pipeX < 120 && pipeX + pipeWidth > 100) {
        if (birdY - 10 > pipes[0].y + pipeGap / 2 || birdY + 10 < pipes[0].y - pipeGap / 2) {
            score++;
        }
    }
    if (pipeX + pipeWidth > 100 && pipeX < 120 &&
        (birdY < pipes[0].y - pipeGap / 2 || birdY > pipes[0].y + pipeGap / 2)) {
        gameOver = true;
    }

    // Check if the pipe is completely out of the canvas before changing color
    if (pipeX < -40 ) {
        changePipeColor();
    }
}

function drawSun() {
    // Define sun properties
    const sunRadius = 50;
    const sunColor = '#FDB813';

    // Draw sun
    ctx.fillStyle = sunColor;
    ctx.beginPath();
    ctx.arc(canvas.width - 200, 70, sunRadius, 0, Math.PI * 2);
    ctx.fill();
}
function generatePipe() {
    const y = Math.floor(Math.random() * (canvas.height - pipeGap)) + pipeGap / 2;
    pipes.push({ y });
}

function generateClouds() {
    for (let i = 0; i < maxClouds; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height - cloudHeight),
            size: Math.random() * 50 + 50 // Random cloud size
        });
    }
}


function moveClouds() {
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].x += cloudSpeed;
        if (clouds[i].x + cloudWidth < 0) { // Check if the endmost point of the cloud is outside the canvas
            clouds[i].x = canvas.width; // Reset the cloud position to the right side of the canvas
            clouds[i].y = Math.random() * (canvas.height - cloudHeight);
        }
        if (clouds[i].x - clouds[i].size > canvas.width) { // Check if the endmost point of the cloud has reached the canvas width
            clouds[i].x = -cloudWidth; // Reset the cloud position to the left side of the canvas
            clouds[i].y = Math.random() * (canvas.height - cloudHeight);
        }
    }
}


function drawClouds() {
    for (let i = 0; i < clouds.length; i++) {
        const cloudGradient = ctx.createRadialGradient(
            clouds[i].x, clouds[i].y, 0,
            clouds[i].x, clouds[i].y, clouds[i].size
        );
        cloudGradient.addColorStop(0, 'white');
        cloudGradient.addColorStop(1, 'lightgray');

        ctx.fillStyle = cloudGradient;
        ctx.beginPath();
        // Draw the main ellipse
        ctx.ellipse(clouds[i].x, clouds[i].y, clouds[i].size, clouds[i].size / 2, 0, 0, Math.PI * 2);
        
        // Draw a smaller ellipse
        ctx.ellipse(clouds[i].x, clouds[i].y, clouds[i].size * 0.8, clouds[i].size * 0.4, 0, 0, Math.PI * 2);

        // Draw circles around the larger ellipse
        const numCircles = 6;
        const circleRadius = clouds[i].size * 0.3;
        for (let j = 0; j < numCircles; j++) {
            const angle = (j / numCircles) * Math.PI * 2;
            const x = clouds[i].x + Math.cos(angle) * circleRadius;
            const y = clouds[i].y + Math.sin(angle) * circleRadius;
            const distanceX = Math.abs(x - clouds[i].x) / (clouds[i].size * 0.6);
            const distanceY = Math.abs(y - clouds[i].y) / (clouds[i].size * 0.2);
            const diameter = (distanceX > distanceY) ? clouds[i].size * 0.8 : clouds[i].size;
            ctx.moveTo(x +diameter , y);
            ctx.arc(x, y, diameter / 2, 0, Math.PI * 2);
        }

        ctx.closePath();
        ctx.fill();
    }
}

function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSun();
        drawClouds(); // Draw clouds
        drawBird();
        pipes.forEach(pipe => drawPipe(pipe.y));
        drawScore();
        updateBird();
        updatePipe();
        moveClouds(); // Move clouds
        if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 200) {
            generatePipe();
        }
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '36px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 40);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !gameOver) {
        velocity = jumpStrength;
    }
});

canvas.addEventListener('click', function (event) {
    if (!gameOver) {
        velocity = jumpStrength;
    }
});

function changePipeColor() {
    pipeColor = getRandomColor(); // Change pipe color to a random color
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

generatePipe();
gameLoop();
