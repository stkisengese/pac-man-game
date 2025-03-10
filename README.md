# Pac-Man

This project is a web-based implementation of the classic Pac-Man game. The game features Pac-Man navigating through a maze, collecting dots and power pellets while avoiding ghosts. The game includes a main menu, pause functionality, and a timer.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Game Controls](#game-controls)
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

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/rodneyo1/pacman
    cd pacman
    ```

2. Open the project directory:
    ```bash
    cd pacman
    ```

3. Open [index.html](index.html) in your web browser to start the game.

## Usage

- Use the arrow keys to navigate Pac-Man through the maze.
- Collect all the dots and power pellets to complete the level.
- Avoid the ghosts or eat them when they are vulnerable after collecting a power pellet.
- The game ends when you lose all your lives or the timer runs out.

## Game Controls

- **Arrow Keys**: Move Pac-Man
- **ESC**: Pause/Resume the game
- **Enter**: Start the game from the main menu
- **D**: Toggle debug overlay

## Development

### Project Structure

- [index.html](http://_vscodecontentref_/1): The main HTML file for the game.
- [style.css](http://_vscodecontentref_/2): The main CSS file for styling the game.
- [maze.js](http://_vscodecontentref_/3): Contains the logic for the maze, Pac-Man movement, and dot rendering.
- [ghosts.js](http://_vscodecontentref_/4): Contains the logic for ghost behavior and movement.
- [pause.js](http://_vscodecontentref_/5): Contains the logic for the pause menu and timer.
- [score.js](http://_vscodecontentref_/6): Contains the logic for score tracking.
- [assets](http://_vscodecontentref_/7): Contains images and other assets used in the game.

### Key Functions

- `initializePacman()`: Initializes Pac-Man's position and style.
- `resetPacmanPosition()`: Resets Pac-Man to the starting position.
- `renderRandomDots()`: Renders dots and power pellets in the maze.
- `ghostLoop()`: Main game loop for ghost movement.
- `updateGhosts()`: Updates the position and behavior of ghosts.
- `createTimer()`: Creates and updates the game timer.
- `togglePause()`: Toggles the pause state of the game.

### Debugging

- The debug overlay can be toggled using the `D` key. This overlay helps visualize the game state and debug issues.

## Contributors

- [Rodney Ochieng](https://github.com/rodneyo1)
- [Malika Asman](https://github.com/Malika7188)
-  [Stephen Kisengese](https://github.com/stkisengese)

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
