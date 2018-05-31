
const POINTS_TO_WIN = 5

export default class Logic {
    constructor(board){
        this.board = board
    }

    checkForWin(type) {
        let array = []
        for (let arr of this.board) {
            for (let cell of arr) {
                if (cell.value === type)
                    array.push(cell)
            }
        }

        for (let cell of array) {
            if (this.checkNeighboursForWin(cell, type)) {
                return true
            }
        }
        return false
    }


    checkNeighboursForWin(cell, type) {
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                //search all neighbours

                //skip this cell
                if (x === 0 && y === 0) {
                    continue
                }

                //check if exists
                if (cell.x + x < 0 || cell.y + y < 0 || cell.x + x >= this.board.length || cell.y + y >= this.board[0].length)
                    continue

                //if found neighbour
                if (this.board[cell.x + x][cell.y + y].value === type) {
                    if (this.checkForWinInDirection(this.board[cell.x + x][cell.y + y], type, 2, x, y) === true) {
                        return true
                    }
                }
            }
        }
        return false
    }

    checkForWinInDirection(cell, type, step, dir_x, dir_y) {
        if (step === POINTS_TO_WIN) {
            return true
        }

        //check if exists
        if (cell.x + dir_x < 0 || cell.y + dir_y < 0 || cell.x + dir_x >= this.board.length || cell.y + dir_y >= this.board[0].length)
            return false

        if (this.board[cell.x + dir_x][cell.y + dir_y].value === type) {
            return this.checkForWinInDirection(this.board[cell.x + dir_x][cell.y + dir_y], type, step + 1, dir_x, dir_y)
        }
        return false
    }
}