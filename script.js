const board = document.querySelector('.board');
const status = document.querySelector('.status');
const restartBtn = document.querySelector('.restart');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');

let currentPlayer = 'X';
let cells = Array(9).fill(null);
let gameMode = 'single'; // 'single' or 'multi'
let gameActive = true;
let scores = { X: 0, O: 0 };

// Show mode selection screen after instructions
function startGame() {
  document.getElementById('instructions-screen').classList.remove('active');
  document.getElementById('mode-selection-screen').classList.add('active');
}

function selectMode(mode) {
  gameMode = mode;
  document.getElementById('mode-selection-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  resetGame();
}

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    board.appendChild(cell);
  }
  board.addEventListener('click', handleCellClick);
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index] || e.target.classList.contains('taken')) return;

  makeMove(index, currentPlayer);

  if (gameMode === 'single' && gameActive && currentPlayer === 'O') {
    setTimeout(() => {
      const aiMove = getBestMove();
      makeMove(aiMove, 'O');
    }, 500);
  }
}

function makeMove(index, player) {
  cells[index] = player;
  const cell = board.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
  cell.classList.add('taken');

  if (checkWinner(player)) {
    scores[player]++;
    showPopup(`🎉 ${player} wins! 🎉<br>Score: X - ${scores.X}, O - ${scores.O}`);
    createEmojiBurst('🎉');
    gameActive = false;
    return;
  }

  if (!cells.includes(null)) {
    showPopup(`🤝 It's a Draw! 🤝<br>Score: X - ${scores.X}, O - ${scores.O}`);
    createEmojiBurst('🤝');
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner(player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return winCombos.some(combo =>
    combo.every(i => cells[i] === player)
  );
}

function getBestMove() {
  const emptyIndices = cells.map((val, idx) => val === null ? idx : null).filter(i => i !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function resetGame() {
  cells.fill(null);
  currentPlayer = 'X';
  gameActive = true;
  status.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

function showPopup(message) {
  popupMessage.innerHTML = message;
  popup.style.display = 'flex';
}

function closePopup() {
  popup.style.display = 'none';
  // Back to Mode Selection
  document.getElementById('game-screen').classList.remove('active');
  document.getElementById('mode-selection-screen').classList.add('active');
}

function createEmojiBurst(emoji) {
  const container = document.createElement('div');
  container.classList.add('emoji-burst');
  document.body.appendChild(container);

  for (let i = 0; i < 20; i++) {
    const span = document.createElement('span');
    span.classList.add('emoji');
    span.textContent = emoji;
    span.style.left = Math.random() * 100 + 'vw';
    span.style.top = Math.random() * -20 + 'vh';
    span.style.animationDuration = (1.5 + Math.random()) + 's';
    container.appendChild(span);
  }

  setTimeout(() => container.remove(), 7000);
}

// Welcome to Instructions
function showLoader() {
  document.getElementById('welcome-screen').classList.remove('active');
  document.getElementById('loader-screen').classList.add('active');
  setTimeout(() => {
    document.getElementById('loader-screen').classList.remove('active');
    document.getElementById('instructions-screen').classList.add('active');
  }, 2000);
}

restartBtn.addEventListener('click', resetGame);
createBoard(); // Initial setup
