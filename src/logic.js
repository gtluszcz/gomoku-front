import axios from 'axios'

const POINTS_TO_WIN = 5
const LEVELS_TO_PREDICT = 3
var instance = axios.create({ baseURL: 'http://localhost:8080/gomoku/v1/logic' })

export default class Logic {
    constructor(board,turn,gameover) {
        this.board = board
        this.x_arr = []
        this.o_arr = []
        this.turn = turn
        this.gameover = gameover
        this.caniMove = true
    }

    setX(x, y) {
        const string = '/setcell/' + x + '/' + y + '/1'

        instance.get(string)
            .then((response) => {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })

        this.board[x][y].value = 1
        this.x_arr.push(this.board[x][y])
        return this.board[x][y]
    }

    setO(x, y) {
        const string = '/setcell/' + x + '/' + y + '/0'
        instance.get(string)
            .then((response) => {
                console.log(response)
                // check if O won
                if (this.checkNeighboursForWin(this.board[x][y]))
                    this.gameover.value = 0
                else {
                    //change turn
                    this.turn.value = 1

                    //computing AI move
                    this.moveAI()
                }
            })
            .catch(function (error) {
                console.log(error)
            })
        this.board[x][y].value = 0
        this.o_arr.push(this.board[x][y])
        return this.board[x][y]
    }

    moveAI() {

        instance.get('/nextmove')
            .then((response) => {

                console.log(response)
                console.log(this.turn.value)
                this.setX(response.data.x,response.data.y)
                if (this.checkNeighboursForWin(this.board[response.data.x][response.data.y]))
                    this.gameover.value = 1
                else{
                    this.turn.value = 0
                    console.log(this.turn.value)
                }

            })
            .catch(function (error) {
                console.log(error)
            })

        return
    }

    globalCheckForWin(type) {
        if (type !== 1 && type !== 0)
            return

        const array = (type === 1) ? this.x_arr : this.o_arr

        for (let cell of array) {
            if (this.checkNeighboursForWin(cell, type)) {
                return true
            }
        }
        return false
    }

    checkNeighboursForWin(cell) {

        let scores = this.getAdjacent(cell, cell.value, this.board)

        if (
            scores[0][0] + scores[2][2] >= (POINTS_TO_WIN - 1) ||
            scores[0][1] + scores[2][1] >= (POINTS_TO_WIN - 1) ||
            scores[1][0] + scores[1][2] >= (POINTS_TO_WIN - 1) ||
            scores[2][0] + scores[0][2] >= (POINTS_TO_WIN - 1)
        ) {
            return true
        }
        else {
            return false
        }
    }

    // returns [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0],
    // ]
    //where integers are the number of continuous adjacent cells of type in this direction
    getAdjacent(cell, type, board) {
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
                if (cell.x + x < 0 || cell.y + y < 0 || cell.x + x >= board.length || cell.y + y >= board[0].length)
                    continue

                //if found neighbour
                if (board[cell.x + x][cell.y + y].value === type) {
                    adjacent[x + 1][y + 1] = this.checkForCellsInDirection(board[cell.x + x][cell.y + y], type, 1, x, y)

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