import { collectDot } from './maze.js';

let score=0
let highscore = localStorage.getItem('highscore') || 0;


document.addEventListener('DOMContentLoaded', () => {
    const pacman = document.getElementById('pacman')
    const scoreElement = document.getElementById('score')
    const highScoreElement = document.getElementById('high-score-display')
    const timeElement = document.getElementById('time')
    

    setInterval(createTimer, 1000)
function createTimer(){
    timeElement.textContent = new(Date)
}
    function updateScore(points) {
        score += points;
        scoreElement.textContent = `${score}`;
        // Update high score if current score is higher
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore)
            highScoreElement.textContent = `${highscore}`;
        }
        
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


    //console.log(highest)
    function gameLoop() {
        checkCollision();
        requestAnimationFrame(gameLoop)
    }

    // Initialize high score display
    highScoreElement.textContent = `${highscore}`

    gameLoop();
});