function initMainMenu() {
    console.log("Initializing main menu...");
    
    const mainMenu = document.getElementById('main-menu');
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-button');
    
    if (!mainMenu) {
        console.error("Main menu element not found!");
        return;
    }
    
    if (!gameContainer) {
        console.error("Game container element not found!");
        return;
    }
    
    if (!startButton) {
        console.error("Start button element not found!");
        return;
    }
    
    console.log("All elements found, setting up...");
    
    // Hide game container initially
    gameContainer.style.display = 'none';
    
    // Add click event to start button with debugging
    startButton.addEventListener('click', function() {
        console.log("Start button clicked!");
        startGame();
    });
    
    // Also listen for Enter key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && mainMenu.style.display !== 'none') {
            console.log("Enter key pressed!");
            startGame();
        }
    });
    
    // Function to start the game
    function startGame() {
        console.log("Starting game...");
        
        // Hide the main menu
        mainMenu.style.display = 'none';
        
        // Show the game container
        gameContainer.style.display = 'block';
        
        console.log("Display properties updated");
        
        // Start the game loops - using try/catch to handle potential errors
        try {
            startGameLoops();
            console.log("Game loops started");
        } catch (error) {
            console.error("Error starting game loops:", error);
        }
        
        // Reset game state if needed
        try {
            resetGameState();
            console.log("Game state reset");
        } catch (error) {
            console.error("Error resetting game state:", error);
        }
    }
    
    // Function to start game loops - simplified for troubleshooting
    function startGameLoops() {
        // Instead of importing functions that might cause issues, dispatch an event
        // that your maze.js and ghosts.js can listen for
        const gameStartEvent = new CustomEvent('gameStart');
        document.dispatchEvent(gameStartEvent);
        console.log("Game start event dispatched");
    }
    
    // Function to reset game state - simplified
    function resetGameState() {
        // Reset score
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = '0';
        }
        
        // Hide game over screen if visible
       
        // Dispatch a reset event for other components to listen for
        const resetEvent = new CustomEvent('gameReset');
        document.dispatchEvent(resetEvent);
        console.log("Game reset event dispatched");
    }
    
    console.log("Main menu initialization complete");
}

// Initialize the main menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing main menu");
    initMainMenu();
});