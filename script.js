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

// Factory function to create players
const player = (name, symbol) => {
  return { name, symbol };
};

// function to change the symbols selected by the users
function changeSymbol() {
  const symbol1 = document.querySelector(".symbol-a");
  const symbol2 = document.querySelector(".symbol-b");

  symbol1.addEventListener("change", () => {
    if (symbol1.value === "X") {
      symbol2.value = "O";
    } else {
      symbol2.value = "X";
    }
  });
  symbol2.addEventListener("change", () => {
    if (symbol2.value === "X") {
      symbol1.value = "O";
    } else {
      symbol1.value = "X";
    }
  });
  return { symbol1, symbol2 };
}

// Main game controller
const gameController = () => {
  const table = document.querySelector(".board");
  const start = document.querySelector(".start");
  const player1 = document.querySelector(".first-player");
  const player2 = document.querySelector(".second-player");
  const symbol1 = document.querySelector(".symbol-a");
  const symbol2 = document.querySelector(".symbol-b");

  changeSymbol();

  let board;
  let currentPlayer;
  let gameActive;

  const players = [];

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
      stopGame(); // the function is defined below
      console.log(`${winner} wins!`);
    } else {
      switchPlayer();
    }
  }

  // function to start/begin the game
  function beginGame() {
    start.addEventListener("click", function (event) {
      event.preventDefault();
      startGame();
    });
  }

  function startGame() {
    players.length = 0; // clear the array
    const firstPlayer = player(player1.value, symbol1.value);
    const secondPlayer = player(player2.value, symbol2.value);
    players.push(
      {
        name: firstPlayer.name,
        value: firstPlayer.symbol,
      },
      {
        name: secondPlayer.name,
        value: secondPlayer.symbol,
      }
    );
    board = gameBoard();
    gameActive = true;
    currentPlayer = players[0];
    console.log(currentPlayer);
    playRound();
  }

  // function to stop the game
  function stopGame() {
    gameActive = false;
    table.removeEventListener("click", detectClick);
  }

  return { beginGame, checkWinner };
};

// // Start the game
const game = gameController();
game.beginGame();
