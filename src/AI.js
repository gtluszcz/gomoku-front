import _ from 'lodash'
const POINTS_TO_WIN = 5
const LEVELS_TO_PREDICT = 3

export default class AI{
    constructor(board,x_arr,o_arr){
        this.board = board
        this.x_arr = x_arr
        this.o_arr = o_arr
    }

    setX(x,y){
        this.board[x][y].value = 1
        this.x_arr.push(this.board[x][y])
        return this.board[x][y]
    }

    setO(x,y){
        this.board[x][y].value = 0
        this.o_arr.push(this.board[x][y])
        return this.board[x][y]
    }

    removeX(x,y){
        this.board[x][y].value = ''
        _.remove(this.x_arr,this.board[x][y])
        return this.board[x][y]
    }

    removeO(x,y){
        this.board[x][y].value = ''
        _.remove(this.o_arr,this.board[x][y])
        return this.board[x][y]
    }

    IntelligentMove(type){

        let moves = this.getAllMoves(this.x_arr,this.o_arr,this.board)

        const choices = []
        for (const cell of moves){
            choices.push({x: cell.x, y:cell.y ,score: this.minmax(cell,type,0)})
        }
        const el = _.maxBy(choices,'score')
        return this.board[el.x][el.y]
    }

    minmax(cell,type,level){

        if (level===2){
            ;(level % 2 === 0) ? this.setX(cell.x,cell.y) : this.setO(cell.x,cell.y)
            const num = this.heuristic(cell,type,this.board)
            ;(level % 2 === 0) ? this.removeX(cell.x,cell.y) : this.removeO(cell.x,cell.y)
            return num
        }

        ;(level % 2 === 0) ? this.setX(cell.x,cell.y) : this.setO(cell.x,cell.y)

        const newmoves = this.getAllMoves(this.x_arr,this.o_arr,this.board)

        const choices=[]
        for (cell of newmoves){
            choices.push(this.minmax(cell,type,level+1))
        }

        ;(level % 2 === 0) ? this.removeX(cell.x,cell.y) : this.removeO(cell.x,cell.y)

        return (level % 2 === 1) ? _.max(choices) : _.min(choices)

    }

    getAllMoves(x_arr,o_arrr,board){
        let allmoves = x_arr.concat(o_arrr)

        let newmoves = new Set()
        for (const cell of allmoves){
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

                    //if can make move on this tile add to allmoves
                    if (board[cell.x + x][cell.y + y].value === '') {
                        newmoves.add(board[cell.x + x][cell.y + y])
                    }
                }
            }
        }
        return Array.from(newmoves)
    }



    heuristic(cell,type,board) {
        const adjacent_ally = this.getAdjacent(cell, type, board)
        const adjacent_enemy = this.getAdjacent(cell, (type === 1)?0:1, board)
        let score = 0
        let max_ally = 0
        let max_enemy = 0
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (adjacent_ally[x][y]>max_ally)
                    max_ally=adjacent_ally[x][y]

                if (adjacent_enemy[x][y]>max_enemy)
                    max_enemy=adjacent_enemy[x][y]
            }
        }


        score += (2*max_ally)
        score += (2*max_enemy)
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
                    adjacent[x+1][y+1] = this.checkForCellsInDirection(board[cell.x + x][cell.y + y], type, 1, x, y)

                }
            }
        }

        return adjacent
    }

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