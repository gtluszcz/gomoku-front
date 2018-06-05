<template>
    <div>
        <div class="fixed flex items-center justify-between label">
            <div class="text-3xl text-grey-darkest">Turn:</div>
            <div class="w-10 h-10 bg flex-no-shrink" :class="['bg-o','bg-x'][turn]"></div>
        </div>

        <div v-if="gameover !== false" class="fixed z-20 overlay"></div>
        <div v-if="gameover !== false"
             class="fixed z-30 flex items-center rounded-full shadow bg-white p-4 pr-16 border border-grey-lightest justify-between win">
            <div class="text-3xl text-grey-darkest">Won:</div>
            <div class="w-10 h-10 bg flex-no-shrink" :class="['bg-o','bg-x'][gameover]"></div>
        </div>

        <div id="board" class="flex flex-col">
            <div class="flex flex-no-shrink" v-for="array in this.board" :key="array.id">
                <div @click="clickOnTile(cell)"
                     class="flex-no-shrink w-6 h-6 border border-grey-lightest text-center bg hover:border-grey"
                     :class="['bg-o','bg-x','bg-green'][cell.value]" v-for="cell in array" :key="cell.id"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import Logic from '../logic.js'

    let logic = {}

    export default {
        name: 'Board',
        data() {
            return {
                board: [],
                turn: 0,
                gameover: false,
            }
        },
        methods: {
            clickOnTile(cell) {
                if (cell.value === '') {
                    if (this.turn === 0) {
                        //set O in coordinates of cell.x and cell.y
                        const newcell = logic.setO(cell.x,cell.y,logic.o_arr,logic.board)

                        // check if O won
                        if (logic.checkNeighboursForWin(newcell))
                            this.gameover = 0
                        else {
                            //change turn
                            this.turn = 1

                            //computing AI move
                            let cell2 = logic.moveAI(1)
                            // check if AI won
                            if (logic.checkNeighboursForWin(this.board[cell2.x][cell2.y]))
                                this.gameover = 1

                            //change turn
                            this.turn = 0
                        }
                    }
                    else if (this.turn === 1) {
                        //set X in coordinates of cell.x and cell.y
                        const newcell = logic.setX(cell.x,cell.y,logic.x_arr,logic.board)

                        // check if X won
                        if (logic.checkNeighboursForWin(newcell))
                            this.gameover = 1

                        //change turn
                        this.turn = 0
                    }

                }
            },
        },
        created() {
            for (let i = 0; i < 100; i++) {
                let arr = []
                for (let j = 0; j < 100; j++) {
                    arr.push({ value: '', x: i, y: j })
                }
                this.board.push(arr)
            }
            logic = new Logic(this.board)
        },
    }
</script>

<style>
    .overlay {
        background-color: rgba(0, 0, 0, 0.3);
        height: 100%;
        width: 100%;
    }

    .pr-16 {
        padding-right: 8rem;
    }

    .label {
        width: 120px;
        top: 60px;
        left: calc(50% - 60px);
    }

    .win {
        width: 140px;
        top: 50%;
        left: calc(50% - 70px);
    }

    .bg {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .bg-x {
        background-image: url('../../assets/X2.svg')
    }

    .bg-o {
        background-image: url('../../assets/O.svg')
    }
</style>
