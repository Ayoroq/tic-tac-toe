// Factory function to create game board
const gameBoard = () => {
  const board = Array(3)
    .fill()
    .map(() => Array(3).fill(""));

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

  return {
    getBoard,
    addMove,
  };
};

// function to change the symbols selected by the users
function changeSymbol() {
  const symbol1 = document.querySelector(".symbol-a");
  const symbol2 = document.querySelector(".symbol-b");

  function handleSymbol1Change() {
    symbol2.value = symbol1.value === "✕" ? "⭕" : "✕";
  }

  function handleSymbol2Change() {
    symbol1.value = symbol2.value === "✕" ? "⭕" : "✕";
  }

  symbol1.addEventListener("change", handleSymbol1Change);
  symbol2.addEventListener("change", handleSymbol2Change);

  return {
    symbol1,
    symbol2,
    cleanup: () => {
      symbol1.removeEventListener("change", handleSymbol1Change);
      symbol2.removeEventListener("change", handleSymbol2Change);
    },
  };
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

  const symbolController = changeSymbol();

  let board;
  let currentPlayer;
  const players = [];

  function switchPlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  }

  function checkWinner() {
    const b = board.getBoard();

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) {
        return [b[i][0], i, "rows"];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) {
        return [b[0][i], i, "columns"];
      }
    }

    // Check diagonals
    if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
      return [b[0][0], "left-diagonal"];
    }
    if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
      return [b[0][2], "right-diagonal"];
    }

    // Check for tie
    return b.flat().every((cell) => cell) ? "tie" : null;
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
        table.rows[i].cells[i].classList.add("diagonal-left");
      }
    }
    if (winner[1] === "right-diagonal") {
      for (let i = 0; i < 3; i++) {
        table.rows[i].cells[2 - i].classList.add("diagonal-right");
      }
    }
    return;
  }

  let confettiInterval;

  function addConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  // Main game loop to play one round
  function playRound() {
    table.addEventListener("click", detectClick);
  }

  function detectClick(event) {
    const clickedElement = event.target;
    if (clickedElement.tagName !== "TD") return;

    const clickedCell = clickedElement;
    if (clickedCell.textContent) return;

    const clickedRow = clickedCell.parentNode;
    const rowIndex = clickedRow.rowIndex;
    const colIndex = clickedCell.cellIndex;

    board.addMove(rowIndex, colIndex, currentPlayer.value);
    clickedCell.textContent = currentPlayer.value;

    const winner = checkWinner();
    if (winner) {
      stopGame();
      finish.showModal();
      if (winner === "tie") {
        winnerDetails.textContent = "It's a tie!";
      } else {
        const winningPlayer = players.find(
          (player) => player.value === winner[0]
        ).name;
        winnerDetails.textContent = `${winningPlayer} is the winner!`;
        drawLineThroughWinner(winner);
        addConfetti();
      }
    } else {
      switchPlayer();
      playerTurn.textContent = `${currentPlayer.name}'s turn`;
    }
  }

  function handleRestart() {
    if (confettiInterval) clearInterval(confettiInterval);

    // Reset board display
    table.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = "";
      cell.className = "cell";
    });

    // Reset game state
    board = gameBoard();
    currentPlayer = players[0];
    playerTurn.textContent = `${currentPlayer.name}'s turn`;
    finish.close();
    playRound();
  }

  function beginGame() {
    start.addEventListener("click", () => {
      const name1 = player1.value.trim();
      const name2 = player2.value.trim();

      if (name1 && name2 && name1 !== name2) {
        table.classList.toggle("visible");
        startGame();
        dialog.close();
      }
    });

    restart.addEventListener("click", handleRestart);
  }

  function startGame() {
    players.length = 0;
    players.push(
      { name: capitalizeFirstLetter(player1.value.trim()), value: symbol1.value },
      { name: capitalizeFirstLetter(player2.value.trim()), value: symbol2.value }
    );
    board = gameBoard();
    currentPlayer = players[0];
    playerTurn.textContent = `${currentPlayer.name}'s turn`;
    playRound();
  }

  function stopGame() {
    table.removeEventListener("click", detectClick);
  }

  return { beginGame };
};

// Start the game
const game = gameController();
game.beginGame();
