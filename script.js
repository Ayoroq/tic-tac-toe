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
    symbol1.value === "✕" ? (symbol2.value = "⭕") : (symbol2.value = "✕");
  });
  symbol2.addEventListener("change", () => {
    symbol2.value === "✕" ? (symbol1.value = "⭕") : (symbol1.value = "✕");
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
  const dialog = document.querySelector(".dialog");
  const restart = document.querySelector(".restart");
  const winnerDetails = document.querySelector(".winner");
  const finish = document.querySelector(".finish");
  const playerTurn = document.querySelector(".player-turn");
  

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
        return [rawBoard[i][0], i, "rows"]; // Return 'X' or 'O'
      }
    }

    // Check columns
    for (let i = 0; i < columns; i++) {
      if (
        rawBoard[0][i] !== "" &&
        rawBoard[0][i] === rawBoard[1][i] &&
        rawBoard[1][i] === rawBoard[2][i]
      ) {
        return [rawBoard[0][i], i, "columns"]; // Return 'X' or 'O'
      }
    }

    // Check diagonals
    if (
      rawBoard[0][0] !== "" &&
      rawBoard[0][0] === rawBoard[1][1] &&
      rawBoard[1][1] === rawBoard[2][2]
    ) {
      return [rawBoard[0][0], "left-diagonal"]; // Return 'X' or 'O'
    }

    if (
      rawBoard[0][2] !== "" &&
      rawBoard[0][2] === rawBoard[1][1] &&
      rawBoard[1][1] === rawBoard[2][0]
    ) {
      return [rawBoard[0][2], "right-diagonal"]; // Return 'X' or 'O'
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
    } else if (winner) {
      return winner;
    } else {
      return null;
    }
  }
  // function to draw line once a winner is determined
  function drawLineThroughWinner(winner) {
    if (winner === "tie") {
      // Handle tie case
      return;
    }
    if (winner[2] === "rows") {
      const winningRow = winner[1];
      for (let i = 0; i < 3; i++) {
        table.rows[winningRow].cells[i].classList.add("horizontal");
      }
    }
    if (winner[2] === "columns") {
      const winningColumn = winner[1];
      for (let i = 0; i < 3; i++) {
        table.rows[i].cells[winningColumn].classList.add("vertical");
      }
    }
    if (winner[1] === "left-diagonal") {
      for (let i = 0; i < 3; i++) {
        console.log(table.rows[i].cells[i]);
        table.rows[i].cells[i].classList.add("diagonal-left");
      }
    }
    if (winner[1] === "right-diagonal") {
      for (let i = 0; i < 3; i++) {
        console.log(table.rows[i].cells[2 - i]);
        table.rows[i].cells[2 - i].classList.add("diagonal-right");
      }
    }
    return;
  }

  function addConfetti() {
    const duration = 5 * 1000,
      animationEnd = Date.now() + duration,
      defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
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

    board.addMove(rowIndex, colIndex, currentPlayer.value);
    clickedCell.textContent = currentPlayer.value;

    const winner = confirmWinner();
    if (winner){
      stopGame();
      finish.showModal();
      if (winner === "tie") {
        winnerDetails.textContent = "It's a tie!";
      } else {
      const winningPlayer = players.find((player) => player.value === winner[0]).name;
      winnerDetails.textContent = `${winningPlayer} is the winner!`;
        drawLineThroughWinner(winner);
        addConfetti();
      }
      restart.addEventListener("click", function () {
        location.reload();
      });
    } else {
      switchPlayer();
      playerTurn.textContent = `${currentPlayer.name}'s turn`;
    }
  }

  // function to start/begin the game
  function beginGame() {
    start.addEventListener("click", function (event) {
      if (player1.value && player2.value) {
        startGame();
        dialog.close();
      }
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
    playerTurn.textContent = `${currentPlayer.name}'s turn`;
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
