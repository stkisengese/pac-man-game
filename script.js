// Description: This is the main file for the pacman game

// Create a new pacman
class pacman { 
  constructor() {
    this.x = 0;
    this.y = 0;
    this.direction = 'right';
  }
  move() {
    switch (this.direction) {
      case 'right':
        this.x++;
        break;
      case 'left':
        this.x--;
        break;
      case 'up':
        this.y--;
        break;
      case 'down':
        this.y++;
        break;
    }
  }
  render() {
    console.log(`(${this.x}, ${this.y})`);
  }
}

// create a new ghoost
class ghoost {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.direction = 'right';
  }
  move() {
    switch (this.direction) {
      case 'right':
        this.x++;
        break;
      case 'left':
        this.x--;
        break;
      case 'up':
        this.y--;
        break;
      case 'down':
        this.y++;
        break;
    }
  }
  render() {
    console.log(`(${this.x}, ${this.y})`);
  }
}