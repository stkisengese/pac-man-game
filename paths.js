document.addEventListener("DOMContentLoaded", () => {
    const pacman = document.getElementById("pacman");
    if (!pacman) {
        console.error("Pacman element not found!");
        return;
    }

    // Cell size matches the one defined earlier
    const CELL_SIZE = 18;
    
    // Starting position (convert grid coordinates to pixels)
    let currentGridX = 13; // Starting grid X position
    let currentGridY = 23; // Starting grid Y position
    let x = currentGridX * CELL_SIZE;
    let y = currentGridY * CELL_SIZE;
    
    let speed = 3;
    let direction = "right";
    let nextDirection = "right";

    // Define sprites for each direction
    const sprites = {
        right: "assets/sprites/pacman-right.gif",
        left: "assets/sprites/pacman-left.gif",
        up: "assets/sprites/pacman-up.gif",
        down: "assets/sprites/pacman-down.gif"
    };

    function initializePacman() {
        // Set all initial styles directly
        Object.assign(pacman.style, {
            position: 'absolute',
            width: '18px',
            height: '18px',
            left: `${x}px`,
            top: `${y}px`,
            backgroundColor: 'yellow',
            borderRadius: '50%',
            visibility: 'visible',
            transform: 'translate(-50%, -50%)', // Center Pac-Man on grid
            transition: 'transform 0.1s ease' // Smooth rotation
        });
        
        // Create content for Pac-Man
        pacman.innerHTML = '&#9786;'; // Using a simple face character as placeholder
        // Note: Replace this with actual sprite images when available
    }

    function isValidMove(gridX, gridY) {
        // Check if position is within bounds
        if (gridY < 0 || gridY >= mazeGrid.length || 
            gridX < 0 || gridX >= mazeGrid[0].length) {
            return false;
        }
        // Check if position is a path (1)
        return mazeGrid[gridY][gridX] === 1;
    }

    function handleTunnel(gridX, gridY) {
        // Handle horizontal tunnel wrapping
        if (gridY === 14) { // Tunnel row
            if (gridX <= 0) return { x: 27, y: gridY }; // Wrap to right
            if (gridX >= 27) return { x: 0, y: gridY }; // Wrap to left
        }
        return { x: gridX, y: gridY };
    }

    function getNextPosition(currentX, currentY, dir) {
        let nextX = currentX;
        let nextY = currentY;
        
        switch(dir) {
            case "right": nextX++; break;
            case "left": nextX--; break;
            case "up": nextY--; break;
            case "down": nextY++; break;
        }

        // Handle tunnel wrapping
        const tunnelPos = handleTunnel(nextX, nextY);
        nextX = tunnelPos.x;
        nextY = tunnelPos.y;

        return { x: nextX, y: nextY };
    }

    function updatePacman() {
        // Try to move in the next direction if it's different from current
        if (nextDirection !== direction) {
            const nextPos = getNextPosition(
                Math.round(x / CELL_SIZE), 
                Math.round(y / CELL_SIZE), 
                nextDirection
            );
            
            if (isValidMove(nextPos.x, nextPos.y)) {
                direction = nextDirection;
                // Update rotation based on direction
                let rotation = 0;
                switch(direction) {
                    case 'right': rotation = 0; break;
                    case 'down': rotation = 90; break;
                    case 'left': rotation = 180; break;
                    case 'up': rotation = 270; break;
                }
                pacman.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            }
        }

        // Move in current direction
        const currentGridX = Math.round(x / CELL_SIZE);
        const currentGridY = Math.round(y / CELL_SIZE);
        const nextPos = getNextPosition(currentGridX, currentGridY, direction);

        if (isValidMove(nextPos.x, nextPos.y)) {
            switch(direction) {
                case "right": x += speed; break;
                case "left": x -= speed; break;
                case "up": y -= speed; break;
                case "down": y += speed; break;
            }

            // Handle tunnel wrapping for pixel position
            if (nextPos.x === 27 && currentGridX === 0) x = nextPos.x * CELL_SIZE;
            if (nextPos.x === 0 && currentGridX === 27) x = 0;
        }

        // Update position
        pacman.style.left = `${x}px`;
        pacman.style.top = `${y}px`;
    }

    // Handle movement with arrow keys
    document.addEventListener("keydown", (event) => {
        switch(event.key) {
            case "ArrowRight": 
                event.preventDefault();
                nextDirection = "right"; 
                break;
            case "ArrowLeft": 
                event.preventDefault();
                nextDirection = "left"; 
                break;
            case "ArrowUp": 
                event.preventDefault();
                nextDirection = "up"; 
                break;
            case "ArrowDown": 
                event.preventDefault();
                nextDirection = "down"; 
                break;
        }
    });

    // Set up game loop
    function gameLoop() {
        updatePacman();
        requestAnimationFrame(gameLoop);
    }

    // Initialize game
    initializePacman();
    gameLoop();
});