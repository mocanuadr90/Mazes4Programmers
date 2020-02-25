class CanvasBuilder{

    padding = 10;

    constructor(elementId, size, nrRows, nrCols){
        //get the canvas element by id
        this.canvas = $(elementId);

        //get the associated canvas context
        this.context = this.canvas.get(0).getContext("2d");

        this.nrRows = nrRows;
        this.nrCols = nrCols;
    
        //adjust the size of the canvas based on the supplied number of cells per row and cells per column
        if(this.nrRows > this.nrCols){
            this.cellSize = size / this.nrRows;
        }
        else{
            this.cellSize = size / this.nrCols;
        }

        this.canvasWidth = this.cellSize*nrCols + (this.padding*2) + 1;
        this.canvasHeight = this.cellSize*nrRows + (this.padding*2) + 1;

        this.canvas.attr('width', this.canvasWidth);
        this.canvas.attr('height', this.canvasHeight);
    }

    getCellSize(){
        return this.cellSize;
    }

    drawCircle(cell, color){
        var x = cell.x + (this.cellSize / 2); 
        var y = cell.y + (this.cellSize / 2); 
        var radius =this.cellSize / 6;
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }

    drawTriangle(ax, ay, bx, by, cx, cy){
        this.context.beginPath();
        this.context.moveTo(ax, ay);
        this.context.lineTo(bx, by);
        this.context.lineTo(cx, cy);

        // the fill color
        this.context.fillStyle = "#FFCC00";
        this.context.fill();

        this.context.closePath();
    }

    drawDirections(cell){
        let ax=0;
        let ay=0;
        let bx=0;
        let by=0;
        let cx=0;
        let cy=0;

        if(!cell.west && cell.sideOfParent() != 0){
            ax = cell.x;
            ay = cell.y + (this.cellSize - this.cellSize/3); 

            bx = cell.x; 
            by = cell.y + this.cellSize/3; 
            
            cx = cell.x - (this.cellSize/3); 
            cy = cell.y + (this.cellSize/2); 

            this.drawTriangle(ax,ay,bx,by,cx,cy);
        }

        if(!cell.north && cell.sideOfParent() != 1){
            ax = cell.x + (this.cellSize/3); 
            ay = cell.y; 

            bx = cell.x + (this.cellSize - this.cellSize/3); 
            by = cell.y; 

            cx = cell.x + (this.cellSize/2); 
            cy = cell.y - (this.cellSize/3); 

            this.drawTriangle(ax,ay,bx,by,cx,cy);
        }

        if(!cell.east && cell.sideOfParent() != 2){
            ax = cell.x + this.cellSize;
            ay = cell.y + (this.cellSize - this.cellSize/3);

            bx = cell.x+ this.cellSize;
            by = cell.y + this.cellSize/3;
            
            cx = cell.x + this.cellSize + (this.cellSize/3); 
            cy = cell.y + (this.cellSize/2);

            this.drawTriangle(ax,ay,bx,by,cx,cy);
        }

        if(!cell.south && cell.sideOfParent() != 3){
            ax = cell.x + (this.cellSize/3); 
            ay = cell.y + this.cellSize; 

            bx = cell.x + (this.cellSize - this.cellSize/3); 
            by = cell.y +this.cellSize; 

            cx = cell.x + (this.cellSize/2); 
            cy = cell.y + this.cellSize + (this.cellSize/3); 

            this.drawTriangle(ax,ay,bx,by,cx,cy);
        } 
    }

    drawMaze(cells){
        this.context.save();
        this.context.beginPath();
        for(let i=0; i<this.nrRows; i++){
            for(let j=0; j<this.nrCols; j++){
                var c = cells[i][j];

                if(j == this.nrCols - 1){
                    if(c.east){
                        this.context.moveTo(0.5 + c.x  + this.cellSize, c.y );
                        this.context.lineTo(0.5 + c.x  + this.cellSize, 0.5 + c.y  + this.cellSize);
                    }
                }

                if(c.north){
                    this.context.moveTo(0.5 + c.x , c.y );
                    this.context.lineTo(0.5 + c.x  + this.cellSize, c.y );
                }

                if(c.west){
                    this.context.moveTo(0.5 + c.x , c.y );
                    this.context.lineTo(0.5 + c.x , 0.5 + c.y  + this.cellSize);
                }

                if(i == this.nrRows - 1){
                    if(c.south){
                        this.context.moveTo(0.5 + c.x , c.y  + this.cellSize);
                        this.context.lineTo(0.5 + c.x  + this.cellSize, c.y  + this.cellSize);
                    }
                }
            }
        }
        
        this.context.shadowBlur = this.cellSize/30;
        this.context.shadowOffsetX = this.cellSize/20;
        this.context.shadowOffsetY = this.cellSize/20;
        this.context.shadowColor = "#47476b";

        this.context.lineWidth = this.cellSize/25;
        this.context.strokeStyle = "black";
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    }

    drawPath(path){
        if(path.length > 1){
            this.context.save();
            this.context.beginPath();

            let currentCell = path[0];
            let x = currentCell.x + this.cellSize/2;
            let y = currentCell.y + this.cellSize/2;

            this.context.moveTo(x, y);

            for(let i=1; i<path.length; i++){
                let currentCell = path[i];
                let x = currentCell.x + this.cellSize/2;
                let y = currentCell.y + this.cellSize/2;

                this.context.lineTo(x, y);
                this.context.moveTo(x, y);
            }

            this.context.lineWidth = 4;
            this.context.strokeStyle = 'green';

            
            this.context.shadowBlur = 6;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
            this.context.shadowColor = "green";
            

            this.context.stroke();
            this.context.closePath();
            this.context.restore();
        }
    }

    drawBoard(cells, path){

        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.drawMaze(cells);

        //draw the player circle
        let playerRow = cells.map(function(row){
            return row.filter((c) => c.value === 'P')[0];
        });
        let playerCell = playerRow.find((c) => c != undefined);

        if(playerCell != undefined){
            this.drawCircle(playerCell, 'green');
            this.drawDirections(playerCell);
        }

        //draw the reward circle
        let rewardRow = cells.map(function(row){
            return row.filter((c) => c.value === 'D')[0];
        });
        let rewardCell = rewardRow.find((c) => c != undefined);
        this.drawCircle(rewardCell, 'red');

        this.drawPath(path);
    }

    show(){
        this.canvas.show();
    }

    hide(){
        this.canvas.hide();
    }
}