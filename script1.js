const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let length = 2;
let lengthMax = 2;
let x1 = 30;
let y1 = 170;
let direction = '-';
let lastDirection = '-';
let playing = true;
let score = 0;
let fruitX, fruitY;
let eaten = false;
let snake = [];
let scoreText = '';
const snakeRadius = 5; // Radius of each snake segment

function start() {
    scoreText = `SCORE: ${score}`;
    fruitX = Math.floor(Math.random() * 34) * 10;
    fruitY = Math.floor(Math.random() * 34) * 10;
    if (fruitY === 0) {
        fruitY = 10;
    }
    for (let i = 0; i < lengthMax; i++) {
        snake.push({ x: x1, y: y1 });
    }
}

function update() {
    scoreText = `SCORE: ${score}`;
    fruit();
    move();
    graphic();
}

function move() {
    document.onkeydown = function(event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 87: // W
            case 38: // Up arrow
                if (lastDirection !== 's' && lastDirection !== 'S') {
                    direction = 'w';
                }
                break;
            case 65: // A
            case 37: // Left arrow
                if (lastDirection !== 'd' && lastDirection !== 'D') {
                    direction = 'a';
                }
                break;
            case 83: // S
            case 40: // Down arrow
                if (lastDirection !== 'w' && lastDirection !== 'W') {
                    direction = 's';
                }
                break;
            case 68: // D
            case 39: // Right arrow
                if (lastDirection !== 'a' && lastDirection !== 'A') {
                    direction = 'd';
                }
                break;
        }
        event.preventDefault();
    };

    lastDirection = direction;

    if (direction === 's' || direction === 'S') {
        y1 += 10;
    } else if (direction === 'a' || direction === 'A') {
        x1 -= 10;
    } else if (direction === 'w' || direction === 'W') {
        y1 -= 10;
    } else if (direction === 'd' || direction === 'D') {
        x1 += 10;
    }
    if (x1 >= canvas.width || x1 < 0 || y1 >= canvas.height || y1 < 10) {
        // alert("Game ended");
        location.reload();
        playing = false; // Set playing to false if snake strikes the boundary
    }
    snake.pop(); // Remove the last segment of the snake
    snake.unshift({ x: x1, y: y1 }); // Add new head segment to the beginning of the snake
}

function graphic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, 10);

    ctx.fillStyle = 'white';
    ctx.fillText(scoreText, 10, 10);

    ctx.fillStyle = 'red';
    ctx.fillRect(fruitX, fruitY, 10, 10);

    ctx.fillStyle = 'blue'; // Set snake color to blue
    snake.forEach(segment => {
        ctx.beginPath();
        ctx.arc(segment.x + snakeRadius, segment.y + snakeRadius, snakeRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function fruit() {
    if (x1 === fruitX && y1 === fruitY) {
        eaten = true;
    }

    if (eaten) {
        eaten = false;
        lengthMax++;
        score++;
        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y }); // Add new tail segment
        fruitX = Math.floor(Math.random() * 34) * 10;
        fruitY = Math.floor(Math.random() * 34) * 10;

        for (let j = 0; j < length; j++) {
            if (fruitX === snake[j].x && fruitY === snake[j].y) {
                fruitX = Math.floor(Math.random() * 34) * 10;
                fruitY = Math.floor(Math.random() * 34) * 10;
            }
        }
        if (fruitY === 0) {
            fruitY = 10;
        }
    }
}

start();
setInterval(update, 150);
