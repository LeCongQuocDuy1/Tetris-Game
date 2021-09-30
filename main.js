const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const ROW = 18; // số hàng
const COL = 10; // số cột
const SQ = 40; // kích thước của 1 ô
const COLOR = 'WHITE'; // màu của ô

let score = 0;

function drawSquare(x, y, color) { // hàm tạo ô vuông có 3 tham số, tạo độ x y, màu color
    ctx.fillStyle = color; // chọn màu
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ); //vẽ ô

    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// tạo mảng 2 chiều chứa gamebox
let board = []; 
for (r = 0; r < ROW; r++) { // duyet qua so hang so cot
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = COLOR;
    }
}

function drawBoard() {
    for (r = 0; r < ROW; r++) { // duyet qua so hang so cot
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;

        this.tetrominoN = 0; // góc quay đầu tiên
        this.activeTetromino = this.tetromino[this.tetrominoN];

        this.x = 3; // vi tri dau tien
        this.y = -2;
    }

    fill(color) {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    draw() {
        this.fill(this.color);
    }

    unDraw() {
        this.fill(COLOR);
    }

    lock() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue
                }

                if (this.y + r < 0) {
                    alert('GAME OVER!');
                    gameOver = true;
                    break;
                }

                board[this.y + r][this.x + c] = this.color;
            }
        }

        // Xử lí ăn điểm
        for (let r = 0; r < ROW; r++) {
            let isFull = true;
            for (let c = 0; c < COL; c++) {
                isFull = isFull && (board[r][c] != COLOR)
            }

            if (isFull) {
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }

                for (let c = 0; c < COL; c++) {
                    board[0][c] = COLOR;
                }

                score += 10;
            }
        }

        drawBoard();

        document.querySelector('#score').innerText = score;
    }

    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let move = 0;

        if (this.collision(0, 0, nextPattern)) {
            if (this.x > COL / 2) {
                move = -1;
            } else {
                move = 1;
            }
        }

        if (!this.collision(0, 0, nextPattern)) {
            this.unDraw();
            this.x += move;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }
    moveDown() {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.lock();
            p = randomPiece();
        }
    }

    moveLeft() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }

    moveRight() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

    

    collision(x, y, piece) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece.length; c++) {
                if (!piece[r][c]) {
                    continue
                }

                let newX = this.x + c + x;
                let newY = this.y + r + y;

                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }

                if (newY < 0) {
                    continue
                }

                if (board[newY][newX] != COLOR) {
                    return true
                }
            }
        }
        return false;
    }
}

const PIECES = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'yellow'],
    [O, 'blue'],
    [L, 'purple'],
    [I, 'cyan'],
    [J, 'orange'],
    [X, 'pink'],
    [Y, 'silver'],
];

function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();
console.log(p);

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 37) {
        p.moveLeft();
    } else if (e.keyCode == 39) {
        p.moveRight();
    } else if (e.keyCode == 38) {
        p.rotate();
    } else if (e.keyCode == 40) {
        p.moveDown();
    }    
})

let gameOver = false;
let interval;

function drop() {
    interval = setInterval(function () {
        if (!gameOver) {
            p.moveDown();
        } else {
            clearInterval(interval)
        }
    }, 1000)
}

drop();


