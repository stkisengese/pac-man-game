window.onload = function () {
    renderRandomDots();
};


const mazeGrid =
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

const dotContainer = document.getElementById("dot-container");
const cellSize = 18;
const dotSize = 4;
const powerPelletSize = 15; // Larger size for power pellets
const POWER_PELLETS_COUNT = 4;
const POWER_PELLET_POINTS = 50; // Points for power pellets

function getRandomDotPercentage() {
    return 100
    // return Math.random() * (85 - 75) + 75;
}

function countPossibleDotPositions() {
    return mazeGrid.flat().filter(cell => cell === 1).length;
}

function renderRandomDots() {
    dotContainer.innerHTML = '';

    const totalPossibleDots = countPossibleDotPositions();
    const percentageToShow = getRandomDotPercentage();
    const numberOfDotsToShow = Math.floor(totalPossibleDots * (percentageToShow / 100));

    // Create array of all possible positions
    const allPositions = [];
    mazeGrid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 1) {
                allPositions.push({ row: rowIndex, col: colIndex });
            }
        });
    });

    // Define power pellet positions
    const powerPelletPositions = [
        { row: 3, col: 1 },   // Top left
        { row: 3, col: 26 },  // Top right
        { row: 23, col: 1 },  // Bottom left
        { row: 23, col: 26 }  // Bottom right
    ];

    // Remove these pellets from available positions for regular dots
    const fixedPelletPositionsToRemove = [];
    powerPelletPositions.forEach(pos => {
        const indexToRemove = allPositions.findIndex(p =>
            p.row === pos.row && p.col === pos.col
        );
        if (indexToRemove !== -1) {
            allPositions.splice(indexToRemove, 1);
        }
    });

    // Then select positions for regular dots
    const regularDotPositions = [];
    const dotsNeeded = numberOfDotsToShow - POWER_PELLETS_COUNT;
    while (regularDotPositions.length < dotsNeeded) {
        const randomIndex = Math.floor(Math.random() * allPositions.length);
        const position = allPositions.splice(randomIndex, 1)[0];
        regularDotPositions.push(position);
    }

    // Create regular dots
    regularDotPositions.forEach(pos => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dot.dataset.points = "10";
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.position = "absolute";
        dot.style.backgroundColor = "yellow";
        // dot.style.borderRadius = "50%";
        dot.style.top = `${pos.row * cellSize + cellSize / 2 - dotSize / 2}px`;
        dot.style.left = `${pos.col * cellSize + cellSize / 2 - dotSize / 2}px`;
        dotContainer.appendChild(dot);
    });

    // Create power pellets
    powerPelletPositions.forEach(pos => {
        const powerPellet = document.createElement("div");
        powerPellet.classList.add("dot", "power-pellet");
        powerPellet.dataset.points = POWER_PELLET_POINTS.toString();
        powerPellet.style.width = `${powerPelletSize}px`;
        powerPellet.style.height = `${powerPelletSize}px`;
        powerPellet.style.position = "absolute";
        powerPellet.style.backgroundSize = "cover";
        // powerPellet.style.backgroundColor = "yellow";
        //powerPellet.style.borderRadius = "50%";
        powerPellet.style.top = `${pos.row * cellSize + cellSize / 2 - powerPelletSize / 2}px`;
        powerPellet.style.left = `${pos.col * cellSize + cellSize / 2 - powerPelletSize / 2}px`;
        powerPellet.style.backgroundImage = "url('assets/sprites/powerPellet.svg')";
        // Add animation for power pellets
        // powerPellet.style.animation = "powerPelletPulse 0.7s ease-in-out infinite";
        dotContainer.appendChild(powerPellet);
    });


    // // Add ghost house visualization
    // mazeGrid.forEach((row, rowIndex) => {
    //     row.forEach((cell, colIndex) => {
    //         if (cell === 3) {
    //             const houseCell = document.createElement("div");
    //             houseCell.classList.add("ghost-house-debug");
    //             Object.assign(houseCell.style, {
    //                 position: "absolute",
    //                 width: `${cellSize}px`,
    //                 height: `${cellSize}px`,
    //                 backgroundColor: "rgba(255, 0, 0, 0.2)", // semi-transparent red
    //                 border: "1px solid red",
    //                 top: `${rowIndex * cellSize}px`,
    //                 left: `${colIndex * cellSize}px`,
    //                 zIndex: "1"
    //             });
    //             dotContainer.appendChild(houseCell);
    //         }
    //     });
    // });

    // Store game state information
    window.gameState = {
        totalDots: numberOfDotsToShow,
        dotsRemaining: numberOfDotsToShow,
        dotPercentage: percentageToShow.toFixed(1),
        powerPelletsRemaining: POWER_PELLETS_COUNT,
        maxPossibleScore: (dotsNeeded * 10) + (POWER_PELLETS_COUNT * POWER_PELLET_POINTS),
        gameOver: true,
    };

    console.log(`Generated ${dotsNeeded} regular dots and ${POWER_PELLETS_COUNT} power pellets (${percentageToShow.toFixed(1)}% of ${totalPossibleDots} possible positions)`);
    return numberOfDotsToShow;
}

