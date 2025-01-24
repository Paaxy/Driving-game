// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ensure the canvas is properly sized
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// Log canvas size for debugging
console.log(`Canvas size: ${canvas.width}x${canvas.height}`);

// Define the car object
let car = {
    x: canvas.width / 2 - 25, // Center the car horizontally
    y: canvas.height - 150,   // Start at the bottom
    width: 50,
    height: 100,
    speed: 5,
    dx: 0, // horizontal speed
    dy: 0, // vertical speed
};

// Obstacles array
let obstacles = [];
let obstacleSpeed = 2;

// Draw the car
function drawCar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Draw the road lines
function drawRoad() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    let lineX = canvas.width / 2 - 2.5;  // Road line at center
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(lineX, i);
        ctx.lineTo(lineX, i + 15);
        ctx.stroke();
    }
}

// Generate obstacles
function createObstacle() {
    const size = Math.random() * (50 - 30) + 30; // Random size for obstacles
    const x = Math.random() * (canvas.width - size); // Random horizontal position
    const y = -size; // Start off-screen
    obstacles.push({ x, y, width: size, height: size });
}

// Draw the obstacles
function drawObstacles() {
    ctx.fillStyle = 'blue';
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Move the obstacles
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacleSpeed; // Move obstacles downwards

        // Remove obstacle if it goes off the screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
        }
    });
}

// Check for collisions between car and obstacles
function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y) {
                alert('Game Over! You hit an obstacle!');
                resetGame();
            }
    });
}

// Move the car based on user input
function moveCar() {
    car.x += car.dx;
    car.y += car.dy;

    // Boundary checks
    if (car.x < 0) car.x = 0;
    if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;
    if (car.y < 0) car.y = 0; // Prevent the car from going above the canvas
    if (car.y + car.height > canvas.height) car.y = canvas.height - car.height; // Prevent the car from going below the canvas
}

// Reset the game after a collision
function resetGame() {
    car.x = canvas.width / 2 - 25;
    car.y = canvas.height - 150;
    obstacles = [];
}

// Update the game area
function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawRoad(); // Draw the road lines
    drawCar(); // Draw the car
    drawObstacles(); // Draw obstacles
    moveObstacles(); // Move obstacles
    moveCar(); // Move the car
    checkCollisions(); // Check for collisions
    requestAnimationFrame(updateGameArea); // Keep updating
}

// Event listeners for desktop keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") {
        car.dx = -car.speed; // Move left
    } else if (e.key === "ArrowRight") {
        car.dx = car.speed; // Move right
    } else if (e.key === "ArrowUp") {
        car.dy = -car.speed; // Move forward (up)
    } else if (e.key === "ArrowDown") {
        car.dy = car.speed; // Move backward (down)
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        car.dx = 0; // Stop horizontal movement
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        car.dy = 0; // Stop vertical movement
    }
});

// Event listeners for touch controls (for mobile)
document.getElementById('left').addEventListener('touchstart', () => {
    car.dx = -car.speed; // Move left
});
document.getElementById('right').addEventListener('touchstart', () => {
    car.dx = car.speed; // Move right
});
document.getElementById('up').addEventListener('touchstart', () => {
    car.dy = -car.speed; // Move forward (up)
});
document.getElementById('down').addEventListener('touchstart', () => {
    car.dy = car.speed; // Move backward (down)
});

// Stop car movement when touch ends (for mobile)
document.querySelectorAll('.control-button').forEach(button => {
    button.addEventListener('touchend', () => {
        car.dx = 0; // Stop horizontal movement
        car.dy = 0; // Stop vertical movement
    });
});

// Create a new obstacle every 2 seconds
setInterval(createObstacle, 2000);

// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Resize canvas when entering or exiting fullscreen
document.addEventListener('fullscreenchange', resizeCanvas);

// Start the game loop
updateGameArea();
