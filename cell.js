
//Class defining a cell within a maze
//A cell is defined by its 2d axis coordinates and by its four sides which may or may not contain a wall 
class Cell {
    row;
    col;
    x; 
    y;
    north;
    south;
    west;
    east;
    occupied;
    value;
    parent;

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.x = 0;
        this.y = 0;
        this.north = true;
        this.south = true;
        this.west = true;
        this.east = true;
        this.occupied = false;
        this.value = '';
        this.parent = null;
    }

    //creates a clone of the current object as a new Cell with the same attributes
    clone(){

        let clonedCell = new Cell();

        clonedCell.row = this.row;
        clonedCell.col = this.col;
        clonedCell.x = this.x;
        clonedCell.y = this.y;
        clonedCell.north = this.north;
        clonedCell.south = this.south;
        clonedCell.west = this.west;
        clonedCell.east = this.east;
        clonedCell.occupied = this.occupied;
        clonedCell.value = this.value;
        clonedCell.parent = this.parent;

        return clonedCell;

    }

    equals(otherCell){
        return this.row == otherCell.row && this .col == otherCell.col;
    }

    //determines whether there is only one possible way to move from the current cell
    //(the possibility of moving backwards is ignored)
    hasOnlyOneExit(){

        var sideOfParent = this.sideOfParent();

        return ((this.west ? 0 : 1) - (sideOfParent == 0 ? 1 : 0)) + 
               ((this.north ? 0 : 1) - (sideOfParent == 1 ? 1 : 0)) +
               ((this.east ? 0 : 1) - (sideOfParent == 2 ? 1 : 0)) +
               ((this.south ? 0 : 1) - (sideOfParent == 3 ? 1 : 0)) == 1;
    }

    //returns the side on which the parent of the cell is located
    //0: west, 1: north, 2: east, 3: south, -1: cell has no parent
    sideOfParent(){
        if(this.parent != null){
            var position = '' + (this.parent.row - this.row) + '' + (this.parent.col - this.col);
            
            switch(position){
                case '0-1':
                    return 0;
                case '-10':
                    return 1;
                case '01':
                    return 2;
                case '10':
                    return 3;
                default:
                    return -1;
            }
        }

        return -1;
    }
}