/**
 * This contains functions and variables necessary
 * for the game application. It declared some global
 * variable for use during the application runtime
 * Funtion Declered: getPlayerInfo()
 *  toastNotify(), modalNotify(), clearBoard()
 *  disableClick(), enableClick(), handleClick()
 *  omarHandler(), plHandler(), beginGame()
 *  restartGame(), exitGame(), setOmar()
 * ********** AUTHOR: MUSTORPHA JAMIU ********************
 * ************ 02-10-2023 *******************************
 */

var game_board = [
    ["","",""],
    ["","",""],
    ["","",""]
]
var current_player = "x";
var scorePl = 0;
var scoreOp = 0;
var player_info;
var newGame = false;
var omar = false;
var newBoard = false;

function getPlayerInfo()
{
    if (!(player_info = localStorage.getItem("player_info")))
    {
        modalNotify("No Data found 😞, kindly exit the game and register once again")
    }
    //console.log(player_info);
    player_info = JSON.parse(player_info);
    if (player_info[1] == "Omar")
    {
        omar = true;
        console.log("AI mode activated");
    }
    //console.log(player_info);
    //localStorage.removeItem("player_info");
    document.getElementById("user1").textContent = player_info[0] + " [" + (player_info[2].toUpperCase()) + "]";
    document.getElementById("user2").textContent = player_info[1] + " [" + (player_info[2] === "x" ? "O" : "X") + "]";
    document.getElementById("plScore").textContent = scorePl;
    document.getElementById("opScore").textContent = scoreOp;

    return ([player_info]);
}

function toastNotify(message)
{
    let notfication = document.getElementById("toast-text");
    notfication.textContent = message;
    const notficationToast = document.getElementById("notification");

    if (notfication)
    {
        const toastBs = new bootstrap.Toast(notficationToast);
        toastBs.show();
    }
}

function modalNotify (message)
{
    let notfication = document.getElementById("modal-notification");
    let notficationText = document.getElementById("modalText");

    notficationText.textContent = message;
    const modalBs = new bootstrap.Modal(notfication);
    modalBs.show();
}

function clearBoard()
{
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (cell.hasChildNodes())
        {
            cell.removeChild(cell.firstChild);
        }
    });
    game_board = [
        ["","",""],
        ["","",""],
        ["","",""]
    ]
    current_player = "x";
    newGame = true;
    newBoard = false;
    if (omar && player_info[2] == "o")
    {
        omarHandler();
    }
}

function disableClick()
{
    for (let row = 0; row < 3; row++)
    {
        for (let col = 0; col < 3; col++)
        {
            const cell_id = `c${row}${col}`;
            const cell = document.getElementById(cell_id);
            //console.log(cell);
            cell.removeEventListener("click", () => {
                plHander(row, col);
            })
        }
    }
}

function enableClick()
{
    for (let row = 0; row < 3; row++)
    {
        for (let col = 0; col < 3; col++)
        {
            const cell_id = `c${row}${col}`;
            const cell = document.getElementById(cell_id);
            //console.log(cell);
            cell.addEventListener("click", () => {
                plHander(row, col);
            })
        }
    }
}

function omarHandler()
{
    let omarMove = Minimax.decideMove(game_board, (player_info[2] == "x") ? "o" : "x", player_info[2]);
    console.log(omarMove);
    handleClick(omarMove[0], omarMove[1]);
}

function handleClick(row, col)
{
    let clickX = "<img src='../assests/x.png' alt='x-img' class='img img-fluid w-50'>";
    let clickO = "<img src='../assests/o.png' alt='o-img' class='img img-fluid w-50'>";
    //console.log("Click Detected at row = "+row+" col = "+col);
    if (Minimax.boardSpace(game_board) && game_board[row][col] !== "")
    {
        //console.log("Click on a non empty space");
        toastNotify("Sorry, move has been taken 😜");
        newGame = true;
        return;
    }

    /*else if (!Minimax.boardSpace(game_board))
    {
        toastNotify("Oops, you ran out moves 😕");
        newGame = true;
        return;
    }*/

    else if (Minimax.boardSpace(game_board) && game_board[row][col] === "")
    {
        //current_player = localStorage.getItem("current_player");
        game_board[row][col] = current_player;
        console.log(...game_board);
        if (current_player === "x")
        {
            document.getElementById(`c${row}${col}`).innerHTML = clickX;
        }
        else if (current_player === "o")
        {
            document.getElementById(`c${row}${col}`).innerHTML = clickO;
        }
        console.log(player_info[2], ((player_info[2] === "x") ? "o" : "x"))
        let result = Minimax.analyze(game_board, player_info[2], ((player_info[2] === "x") ? "o" : "x"));
        console.log("Analysis result = "+result);
        if (result == 10)
        {
            modalNotify("Hurray!, "+player_info[0]+" has Won! 🥳🎉")
            scorePl++;
            document.getElementById("plScore").textContent = scorePl;
            newBoard = true;
            //disableClick();
            newBoard = true;
        }
        else if (result == -10)
        {
            modalNotify("Hurray!, "+player_info[1]+" has Won! 🥳🎉")
            scoreOp++;
            document.getElementById("opScore").textContent = scoreOp;
            //disableClick();
            //toastNotify("Restart the Game for a new board");
            newBoard = true;
        }
        else if (result == 0 && !Minimax.boardSpace(game_board))
        {
            modalNotify("Oops!, It is a tie for you both 😑🙄");
            //disableClick();
            newBoard = true;
        }
        //localStorage.setItem("current_player", current_player);
        else
        {
            newGame = false;
            current_player = (current_player == "x") ? "o" : "x";
        }
    }
}

function plHander(row, col)
{
    if (newBoard)
    {
        toastNotify("Please restart the game 🎮")
        return;
    }
    handleClick(row, col);
    if (omar && !newGame)
    {
        omarHandler();
    }
}


function beginGame()
{
    getPlayerInfo();
    if (omar && player_info[2] == "o")
    {
        omarHandler();
    }
    //localStorage.setItem("current_player", current_player);
    //console.log(player_info[1]);
    //console.log("Added the Click event");
    for (let row = 0; row < 3; row++)
    {
        for (let col = 0; col < 3; col++)
        {
            const cell_id = `c${row}${col}`;
            const cell = document.getElementById(cell_id);
            //console.log(cell);
            cell.addEventListener("click", () => {
                plHander(row, col);
            })
        }
    }
}

function restartGame()
{
    if (window.confirm("Do you wish for the game to restart?"))
    {
        //hmodalNotify("We kept your previous scores, kindly exit the game if you wish to restart the scores as well")
        clearBoard();
        toastNotify("Game restarted successfully");
    }
}

function exitGame()
{
    if (window.confirm("Do you wish to exit the game?"))
    {
        clearBoard();
        localStorage.clear();
        window.location.href = "../index.html";
    }
}

function setOmar()
{
    setOmar = localStorage.setItem("omar", true);
    //console.log(localStorage.getItem("omar"));
}