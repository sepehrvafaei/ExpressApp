const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById("board");
const winning_element = document.getElementById("winningMessage");
const winning_message = document.querySelector('[data-winning-message]');
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', startGame);
let oTurn;
const winning_combinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 4, 8], [2, 4, 6],
    [0, 3, 6], [1, 4, 7], [2, 5, 8]
];
startGame();
function startGame() {
    oTurn = false;
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('o');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener("click", handleClick, { once: true });
    });
    setBoardHoverClass();
    winning_element.classList.remove('show');
}
function setBoardHoverClass() {
    board.classList.remove("x");
    board.classList.remove("o");
    if (oTurn) {
        board.classList.add("o");
    } else {
        board.classList.add("x");
    }
}
function handleClick(e) {
    let cell = e.target;
    let currentClass = oTurn ? 'o' : 'x';
    cell.classList.add(currentClass);
    if (checkWinner(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        oTurn = !oTurn;
        setBoardHoverClass();
    }
}
function checkWinner(currentClass) {
    return winning_combinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}
function isDraw() {
    return [...cells].every(cell => {
        return (cell.classList.contains('x') || cell.classList.contains('o'));
    });
}
function endGame(draw) {
    if (draw) {
        winning_message.innerHTML = 'Draw';
    }
    else {
        winning_message.innerHTML = (oTurn) ? 'O wins' : 'x wins';
    }
    winning_element.classList.add("show");
}