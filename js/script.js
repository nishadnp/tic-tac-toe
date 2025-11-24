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

    function switchPlayer() {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    function playRound(position) {
        console.log(currentPlayer);
        if (checkGameWin() || checkGameTie()) return;
        const isMoveValid = Gameboard.setMark(position, currentPlayer.mark);
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
                    console.log(currentPlayer.name + "wins!");
                    return true;
                }
        }
        
        return false;
    }

    function checkGameTie() {
        if (Gameboard.getBoard().includes('')) return false;
        else {
            console.log("TIE!")
            return true;
        }
    }

    return {
        playRound,
    }

})();