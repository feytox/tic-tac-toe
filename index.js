const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
const map = Array(9);

let step = 0;
let isGameEnd = false;

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
    step = 0;
    isGameEnd = false;
    map.fill(EMPTY);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function checkRow(symbol, row, col) {
    if (row > 1) {
        if (map[(row - 2) * colSize + col] === symbol && map[(row - 1) * colSize + col] === symbol)
            return ((row - 2) * colSize + col, (row - 1) * colSize + col, row * colSize + col)
    } 
    if (row > 0 && row < rowSize - 1) {
        if (map[(row - 1) * colSize + col] === symbol && map[(row + 1) * colSize + col] === symbol)
            return ((row - 1) * colSize + col, row * colSize + col, (row + 1) * colSize + col)
    }
    if (row < rowSize - 2) {
        if (map[(row + 1) * colSize + col] === symbol && map[(row + 1) * colSize + col] === symbol)
            return ((row - 1) * colSize + col, row * colSize + col, (row + 1) * colSize + col)
    }
    return (-1, -1, -1)
}

function checkCol(symbol, row, col) {
    if (col > 1) {
        if (map[row * colSize + col - 2] === symbol && map[row * colSize + col - 1] === symbol)
            return (row * colSize + col - 2, row * colSize + col - 1, row * colSize + col)
    } 
    if (col > 0 && col < colSize - 1) {
        if (map[row * colSize + col - 1] === symbol && map[row * colSize + col + 1] === symbol)
            return (row * colSize + col - 1, row * colSize + col, row * colSize + col + 1)
    }
    if (col < colSize - 2) {
        if (map[row * colSize + col + 1] === symbol && map[row * colSize + col + 2] === symbol)
            return (row * colSize + col, row * colSize + col + 1, row * colSize + col + 2)
    }
    return (-1, -1, -1)
}

function checkDial(symbol, row, col) {
    if (row > 1 && col > 1) {
        if (map[(row - 2) * colSize + col - 2] === symbol && map[(row - 1) * colSize + col - 1] === symbol)
            return ((row - 2) * colSize + col - 2, (row - 1) * colSize + col - 1, row * colSize + col)
    } 
    if (row > 0 && row < rowSize - 1 && col > 0 && col < colSize - 1) {
        if (map[(row - 1) * colSize + col - 1] === symbol && map[(row + 1) * colSize + col + 1] === symbol)
            return ((row - 1) * colSize + col - 1, row * colSize + col, (row + 1) * colSize + col + 1)
    }
    if (row < rowSize - 2 && col < colSize - 2) {
        if (map[(row + 1) * colSize + col + 1] === symbol && map[(row + 2) * colSize + col + 2] === symbol)
            return (row * colSize + col, (row + 1) * colSize + col + 1, (row + 2) * colSize + col + 2)
    }

    if (row < rowSize - 2 && col > 1) {
        if (map[(row + 2) * colSize + col - 2] === symbol && map[(row + 1) * colSize + col - 1] === symbol)
            return ((row + 2) * colSize + col - 2, (row + 1) * colSize + col - 1, row * colSize + col)
    } 
    if (row > 0 && row < rowSize - 1 && col > 0 && col < colSize - 1) {
        if (map[(row + 1) * colSize + col - 1] === symbol && map[(row - 1) * colSize + col + 1] === symbol)
            return ((row + 1) * colSize + col - 1, row * colSize + col, (row - 1) * colSize + col + 1)
    }
    if (row > 1 && col < colSize - 2) {
        if (map[(row - 1) * colSize + col + 1] === symbol && map[(row - 2) * colSize + col + 2] === symbol)
            return (row * colSize + col, (row - 1) * colSize + col + 1, (row - 2) * colSize + col + 2)
    }

    return (-1, -1, -1)
}

function checkWin(row, col) {
    let symbol;
    if (step % 2) {
        symbol = ZERO;
    } else {
        symbol = CROSS;
    }

    let cur = checkRow(symbol, row, col);
    if (cur === (-1, -1, -1)) 
        cur = checkCol(symbol, row, col);
    if (cur === (-1, -1, -1)) 
        cur = checkDiag(symbol, row, col);
    if (cur === (-1, -1, -1))
        cur = NaN;
    return cur;
}

function cellClickHandler (row, col) {
    if (isGameEnd)
        return;

    const index = row * 3 + col;
    const current = map[index];
    const isCross = step % 2 === 0;
    if (current !== EMPTY)
        return;

    const symbol = isCross ? CROSS : ZERO;

    map[index] = symbol;
    step++;
    renderSymbolInCell(symbol, row, col);

    if (step === 9) {
        alert("Победила дружба")
        isGameEnd = true;
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    startGame();
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
