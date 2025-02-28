import { mazeGrid, resetPacmanPosition, changePacmanImage } from './maze.js';

document.addEventListener("DOMContentLoaded", () => {
    class GhostManager {
        constructor() {
            this.mode = 'scatter';
            this.modeTimer = 0;
            this.modePatterns = [
                { mode: 'scatter', duration: 7000 },  // 7 seconds scatter
                { mode: 'chase', duration: 20000 },   // 20 seconds chase
                { mode: 'scatter', duration: 7000 },  // 7 seconds scatter
                { mode: 'chase', duration: 20000 },   // 20 seconds chase
                { mode: 'scatter', duration: 5000 },  // 5 seconds scatter
                { mode: 'chase', duration: 20000 },   // 20 seconds chase
                { mode: 'scatter', duration: 5000 },  // 5 seconds scatter
                { mode: 'chase', duration: -1 }       // Chase indefinitely
            ];
            this.currentPatternIndex = 0;

            this.scatterTargets = {
                'blinky': { x: 25, y: 0 },  // Top-right
                'pinky': { x: 2, y: 0 },    // Top-left
                'inky': { x: 27, y: 30 },   // Bottom-right
                'clyde': { x: 0, y: 30 }    // Bottom-left
            };
        }

        update(deltaTime) {
            // Update mode timer
            this.modeTimer += deltaTime;

            const currentPattern = this.modePatterns[this.currentPatternIndex];

            // Check if it's time to switch modes
            if (currentPattern.duration > 0 && this.modeTimer >= currentPattern.duration) {
                this.modeTimer = 0;
                this.currentPatternIndex = (this.currentPatternIndex + 1) % this.modePatterns.length;
                this.mode = this.modePatterns[this.currentPatternIndex].mode;

                // Signal ghosts to reverse direction when mode changes
                document.dispatchEvent(new CustomEvent('ghostModeChanged'));
            }
        }

        getCurrentTarget(ghostId, pacmanX, pacmanY, pacmanDirection) {
            if (this.mode === 'scatter') {
                return this.scatterTargets[ghostId];
            } else {
                // Use the ghost's chase targeting
                return ghosts[ghostId].calculateTarget(pacmanX, pacmanY, pacmanDirection);
            }
        }
    }
    // Initialize ghost manager
    const ghostManager = new GhostManager();

    // Ghost configuration
    const GHOST_CONFIG = {
        blinky: { startX: 14, startY: 11, color: 'red', character: '👻' },
        pinky: { startX: 12, startY: 14, color: 'pink', character: '👻' },
        inky: { startX: 14, startY: 14, color: 'cyan', character: '👻' },
        clyde: { startX: 16, startY: 14, color: 'orange', character: '👻' }
    };

    const CELL_SIZE = 18;
    const GHOST_POSITION_OFFSET = {
        x: 4,  // Horizontal offset to center ghost in path
        y: -7  // Vertical offset to center ghost in path
    };
    const GHOST_SPEED = 1;
    const GRID_SNAP_THRESHOLD = 1;

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
                left: `${this.x}px`,
                top: `${this.y}px`,
                color: config.color,
                visibility: 'visible',
                transform: 'translate(-50%, -50%)',
                zIndex: '900'
            });
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
                mazeGrid[gridY][gridX] === 3 ||
                mazeGrid[gridY][gridX] === 4;
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

        calculateTarget(pacmanX, pacmanY, pacmanDirection) {
            // Convert from pixel coordinates to grid coordinates
            const pacmanGridX = Math.floor(pacmanX / CELL_SIZE);
            const pacmanGridY = Math.floor(pacmanY / CELL_SIZE);

            switch (this.id) {
                case 'blinky': // Red ghost - directly targets Pacman
                    return { x: pacmanGridX, y: pacmanGridY };

                case 'pinky': // Pink ghost - targets 4 tiles ahead of Pacman
                    let targetX = pacmanGridX;
                    let targetY = pacmanGridY;

                    // Calculate position 4 tiles ahead based on Pacman's direction
                    switch (pacmanDirection) {
                        case 'up':
                            targetY -= 4;
                            // Recreate the original game's bug: when Pacman faces up, Pinky targets 4 tiles up and 4 tiles left
                            targetX -= 4;
                            break;
                        case 'down': targetY += 4; break;
                        case 'left': targetX -= 4; break;
                        case 'right': targetX += 4; break;
                    }

                    return { x: targetX, y: targetY };

                case 'inky': // Cyan ghost - uses vector from Blinky to determine target
                    let blinky = ghosts['blinky'];
                    let blinkyGridX = Math.floor(blinky.x / CELL_SIZE);
                    let blinkyGridY = Math.floor(blinky.y / CELL_SIZE);

                    // First, get position 2 tiles ahead of Pacman
                    let pivotX = pacmanGridX;
                    let pivotY = pacmanGridY;

                    switch (pacmanDirection) {
                        case 'up':
                            pivotY -= 2;
                            // Same bug as Pinky
                            pivotX -= 2;
                            break;
                        case 'down': pivotY += 2; break;
                        case 'left': pivotX -= 2; break;
                        case 'right': pivotX += 2; break;
                    }

                    // Then, calculate the vector from Blinky to this position and double it
                    let vectorX = pivotX - blinkyGridX;
                    let vectorY = pivotY - blinkyGridY;

                    return {
                        x: pivotX + vectorX,
                        y: pivotY + vectorY
                    };

                case 'clyde': // Orange ghost - targets Pacman when far, scatters when close
                    const distance = Math.sqrt(
                        Math.pow(this.currentGridX - pacmanGridX, 2) +
                        Math.pow(this.currentGridY - pacmanGridY, 2)
                    );

                    // If closer than 8 tiles, target scatter point (bottom-left corner)
                    if (distance < 8) {
                        return { x: 0, y: 30 }; // Adjust corner position as needed
                    } else {
                        return { x: pacmanGridX, y: pacmanGridY };
                    }
            }
        }


        chooseNextDirection() {
            // Get current target based on mode
            const pacman = document.getElementById('pacman');
            const pacmanX = parseInt(pacman.style.left);
            const pacmanY = parseInt(pacman.style.top);
            const pacmanDirection = window.pacmanDirection; // Assume pacman direction is stored globally

            const target = ghostManager.getCurrentTarget(
                this.id, pacmanX, pacmanY, pacmanDirection
            );

            // Find possible directions at current intersection
            const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
                const nextPos = this.getNextPosition(this.currentGridX, this.currentGridY, dir);
                return this.isValidMove(nextPos.x, nextPos.y);
            });

            // Don't reverse direction unless it's the only option
            const oppositeDir = {
                'up': 'down', 'down': 'up',
                'left': 'right', 'right': 'left'
            };

            // Exception: Reverse direction when mode changes
            if (this.shouldReverseDirection) {
                this.shouldReverseDirection = false;
                if (possibleDirections.includes(oppositeDir[this.direction])) {
                    return oppositeDir[this.direction];
                }
            }

            const filteredDirections = possibleDirections.filter(dir =>
                dir !== oppositeDir[this.direction]
            );

            const validDirections = filteredDirections.length > 0 ?
                filteredDirections : possibleDirections;

            if (validDirections.length === 0) return this.direction;
            if (validDirections.length === 1) return validDirections[0];

            // Calculate which direction gets us closest to the target
            return validDirections.reduce((bestDir, currentDir) => {
                let nextPos = this.getNextPosition(this.currentGridX, this.currentGridY, currentDir);
                let currentDistance = Math.sqrt(
                    Math.pow(nextPos.x - target.x, 2) +
                    Math.pow(nextPos.y - target.y, 2)
                );

                let bestPos = this.getNextPosition(this.currentGridX, this.currentGridY, bestDir);
                let bestDistance = Math.sqrt(
                    Math.pow(bestPos.x - target.x, 2) +
                    Math.pow(bestPos.y - target.y, 2)
                );

                return currentDistance < bestDistance ? currentDir : bestDir;
            }, validDirections[0]);
        }

        makeVulnerable() {
            this.isVulnerable = true;
            this.element.style.color = 'blue';
            this.speed = GHOST_SPEED * 0.5; // Slower when vulnerable
            this.previousMode = ghostManager.mode;
            ghostManager.mode = 'frightened';

            // When frightened, reverse direction immediately
            this.shouldReverseDirection = true;

            // Clear existing timer if there is one
            if (this.vulnerableTimer) clearTimeout(this.vulnerableTimer);

            // Set up flashing animation near the end of frightened mode
            this.vulnerableTimer = setTimeout(() => {
                this.startFlashing();
            }, 7000); // Start flashing 3 seconds before vulnerability ends

            setTimeout(() => {
                this.isVulnerable = false;
                this.element.style.color = GHOST_CONFIG[this.id].color;
                this.speed = GHOST_SPEED;
                ghostManager.mode = this.previousMode;
                this.stopFlashing();
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

    function handleCollision() {
        if (isImmune) return;

        lives--;
        console.log(`Collision! Lives remaining: ${lives}`);


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

        // Reset Pac-Man position
        setTimeout(() => {
            resetPacmanPosition()
            pacman.style.display = 'block'
        }, 900);


        if (lives === -1) { // Lives are over
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

    let lastTime = 0;

    // Game loop for ghost movement
    function ghostLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Update ghost manager
        ghostManager.update(deltaTime);

        // Update ghosts
        updateGhosts(deltaTime);

        if (!gameover) {
            requestAnimationFrame(ghostLoop);
        }
    }

    if (gameover == false) {
        lastTime = performance.now()
        ghostLoop();
    } else {
        // TODO set game over text to visible
    }
});