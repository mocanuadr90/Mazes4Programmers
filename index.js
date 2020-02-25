$(document).ready(function(){

    $('#divCanvas').keydown(function(){alert("Hello")});

    var canvas = null;
    var game = null;

    //generate maze button event handler
    $('#btnGenerate').click(function(){
        if($('#txtNrRows').val().trim() === '' || $('#txtNrCols').val().trim() === ''){
            $('#modalError').find('.modal-body').text('Please provide a size for the maze');
            $('#modalError').modal('show');
        }
        else{

            var nrRows = parseInt($('#txtNrRows').val());
            var nrCols = parseInt($('#txtNrCols').val());

            if(nrRows === 0 || nrCols === 0){
                $('#modalError').find('.modal-body').text('The number of cells per row and cells per column must be greater than 0');
                $('#modalError').modal('show');
            }
            else{
                
                //create an instance of the canvas builder
                canvas = new CanvasBuilder('#myCanvas', 800, nrRows, nrCols);

                var alg = null;

                switch($('#selAlgorithm').val()){
                    case 'binary_tree':
                        alg = new BinaryTree(nrRows, nrCols, canvas.getCellSize(), canvas.padding);
                        break;
                    case 'sidewinder':
                        alg = new SideWinter(nrRows, nrCols, canvas.getCellSize(), canvas.padding);
                        break;
                    default:
                        break;
                }

                //generate and fetch the maze blueprint
                var cells = alg.generateMaze();

                //create a new instance of the game object by passing it the maze blueprint
                game = new Game(cells);
                game.initialize();
                
                //draw the actual maze by fetching the updated maze blueprint from the game object
                canvas.drawBoard(game.getUpdatedMazeBlueprint(), game.getPlayerPath());

                //display the canvas
                canvas.show();
            }
        }
    });

    var reset = function(){
        $('#txtNrRows').val('');
        $('#txtNrCols').val('');
        canvas.hide();
        canvas = null;
        game = null;
    }

    //performs a run through the maze given the initial direction
    //will keep running as long as the current cell has only one exit
    //(the possibility of moving backwards is ignored)
    var run = function(direction){
        if(game.isMovingBackwards(direction)){
            game.updateMazeBlueprint(direction);
            canvas.drawBoard(game.getUpdatedMazeBlueprint(), game.getPlayerPath());
        }
        else{
            game.updateMazeBlueprint(direction);
            canvas.drawBoard(game.getUpdatedMazeBlueprint(), game.getPlayerPath());

            while(game.getCurrentCell().hasOnlyOneExit()){
                let nextDirection = game.getNextDirection();

                //setTimeout(2000);
                game.updateMazeBlueprint(nextDirection);

                canvas.drawBoard(game.getUpdatedMazeBlueprint(), game.getPlayerPath());

                if(game.isSolved()){
                    $('#modalSuccess').modal('show');
                    return;
                }
            }

            if(game.isSolved()){
                $('#modalSuccess').modal('show');
                return;
            }
        }
    }

    var move = function(e){

        if(canvas != null){
            var code = e.keyCode;
            switch (code) {
                case 37: run(0); break; //Left key
                case 38: run(1); break; //Up key
                case 39: run(2); break; //Right key
                case 40: run(3); break; //Down key
                default: break; //Everything else
            }

            /*if(game.isSolved()){
                $('#modalSuccess').modal('show');
            }

            canvas.drawBoard(game.getUpdatedMazeBlueprint(), game.getPlayerPath());*/

        }
    }

    document.addEventListener('keydown',move);

    $('#modalSuccess').on('hidden.bs.modal', function (e) {
        reset();
    });
  
});
