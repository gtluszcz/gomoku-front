
const POINTS_TO_WIN = 5

export default class Logic {
    constructor(board){
        this.board = board
    }

    globalCheckForWin(type) {
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


    checkNeighboursForWin(cell) {

        let scores = this.getAdjacent(cell,cell.value)


        if (
            scores[0][0] + scores[2][2] >= 4 ||
            scores[0][1] + scores[2][1] >= 4 ||
            scores[1][0] + scores[1][2] >= 4 ||
            scores[2][0] + scores[0][2] >= 4
        ){
            return true
        }
        else{
            return false
        }
    }

    // returns [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0],
    // ]
    //where integers are the number of adjacent cells of type in this direction
    getAdjacent(cell,type){
        let adjacent = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]

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
                    adjacent[x+1][y+1] = this.checkForCellsInDirection(this.board[cell.x + x][cell.y + y], type, 1, x, y)

                }
            }
        }

        return adjacent
    }


    //recursive function that returns amount of continuous adjacent cells of certain type starting from cell.
    checkForCellsInDirection(cell, type, step, dir_x, dir_y) {
        if (step === POINTS_TO_WIN) {
            return step
        }

        //check if exists
        if (cell.x + dir_x < 0 || cell.y + dir_y < 0 || cell.x + dir_x >= this.board.length || cell.y + dir_y >= this.board[0].length)
            return step

        if (this.board[cell.x + dir_x][cell.y + dir_y].value === type) {
            return this.checkForCellsInDirection(this.board[cell.x + dir_x][cell.y + dir_y], type, step + 1, dir_x, dir_y)
        }
        return step
    }
}