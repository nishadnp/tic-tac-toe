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

    // Create both players and start the game
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

        // Loop through all win combinations
        for (combo of winPatterns) {
            const [a, b, c] = combo;

            if (board[a] !== '' && 
                board[a] === board[b] && 
                board[a] === board[c]) {
                    gameResult = currentPlayer.name + " WINS!"
                    return true;
            }
        }

        return false;   // No win found
    }

    // Check if game is a tie (board full without a winner)
    function checkGameTie() {
        if (Gameboard.getBoard().includes('')) return false;
        else {
            gameResult = "TIE!"
            return true;
        }
    }

    // Return current game result (null until game ends)
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

    // Return current player's name (for UI updates)
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

    // DOM references for buttons and status display
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const statusOutput = document.getElementById('game-status');

    // Game grid cells
    const gameGrid = document.getElementById('game-grid');
    const divs = [...gameGrid.getElementsByTagName('div')];

    // Handle clicking Start button, initializes players and begins game
    startButton.addEventListener('click', () => {

        const playerOneName = document.getElementById('player-1').value;
        const playerTwoName = document.getElementById('player-2').value;

        // Reset any previous warning styles
        document.getElementById('player-1').style.borderColor = 'rgba(255, 255, 255, 0.3)';
        document.getElementById('player-2').style.borderColor = 'rgba(255, 255, 255, 0.3)';

        // Prevent and warn about empty fields
        if (!(playerOneName && playerTwoName)) { 
            if (!playerOneName) document.getElementById('player-1').style.borderColor = 'red';
            if (!playerTwoName) document.getElementById('player-2').style.borderColor = 'red';
            return;
        }

        // Pass names to GameController to create players
        GameController.setPlayers(playerOneName, playerTwoName);
        
        startButton.disabled = true;
        resetButton.disabled = false;

        startGame = true;

        // First turn always Player 1
        statusOutput.textContent = GameController.getCurrentPlayerName() + "'s Turn...";
    });    

    // Handle clicks on the game grid
    gameGrid.addEventListener('click', e => {
        if (e.target.matches('div')) {

            if (!startGame) return; // Ignore clicks until game starts
            
            const index = divs.indexOf(e.target);

            // Execute a round in game logic
            GameController.playRound(index);

            // Update clicked cell visually            
            e.target.textContent = Gameboard.getBoard()[index];
            
            statusOutput.textContent = GameController.getCurrentPlayerName() + "'s Turn...";

            // Update live status unless game is over
            if (GameController.getResult()) {
                statusOutput.textContent = "Game Ended!";
                const displayResult = document.createElement("output");
                displayResult.id = "display-result"
                displayResult.textContent = GameController.getResult();
                document.querySelector('main').append(displayResult);
                outputReset = true;

                // Ensure further clicking of grid cell is prevented after game ends
                startGame = false;
            }
        }
    });

    // Reset button click handler
    resetButton.addEventListener('click', displayReset);


    // Function to clear the board visually and removes the result display
    function displayReset() {
        startGame = false;

        // Clear board tiles
        divs.forEach(div => {
            div.textContent = '';
        });

        // Reset game-status text
        statusOutput.textContent = "Game Yet To Start!";
        
        // Remove win or tie output if present
        if (outputReset) {
            const result = document.getElementById('display-result');
            document.querySelector('main').removeChild(result);
            outputReset = false;
        }

        // Reset game logic state
        GameController.resetGame();

        // Restore button states
        resetButton.disabled = true;
        startButton.disabled = false;
    }

})();