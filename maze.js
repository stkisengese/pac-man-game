window.onload = function() {
    renderRandomDots();
};


const mazeGrid = 
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,0,0,2,2,0,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,3,3,3,3,3,3,0,1,0,0,1,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,0,3,3,3,3,3,3,0,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,1,0,0,1,0,3,3,3,3,3,3,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0],
        [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
        [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
        [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

const dotContainer = document.getElementById("dot-container");
const cellSize = 18;
const dotSize = 4;
const powerPelletSize = 12; // Larger size for power pellets
const POWER_PELLETS_COUNT = 5;
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
    
    // First, select positions for power pellets
    const powerPelletPositions = [];
    for (let i = 0; i < POWER_PELLETS_COUNT; i++) {
        const randomIndex = Math.floor(Math.random() * allPositions.length);
        const position = allPositions.splice(randomIndex, 1)[0];
        powerPelletPositions.push(position);
    }
    
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
        dot.style.borderRadius = "50%";
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
        powerPellet.style.backgroundColor = "yellow";
        powerPellet.style.borderRadius = "50%";
        powerPellet.style.top = `${pos.row * cellSize + cellSize / 2 - powerPelletSize / 2}px`;
        powerPellet.style.left = `${pos.col * cellSize + cellSize / 2 - powerPelletSize / 2}px`;
        
        // Add animation for power pellets
        powerPellet.style.animation = "powerPelletPulse 0.7s ease-in-out infinite";
        dotContainer.appendChild(powerPellet);
    });
    
    // Store game state information
    window.gameState = {
        totalDots: numberOfDotsToShow,
        dotsRemaining: numberOfDotsToShow,
        dotPercentage: percentageToShow.toFixed(1),
        powerPelletsRemaining: POWER_PELLETS_COUNT,
        maxPossibleScore: (dotsNeeded * 10) + (POWER_PELLETS_COUNT * POWER_PELLET_POINTS)
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