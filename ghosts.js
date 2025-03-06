import { mazeGrid, resetPacmanPosition, changePacmanImage } from './maze.js';
import { score } from './score.js';
// import { isGamePaused, initPauseSystem } from './pauseMenu.js';

const ghosts = {};

// Add game state
export let lives = 2; //there are three lives. the last life is 0(for pacman life elemnet indexing)
let isImmune = false;
let immunityTime = 2000; // 2 seconds immunity after collision
export let gameover = false
let timeLeft = 600; // 10 minutes in seconds

document.addEventListener("DOMContentLoaded", () => {
    // Refined Ghost Configuration with SVG characters
    const GHOST_CONFIGS = {
        blinky: {
            startPos: { x: 14, y: 11 },
            color: 'red',
            frightenedColor: 'blue',
            character: (color) => `
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path class="ghost-body" d="M1,19 L1,8 C1,3.5 5,0 10,0 C15,0 19,3.5 19,8 L19,19 L15,15 L13,19 L10,15 L7,19 L5,15 L1,19" fill="${color}">
                <animate attributeName="d"
                values="M1,19 L1,8 C1,3.5 5,0 10,0 C15,0 19,3.5 19,8 L19,19 L15,15 L13,19 L10,15 L7,19 L5,15 L1,19;
                M1,20 L1,9 C1,4.5 5,1 10,1 C15,1 19,4.5 19,9 L19,20 L15,16 L13,20 L10,16 L7,20 L5,16 L1,20"
                dur="0.5s"
                repeatCount="indefinite"/>
                </path>
                <circle class="eye" cx="7" cy="8" r="2" fill="white"/>
                <circle class="eye" cx="13" cy="8" r="2" fill="white"/>
                <circle class="pupil" cx="7" cy="8" r="1" fill="black">
                <animate attributeName="cx" values="6;8;6" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle class="pupil" cx="13" cy="8" r="1" fill="black">
                <animate attributeName="cx" values="12;14;12" dur="2s" repeatCount="indefinite"/>
                </circle>
                </svg>`
        },
        pinky: {
            startPos: { x: 12, y: 14 },
            color: 'pink',
            frightenedColor: 'blue',
            character: (color) => `
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path class="ghost-body" d="M1,19 L1,8 C1,3.5 5,0 10,0 C15,0 19,3.5 19,8 L19,19 L15,15 L13,19 L10,15 L7,19 L5,15 L1,19" fill="${color}"/>
                <circle class="eye" cx="7" cy="8" r="2" fill="white"/>
                <circle class="eye" cx="13" cy="8" r="2" fill="white"/>
                <circle class="pupil" cx="7" cy="8" r="1" fill="black"/>
                <circle class="pupil" cx="13" cy="8" r="1" fill="black"/>
                </svg>`
        },
        inky: {
            startPos: { x: 14, y: 14 },
            color: 'cyan',
            frightenedColor: 'blue',
            character: (color) => `
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path class="ghost-body" d="M1,19 L1,8 C1,3.5 5,0 10,0 C15,0 19,3.5 19,8 L19,19 L15,15 L13,19 L10,15 L7,19 L5,15 L1,19" fill="${color}"/>
                <circle class="eye" cx="7" cy="8" r="2" fill="white"/>
                <circle class="eye" cx="13" cy="8" r="2" fill="white"/>
                <circle class="pupil" cx="7" cy="8" r="1" fill="black"/>
                <circle class="pupil" cx="13" cy="8" r="1" fill="black"/>
                </svg>`
        },
        clyde: {
            startPos: { x: 16, y: 14 },
            color: 'orange',
            frightenedColor: 'blue',
            character: (color) => `
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path class="ghost-body" d="M1,19 L1,8 C1,3.5 5,0 10,0 C15,0 19,3.5 19,8 L19,19 L15,15 L13,19 L10,15 L7,19 L5,15 L1,19" fill="${color}"/>
                <circle class="eye" cx="7" cy="8" r="2" fill="white"/>
                <circle class="eye" cx="13" cy="8" r="2" fill="white"/>
                <circle class="pupil" cx="7" cy="8" r="1" fill="black"/>
                <circle class="pupil" cx="13" cy="8" r="1" fill="black"/>
                </svg>`
        }
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
            this.mode = "scatter";
            this.target = { x: 0, y: 0 };
            this.scatterTarget = this.getScatterTarget();
            this.x = config.startPos.x * CELL_SIZE + GHOST_POSITION_OFFSET.x;
            this.y = config.startPos.y * CELL_SIZE + GHOST_POSITION_OFFSET.y;
            this.currentGridX = config.startPos.x;
            this.currentGridY = config.startPos.y;
            this.direction = this.getRandomDirection();
            this.nextDirection = this.direction;
            this.isMoving = false;
            this.isVulnerable = false;
            this.speed = GHOST_SPEED;
            this.config = config;

            this.initializeGhost();
        }

        initializeGhost() {
            // Create ghost SVG
            this.updateGhostAppearance(this.config.color);

            Object.assign(this.element.style, {
                position: 'absolute',
                width: '24px',
                height: '24px',
                left: `${this.x}px`,
                top: `${this.y}px`,
                visibility: 'visible',
                transform: 'translate(-50%, -50%)',
                zIndex: '900'
            });
        }

        updateGhostAppearance(color) {
            // Use the character function to generate SVG based on color
            this.element.innerHTML = this.config.character(color);
        }

        getScatterTarget() {
            // Each ghost has a fixed scatter target (usually near a corner)
            switch (this.id) {
                case "blinky": return { x: 26, y: 0 }; // Top-right
                case "pinky": return { x: 1, y: 0 };   // Top-left
                case "inky": return { x: 26, y: 29 };  // Bottom-right
                case "clyde": return { x: 1, y: 29 };  // Bottom-left
                default: return { x: 0, y: 0 };
            }
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

            // // Allow movement on paths, ghost house entrance, ghost house
            // return [1, 2, 3, 4].includes(mazeGrid[gridY][gridX]);

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

        updateTargetPosition(pacmanX, pacmanY, pacmanDirection) {
            // Convert pacman pixel position to grid position
            const pacmanGridX = Math.round((pacmanX - GHOST_POSITION_OFFSET.x) / CELL_SIZE);
            const pacmanGridY = Math.round((pacmanY - GHOST_POSITION_OFFSET.y) / CELL_SIZE);

            if (this.isVulnerable) {
                // Frightened mode: random target (already handled by random movement)
                this.mode = "frightened";
                return;
            }

            // Toggle between scatter and chase modes periodically
            // This is typically handled with a timer system, simplified here
            if (this.mode !== "frightened") {
                // For now, we'll focus on chase mode
                this.mode = "chase";
            }

            if (this.mode === "scatter") {
                this.target = this.scatterTarget;
            } else if (this.mode === "chase") {
                // Each ghost has a unique targeting strategy
                switch (this.id) {
                    case "blinky": // Red ghost - Direct chase
                        this.target = { x: pacmanGridX, y: pacmanGridY };
                        break;

                    case "pinky": // Pink ghost - Ambush (4 tiles ahead of Pacman)
                        let targetX = pacmanGridX;
                        let targetY = pacmanGridY;

                        // Calculate position 4 tiles ahead based on Pacman's direction
                        switch (pacmanDirection) {
                            case "up":
                                targetY -= 4;
                                targetX -= 4;
                                break;
                            case 'down': targetY += 4; break;
                            case 'left': targetX -= 4; break;
                            case 'right': targetX += 4; break;
                        }

                        this.target = { x: targetX, y: targetY };
                        break;

                    case "inky": // // Cyan ghost - uses vector from Blinky to determine target
                        let inkyTargetX = pacmanGridX;
                        let inkyTargetY = pacmanGridY;

                        // First, find the point 2 tiles ahead of Pacman
                        switch (pacmanDirection) {
                            case "up":
                                inkyTargetY -= 2;
                                inkyTargetX -= 2;
                                break;
                            case "down": inkyTargetY += 2; break;
                            case "left": inkyTargetX -= 2; break;
                            case "right": inkyTargetX += 2; break;
                        }

                        // Get Blinky's position
                        const blinky = ghosts["blinky"];
                        const blinkyGridX = Math.round((blinky.x - GHOST_POSITION_OFFSET.x) / CELL_SIZE);
                        const blinkyGridY = Math.round((blinky.y - GHOST_POSITION_OFFSET.y) / CELL_SIZE);

                        // Calculate the vector from Blinky to the point ahead of Pacman
                        const vectorX = inkyTargetX - blinkyGridX;
                        const vectorY = inkyTargetY - blinkyGridY;

                        // Double the vector to find Inky's target
                        this.target = {
                            x: blinkyGridX + (vectorX * 2),
                            y: blinkyGridY + (vectorY * 2)
                        };
                        break;

                    case "clyde": // Orange ghost - Chase when far, scatter when close
                        const distanceToPacman = Math.sqrt(
                            Math.pow(this.currentGridX - pacmanGridX, 2) +
                            Math.pow(this.currentGridY - pacmanGridY, 2)
                        );

                        if (distanceToPacman > 8) {
                            // Chase directly if distance > 8 tiles
                            this.target = { x: pacmanGridX, y: pacmanGridY };
                        } else {
                            // Otherwise retreat to scatter position
                            this.target = this.scatterTarget;
                        }
                        break;
                }
            }
        }

        chooseNextDirection() {
            if (this.isVulnerable) {
                // During frightened mode, move randomly
                return this.chooseRandomDirection();
            }

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

            const validDirections = filteredDirections.length > 0 ?
                filteredDirections : possibleDirections;

            if (validDirections.length === 0) return this.direction;

            // Calculate distances to target for each valid direction
            const directionDistances = validDirections.map(dir => {
                const nextPos = this.getNextPosition(this.currentGridX, this.currentGridY, dir);
                const distance = Math.sqrt(
                    Math.pow(nextPos.x - this.target.x, 2) +
                    Math.pow(nextPos.y - this.target.y, 2)
                );
                return { direction: dir, distance: distance };
            });

            // Sort by distance (ascending)
            directionDistances.sort((a, b) => a.distance - b.distance);

            // Return the direction that gets closest to the target
            return directionDistances[0].direction;
        }

        // Renamed the original random movement function
        chooseRandomDirection() {
            const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
                const nextPos = this.getNextPosition(this.currentGridX, this.currentGridY, dir);
                return this.isValidMove(nextPos.x, nextPos.y);
            });

            const oppositeDir = {
                'up': 'down', 'down': 'up',
                'left': 'right', 'right': 'left'
            };

            const filteredDirections = possibleDirections.filter(dir =>
                dir !== oppositeDir[this.state.direction]
            );

            return filteredDirections.length > 0 
                ? filteredDirections[Math.floor(Math.random() * filteredDirections.length)]
                : possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }

        update() {
            // Update grid position when at grid center
            if (this.isAtGridCenter()) {
                this.state.gridPosition = {
                    x: Math.round((this.state.position.x - GAME_CONFIG.GHOST_OFFSET.x) / GAME_CONFIG.CELL_SIZE),
                    y: Math.round((this.state.position.y - GAME_CONFIG.GHOST_OFFSET.y) / GAME_CONFIG.CELL_SIZE)
                };

                // Choose new direction at intersections
                this.state.nextDirection = this.chooseNextDirection();
                this.state.direction = this.state.nextDirection;
            }

            // Check next position validity
            const nextPos = this.getNextPosition(this.state.gridPosition.x, this.state.gridPosition.y, this.state.direction);
            
            if (this.isValidMove(nextPos.x, nextPos.y)) {
                // Move ghost based on direction
                switch (this.state.direction) {
                    case "right": this.state.position.x += this.state.speed; break;
                    case "left": this.state.position.x -= this.state.speed; break;
                    case "up": this.state.position.y -= this.state.speed; break;
                    case "down": this.state.position.y += this.state.speed; break;
                }

                // Handle tunnel teleportation
                if (nextPos.x === 27 && this.state.gridPosition.x === 0) {
                    this.state.position.x = nextPos.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.x;
                }
                if (nextPos.x === 0 && this.state.gridPosition.x === 27) {
                    this.state.position.x = 0 + GAME_CONFIG.GHOST_OFFSET.x;
                }
            } else {
                // Snap to grid if move is invalid
                this.state.position.x = this.state.gridPosition.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.x;
                this.state.position.y = this.state.gridPosition.y * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.y;
                
                // Rechoose direction
                this.state.nextDirection = this.chooseNextDirection();
            }

            // Update element position
            this.element.style.left = `${this.state.position.x}px`;
            this.element.style.top = `${this.state.position.y}px`;

            // Check for return to ghost house if eaten
            if (this.state.isEaten) {
                this.checkReturnToGhostHouse();
            }
        }

        checkReturnToGhostHouse() {
            const ghostHousePosition = { x: 14, y: 11 };
            const ghostHouseX = ghostHousePosition.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.x;
            const ghostHouseY = ghostHousePosition.y * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.y;
        
            const distance = Math.sqrt(
                Math.pow(this.state.position.x - ghostHouseX, 2) +
                Math.pow(this.state.position.y - ghostHouseY, 2)
            );
        
            // If the ghost reaches the ghost house
            if (distance < GAME_CONFIG.CELL_SIZE / 2) {
                // Pause or delay for animation before reviving
                setTimeout(() => {
                    this.revive(); // Revive the ghost after the delay
                }, 500); // 500ms delay for example
            }
        }
        

        makeVulnerable() {
            if (this.state.isEaten) return;

            this.state.isVulnerable = true;
            this.state.speed = GAME_CONFIG.GHOST_SPEED.VULNERABLE;
            
            const ghostBody = this.element.querySelector('.ghost-body');
            if (ghostBody) {
                ghostBody.setAttribute('fill', 'blue');
            }

            this.stateManager.setFrightenedMode();
            // this.reverseDirection();
            this.shouldReverseDirection = true;

            // Set timeout for vulnerability
            setTimeout(() => this.endVulnerableState(), GAME_CONFIG.VULNERABLE_DURATION);
        }

        endVulnerableState() {
            if (this.state.isEaten) return;

            this.state.isVulnerable = false;
            this.state.speed = GAME_CONFIG.GHOST_SPEED.NORMAL;
            
            const ghostBody = this.element.querySelector('.ghost-body');
            if (ghostBody) {
                ghostBody.setAttribute('fill', this.originalColor);
            }

            // Only revert global mode if no ghosts are vulnerable
            if (!Object.values(ghosts).some(ghost => ghost.state.isVulnerable)) {
                this.stateManager.revertFromFrightenedMode();
            }
        }

        makeEaten() {
            if (this.state.isEaten) return;

            this.state.isEaten = true;
            this.state.isVulnerable = false;
            this.state.speed = GAME_CONFIG.GHOST_SPEED.EATEN;
            
            this.element.innerHTML = '👀';
            this.element.style.color = 'white';

            console.log(`${this.id} has been eaten!`);
        }

        revive() {
            this.state.isEaten = false;
            this.element.innerHTML = this.config.character(this.originalColor);
            this.element.style.color = this.originalColor;
            this.state.speed = GAME_CONFIG.GHOST_SPEED.NORMAL;

            console.log(`${this.id} has been revived!`);
        }

        checkCollision(pacmanX, pacmanY) {
            // Don't check collision if already eaten
            if (this.state.isEaten) return false;
            
            const collisionThreshold = GAME_CONFIG.CELL_SIZE / 2;
            const dx = Math.abs(this.state.position.x - pacmanX);
            const dy = Math.abs(this.state.position.y - pacmanY);
            
            return dx < collisionThreshold && dy < collisionThreshold;
        }

        reset() {
            const config = this.config;
            this.state.position = {
                x: config.startPos.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.x,
                y: config.startPos.y * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.y
            };
            this.state.gridPosition = { x: config.startPos.x, y: config.startPos.y };
            this.state.direction = this.getRandomDirection();
            this.state.nextDirection = this.state.direction;
            this.state.isVulnerable = false;
            this.state.isEaten = false;
            this.state.speed = GAME_CONFIG.GHOST_SPEED.NORMAL;
            
            this.element.innerHTML = this.config.character(this.originalColor);
            this.element.style.color = this.originalColor;
            
            this.update(); // Immediately update position
        }
    }

    // Game State Manager
    class GameStateManager {
        constructor() {
            this.lives = 2;
            this.score = 0;
            this.isImmune = false;
            this.gameOver = false;
        }

        handleCollision(ghost) {
            if (this.isImmune || ghost.state.isEaten) return;

            if (ghost.state.isVulnerable) {
                this.eatGhost(ghost);
                return;
            }

            this.loseLife();
        }

        loseLife() {
            this.lives--;
            
            if (this.lives < 0) {
                this.triggerGameOver();
                return;
            }

            this.resetLevel();
        }

        resetLevel() {
            // Reset ghosts and Pac-Man
            Object.values(ghosts).forEach(ghost => ghost.reset());
            resetPacmanPosition();

            // Temporary immunity
            this.isImmune = true;
            setTimeout(() => { this.isImmune = false; }, GAME_CONFIG.IMMUNITY_TIME);

            // Update life indicators
            this.updateLifeDisplay();
        }

        eatGhost(ghost) {
            ghost.makeEaten();
            this.score += 200;
            this.updateScoreDisplay();
        }

        updateScoreDisplay() {
            const scoreDisplay = document.getElementById('scoreDisplay');
            if (scoreDisplay) {
                scoreDisplay.innerText = `Score: ${this.score}`;
            }
        }

        updateLifeDisplay() {
            const lifeElements = document.querySelectorAll('.pacman-life');
            lifeElements.forEach((el, index) => {
                el.style.visibility = index < this.lives ? 'visible' : 'hidden';
            });
        }

        triggerGameOver() {
            this.gameOver = true;
            const gameOverAlert = document.querySelector('.game-over');
            gameOverAlert.style.display = 'block';
            overlay.style.opacity = '1';
            overlay.style.backgroundColor = '';
            console.log('Game Over!');
            gameover = true;
        }
    }

    // Initialization
    const gameStateManager = new GameStateManager();

    const ghosts = Object.entries(GHOST_CONFIGS).reduce((acc, [id, config]) => {
        acc[id] = new Ghost(id, config, ghostStateManager);
        return acc;
    }, {});

    // Handle power pellet collection
    document.addEventListener('powerPelletCollected', () => {
        Object.values(ghosts).forEach(ghost => ghost.makeVulnerable());
    });

      // Game Loop
      function ghostLoop(timestamp) {
        if (gameStateManager.gameOver) return;

        // Update ghost state manager
        ghostStateManager.update(timestamp);

        // Update individual ghosts and check collisions
        Object.values(ghosts).forEach(ghost => {
            ghost.update();

            // Check for collision with Pac-Man
            const pacman = document.getElementById('pacman');
            if (pacman && ghost.checkCollision(
                parseInt(pacman.style.left), 
                parseInt(pacman.style.top)
            )) {
                gameStateManager.handleCollision(ghost);
            }
        });

        requestAnimationFrame(ghostLoop);
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
                gameStateManager.handleCollision(ghost);
            }
        });
    }

    let lastGhostLoopTime = 0; // track time for deltaTime in ghostLoop

    // Game Loop for ghost movement
    function ghostLoop(timestamp) {
        if (gameStateManager.gameOver) return;

        const deltaTime = timestamp - lastGhostLoopTime;
        lastGhostLoopTime = timestamp;

        // Update ghost state manager
        ghostStateManager.update(deltaTime);

        // Update individual ghosts and check collisions
        updateGhosts(deltaTime);

        requestAnimationFrame(ghostLoop);
    }
    ghostLoop(performance.now());
});