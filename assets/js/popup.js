document.addEventListener('DOMContentLoaded', function () {
  const board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  const humanPlayer = "X";
  const computerPlayer = "O";

  function renderBoard() {
    const boardContainer = document.getElementById("game-board");
    boardContainer.innerHTML = "";
    
    for (let i = 0; i < board.length; i++) {
      const cell = document.createElement("div");
      cell.className = "cell " + board[i];
      cell.innerText = board[i];
      cell.addEventListener("click", () => makeMove(i));
      boardContainer.appendChild(cell);
    }
  }

  function makeMove(index) {
    if (board[index] === "" && !isGameOver()) {
      board[index] = humanPlayer;
      renderBoard();

      if (!isGameOver()) {
        switchPlayer();
        makeComputerMove();
      }
    }
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }

  function makeComputerMove() {
    if (currentPlayer === computerPlayer && !isGameOver()) {
      const bestMove = getBestMove();
      board[bestMove] = computerPlayer;
      renderBoard();
      switchPlayer();
    }
  }

  function isGameOver() {
    if (checkWinner(humanPlayer)) {
      showResult("You win!");
      return true;
    } else if (checkWinner(computerPlayer)) {
      showResult("Computer wins!");
      return true;
    } else if (!board.includes("")) {
      showResult("It's a Draw!");
      return true;
    }
    return false;
  }
  function checkWinner(player) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i * 3] === player && board[i * 3 + 1] === player && board[i * 3 + 2] === player) {
        return true;
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[i] === player && board[i + 3] === player && board[i + 6] === player) {
        return true;
      }
    }

    // Check diagonals
    if (board[0] === player && board[4] === player && board[8] === player) {
      return true;
    }
    if (board[2] === player && board[4] === player && board[6] === player) {
      return true;
    }

    return false;
  }

  function showResult(message) {
    const resultModal = document.getElementById("result-modal");
    const resultMessage = document.getElementById("result-message");
    resultMessage.innerText = message;
    resultModal.style.display = "block";
  }

  function resetGame() {
    const resultModal = document.getElementById("result-modal");
    resultModal.style.display = "none";

    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
    currentPlayer = "X";
    renderBoard();
  }


  function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = computerPlayer;
        let score = minimax(board, 0, false);
        board[i] = "";
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  function minimax(board, depth, isMaximizing) {
    if (checkWinner(humanPlayer)) {
      return -1;
    } else if (checkWinner(computerPlayer)) {
      return 1;
    } else if (!board.includes("")) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = computerPlayer;
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = humanPlayer;
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  // Initial rendering
  renderBoard();
  // reset game
  document.getElementById('reset-game').addEventListener('click', () => resetGame());

});
