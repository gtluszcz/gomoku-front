import _ from 'lodash'

const POINTS_TO_WIN = 5
const LEVELS_TO_PREDICT = 3

export default class AI {
    constructor(board, x_arr, o_arr) {
        this.board = board
        this.x_arr = x_arr
        this.o_arr = o_arr
    }

    setX(x, y) {
        this.board[x][y].value = 1
        this.x_arr.push(this.board[x][y])
        return this.board[x][y]
    }

    setO(x, y) {
        this.board[x][y].value = 0
        this.o_arr.push(this.board[x][y])
        return this.board[x][y]
    }

    removeX(x, y) {
        this.board[x][y].value = ''
        _.remove(this.x_arr, this.board[x][y])
        return this.board[x][y]
    }

    removeO(x, y) {
        this.board[x][y].value = ''
        _.remove(this.o_arr, this.board[x][y])
        return this.board[x][y]
    }

    IntelligentMove() {
        let moves = this.getAllMoves(this.x_arr.concat(this.o_arr))

        const choices = []
        for (const cell of moves) {
            choices.push({ x: cell.x, y: cell.y, score: this.minmax(cell, 1) })
        }
        const el = _.maxBy(choices, 'score') || choices[0]
        console.log(el.score)
        return this.board[el.x][el.y]
    }

    minmax(cell, level) {

        if (level === 3) {
            ;(level % 2 === 1) ? this.setX(cell.x, cell.y) : this.setO(cell.x, cell.y)
            const num = this.heuristic()
            ;(level % 2 === 1) ? this.removeX(cell.x, cell.y) : this.removeO(cell.x, cell.y)
            return num
        }

        ;(level % 2 === 1) ? this.setX(cell.x, cell.y) : this.setO(cell.x, cell.y)

        let moves = this.getAllMoves(this.x_arr.concat(this.o_arr))


        const choices = []
        for (const cell2 of moves) {
            choices.push(this.minmax(cell2, level + 1))
        }

        ;(level % 2 === 1) ? this.removeX(cell.x, cell.y) : this.removeO(cell.x, cell.y)

        return (level % 2 === 0) ? _.max(choices) : _.min(choices)

    }

