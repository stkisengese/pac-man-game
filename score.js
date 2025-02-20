import { collectDot } from './maze.js';

document.addEventListener('DOMContentLoaded', () => {
    const pacman = document.getElementById('pacman');
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
        checkCollision();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});