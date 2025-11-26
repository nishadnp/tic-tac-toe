// Gameboard module: stores and manages the state of the board
const Gameboard =  (function() {

    // Internal array representing the 3x3 board
    let gameboard = ['','','','','','','','',''];
    
    // Get current state of the board
    function getBoard() {
        return gameboard;
    }

    // Reset the board to empty
    function resetBoard() {
        gameboard = ['','','','','','','','',''];
    }

    // Place a mark at a given position if it's empty
    // Returns true if move was valid, false otherwise
    function setMark(position, mark) {
        if (gameboard[position] !== '') 
        {
            return false;
        }
        else {
            gameboard[position] = mark;
            return true;
        }
        
    }

    // Expose public methods
    return {
        getBoard, 
        resetBoard,
        setMark,
    };
})();


// Factory function for creating players
const createPlayer = (name, mark) => {
    return {
        name, 
        mark,
    }
}


// GameController module: handles game logic and turn management
const GameController = (function() {

    let playerOne = null;
    let playerTwo = null;
    let currentPlayer = null;   // Tracks whose turn it is
    
    let startGame = false;
    let gameResult = null;  // Stores win or tie message

    function setPlayers(name1, name2) {
        playerOne = createPlayer(name1, "X");
        playerTwo = createPlayer(name2, "O");
        currentPlayer = playerOne;
        startGame = true;
    }
        

    // Switch turns between players
    function switchPlayer() {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    // Execute a round of play at a given board position
    function playRound(position) {
        if (!startGame) {
            return;
        }
        
        const isMoveValid = Gameboard.setMark(position, currentPlayer.mark);

        // Check for win or tie after move
        if (checkGameWin() || checkGameTie()) {
            return;
        }

        // Switch player only if move was valid
        if (isMoveValid) {
            switchPlayer();
        }
    }

    // Check if current player has won
    function checkGameWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]    // Diagonals
        ];
        const board = Gameboard.getBoard();

        for (combo of winPatterns) {
            const [a, b, c] = combo;

            if (board[a] !== '' && 
                board[a] === board[b] && 
                board[a] === board[c]) {
                    gameResult = currentPlayer.name + " WINS!"
                    return true;
            }
        }

        return false;
    }

    // Check if game is a tie (board full without a winner)
    function checkGameTie() {
        if (Gameboard.getBoard().includes('')) return false;
        else {
            gameResult = "TIE!"
            return true;
        }
    }

    // Return current game result
    function getResult() {
        return gameResult;
    }

    // Reset game to initial state
    function resetGame() {
        Gameboard.resetBoard();
        playerOne = null;
        playerTwo = null;
        gameResult = null;
        startGame = false;
    }

    let getCurrentPlayerName = () => currentPlayer.name;

    // Expose public methods
    return {
        setPlayers,
        playRound,
        getCurrentPlayerName,
        getResult,
        resetGame,
    }

})();


// DisplayController module: handles all DOM interactions
const DisplayController = (function() {

    let startGame = false;
    let outputReset = false;  // Tracks if result output reset is needed

    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const statusOutput = document.getElementById('game-status');

    const gameGrid = document.getElementById('game-grid');
    const divs = [...gameGrid.getElementsByTagName('div')];

    startButton.addEventListener('click', () => {
        const playerOneName = document.getElementById('player-1').value;
        const playerTwoName = document.getElementById('player-2').value;
        GameController.setPlayers(playerOneName, playerTwoName);
        
        startButton.disabled = true;
        resetButton.disabled = false;

        startGame = true;

        statusOutput.textContent = GameController.getCurrentPlayerName() + "'s Turn...";
    });    

    // Handle clicks on the game grid
    gameGrid.addEventListener('click', e => {
        if (e.target.matches('div')) {

            if (!startGame) return;
            
            const index = divs.indexOf(e.target);

            // Execute a round in game logic
            GameController.playRound(index);

            // Update clicked cell visually            
            e.target.textContent = Gameboard.getBoard()[index];
            
            statusOutput.textContent = GameController.getCurrentPlayerName() + "'s Turn...";

            // If game ended, show result and set output reset flag
            if (GameController.getResult()) {
                statusOutput.textContent = "Game Ended!";
                const displayResult = document.createElement("output");
                displayResult.id = "display-result"
                displayResult.textContent = GameController.getResult();
                document.body.append(displayResult);
                outputReset = true;
            }
        }
    });

    // Reset button click handler
    resetButton.addEventListener('click', displayReset);


    // Clears the board visually and removes the result display
    function displayReset() {
        startGame = false;
        divs.forEach(div => {
            div.textContent = '';
        });

        statusOutput.textContent = "Game Yet To Start!";
        // Trigger full reset, if including output of the game also to be cleared
        if (outputReset) {
            const result = document.getElementById('display-result');
            document.body.removeChild(result);
            outputReset = false;
        }

        GameController.resetGame();

        resetButton.disabled = true;
        startButton.disabled = false;
    }

})();