    getAllMoves() {
        let allmoves = this.x_arr.concat(this.o_arr)

        let newmoves = []
        for (const cell of allmoves) {
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

                    //if can make move on this tile add to allmoves
                    if (this.board[cell.x + x][cell.y + y].value === '' && !_.some(newmoves, this.board[cell.x + x][cell.y + y])) {
                        newmoves.push(this.board[cell.x + x][cell.y + y])
                    }
                }
            }
        }
        return newmoves
    }

    getAroundMoves(cell){
        let newmoves = []
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

                //if can make move on this tile add to allmoves
                if (this.board[cell.x + x][cell.y + y].value === '' && !_.some(newmoves, this.board[cell.x + x][cell.y + y])) {
                    newmoves.push(this.board[cell.x + x][cell.y + y])
                }
            }
        }
        return newmoves
    }
    // getAllMoves(occupied) {
    //     console.log('|', occupied.length)
    //     const around = [] // Array<Object<x: int, y: int>>
    //
    //     for (const { x, y } of occupied) {
    //         for (let r = 1; r <= 1; r++) {
    //             if (this._isAvailable(x - r, y - r, around)) around.push({ x: x - r, y: y - r })
    //             if (this._isAvailable(x - r, y + r, around)) around.push({ x: x - r, y: y + r })
    //             if (this._isAvailable(x + r, y - r, around)) around.push({ x: x + r, y: y - r })
    //             if (this._isAvailable(x + r, y + r, around)) around.push({ x: x + r, y: y + r })
    //             if (this._isAvailable(x - r, y, around)) around.push({ x: x - r, y })
    //             if (this._isAvailable(x + r, y, around)) around.push({ x: x + r, y })
    //             if (this._isAvailable(x, y - r, around)) around.push({ x, y: y - r })
    //             if (this._isAvailable(x, y + r, around)) around.push({ x, y: y + r })
    //         }
    //     }
    //
    //     return around
    // }

    _isAvailable(x, y, occupied) {
        return ! this._outOfBounds(x, y)
            && this.board[x][y].value === ''
            && ! _.some(occupied, { x, y })
    }

    _outOfBounds(x, y) {
        return x < 0
            || y < 0
            || x >= this.board.length
            || y >= this.board[0].length
    }

    heuristic() {
        let score = 0
        const found_pairs = []
        for (let cell of this.x_arr.concat(this.o_arr)) {
            for (let x = 0; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    //search all neighbours

                    //skip this cell
                    if (x === 0 && y === 0) {
                        continue
                    }


                    let num1 = 0
                    let num2 = 0

                    //check if exists
                    if (!(cell.x + x < 0 || cell.y + y < 0 || cell.x + x >= this.board.length || cell.y + y >= this.board[0].length))
                        if (
                            this.board[cell.x + x][cell.y + y].value === cell.value &&
                            ! this._hasPair(found_pairs,[this.board[cell.x + x][cell.y + y], this.board[cell.x][cell.y]]))
                        {
                            found_pairs.push([this.board[cell.x][cell.y], this.board[cell.x + x][cell.y + y]])
                            num1 = this.checkForCellsInDirection(this.board[cell.x + x][cell.y + y], cell.value, 1, x, y,found_pairs)
                        }

                    if (!(cell.x - x < 0 || cell.y - y < 0 || cell.x - x >= this.board.length || cell.y - y >= this.board[0].length))
                        if (
                            this.board[cell.x - x][cell.y - y].value === cell.value &&
                            ! this._hasPair(found_pairs,[this.board[cell.x - x][cell.y - y], this.board[cell.x][cell.y]]))
                        {
                            found_pairs.push([this.board[cell.x][cell.y], this.board[cell.x - x][cell.y - y]])
                            num2 = this.checkForCellsInDirection(this.board[cell.x - x][cell.y - y], cell.value, 1, -x, -y,found_pairs)
                        }


                    let num = 0
                    switch (num1+num2+1){
                    case 2:
                        num+=1
                        break
                    case 3:
                        num+=50
                        break
                    case 4:
                        num+=1000
                        break
                    case 5:
                        num+=10000000
                        break
                    case 6:
                        num+=10000000000000
                        break
                    }

                    ;(cell.value === 1) ? score += num : score -= num
                }
            }
        }
        return score
    }

    getAdjacent(cell,type,board){
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
                    adjacent[x+1][y+1] = this.checkForCellsInDirection2(board[cell.x + x][cell.y + y], type, 1, x, y)

                }
            }
        }

        return adjacent
    }

    _hasPair(pairs, pair) {
        return !! _.find(pairs, (el) =>
            (_.isEqual(el[0], pair[0]) && _.isEqual(el[1], pair[1]))
            || (_.isEqual(el[0], pair[1]) && _.isEqual(el[1], pair[0]))
        )
    }

    checkForCellsInDirection(cell, type, step, dir_x, dir_y,found_pairs) {

        //check if exists
        if (cell.x + dir_x < 0 || cell.y + dir_y < 0 || cell.x + dir_x >= this.board.length || cell.y + dir_y >= this.board[0].length)
            return step

        if (this.board[cell.x + dir_x][cell.y + dir_y].value === type ) {
            found_pairs.push([this.board[cell.x][cell.y], this.board[cell.x + dir_x][cell.y + dir_y]])
            return this.checkForCellsInDirection(this.board[cell.x + dir_x][cell.y + dir_y], type, step + 1, dir_x, dir_y, found_pairs)
        }
        return step
    }

    checkForCellsInDirection2(cell, type, step, dir_x, dir_y) {

        //check if exists
        if (cell.x + dir_x < 0 || cell.y + dir_y < 0 || cell.x + dir_x >= this.board.length || cell.y + dir_y >= this.board[0].length)
            return step

        if (this.board[cell.x + dir_x][cell.y + dir_y].value === type ) {
            return this.checkForCellsInDirection2(this.board[cell.x + dir_x][cell.y + dir_y], type, step + 1, dir_x, dir_y)
        }
        return step
    }
}