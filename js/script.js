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
    const playerOne = createPlayer("Player 1", "X");
    const playerTwo = createPlayer("Player 2", "O");

    let currentPlayer = playerOne;  // Tracks whose turn it is
    let gameResult = null;  // Stores win or tie message
    let stopGame = false;   // Flag to prevent moves after game ends

    // Switch turns between players
    function switchPlayer() {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    // Execute a round of play at a given board position
    function playRound(position) {
        if (stopGame) {
            resetGame();
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
                board[b] === board[c] && 
                board[a] === board[c]) {
                    gameResult = currentPlayer.name + " WINS!"
                    stopGame = true;
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
            stopGame = true;
            return true;
        }
    }

    // Return current game result
    function getResult() {
        return gameResult;
    }

    // Reset game to initial state
    function resetGame() {
        currentPlayer = playerOne;
        gameResult = null;
        Gameboard.resetBoard();
        stopGame = false;
    }

    // Expose public methods
    return {
        playRound,
        getResult,
    }

})();

// DisplayController module: handles all DOM interactions
const DisplayController = (function() {
    const gameGrid = document.getElementById('game-grid');
    const divs = [...gameGrid.getElementsByTagName('div')];

    // Clears the board visually and removes the result display
    function displayReset() {
        divs.forEach(div => {
            div.textContent = '';
        });
        const result = document.querySelector('output');
        document.body.removeChild(result);
    }

    let reset = false;  // Tracks if visual reset is needed on next click

    // Handle clicks on the game grid
    gameGrid.addEventListener('click', e => {
        if (e.target.matches('div')) {

            // If reset flag is true, clear visuals first
            if (reset) {
                displayReset();
                reset = false;
            }
            
            const index = divs.indexOf(e.target);

            // Execute a round in game logic
            GameController.playRound(index);

            // Update clicked cell visually            
            e.target.textContent = Gameboard.getBoard()[index]; 

            // If game ended, show result and set reset flag
            if (GameController.getResult()) {
                const displayResult = document.createElement("output");
                displayResult.textContent = GameController.getResult();
                document.body.append(displayResult);
                reset = true;
            }
        }
    });

})();