const prompt = require("prompt-sync")({ sigint: true });

// Factory function to create game board
const gameBoard = () => {
  const rows = 3;
  const columns = 3;
  const board = [];
  // Initialize empty 3x3 board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push("");
    }
  }

  function getBoard() {
    return board;
  }

  // Add player move to board
  function addMove(row, column, value) {
    if (board[row][column] !== "") {
      return;
    }
    board[row][column] = value;
  }

  // Display current board state
  function printBoard() {
    for (let i = 0; i < rows; i++) {
      console.log(board[i]);
    }
  }

  return {
    getBoard,
    addMove,
    printBoard,
  };
};

// Main game controller
const gameController = (player1 = "player1", player2 = "player2") => {
  const players = [
    {
      name: player1,
      value: "X",
    },
    {
      name: player2,
      value: "O",
    },
  ];

  let currentPlayer = players[0];
  let gameActive = true;
  let board = gameBoard();

  // Switch between players
  function switchPlayer() {
    currentPlayer === players[0]
      ? (currentPlayer = players[1])
      : (currentPlayer = players[0]);
  }

  // Check for winning conditions
  function checkWinner() {
    const rawBoard = board.getBoard();
    const rows = rawBoard.length;
    const columns = rawBoard[0].length;

    // Check rows
    for (let i = 0; i < rows; i++) {
      if (
        rawBoard[i][0] !== "" &&
        rawBoard[i][0] === rawBoard[i][1] &&
        rawBoard[i][1] === rawBoard[i][2]
      ) {
        return rawBoard[i][0]; // Return 'X' or 'O'
      }
    }

    // Check columns
    for (let i = 0; i < columns; i++) {
      if (
        rawBoard[0][i] !== "" &&
        rawBoard[0][i] === rawBoard[1][i] &&
        rawBoard[1][i] === rawBoard[2][i]
      ) {
        return rawBoard[0][i]; // Return 'X' or 'O'
      }
    }

    // Check diagonals
    if (
      rawBoard[0][0] !== "" &&
      rawBoard[0][0] === rawBoard[1][1] &&
      rawBoard[1][1] === rawBoard[2][2]
    ) {
      return rawBoard[0][0]; // Return 'X' or 'O'
    }

    if (
      rawBoard[0][2] !== "" &&
      rawBoard[0][2] === rawBoard[1][1] &&
      rawBoard[1][1] === rawBoard[2][0]
    ) {
      return rawBoard[0][2]; // Return 'X' or 'O'
    }

    // Check for tie
    if (rawBoard.flat().every((cell) => cell !== "")) {
      return "tie";
    }
  }

  // Convert winner symbol to player name
  function confirmWinner() {
    const winner = checkWinner();

    if (winner === "tie") {
      return "tie";
    } else if (winner === "X" || winner === "O") {
      return players.find((player) => player.value === winner).name;
    } else {
      return null;
    }
  }

  // Main game loop
  function playRound() {
    while (gameActive) {
      console.log(`${currentPlayer.name}'s turn`);
      const values = prompt("Enter row and column (0-2) comma separated: ").split(",");
      const row = parseInt(values[0]);
      const column = parseInt(values[1]);
      
      // Validate input
      if (isNaN(row) || isNaN(column) || row < 0 || row > 2 || column < 0 || column > 2) {
        console.log("Invalid input. Please enter numbers 0-2.");
        continue;
      }
      
      // Check if cell is occupied
      if (board.getBoard()[row][column] !== "") {
        console.log("Cell already occupied. Try again.");
        continue;
      }
      
      board.addMove(row, column, currentPlayer.value);
      board.printBoard();
      const winner = confirmWinner();
      if (winner) {
        gameActive = false;
        console.log(`${winner} wins!`);
        return winner;
      } else {
        switchPlayer();
      }
    }
  }
  return { playRound, checkWinner };
};

// Start the game
const game = gameController();
game.playRound()