function getGameState() {
    return window.gameState;
}

function collectDot(dotElement) {
    if (dotElement && dotElement.classList.contains('dot')) {
        const points = parseInt(dotElement.dataset.points) || 10;
        window.gameState.dotsRemaining--;

        if (dotElement.classList.contains('power-pellet')) {
            window.gameState.powerPelletsRemaining--;
            // You can trigger ghost vulnerability here
            document.dispatchEvent(new CustomEvent('powerPelletCollected'));
        }

        dotElement.remove();
        return points;
    }
    return 0;
}

function areAllDotsCollected() {
    return window.gameState.dotsRemaining === 0;
}

function resetDots() {
    return renderRandomDots();
}

// CSS 
const style = document.createElement('style');
style.textContent = `
@keyframes powerPelletPulse {
    0% { transform: scale(1); }
    50% { transform: scale(0.8); }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
    const pacman = document.getElementById("pacman");
    if (!pacman) {
        console.error("Pacman element not found!");
        return;
    }

    // Configuration constants - adjust these for fine-tuning
    const CELL_SIZE = 18;
    const POSITION_OFFSET = {
        x: 8,  // Adjust if Pac-Man needs to shift left/right
        y: -7   // Adjust if Pac-Man needs to shift up/down
    };
    const GRID_SNAP_THRESHOLD = 1; // How close to center before snapping

    // Starting position (in grid coordinates)
    let currentGridX = 13;
    let currentGridY = 23;

    // Pixel position (will be kept aligned to grid)
    let x = currentGridX * CELL_SIZE + POSITION_OFFSET.x;
    let y = currentGridY * CELL_SIZE + POSITION_OFFSET.y;

    //console.log(x,y)


    let speed = 3;
    let direction = "right";
    let nextDirection = "right";
    let isMoving = false;

    // // Create debug overlay for path visualization
    // function createDebugOverlay() {
    //     const overlay = document.createElement('div');
    //     overlay.style.position = 'absolute';
    //     overlay.style.top = '0';
    //     overlay.style.left = '0';
    //     overlay.style.width = '100%';
    //     overlay.style.height = '100%';
    //     overlay.style.pointerEvents = 'none';
    //     overlay.id = 'debug-overlay';

    //     mazeGrid.forEach((row, rowIndex) => {
    //         row.forEach((cell, colIndex) => {
    //             if (cell === 1) {  // If it's a path
    //                 const pathCell = document.createElement('div');
    //                 pathCell.style.position = 'absolute';
    //                 pathCell.style.width = `${CELL_SIZE}px`;
    //                 pathCell.style.height = `${CELL_SIZE}px`;
    //                 pathCell.style.top = `${rowIndex * CELL_SIZE}px`;
    //                 pathCell.style.left = `${colIndex * CELL_SIZE}px`;
    //                 pathCell.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';  // Semi-transparent red
    //                 pathCell.style.border = '1px solid rgba(255, 0, 0, 0.5)';
    //                 pathCell.style.boxSizing = 'border-box';
    //                 overlay.appendChild(pathCell);
    //             }
    //         });
    //     });

    //     document.querySelector('.maze').appendChild(overlay);
    // }

    function initializePacman() {
        Object.assign(pacman.style, {
            position: 'absolute',
            width: '16px',
            height: '16px',
            left: `${x}px`,
            top: `${y}px`,
            //backgroundColor: 'white',
            borderRadius: '50%',
            visibility: 'visible',
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.1s ease',
            zIndex: '1000'  // Ensure Pac-Man appears above debug overlay
        });

        // pacman.innerHTML = '&#9786;';

        // Create debug overlay
        //   createDebugOverlay();
    }

    function isValidMove(gridX, gridY) {
        if (gridY < 0 || gridY >= mazeGrid.length ||
            gridX < 0 || gridX >= mazeGrid[0].length) {
            return false;
        }
        return mazeGrid[gridY][gridX] === 1;
    }

    function handleTunnel(gridX, gridY) {
        if (gridY === 14) {
            if (gridX <= 0) return { x: 27, y: gridY };
            if (gridX >= 27) return { x: 0, y: gridY };
        }
        return { x: gridX, y: gridY };
    }

    function getNextPosition(currentX, currentY, dir) {
        let nextX = currentX;
        let nextY = currentY;

        switch (dir) {
            case "right": nextX++; break;
            case "left": nextX--; break;
            case "up": nextY--; break;
            case "down": nextY++; break;
        }

        const tunnelPos = handleTunnel(nextX, nextY);
        return tunnelPos;
    }

    function isAtGridCenter() {
        const gridAlignedX = Math.round(x / CELL_SIZE) * CELL_SIZE + POSITION_OFFSET.x;
        const gridAlignedY = Math.round(y / CELL_SIZE) * CELL_SIZE + POSITION_OFFSET.y;
        return Math.abs(x - gridAlignedX) < GRID_SNAP_THRESHOLD &&
            Math.abs(y - gridAlignedY) < GRID_SNAP_THRESHOLD;
    }

    function updatePacman() {
        const currentGridX = Math.round((x - POSITION_OFFSET.x) / CELL_SIZE);
        const currentGridY = Math.round((y - POSITION_OFFSET.y) / CELL_SIZE);

        if (isAtGridCenter()) {
            if (nextDirection !== direction) {
                const nextPos = getNextPosition(currentGridX, currentGridY, nextDirection);
                if (isValidMove(nextPos.x, nextPos.y)) {
                    direction = nextDirection;
                    x = currentGridX * CELL_SIZE + POSITION_OFFSET.x;
                    y = currentGridY * CELL_SIZE + POSITION_OFFSET.y;

                    let rotation = 0;
                    switch (direction) {
                        case 'right': rotation = 0; break;
                        case 'down': rotation = 90; break;
                        case 'left': rotation = 180; break;
                        case 'up': rotation = 270; break;
                    }
                    pacman.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
                }
            }
        }

        const nextPos = getNextPosition(currentGridX, currentGridY, direction);
        if (isValidMove(nextPos.x, nextPos.y)) {
            isMoving = true;
            switch (direction) {
                case "right": x += speed; break;
                case "left": x -= speed; break;
                case "up": y -= speed; break;
                case "down": y += speed; break;
            }

            if (nextPos.x === 27 && currentGridX === 0) x = nextPos.x * CELL_SIZE + POSITION_OFFSET.x;
            if (nextPos.x === 0 && currentGridX === 27) x = 0 + POSITION_OFFSET.x;
        } else {
            isMoving = false;
            x = currentGridX * CELL_SIZE + POSITION_OFFSET.x;
            y = currentGridY * CELL_SIZE + POSITION_OFFSET.y;
        }

        pacman.style.left = `${x}px`;
        pacman.style.top = `${y}px`;
    }

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
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
            // Debug controls
            case 'd':
                const overlay = document.getElementById('debug-overlay');
                if (overlay) {
                    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
                }
                break;
        }
    
    });


    // Scores
    const scoreElement = document.getElementById('score');
    let score = 0;

    function updateScore(points) {
        score += points;
        scoreElement.textContent = `${score}`;
    }

    function checkCollision() {
        const pacmanRect = pacman.getBoundingClientRect();
        const dots = document.querySelectorAll('.dot');

        dots.forEach(dot => {
            const dotRect = dot.getBoundingClientRect();
            if (
                pacmanRect.left < dotRect.right &&
                pacmanRect.right > dotRect.left &&
                pacmanRect.top < dotRect.bottom &&
                pacmanRect.bottom > dotRect.top
            ) {
                const points = collectDot(dot);
                updateScore(points);
            }
        });
    }

    function gameLoop() {
        updatePacman();  // Ensures Pac-Man updates each frame
        checkCollision(); // Checks for collisions after movement
        requestAnimationFrame(gameLoop); // Ensures smooth looping
    }

    // Initialize the game
    initializePacman();
    gameLoop(); // Start the game loop

});


// ####################################################################
// Ghostloop

document.addEventListener("DOMContentLoaded", () => {
// Ghost configuration
const GHOST_CONFIG = {
    blinky: { startX: 14, startY: 11, color: 'red', character: '👻' },
    pinky: { startX: 12, startY: 14, color: 'pink', character: '👻' },
    inky: { startX: 14, startY: 14, color: 'cyan', character: '👻' },
    clyde: { startX: 16, startY: 14, color: 'orange', character: '👻' }
};

 CELL_SIZE = 18;
const GHOST_POSITION_OFFSET = {
    x: 4,  // Horizontal offset to center ghost in path
    y: -7  // Vertical offset to center ghost in path
};
const GHOST_SPEED = 1;
 GRID_SNAP_THRESHOLD = 1;

const PACMAN_START_POS = {
    x: 13 * CELL_SIZE + GHOST_POSITION_OFFSET.x,
    y: 23 * CELL_SIZE + GHOST_POSITION_OFFSET.y
};

class Ghost {
    constructor(id, config) {
        this.element = document.getElementById(id);
        this.id = id;
        this.x = config.startX * CELL_SIZE + GHOST_POSITION_OFFSET.x;
        this.y = config.startY * CELL_SIZE + GHOST_POSITION_OFFSET.y;
        this.currentGridX = config.startX;
        this.currentGridY = config.startY;
        this.direction = this.getRandomDirection();
        this.nextDirection = this.direction;
        this.isMoving = false;
        this.isVulnerable = false;
        this.speed = GHOST_SPEED;

        this.initializeGhost(config);
    }

    initializeGhost(config) {
        Object.assign(this.element.style, {
            position: 'absolute',
            width: '15px',
            height: '15px',
            // backgroundColor: config.color,
            left: `${this.x}px`,
            top: `${this.y}px`,
            color: config.color,
            visibility: 'visible',
            transform: 'translate(-50%, -50%)',
            zIndex: '900'
        });
        // this.element.innerHTML = config.character;
    }

    getRandomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    isAtGridCenter() {
        const gridAlignedX = Math.round(this.x / CELL_SIZE) * CELL_SIZE + GHOST_POSITION_OFFSET.x;
        const gridAlignedY = Math.round(this.y / CELL_SIZE) * CELL_SIZE + GHOST_POSITION_OFFSET.y;
        return Math.abs(this.x - gridAlignedX) < GRID_SNAP_THRESHOLD &&
            Math.abs(this.y - gridAlignedY) < GRID_SNAP_THRESHOLD;
    }

    isValidMove(gridX, gridY) {
        if (gridY < 0 || gridY >= mazeGrid.length ||
            gridX < 0 || gridX >= mazeGrid[0].length) {
            return false;
        }
        // Allow movement on paths (1), ghost house entrance (2) and ghost house (3)
        return mazeGrid[gridY][gridX] === 1 ||
            mazeGrid[gridY][gridX] === 2 ||
            mazeGrid[gridY][gridX] === 3;
    }

    handleTunnel(gridX, gridY) {
        if (gridY === 14) {
            if (gridX <= 0) return { x: 27, y: gridY };
            if (gridX >= 27) return { x: 0, y: gridY };
        }
        return { x: gridX, y: gridY };
    }

    getNextPosition(currentX, currentY, dir) {
        let nextX = currentX;
        let nextY = currentY;

        switch (dir) {
            case "right": nextX++; break;
            case "left": nextX--; break;
            case "up": nextY--; break;
            case "down": nextY++; break;
        }

        return this.handleTunnel(nextX, nextY);
    }

    chooseNextDirection() {
        const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
            const nextPos = this.getNextPosition(this.currentGridX, this.currentGridY, dir);
            return this.isValidMove(nextPos.x, nextPos.y);
        });

        // Don't reverse direction unless it's the only option
        const oppositeDir = {
            'up': 'down', 'down': 'up',
            'left': 'right', 'right': 'left'
        };
        const filteredDirections = possibleDirections.filter(dir =>
            dir !== oppositeDir[this.direction]
        );

        if (filteredDirections.length > 0) {
            return filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
        }
        return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    }

    makeVulnerable() {
        this.isVulnerable = true;
        this.element.style.color = 'blue';
        this.speed = GHOST_SPEED * 0.5; // Slower when vulnerable

        setTimeout(() => {
            this.isVulnerable = false;
            this.element.style.color = GHOST_CONFIG[this.id].color;
            this.speed = GHOST_SPEED;
        }, 10000); // 10 seconds of vulnerability
    }

    checkCollision(pacmanX, pacmanY) {
        const collisionThreshold = CELL_SIZE / 2;
        const dx = Math.abs(this.x - pacmanX);
        const dy = Math.abs(this.y - pacmanY);
        return dx < collisionThreshold && dy < collisionThreshold;
    }

    update() {
        if (this.isAtGridCenter()) {
            this.currentGridX = Math.round((this.x - GHOST_POSITION_OFFSET.x) / CELL_SIZE);
            this.currentGridY = Math.round((this.y - GHOST_POSITION_OFFSET.y) / CELL_SIZE);

            // Choose new direction at intersections
            this.nextDirection = this.chooseNextDirection();
            this.direction = this.nextDirection;
        }

        const nextPos = this.getNextPosition(this.currentGridX, this.currentGridY, this.direction);
        if (this.isValidMove(nextPos.x, nextPos.y)) {
            this.isMoving = true;
            switch (this.direction) {
                case "right": this.x += this.speed; break;
                case "left": this.x -= this.speed; break;
                case "up": this.y -= this.speed; break;
                case "down": this.y += this.speed; break;
            }

            // Handle tunnel teleportation
            if (nextPos.x === 27 && this.currentGridX === 0) this.x = nextPos.x * CELL_SIZE + GHOST_POSITION_OFFSET.x;
            if (nextPos.x === 0 && this.currentGridX === 27) this.x = 0 + GHOST_POSITION_OFFSET.x;
        } else {
            this.isMoving = false;
            this.x = this.currentGridX * CELL_SIZE + GHOST_POSITION_OFFSET.x;
            this.y = this.currentGridY * CELL_SIZE + GHOST_POSITION_OFFSET.y;
            this.nextDirection = this.chooseNextDirection();
        }

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    reset() {
        const config = GHOST_CONFIG[this.id]; // Get original starting position
        this.x = config.startX * CELL_SIZE + GHOST_POSITION_OFFSET.x;
        this.y = config.startY * CELL_SIZE + GHOST_POSITION_OFFSET.y;
        this.currentGridX = config.startX;
        this.currentGridY = config.startY;
        this.direction = this.getRandomDirection();
        this.nextDirection = this.direction;
        this.isMoving = false;
        this.isVulnerable = false;
        this.update(); // Immediately update position
    }

}

// Add game state
let lives = 2; //there are three lives. the last life is 0(for pacman life elemnet indexing)
let isImmune = false;
let immunityTime = 2000; // 2 seconds immunity after collision
let gameover = false
resetPacman = false
// let gstatege=GameState()
// console.log(gstatege)
//console.log(PACMAN_START_POS)
function handleCollision() {
    if (isImmune) return;

    lives--;
    console.log(`Collision! Lives remaining: ${lives}`);

    // Reset Pac-Man position
    const pacman = document.getElementById('pacman');
    if (pacman) {
        pacman.style.left = `${PACMAN_START_POS.x}px`;
        pacman.style.top = `${PACMAN_START_POS.y}px`;
    }

    // Reset all ghosts
    Object.values(ghosts).forEach(ghost => ghost.reset());


    // Apply fade-in effect to maze
    const overlay = document.getElementById('fade-overlay');
    if (overlay && lives > -1) {
        overlay.style.opacity = '1';
        overlay.style.backgroundColor = 'black'
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 800); // Duration of fade-in and fade-out animation
    }


    if (lives === -1) {
        const gameOverAlert = document.querySelector('.game-over')
        gameOverAlert.style.display = 'block'
        overlay.style.opacity = '1';
        overlay.style.backgroundColor = ''
        console.log('Game Over!');
        gameover = true
        return;
    }

    // Temporary immunity after respawn
    isImmune = true;
    setTimeout(() => { isImmune = false; }, immunityTime);

    // Remove or hide one life indicator
    const lifeElements = document.querySelectorAll('.pacman-life');
    if (lifeElements[lives]) {
        lifeElements[lives].style.visibility = 'hidden';
    }
}


function updateGhosts() {
    const pacman = document.getElementById('pacman');
    if (!pacman) return;

    const pacmanX = parseInt(pacman.style.left);
    const pacmanY = parseInt(pacman.style.top);

    Object.values(ghosts).forEach(ghost => {
        ghost.update();

        // Check for collision
        if (ghost.checkCollision(pacmanX, pacmanY)) {
            handleCollision();
        }
    });
}

// Initialize ghosts
const ghosts = {};
for (const [id, config] of Object.entries(GHOST_CONFIG)) {
    ghosts[id] = new Ghost(id, config);
}

// Handle power pellet collection
document.addEventListener('powerPelletCollected', () => {
    Object.values(ghosts).forEach(ghost => ghost.makeVulnerable());
});

// Game loop for ghost movement
function ghostLoop() {
    updateGhosts();
    requestAnimationFrame(ghostLoop);
}

if (gameover == false) {
    ghostLoop();
}
});

