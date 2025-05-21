// Story mode management for Pac-Man game
import { isGamePaused } from "./pause.js";
import { score } from "./score.js";
import { gameover, lives, ghostLoop } from "./ghosts.js";
import { gameLoop } from "./maze.js";

// Story mode configuration with flag to track story parts
const STORY_CONFIG = {
  dotsThreshold: 124, // set to half of total dots
  introShown: false,
  developmentShown: false,
  conclusionShown: false,
  storyActive: false,
};

// Initialize story mode
export function initStoryMode() {
  console.log("Initializing story mode...");

  // Get story overlay elements
  const storyIntro = document.getElementById("story-intro");
  const storyDevelopment = document.getElementById("story-development");
  const storyVictory = document.getElementById("story-victory");
  const storyDefeat = document.getElementById("story-defeat");

  // Get story button elements
  const introButton = document.getElementById("story-intro-btn");
  const developmentButton = document.getElementById("story-development-btn");
  const victoryButton = document.getElementById("story-victory-btn");
  const defeatButton = document.getElementById("story-defeat-btn");
  const continueButton = document.getElementById("story-continue-btn");

  // Add event listeners to story buttons
  introButton.addEventListener("click", () => {
    hideStoryOverlay(storyIntro);
    STORY_CONFIG.introShown = true;
    resumeGameAfterStory();
  });

  developmentButton.addEventListener("click", () => {
    hideStoryOverlay(storyDevelopment);
    STORY_CONFIG.developmentShown = true;
    resumeGameAfterStory();
  });

  victoryButton.addEventListener("click", () => {
    hideStoryOverlay(storyVictory);
    resetGame();
  });

  continueButton.addEventListener("click", () => {
    hideStoryOverlay(storyVictory);
    STORY_CONFIG.conclusionShown = false;
    resumeGameAfterStory();
  });

  defeatButton.addEventListener("click", () => {
    hideStoryOverlay(storyDefeat);
    resetGame();
  });

  // Show intro story when game starts
  document.getElementById("start-button").addEventListener("click", () => {
    // Short delay to ensure main menu is hidden first
    setTimeout(() => {
      if (!STORY_CONFIG.introShown) {
        showStoryOverlay(storyIntro);
        pauseGameForStory();
      }
    }, 100);
  });

  // Check for development story trigger based on dots collected
  document.addEventListener("dotCollected", (event) => {
    if (!isGamePaused() && !STORY_CONFIG.developmentShown) {
      const dotsCollected = window.gameState.totalDots - window.gameState.dotsRemaining;

      if (dotsCollected >= STORY_CONFIG.dotsThreshold) {
        showStoryOverlay(storyDevelopment);
        pauseGameForStory();
        STORY_CONFIG.developmentShown = true;
      }
    }
  });

  // Listen for game over event to show conclusion
  document.addEventListener("gameOver", (event) => {
    if (!STORY_CONFIG.conclusionShown) {
      if (event.detail && event.detail.victory) {
        showStoryOverlay(storyVictory);
        pauseGameForStory();
      } else {
        // Short delay to display gameover screen
        setTimeout(() => {
          showStoryOverlay(storyDefeat);
        }, 1000);
      }
      STORY_CONFIG.conclusionShown = true;
      STORY_CONFIG.developmentShown = false;
    }
  });

  // Reset story flags when game resets
  document.addEventListener("gameReset", () => {
    resetStoryFlags();
  });
}

// Helper function to show a story overlay
function showStoryOverlay(overlay) {
  if (!overlay) return;

  // Fade in the overlay
  overlay.classList.remove("hidden");
  overlay.style.opacity = "0";

  // Use setTimeout to ensure the transition works
  setTimeout(() => {
    overlay.style.opacity = "1";
  }, 10);
}

// Helper function to hide a story overlay
function hideStoryOverlay(overlay) {
  if (!overlay) return;
  overlay.style.opacity = "0";   // Fade out the overlay

  // Wait for transition to complete before hiding
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 500); // Matched with CSS transition duration
}

// Pause game when showing story by cancelling animation frames
function pauseGameForStory() {
  cancelAnimationFrame(pacmanAnimationId);
  cancelAnimationFrame(ghostAnimationId);

  // Set a flag to indicate story is showing
  window.storyShowing = true;
}

// Resume game after story is closed
function resumeGameAfterStory() {
  // Clear story showing flag
  window.storyShowing = false;

  // Resume game loops
  if (typeof gameLoop === 'function') {
    pacmanAnimationId = requestAnimationFrame(gameLoop);
  }

  // Resume ghost game loop from ghost.js
  if (typeof ghostLoop === 'function') {
    ghostAnimationId = requestAnimationFrame(ghostLoop);
  }
}

// Reset story flags when starting a new game
function resetStoryFlags() {
  STORY_CONFIG.introShown = false;
  STORY_CONFIG.developmentShown = false;
  STORY_CONFIG.conclusionShown = false;
}

// Reset game completely by reloading the page
function resetGame() {
  window.location.reload();
}

// Check if all dots are collected for victory condition
function checkVictoryCondition() {
  // If all dots are collected, trigger victory
  if (window.gameState && window.gameState.dotsRemaining === 0 && !gameover) {
    // Trigger game over with victory flag
    const victoryEvent = new CustomEvent("gameOver", {
      detail: { victory: true },
    });
    document.dispatchEvent(victoryEvent);
    return true;
  }
  return false;
}

// Check defeat condition
function checkDefeatCondition() {
  // If lives are depleted, trigger defeat
  if (lives < 0 && !STORY_CONFIG.conclusionShown) {
    // Trigger game over with defeat flag
    const defeatEvent = new CustomEvent("gameOver", {
      detail: { victory: false },
    });
    document.dispatchEvent(defeatEvent);
    return true;
  }
  return false;
}

// Main game initialization
document.addEventListener("DOMContentLoaded", () => {
  initStoryMode();

  // Set up game state monitoring
  setInterval(() => {
    checkVictoryCondition();
    checkDefeatCondition();
  }, 1000);
});