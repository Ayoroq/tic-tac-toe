// const prompt = require("prompt-sync")({ sigint: true });

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

  // Add a move to the board
  function addMove(row, column, value) {
    if (board[row][column] !== "") {
      return;
    }
    board[row][column] = value;
  }

  // // Display current board state
  // function printBoard() {
  //   for (let i = 0; i < rows; i++) {
  //     console.log(board[i]);
  //   }
  // }
  return {
    getBoard,
    addMove,
  };
};

// Main game controller
const gameController = (player1 = "player1", player2 = "player2") => {
  const table = document.querySelector(".board");
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

  // Main game loop to play one round
  function playRound() {
    table.addEventListener("click", detectClick);
  }

  function detectClick(event) {
    const clickedElement = event.target;
    if (clickedElement.tagName !== "TD") return;

    const clickedCell = clickedElement;
    if (clickedCell.textContent !== "") {
      console.log("Cell already occupied. Try again.");
      return;
    }

    const clickedRow = clickedCell.parentNode;
    const rowIndex = clickedRow.rowIndex;
    const colIndex = clickedCell.cellIndex;

    console.log(`Clicked Row: ${rowIndex}, Clicked Column: ${colIndex}`);
    board.addMove(rowIndex, colIndex, currentPlayer.value);
    clickedCell.textContent = currentPlayer.value;

    const winner = confirmWinner();
    if (winner) {
      gameActive = false;
      table.removeEventListener("click", detectClick);
      console.log(`${winner} wins!`);
    } else {
      switchPlayer();
    }
  }
  return { playRound, checkWinner };
};

// Start the game
const game = gameController();
game.playRound();
