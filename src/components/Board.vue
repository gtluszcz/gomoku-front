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
                     :class="['bg-o','bg-x'][cell.value]" v-for="cell in array" :key="cell.id"></div>
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
                        this.board[cell.x][cell.y].value = 0
                        this.turn = 1
                        if (logic.checkNeighboursForWin(this.board[cell.x][cell.y],0))
                            this.gameover = 0
                    }
                    else if (this.turn === 1) {
                        this.board[cell.x][cell.y].value = 1
                        this.turn = 0
                        if (logic.checkNeighboursForWin(this.board[cell.x][cell.y],1))
                            this.gameover = 1
                    }

                }
            },
        },
        created() {
            for (let i = 0; i < 100; i++) {
                let arr = []
                for (let j = 0; j < 100; j++) {
                    arr.push({ value: (Math.random() > 0.8) ?((Math.random()>0.5) ? 1:0):'', x: i, y: j })
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
