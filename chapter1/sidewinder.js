class SideWinter extends Algorithm{
    constructor(nrRows, nrCols, cellSize, padding){
        super(nrRows, nrCols, cellSize, padding);
    }

    //given a set of cells it will randomly pick one
    //and have its' northern wall removed
    closeRun(runSet){
        var n = runSet.length;
        var cell = runSet[Math.round((n-1) * Math.random())];
                    
        cell.north = false;
        this.cells[cell.row-1][cell.col].south = false;
    }

    generateMaze(){
        var runSet = []

        for(let i=0; i<this.nrRows; i++){
            for(let j=0; j<this.nrCols; j++){

                //for all the cells in the first (northern) row 
                //apart from the last one just carve east
                if(i == 0){
                    if(j < this.nrCols-1){
                        this.cells[i][j].east = false;
                        this.cells[i][j+1].west = false;
                    }
                }
                else{
                    runSet.push(this.cells[i][j]);
                
                    var flip = Math.random();
                    
                    if(flip < 0.5){
                        this.closeRun(runSet);

                        //clear the run set
                        runSet = []
                    }
                    //else keep carving east if the cell is not located in the last column
                    else{
                        if(j < this.nrCols-1){
                            this.cells[i][j].east = false;
                            this.cells[i][j+1].west = false;
                        }
                        else{
                            this.closeRun(runSet);

                            //clear the run set
                            runSet = []
                        }
                    }
                }
            }
        }

        return this.cells;
    }
}