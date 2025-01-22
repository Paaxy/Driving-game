// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ensure the canvas is properly sized
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load car image
const carImage = new Image();
carImage.src = 'https://upload.wikimedia.org/wikipedia/commons/5/55/Car_icon.svg'; // Use your own image URL

// Define the car object
let car = {
    x: canvas.width / 2 - 50, // Center the car horizontally
    y: canvas.height - 150,   // Start at the bottom
    width: 100,
    height: 50,
    speed: 5,
    dx: 0, // horizontal speed
    dy: 0, // vertical speed
};

// Obstacles array
let obstacles = [];
let obstacleSpeed = 2;

// Draw the car
function drawCar() {
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
}

// Draw a gradient sky
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB"); // Light blue for sky
    gradient.addColorStop(1, "#4682B4"); // Dark blue for sky towards bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the road
function drawRoad() {
    ctx.fillStyle = "#555";
    ctx.fillRect(0, canvas.height - 200, canvas.width, 200); // Road at the bottom

    // Draw dashed lane markings
    ctx.strokeStyle = 'white';
    ctx.setLineDash([20, 30]);  // Dashed lines
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height - 200);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]); // Reset the line dash
}

// Generate obstacles
function createObstacle() {
    const size = Math.random() * (60 - 40) + 40; // Random size for obstacles
    const x = Math.random() * (canvas.width - size); // Random horizontal position
    const y = -size; // Start off-screen
    obstacles.push({ x, y, width: size, height: size, color: getRandomColor() });
}

// Draw the obstacles
function drawObstacles() {
    obstacles.forEach((obstacle, index) => {
        ctx.fillStyle = obstacle.color;
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
    car.x = canvas.width / 2 - 50;
    car.y = canvas.height - 150;
    obstacles = [];
}

// Get a random color for obstacles
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Update the game area
function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawBackground(); // Draw the gradient sky background
    drawRoad(); // Draw the road
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

// Start the game loop
updateGameArea();
