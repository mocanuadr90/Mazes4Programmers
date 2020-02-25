//the Game class received the original maze blueprint from a maze generating algorithm object
//and is responsible for updating the blueprint as the player advances and passing the updated 
//blueprint to the canvas builder object
class Game{
    constructor(cells){

        //clones the maze blueprint received from a maze algorithm (i.e. the cell matrix)
        //thus leaving the original matrix intact
        this.cells = cells.map(function(row){
            return row.map((cell) => cell.clone());
        });

        this.path = [];

        this.solved = false;
    }

    initialize(){
        //set the starting cell and the destination cell
        this.startingCell = this.getRandomCell();
        this.startingCell.value = 'P';
        this.currentCell = this.startingCell;
        this.destinationCell = this.getRandomCell();
        this.destinationCell.value = 'D';

        //add the initial cell to the player's path
        this.path.push(this.currentCell);
    }

    getRandomCell(){

        //convert the 2d cell array to a 1d array excluding any previously occupied cells
        var cellArray = [];

        for(let i=0; i<this.cells.length; i++){
            var cellRow = this.cells[i].filter((c) => c.occupied == false);
            cellArray = cellArray.concat(cellRow);
        }

        var n = cellArray.length;

        var cell =  cellArray[Math.round((n-1) * Math.random())];

        //mark the chosen cell as occupied
        cell.occupied = true;

        return cell;
    }

    getCurrentCell(){
        return this.currentCell;
    }

    getTheNewCell(direction){
        var newCell = null;

        switch(direction){
            //left
            case(0):
                if(!this.currentCell.west){
                    newCell = this.cells[this.currentCell.row][this.currentCell.col - 1];
                }
                break;
            //up
            case(1):
                if(!this.currentCell.north){
                    newCell = this.cells[this.currentCell.row - 1][this.currentCell.col];
                }
                break;
            //right
            case(2):
                if(!this.currentCell.east){
                    newCell = this.cells[this.currentCell.row][this.currentCell.col + 1];
                }
                break;
            //down
            case(3):
                if(!this.currentCell.south){
                    newCell = this.cells[this.currentCell.row + 1][this.currentCell.col];
                }
                break;
            default:
                break;
        }

        return newCell;
    }

    getNextDirection(){
        return this.currentCell.west === false && this.currentCell.sideOfParent() != 0 ? 0 :
                   (this.currentCell.north === false && this.currentCell.sideOfParent() != 1 ? 1 : 
                       (this.currentCell.east === false && this.currentCell.sideOfParent() != 2 ? 2 : 3));
    }

    updateCurrentCell(newCell){

        //the previous cell is no longer occupied
        this.currentCell.occupied = false;
        this.currentCell.value = '';

        if(newCell != this.destinationCell){  
            newCell.occupied = true;
            newCell.value = 'P';

            //if the player goes backwards (i.e. the new cell is the parent of the current cell)
            if(this.currentCell.parent != null && this.currentCell.parent.equals(newCell)){
                //remove the current cell from the path
                var self = this;

                this.path = this.path.filter(function(cell) {
                    return !cell.equals(self.currentCell);
                });

                //the new cell is no longer the parent of the current cell
                this.currentCell.parent = null;
            }
            else{
                //add the new visited cell to the player's path
                this.path.push(newCell);

                //the current cell becomes the parent of the new cell
                newCell.parent = this.currentCell;
            }

            //the new cell becomes the current cell
            this.currentCell = newCell;
        }
        else{
            //add the new visited cell to the player's path
            this.path.push(newCell);

            this.solved = true;
        }
    }

    isMovingBackwards(direction){
        var newCell = this.getTheNewCell(direction);
        
        if(newCell != null){
            return this.currentCell.parent != null && this.currentCell.parent.equals(newCell);
        }
    }

    //0: left, 1: up, 2: right, 3: down
    updateMazeBlueprint(direction){
        
        var newCell = this.getTheNewCell(direction);
        
        if(newCell != null){
            this.updateCurrentCell(newCell);
        }

    }

    getUpdatedMazeBlueprint(){
        return this.cells;
    }

    getPlayerPath(){
        return this.path;
    }

    isSolved(){
        return this.solved;
    }
}