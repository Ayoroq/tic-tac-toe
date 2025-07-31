# Tic Tac Toe Game

A modern, interactive tic-tac-toe game built with vanilla HTML, CSS, and JavaScript. Features customizable player names, symbol selection, visual win indicators, and celebratory confetti animations.

## Features

- **Two-player gameplay** with customizable player names
- **Symbol selection** - Choose between ✕ and ⭕ for each player
- **Input validation** - Prevents duplicate or empty player names
- **Visual win indicators** - Lines drawn through winning combinations
- **Tie game detection** 
- **Confetti celebration** for winners
- **In-game instructions** - Built-in how-to-play guide
- **Current player indicator** - Shows whose turn it is
- **Responsive design** with clean, modern UI
- **Instant restart** - No page reload required

## How to Play

1. Open `index.html` in your web browser
2. Enter names for Player 1 and Player 2
3. Select symbols for each player (✕ or ⭕)
4. Click "Start Game" to begin
5. Players take turns clicking on empty cells
6. First player to get three symbols in a row (horizontally, vertically, or diagonally) wins
7. Click "Restart Game" to play again

## Project Structure

```
tic-tac-toe/
├── index.html      # Main HTML structure
├── style.css       # Game styling and animations
├── reset.css       # CSS reset for consistent styling
├── script.js       # Game logic and functionality
└── README.md       # Project documentation
```

## Technical Implementation

### Game Architecture

- **Factory Functions**: Uses factory pattern for creating game board and players
- **Module Pattern**: Game controller manages all game state and interactions
- **Event-Driven**: Click handlers manage user interactions
- **DOM Manipulation**: Dynamic updates to game board and UI elements

### Key Components

- `gameController()` - Main game logic controller
- `changeSymbol()` - Handles symbol selection synchronization  
- `checkWinner()` - Optimized winner detection using lookup tables
- `drawLineThroughWinner()` - Visual indication of winning line
- `handleRestart()` - Memory-efficient game reset without page reload
- `addConfetti()` - Celebration animation with proper cleanup

### Dependencies

- [TSParticles Confetti](https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js) - For celebration animations

## Setup

1. Clone or download the project files
2. Open `index.html` in any modern web browser
3. No additional setup or dependencies required

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Optimizations

- **Memory leak prevention** - Proper event listener cleanup
- **Efficient DOM manipulation** - Minimal reflows and repaints
- **Clean restart logic** - No page reload, just state reset

## Future Enhancements

- AI opponent option
- Score tracking across multiple games
- Different board sizes (4x4, 5x5)
- Keyboard navigation support
- Sound effects
- Online multiplayer functionality

## License

This project is part of The Odin Project curriculum and is available for educational purposes.