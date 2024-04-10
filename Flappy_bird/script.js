const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdY = canvas.height / 2;
let velocity = 0;
const gravity = 0.5;
const jumpStrength = -10;
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

function drawBird() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(110, birdY, 10, 0, Math.PI * 2);
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
        changePipeColor(); // Change pipe color when crossing boundary
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
        if (clouds[i].x > canvas.width) {
            clouds[i].x = -cloudWidth;
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
        ctx.ellipse(clouds[i].x, clouds[i].y, clouds[i].size, clouds[i].size / 2, 0, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
