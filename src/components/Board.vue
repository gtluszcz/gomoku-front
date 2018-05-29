<template>
    <div>
        <div class="fixed flex items-center justify-between label">
            <div class="text-3xl text-grey-darkest">Turn:</div>
            <div class="w-10 h-10 bg flex-no-shrink" :class="['bg-o','bg-x'][turn]"></div>
        </div>

        <div v-if="gameover !== false" class="fixed z-20 overlay"></div>
        <div v-if="gameover !== false" class="fixed z-30 flex items-center rounded-full shadow bg-white p-4 pr-16 border border-grey-lightest justify-between win">
            <div class="text-3xl text-grey-darkest">Won:</div>
            <div class="w-10 h-10 bg flex-no-shrink" :class="['bg-o','bg-x'][gameover]"></div>
        </div>

        <div id="board" class="flex flex-col">
            <div class="flex flex-no-shrink" v-for="array in this.board" v-bind:key="array.id">
                <div @click="clickOnTile(cell)" class="flex-no-shrink w-6 h-6 border border-grey-lightest text-center bg hover:border-grey" :class="['bg-o','bg-x'][cell.value]" v-for="cell in array" v-bind:key="cell.id"></div>
            </div>
        </div>


    </div>
</template>

<script>

    const POINTS_TO_WIN = 5

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
            clickOnTile(cell){
                if (cell.value === ''){
                    if (this.turn === 0) {
                        this.board[cell.x][cell.y].value = 0
                        this.turn = 1
                        this.checkForWin(0)
                    }
                    else if (this.turn === 1){
                        this.board[cell.x][cell.y].value = 1
                        this.turn = 0
                        this.checkForWin(1)

                    }

                }
            },
            checkForWin(type){
                let o_arr = []
                let x_arr = []
                for (let arr of this.board){
                    for (let cell of arr){
                        if (cell.value === 0)
                            o_arr.push(cell)
                        else if (cell.value === 1)
                            x_arr.push(cell)
                    }
                }

                //console.log(o_arr)


                if (type === 0){
                    for(let cell of o_arr){
                        this.checkNeighboursForWin(cell,0)
                    }
                }
                else if (type === 1){
                    for(let cell of x_arr){
                        this.checkNeighboursForWin(cell,1)
                    }
                }
            },
            checkNeighboursForWin(cell,type){
                for(let x=-1;x<2;x++){
                    for(let y=-1;y<2;y++){
                        //search all neighbours

                        //skip this cell
                        if (x===0 && y===0){
                            continue
                        }

                        //check if exists
                        if (cell.x+x<0 || cell.y+y<0)
                            continue

                        //console.log(cell.x,cell.y)
                        //if found neighbour
                        //console.log(cell.x+x,cell.y+y,this.board[cell.x+x][cell.y+y].value)

                        if (this.board[cell.x+x][cell.y+y].value === type){
                            console.log(x,y)
                            this.checkForWinInDirection(this.board[cell.x+x][cell.y+y],type,2,x,y)

                        }
                    }
                }
            },
            checkForWinInDirection(cell,type,step,dir_x,dir_y){
                if(step === POINTS_TO_WIN) {
                    this.gameover = type
                    return
                }

                //check if exists
                if (cell.x+dir_x<0 || cell.y+dir_y<0)
                    return

                if (this.board[cell.x+dir_x][cell.y+dir_y].value === type){
                    this.checkForWinInDirection(this.board[cell.x+dir_x][cell.y+dir_y],type,step+1,dir_x,dir_y)
                }
            },
        },
        created() {
            for (let i=0;i<100;i++){
                let arr = []
                for (let j=0;j<100;j++){
                    arr.push({value: '', x:i, y: j})
                }
                this.board.push(arr)
            }
        },
    }
</script>

<style>
    .overlay{
        background-color: rgba(0,0,0,0.3);
        height: 100%;
        width: 100%;
    }
    .pr-16{
        padding-right: 8rem;
    }
    .label{
        width: 120px;
        top: 60px;
        left: calc(50% - 60px);
    }
    .win{
        width: 140px;
        top: 50%;
        left: calc(50% - 70px);
    }
    .bg{
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .bg-x{
        background-image: url('../../assets/X2.svg')
    }
    .bg-o{
        background-image: url('../../assets/O.svg')
    }
</style>
