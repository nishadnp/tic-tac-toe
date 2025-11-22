const Gameboard =  (function() {
    let gameboard = ['','X','','','','','O','',''];
    
    function getBoard() {
        return gameboard;
    }

    function resetBoard() {
        gameboard = ['','','','','','','','',''];
    }

    function setMark(position, mark) {
        if (gameboard[position] !== '') 
        {
            return;
        }
        gameboard[position] = mark;
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

