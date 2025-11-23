const Gameboard =  (function() {
    let gameboard = ['X','X','X','X','O','O','O','O',''];
    
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
        if (checkGameWin() || checkGameTie()) return;
        const isMoveValid = Gameboard.setMark(position, currentPlayer.mark);
        if (isMoveValid) {
            switchPlayer();
        }
        console.log(currentPlayer);
    }

    function checkGameWin() {
        // win logic to be written later
        
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