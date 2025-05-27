# Pac-Man

This project is a web-based implementation of the classic Pac-Man game. The game features Pac-Man navigating through a maze, collecting dots and power pellets while avoiding ghosts. The game includes a main menu, pause functionality, timer, and an immersive story mode.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Game Controls](#game-controls)
- [Story Mode](#story-mode)
- [Development](#development)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [License](#license)

## Features
- Classic Pac-Man gameplay
- Main menu with start button
- Pause and resume functionality
- Timer to track game duration
- Ghosts with different behaviors
- Power pellets that make ghosts vulnerable
- Score tracking
- Game over screen
- Immersive story mode with progressive narrative elements

## Installation
1. Clone the repository:
```bash
git clone https://learn.zone01kisumu.ke/git/skisenge/make-your-game-history pacman
```
2. Open the project directory:
```bash
cd pacman
```
3. Open [index.html](index.html) in your web browser to start the game.

#### Alternatively
Serve the application using a local web server:

*Python 3:*

```python
python3 -m http.server 7503
```

*Node.js (with live-server):*
```js
    npx live-server
```

*Open in browser:*
```
    http://localhost:7503
```

## Usage
- Use the arrow keys to navigate Pac-Man through the maze.
- Collect all the dots and power pellets to complete the level.
- Avoid the ghosts or eat them when they are vulnerable after collecting a power pellet.
- The game ends when you lose all your lives or the timer runs out.
- Experience the story progression as you complete levels.

## Game Controls
- **Arrow Keys**: Move Pac-Man
- **ESC**: Pause/Resume the game
- **Enter**: Start the game from the main menu
- **D**: Toggle debug overlay

## Story Mode
Our Pac-Man implementation features an engaging story mode that unfolds as you progress through the game:

- **Introduction**: The story begins when you start the game, setting up Pac-Man's adventure.
- **Development**: New story segments unlock after collecting a number of dots, revealing more of the narrative.
- **Conclusion**: The story concludes with either a victory or defeat ending, depending on your game outcome.

The story adds depth to the classic gameplay and provides additional motivation to progress through multiple levels.

## Development
### Project Structure
- [index.html](./index.html): The main HTML file for the game.
- [style.css](./style.css): The main CSS file for styling the game.
- [maze.js](./maze.js): Contains the logic for the maze, Pac-Man movement, and dot rendering.
- [ghosts.js](./ghosts.js): Contains the logic for ghost behavior and movement.
- [pause.js](./pause.js): Contains the logic for the pause menu and timer.
- [score.js](./score.js): Contains the logic for score tracking.
- [story.js](./story.js): Manages the story mode functionality and narrative progression.
- [story.css](./story.css): The story CSS file for styling the game.
- [assets](./assets/): Contains images and other assets used in the game.

### Key Functions
- `initializePacman()`: Initializes Pac-Man's position and style.
- `resetPacmanPosition()`: Resets Pac-Man to the starting position.
- `renderRandomDots()`: Renders dots and power pellets in the maze.
- `ghostLoop()`: Main game loop for ghost movement.
- `updateGhosts()`: Updates the position and behavior of ghosts.
- `createTimer()`: Creates and updates the game timer.
- `togglePause()`: Toggles the pause state of the game.
- `initStoryMode()`: Initializes the story mode components and event listeners.
- `showStoryOverlay()`: Displays story segments at appropriate times.
- `checkVictoryCondition()`: Checks if the player has won to trigger victory story.
- `checkDefeatCondition()`: Checks if the player has lost to trigger defeat story.

### Debugging
- The debug overlay can be toggled using the `D` key. This overlay helps visualize the game state and debug issues.

## Contributors
- [Rodney Ochieng](https://github.com/rodneyo1)
- [Malika Asman](https://github.com/Malika7188)
- [Stephen Kisengese](https://github.com/stkisengese)

## Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch:
```bash
git checkout -b feature-branch
```
3. Make your changes and commit them:
```bash
git commit -m "Description of your changes"
```
4. Push to the branch:
```bash
git push origin feature-branch
```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.