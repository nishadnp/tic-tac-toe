const Gameboard =  (function() {
    let gameboard = ['','','','','','','','',''];
    
    function getBoard() {
        return gameboard;
    }

    function resetBoard() {
        gameboard = ['','','','','','','','',''];
    }

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

    return {
        getBoard, 
        resetBoard,
        setMark,
    };
})();

const createPlayer = (name, mark) => {
    return {
        name, 
        mark,
    }
}

const GameController = (function() {
    const playerOne = createPlayer("Player 1", "X");
    const playerTwo = createPlayer("Player 2", "O");

    let currentPlayer = playerOne;
    let gameResult = null;
    let stopGame = false;

    function switchPlayer() {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    function playRound(position) {
        if (stopGame) {
            resetGame();
        }
        
        console.log(currentPlayer);
        const isMoveValid = Gameboard.setMark(position, currentPlayer.mark);
        console.log(Gameboard.getBoard());
        if (checkGameWin() || checkGameTie()) {
            return;
        }
        if (isMoveValid) {
            switchPlayer();
        }
    }

    function checkGameWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];
        const board = Gameboard.getBoard();

        for (combo of winPatterns) {
            const [a, b, c] = combo;

            if (board[a] !== '' && 
                board[b] === board[c] && 
                board[a] === board[c]) {
                    gameResult = currentPlayer.name + " WINS!"
                    console.log(gameResult);
                    stopGame = true;
                    return true;
                }
        }
        
        return false;
    }

    function checkGameTie() {
        if (Gameboard.getBoard().includes('')) return false;
        else {
            gameResult = "TIE!"
            console.log(gameResult);
            stopGame = true;
            return true;
        }
    }

    function getResult() {
        return gameResult;
    }

    function resetGame() {
        currentPlayer = playerOne;
        gameResult = null;
        Gameboard.resetBoard();
        stopGame = false;
    }

    return {
        playRound,
        getResult,
    }

})();

const DisplayController = (function() {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.addEventListener('click', e => {
        if (e.target.matches('div')) {
            const divs = [...gameGrid.getElementsByTagName('div')];
            const index = divs.indexOf(e.target);

            GameController.playRound(index);

            e.target.textContent = Gameboard.getBoard()[index]; 
            
            console.log(GameController.getResult());

            if (GameController.getResult()) {
                const displayResult = document.createElement("output");
                displayResult.textContent = GameController.getResult();
                document.body.append(displayResult);
            }
        }
    });


})();