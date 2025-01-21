// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fit the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define the car object
let car = {
    x: canvas.width / 2 - 25, // Center the car horizontally
    y: canvas.height - 100,   // Place it at the bottom
    width: 50,
    height: 100,
    speed: 5,
    dx: 0, // horizontal speed
};

// Draw the car
function drawCar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Move the car based on user input
function moveCar() {
    car.x += car.dx;
    
    // Boundary check (keep car within canvas)
    if (car.x < 0) car.x = 0;
    if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;
}

// Update the canvas
function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawCar(); // Redraw the car
    moveCar(); // Move the car
    requestAnimationFrame(updateGameArea); // Keep updating
}

// Handle key presses for car movement
function keyDownHandler(e) {
    if (e.key === "ArrowLeft") {
        car.dx = -car.speed; // Move left
    } else if (e.key === "ArrowRight") {
        car.dx = car.speed; // Move right
    }
}

// Handle key release to stop the car
function keyUpHandler(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        car.dx = 0; // Stop moving when key is released
    }
}

// Add event listeners for keydown and keyup
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// Start the game loop
updateGameArea();
