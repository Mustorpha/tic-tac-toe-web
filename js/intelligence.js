/**
 * A functional class for deciding the best move that can be
 * offered by a player during a tic tac toe game.
 * It make use of the MINIMAX algorithm by sorting a certain
 * move that guarantee maximum gain or minimum loss in the game.
 * It loops around game board and try every possible move for
 * player as well as the opponent in a sequenece of binary tree branch,
 * until it finds out the best move from the base tree for the player.
 * The game board must be initialized with a 3 x 3 2D Array.
 * ********** AUTHOR: MUSTORPHA JAMIU ********************
 * ************ 09-03-2023 *******************************
 */

class Minimax {

    //initialize the class with a reference to the game board array, the player and the opponent symbol
    constructor (gameBoard, player, opponent){
        this.board = gameBoard;
        this.player = player;
        this.opponent = opponent;
    }

    // This method scans through the board for empty spaces
    // returns true if there are spaces left in the board and false otherwise.
    static boardSpace (board){
        for (const ROW of board) {
            for (const COLUMN of ROW) {
                if (COLUMN == ""){
                    return true;
                }
            }
        }
        return false; // The board is full
    }

    // This method check for win in the rows, columns and diagonals
    static analyze (board, player, opponent){
        for (let row = 0; row < 3; row++){
            if (board[row][0] == board[row][1] && board[row][1] == board[row][2]){
                if (board[row][0] == player){
                    return 10; // The player wins
                }
                else if (board[row][0] == opponent){
                    return -10; // The opponent wins
                }
            }
        }
        for (let column = 0; column < 3; column++){
            if (board[0][column] == board[1][column] && board[1][column] == board[2][column]){
                if (board[0][column] == player){
                    return 10;
                }
                else if (board[0][column] == opponent){
                    return -10
                    ;} 
            }
        }
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2]){
            if (board[0][0] == player){
                return 10;
            }
            else if (board[0][0] == opponent){
                return -10;
            }
        }
        if (board[0][2] == board[1][1] && board[1][1] == board[2][0]){
            if (board[0][2] == player){
                return 10;
            }
            else if (board[0][2] == opponent){
                return -10;
            }
        }

        return 0; // It is a tie
    }

    // This is the core method that handles the minimax algorithm
    // Alpha-Beta prunning method is employed to reduce unecessary loops.
    // returns an estimated value for the best move encountered
    static intelligence (board, player, opponent, base, maxTurn, alpha, beta){
        let value = this.analyze(board, player, opponent);
        if (value == 10){
            return value - base; // maximimum gain value
        }
        if (value == -10){
            return value + base; // minimum loss value
        }
        if (!this.boardSpace(board)){
            return 0; // board full: It is a tie
        }

        // Maximizing the minimum gain
        if (maxTurn){
            var best = -Infinity;
            for (let row of board){
                for (let column = 0; column < 3; column++){
                    if (row[column] == ""){
                        row[column] = player; // make the move
                        //call the minimax function recursively
                        best = Math.max(best, this.intelligence(board, player, opponent, base+1, false, alpha, beta));
                        alpha = Math.max(alpha, best);
                        row[column] = ""; // undo move
                        if (beta <= alpha){
                            break;
                        }
                    }
                }
            }
            
            return best;
        }
        // Minimising the maximum loss
        else {
            var best = Infinity;
            for (let row of board){
                for (let column = 0; column < 3; column++){
                    if (row[column] == ""){
                        row[column] = opponent;
                        best = Math.min(best, this.intelligence(board, player, opponent, base+1, true, alpha, beta));
                        beta = Math.min(beta,best);
                        row[column] = "";
                        if (beta <= alpha){
                            break;
                        }
                    }
                }
            }

            return best;
        }
    }

    // This method runs the intelligence method as it's operating code
    // It interact with the minimax method in a way a more familiar way
    // It returns an array that contains the location of the anticipated move.
    static decideMove(board, player, opponent){
        var bestValue = -Infinity;
        var bestMove = [-1,-1];
        var alpha = -Infinity
        var beta = Infinity
        console.log("Got into decidemove codespace");
        for (let row = 0; row < 3; row++){
            for (let column = 0; column < 3; column++){
                if (board[row][column] == ""){
                    board[row][column] = player;
                    let moveValue = this.intelligence(board, player, opponent, 0, false, alpha, beta);
                    board[row][column] = "";
                    if (moveValue > bestValue){
                        bestMove = [row, column];
                        bestValue = moveValue;
                    }
                }
            }
        }
        console.log("The value of the best move is " + bestValue);
        return bestMove;
    }
}