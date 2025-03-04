// Create a pause state variable to track game status
let isPaused = false;

import { gameLoop, resetPacmanPosition } from "./maze.js";
import { ghostLoop } from "./ghosts.js";

window.ghostAnimationId = null
window.pacmanAnimationId = null
// Create the pause menu HTML structure
function createPauseMenu() {
    const pauseMenuHTML = `
    <div id="pauseMenu" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
         background-color: rgba(0, 0, 0, 0.8); flex-direction: column; justify-content: center; 
         align-items: center; z-index: 1000;">
      <h2 style="color: yellow; font-family: 'Press Start 2P Regular', sans-serif, cursive; margin-bottom: 20px;">PAUSED</h2>
      <button id="resumeButton" style="background-color: yellow; color: black; border: none; padding: 10px 20px; 
              margin: 10px; cursor: pointer; font-family: 'Press Start 2P Regular', sans-serif, cursive;">Resume</button>
      <button id="quitButton" style="background-color: yellow; color: black; border: none; padding: 10px 20px; 
              margin: 10px; cursor: pointer; font-family: 'Press Start 2P Regular', sans-serif, cursive;">Quit</button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', pauseMenuHTML);
}

// Set up pause menu functionality
function setupPauseMenu() {
    // Create the menu if it doesn't exist
    if (!document.getElementById('pauseMenu')) {
        createPauseMenu();
    }

    // Add event listener for ESC key to toggle pause
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            togglePause();
        }
    });

    // Get references to pause menu elements
    const pauseMenu = document.getElementById('pauseMenu');
    const resumeButton = document.getElementById('resumeButton');
    // const restartButton = document.getElementById('restartButton');
    const quitButton = document.getElementById('quitButton');

    // Set up button event listeners
    resumeButton.addEventListener('click', function () {
        togglePause(); // Resume game
    });

    // restartButton.addEventListener('click', function () {
    //     // Hide pause menu
    //     pauseMenu.style.display = 'none';
    //     isPaused = false;

    //     // Reset game
    //     resetGame();
    // });

    quitButton.addEventListener('click', function () {
        // Hide pause menu
        pauseMenu.style.display = 'none';
        isPaused = false;

        // Show main menu or reload page
        if (window.location.pathname.includes('index.html')) {
            // If we're on the main page, just reload
            window.location.reload();
        } else {
            // Otherwise try to go back to main menu
            window.location.href = 'index.html';
        }
    });
}

// Toggle pause state
function togglePause() {
    isPaused = !isPaused;
    const pauseMenu = document.getElementById('pauseMenu');

    if (isPaused) {
        // Show pause menu with flex display for proper centering
        pauseMenu.style.display = 'flex';
        // Cancel any ongoing animations
        cancelAnimationFrame(ghostAnimationId);
        cancelAnimationFrame(pacmanAnimationId);
        // Pause any audio that might be playing
        pauseAudio();
    } else {
        // Hide pause menu
        pauseMenu.style.display = 'none';
        // Resume game loops
        resumeGameLoops();
        // Resume audio
        resumeAudio();
    }
}

// Helper function to pause any game audio
function pauseAudio() {
    // Find and pause all audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            // Mark as paused by us
            audio.dataset.pausedByMenu = 'true';
        }
    });
}

// Helper function to resume audio that was paused by the menu
function resumeAudio() {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        if (audio.dataset.pausedByMenu === 'true') {
            audio.play();
            delete audio.dataset.pausedByMenu;
        }
    });
}

// Resume game loops
function resumeGameLoops() {

    console.log(pacmanAnimationId, ghostAnimationId)
    // Resume pacman game loop from maze.js
    if (typeof gameLoop === 'function') {
        pacmanAnimationId = requestAnimationFrame(gameLoop);
    }

    // Resume ghost game loop from ghost.js
    if (typeof ghostLoop === 'function') {
        ghostAnimationId = requestAnimationFrame(ghostLoop);
    }
}

// Reset the game
function resetGame() {
    // Reset pacman position
    if (typeof resetPacmanPosition === 'function') {
        resetPacmanPosition();
    }

    // Reset ghosts
    const ghosts = document.querySelectorAll('.ghost');
    ghosts.forEach(ghost => {
        if (ghost.reset && typeof ghost.reset === 'function') {
            ghost.reset();
        }
    });

    // Reset dots if needed
    if (typeof renderRandomDots === 'function') {
        renderRandomDots();
    }

    // Reset score
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = '0';
    }

    // Resume game loops
    resumeGameLoops();
    // resetPacmanPosition();
}

// Function to check if game is paused - can be used by other scripts
export function isGamePaused() {
    return isPaused;
}

// Function to modify your existing game loops to respect pause state
export function modifyGameLoop(originalGameLoop) {
    return function () {
        if (!isPaused) {
            originalGameLoop();
        }
        requestAnimationFrame(arguments.callee);
    };
}

// Initialize pause menu system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupPauseMenu();

    // Also add a visible pause button for mobile compatibility
    const pauseButtonHTML = `<button id="pauseBtn" style="position: absolute; top: 10px; right: 10px; z-index: 999; 
                             background-color: yellow; color: black; border: none; padding: 10px 20px; 
                             cursor: pointer; font-family: 'Press Start 2P', sans-serif, cursive;">⏸</button>`;
    document.body.insertAdjacentHTML('beforeend', pauseButtonHTML);

    document.getElementById('pauseBtn').addEventListener('click', togglePause);
});

// This function should be called to integrate with your existing code
export function initPauseSystem() {
    // Make original game loops respect pause state
    setupPauseMenu();
    return { isPaused, togglePause, isGamePaused };
}