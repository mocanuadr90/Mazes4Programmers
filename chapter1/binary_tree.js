class BinaryTree extends Algorithm{

    constructor(nrRows, nrCols, cellSize, padding){
        super(nrRows, nrCols, cellSize, padding);
    }

    generateMaze(){
        for(let i=0; i<this.nrRows; i++){
            for(let j=0; j<this.nrCols; j++){

                var flip = Math.random();

                if(flip < 0.5){
                    //if the cell is not located in the first row then carve north
					if(i > 0){
                        this.cells[i][j].north = false;
						this.cells[i-1][j].south = false;
                    }
                    //else carve east if the cell is not located in the last column
                    else{
                        if(j < this.nrCols-1){
                            this.cells[i][j].east = false;
                            this.cells[i][j+1].west = false;
                        }
                    }
                }
                else{
                    //if the cell is not located in the last column carve east
                    if(j < this.nrCols-1){
                        this.cells[i][j].east = false;
                        this.cells[i][j+1].west = false;
                    }
                    //else carve north if the cell is not located on the first row
                    else{
                        if(i > 0){
                            this.cells[i][j].north = false;
                            this.cells[i-1][j].south = false;
                        }
                    }
                }
            }
        }

        return this.cells;
    }
}