class Algorithm {

    //the algorithm superclass constructor simply builds a standard cell matrix 
    //given the number of cells per side and the cell size
    constructor(nrRows, nrCols, cellSize, padding){

        this.cells = []

        this.nrRows = nrRows;
        this.nrCols = nrCols;

        //build the cell matrix
        for(let i=0; i<this.nrRows; i++){
            this.cells[i] = [];

            for(let j=0; j<this.nrCols; j++){
                var c = new Cell(i,j);
                c.y = i*cellSize + padding;
                c.x = j*cellSize + padding;
                this.cells[i].push(c);
            }
        }
    }
    
    //abstract method meant to be overidden in the child classes
    //will throw an error if it is not overidden
    generateMaze(){
        throw new Error('generateMaze is abstract and cannot be called directly from the super class. Please override.');
    }
}