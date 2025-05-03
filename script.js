const board = document.querySelector('.board');
const status = document.querySelector('.status');
const restartBtn = document.querySelector('.restart');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');

let currentPlayer = 'X';
let cells = Array(9).fill(null);

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
    if (cells[index] || e.target.classList.contains('taken')) return;

    cells[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken');

    checkWinner();

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    const winCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            showPopup(`🎉 ${cells[a]} is the winner! 🎉`);
            createEmojiBurst('🎉');
            board.removeEventListener('click', handleCellClick);
            return;
        }
    }

    if (!cells.includes(null)) {
        showPopup("🤝 It's a Draw! 🤝");
        createEmojiBurst('🤝');
    }
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
        span.style.top = Math.random() * -20 + 'vh'; // start from slightly above
        span.style.animationDuration = (1.5 + Math.random()) + 's';
        container.appendChild(span);
    }

    setTimeout(() => {
    container.remove();
}, 7000); // 7 seconds before removing
}



function resetGame() {
    cells.fill(null);
    currentPlayer = 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
    createBoard();
}

function showPopup(message) {
    popupMessage.innerHTML = message;  // Use innerHTML to allow emoji rendering
    popup.style.display = 'flex';
}

function closePopup() {
    popup.style.display = 'none';
    resetGame();
}

restartBtn.addEventListener('click', resetGame);
createBoard();
