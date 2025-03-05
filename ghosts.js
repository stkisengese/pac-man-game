import { mazeGrid, resetPacmanPosition, changePacmanImage } from './maze.js';

document.addEventListener("DOMContentLoaded", () => {
    // Constants for better configuration
    const GAME_CONFIG = {
        CELL_SIZE: 18,
        GHOST_SPEED: {
            NORMAL: 1.4,
            VULNERABLE: 0.7,
            EATEN: 3.8
        },
        VULNERABLE_DURATION: 10000,
        IMMUNITY_TIME: 2000,
        GHOST_OFFSET: { x: 4, y: -7 },
        GRID_SNAP_THRESHOLD: 1
    };

    // Centralized Ghost State Management
    class GhostStateManager {
        constructor() {
            this.mode = 'scatter';
            this.modeTimer = 0;
            this.modePatterns = [
                { mode: 'scatter', duration: 10000 },
                { mode: 'chase', duration: 20000 },
                { mode: 'scatter', duration: 7000 },
                { mode: 'chase', duration: 20000 },
                { mode: 'scatter', duration: 5000 },
                { mode: 'chase', duration: 20000 },
                { mode: 'scatter', duration: 5000 },
                { mode: 'chase', duration: -1 }
            ];
            this.currentPatternIndex = 0;
            this.previousMode = null;
            this.scatterTargets = {
                'blinky': { x: 25, y: 0 },  // Top-right
                'pinky': { x: 2, y: 0 },    // Top-left
                'inky': { x: 27, y: 30 },   // Bottom-right
                'clyde': { x: 0, y: 30 }    // Bottom-left
            };
        }

        update(deltaTime) {
            if (this.mode === 'frightened') return;
            
            this.modeTimer += deltaTime;
            const currentPattern = this.modePatterns[this.currentPatternIndex];

            if (currentPattern.duration > 0 && this.modeTimer >= currentPattern.duration) {
                this.advanceMode();
            }
        }

        advanceMode() {
            this.modeTimer = 0;
            this.currentPatternIndex = (this.currentPatternIndex + 1) % this.modePatterns.length;
            this.mode = this.modePatterns[this.currentPatternIndex].mode;
            
            // Dispatch mode change event
            document.dispatchEvent(new CustomEvent('ghostModeChanged'));
        }

        setFrightenedMode() {
            this.previousMode = this.mode;
            this.mode = 'frightened';
        }

        revertFromFrightenedMode() {
            this.mode = this.previousMode || 'chase';
        }

        getCurrentTarget(ghostId, pacmanX, pacmanY, pacmanDirection) {
            // Ensure the ghost exists and is properly initialized before calculating the target
            const ghost = ghosts[ghostId];
            
            if (!ghost || !ghost.calculateChaseTarget) {
                console.error(`Ghost ${ghostId} not initialized properly!`);
                return { x: pacmanX, y: pacmanY }; // Return pacman's position if ghost is not initialized
            }

            if (this.mode === 'scatter') {
                return this.scatterTargets[ghostId];
            } else if (this.mode === 'frightened') {
                // Random target in frightened mode
                return {
                    x: Math.floor(Math.random() * mazeGrid[0].length),
                    y: Math.floor(Math.random() * mazeGrid.length)
                };
            }
            
            // Chase mode - use ghost-specific targeting
            return ghost.calculateChaseTarget(ghostId, pacmanX, pacmanY, pacmanDirection);
        }
    }

    // Initialize ghost manager
    const ghostStateManager = new GhostStateManager();

    // Ghost configuration
    const GHOST_CONFIGS = {
        blinky: {
            startPos: { x: 14, y: 11 },
            color: 'red',
            character: (color) => `
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path class="ghost-body" d="M1,19 L1,8 C1,3.5 5,0 10,0 C15,0 19,3.5 19,8 L19,19 L15,15 L13,19 L10,15 L7,19 L5,15 L1,19" fill="${color}"/>
                    <circle class="eye" cx="7" cy="8" r="2" fill="white"/>
                    <circle class="eye" cx="13" cy="8" r="2" fill="white"/>
                    <circle class="pupil" cx="7" cy="8" r="1" fill="black"/>
                    <circle class="pupil" cx="13" cy="8" r="1" fill="black"/>
                </svg>`
        },
        pinky: {
            startPos: { x: 12, y: 14 },
            color: 'pink',
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
            character: (color) => `
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path class="ghost-body" d="M1,19 L1,8 C1,3.5 5,0 10,0 C15,0 19,3.5 19,8 L19,19 L15,15 L13,19 L10,15 L7,19 L5,15 L1,19" fill="${color}"/>
                    <circle class="eye" cx="7" cy="8" r="2" fill="white"/>
                    <circle class="eye" cx="13" cy="8" r="2" fill="white"/>
                    <circle class="pupil" cx="7" cy="8" r="1" fill="black"/>
                    <circle class="pupil" cx="13" cy="8" r="1" fill="black"/>
                </svg>`
        },
    };

    class Ghost {
        constructor(id, config, stateManager) {
            this.id = id;
            this.stateManager = stateManager;
            this.config = config;
            this.originalColor = config.color;
            
            this.state = {
                position: {
                    x: config.startPos.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.x,
                    y: config.startPos.y * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.y
                },
                gridPosition: { x: config.startPos.x, y: config.startPos.y },
                direction: this.getRandomDirection(),
                nextDirection: null,
                speed: GAME_CONFIG.GHOST_SPEED.NORMAL,
                isVulnerable: false,
                isEaten: false,
                shouldReverseDirection: false
            };

            this.element = this.createGhostElement();
            this.setupEventListeners();
        }

        createGhostElement() {
            const element = document.getElementById(this.id);
            element.innerHTML = this.config.character(this.originalColor);
            this.updateElementStyle(element);
            return element;
        }

        updateElementStyle(element) {
            Object.assign(element.style, {
                position: 'absolute',
                width: '15px',
                height: '15px',
                left: `${this.state.position.x}px`,
                top: `${this.state.position.y}px`,
                color: this.originalColor,
                transform: 'translate(-50%, -50%)',
                zIndex: '900'
            });
        }

        setupEventListeners() {
            document.addEventListener('ghostModeChanged', () => {
                if (!this.state.isVulnerable && !this.state.isEaten) {
                    this.shouldReverseDirection = true;
                }
            });
        }

        getRandomDirection() {
            const directions = ['up', 'down', 'left', 'right'];
            return directions[Math.floor(Math.random() * directions.length)];
        }

        isAtGridCenter() {
            const gridAlignedX = Math.round(this.state.position.x / GAME_CONFIG.CELL_SIZE) * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.x;
            const gridAlignedY = Math.round(this.state.position.y / GAME_CONFIG.CELL_SIZE) * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.GHOST_OFFSET.y;
            return Math.abs(this.state.position.x - gridAlignedX) < GAME_CONFIG.GRID_SNAP_THRESHOLD &&
                   Math.abs(this.state.position.y - gridAlignedY) < GAME_CONFIG.GRID_SNAP_THRESHOLD;
        }

        isValidMove(gridX, gridY) {
            if (gridY < 0 || gridY >= mazeGrid.length ||
                gridX < 0 || gridX >= mazeGrid[0].length) {
                return false;
            }

            // When eaten, ghosts can move through any path and the ghost house
            if (this.state.isEaten) {
                return mazeGrid[gridY][gridX] !== 0; // Can move through anything except walls
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

        calculateChaseTarget(ghostId, pacmanX, pacmanY, pacmanDirection) {
            const pacmanGridX = Math.floor(pacmanX / GAME_CONFIG.CELL_SIZE);
            const pacmanGridY = Math.floor(pacmanY / GAME_CONFIG.CELL_SIZE);

            switch (ghostId) {
                case 'blinky': // Red ghost - directly targets Pacman
                    return { x: pacmanGridX, y: pacmanGridY };

                case 'pinky': // Pink ghost - targets 4 tiles ahead of Pacman
                    let targetX = pacmanGridX;
                    let targetY = pacmanGridY;

                    // Calculate position 4 tiles ahead based on Pacman's direction
                    switch (pacmanDirection) {
                        case 'up':
                            targetY -= 4;
                            targetX -= 4;
                            break;
                        case 'down': targetY += 4; break;
                        case 'left': targetX -= 4; break;
                        case 'right': targetX += 4; break;
                    }

                    return { x: targetX, y: targetY };

                case 'inky': // Cyan ghost - uses vector from Blinky to determine target
                    const blinky = ghosts['blinky'];
                    const blinkyGridX = Math.floor(blinky.state.position.x / GAME_CONFIG.CELL_SIZE);
                    const blinkyGridY = Math.floor(blinky.state.position.y / GAME_CONFIG.CELL_SIZE);

                    // First, get position 2 tiles ahead of Pacman
                    let pivotX = pacmanGridX;
                    let pivotY = pacmanGridY;

                    switch (pacmanDirection) {
                        case 'up':
                            pivotY -= 2;
                            pivotX -= 2;
                            break;
                        case 'down': pivotY += 2; break;
                        case 'left': pivotX -= 2; break;
                        case 'right': pivotX += 2; break;
                    }

                    // Then, calculate the vector from Blinky to this position and double it
                    const vectorX = pivotX - blinkyGridX;
                    const vectorY = pivotY - blinkyGridY;

                    return {
                        x: pivotX + vectorX,
                        y: pivotY + vectorY
                    };

                case 'clyde': // Orange ghost - targets Pacman when far, scatters when close
                    const distance = Math.sqrt(
                        Math.pow(pacmanGridX - this.state.gridPosition.x, 2) +
                        Math.pow(pacmanGridY - this.state.gridPosition.y, 2)
                    );
                    return distance < 8 ? { x: 0, y: 30 } : { x: pacmanGridX, y: pacmanGridY };
            }
        }

        chooseNextDirection() {
            // Eaten ghosts always target ghost house
            if (this.state.isEaten) {
                return this.chooseDirectionToTarget(14, 11);
            }

            // Frightened mode - random direction
            if (this.state.isVulnerable) {
                return this.chooseNextDirectionFrightened();
            }

            // Get current target based on mode
            const pacman = document.getElementById('pacman');
            const pacmanX = parseInt(pacman.style.left);
            const pacmanY = parseInt(pacman.style.top);
            const pacmanDirection = window.pacmanDirection || 'right';

            const target = this.stateManager.getCurrentTarget(
                this.id, pacmanX, pacmanY, pacmanDirection
            );

            return this.chooseDirectionToTarget(target.x, target.y);
        }

        chooseDirectionToTarget(targetX, targetY) {
            // Find possible directions at current intersection
            const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
                const nextPos = this.getNextPosition(this.state.gridPosition.x, this.state.gridPosition.y, dir);
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
                if (possibleDirections.includes(oppositeDir[this.state.direction])) {
                    return oppositeDir[this.state.direction];
                }
            }

            const filteredDirections = possibleDirections.filter(dir =>
                dir !== oppositeDir[this.state.direction]
            );

            const validDirections = filteredDirections.length > 0 ?
                filteredDirections : possibleDirections;

            if (validDirections.length === 0) return this.state.direction;
            if (validDirections.length === 1) return validDirections[0];

            // Choose direction closest to target
            return validDirections.reduce((bestDir, currentDir) => {
                let nextPos = this.getNextPosition(this.state.gridPosition.x, this.state.gridPosition.y, currentDir);
                let currentDistance = Math.sqrt(
                    Math.pow(nextPos.x - targetX, 2) +
                    Math.pow(nextPos.y - targetY, 2)
                );

                let bestPos = this.getNextPosition(this.state.gridPosition.x, this.state.gridPosition.y, bestDir);
                let bestDistance = Math.sqrt(
                    Math.pow(bestPos.x - targetX, 2) +
                    Math.pow(bestPos.y - targetY, 2)
                );

                return currentDistance < bestDistance ? currentDir : bestDir;
            }, validDirections[0]);
        }

        chooseNextDirectionFrightened() {
            const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
                const nextPos = this.getNextPosition(this.state.gridPosition.x, this.state.gridPosition.y, dir);
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
            this.isEaten = false;
            this.speed = GHOST_SPEED;
            this.element.innerHTML = GHOST_CONFIG[this.id].character;
            this.element.style.color = this.originalColor;
            this.stopFlashing();
            this.update(); // Immediately update position
        }
    }

    // Initialize ghosts
    const ghosts = {};
    for (const [id, config] of Object.entries(GHOST_CONFIG)) {
        ghosts[id] = new Ghost(id, config);
    }

    // Add event listener for mode changes
    document.addEventListener('ghostModeChanged', () => {
        Object.values(ghosts).forEach(ghost => {
            if (!ghost.isVulnerable && !ghost.isEaten) {
                ghost.shouldReverseDirection = true;
            }
        });
    }); 

    // Add game state
    let lives = 2; //there are three lives. the last life is 0(for pacman life element indexing)
    let isImmune = false;
    let immunityTime = 2000; // 2 seconds immunity after collision
    let gameover = false;
    let score = 0;

    function handleCollision(ghost) {
        // If ghost is vulnerable, eat it
        if (ghost.isVulnerable) {
            eatGhost(ghost);
            return;
        }
        
        // If pacman is immune or the ghost is already eaten, do nothing
        if (isImmune || ghost.isEaten) return;

        lives--;
        console.log(`Collision! Lives remaining: ${lives}`);

        // Reset all ghosts
        Object.values(ghosts).forEach(ghost => ghost.reset());

        // Apply fade-in effect to maze
        const overlay = document.getElementById('fade-overlay');
        if (overlay && lives > -1) {
            overlay.style.opacity = '1';
            overlay.style.backgroundColor = 'black';
            setTimeout(() => {
                overlay.style.opacity = '0';
            }, 800); // Duration of fade-in and fade-out animation
        }

        // Reset Pac-Man position
        const pacman = document.getElementById('pacman');
        pacman.style.display = 'none';
        setTimeout(() => {
            resetPacmanPosition();
            pacman.style.display = 'block';
        }, 900);

        if (lives === -1) { // Lives are over
            const gameOverAlert = document.querySelector('.game-over');
            gameOverAlert.style.display = 'block';
            overlay.style.opacity = '1';
            overlay.style.backgroundColor = '';
            console.log('Game Over!');
            gameover = true;
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

    function eatGhost(ghost) {
        ghost.makeEaten();
        
        // Increase score
        score += 200; // Base points for eating a ghost
        
        // Update score display if it exists
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) {
            scoreDisplay.innerText = `Score: ${score}`;
        }
        
        // Play eat ghost sound if exists
        const eatGhostSound = document.getElementById('eatGhostSound');
        if (eatGhostSound) {
            eatGhostSound.play();
        }
        
        console.log(`Ate ${ghost.id}! Score: ${score}`);
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
                handleCollision(ghost);
            }
        });
    }

    // Handle power pellet collection
    document.addEventListener('powerPelletCollected', () => {
        Object.values(ghosts).forEach(ghost => ghost.makeVulnerable());
    });

    let lastGhostLoopTime = 0; // track time for deltaTime in ghostLoop

    // Game loop for ghost movement
    function ghostLoop(timestamp) {
        const deltaTime = timestamp - lastGhostLoopTime;
        lastGhostLoopTime = timestamp;

        // Update ghost manager
        ghostManager.update(deltaTime);

        // Update ghosts
        updateGhosts(deltaTime);

        if (!gameover) {
            requestAnimationFrame(ghostLoop);
        }
    }
    ghostLoop(performance.now());
});