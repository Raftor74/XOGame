/**
 * Created by Андрей on 10.03.2017.
 */

//Инициализация
$(document).ready(function() {
    //Если выбран белый квадрат
    $(".dots").click(function() {
        $(".guys, p").css("visibility", "hidden");
        $("td").css("visibility", "visible");
        //Установка цветов для игроков
        aiCo = "#333";
        huCo = "white";
    });
    //Если выбран черный квадрат
    $(".dots2").click(function() {
        $(".guys, p").css("visibility", "hidden");
        $("td").css("visibility", "visible");
    });

    //Инициализируем игру при первом запуске
    init();
    //Если нажали на какую-то ячейку
    $("td").click(function() {
        move(this, huPlayer, huCo);
    });
});

//Глобальные переменные
var boardSize = 3;
var board = [];
var huPlayer = "P";
var aiPlayer = "C";
//Глубина рекурсии
var iter = 0;
var round = 0;
var aiCo = "white";
var huCo = "#333";

//Создаёт игровое поле
function init(){
    round = 0;
    for(var i=0; i<boardSize*boardSize; i++){
        board[i] = i;
    }
}

//Функция хода
//Принимает текущий элемент доски, игрока и цвет
function move(element, player, color) {
    //Проверяем не занята ли уже клетка
    if (board[element.id] != huPlayer && board[element.id] != aiPlayer) {
        //Увеличиваем кол-во раундов на 1
        round++;
        //Устанавливаем цвет клетки под цвет игрока
        $(element).css("background-color", color);
        board[element.id] = player;

        //Проверяем выйгрышная позиция или нет
        if (winning(board, player)) {
            setTimeout(function() {
                alert("YOU WIN");
                reset();
            }, 500);
            return;
        } else if (round > 8) {
            setTimeout(function() {
                alert("TIE");
                reset();
            }, 500);
            return;
        } else {
            round++;
            //Находим индекс хода AI
            var index = minimax(board, aiPlayer).index;
            var selector = "#" + index;
            //Устанавливаем цвет и маркер клетки на AI
            $(selector).css("background-color", aiCo);
            board[index] = aiPlayer;

            //Проверяем выйграли или нет
            if (winning(board, aiPlayer)) {
                setTimeout(function() {
                    alert("YOU LOSE");
                    reset();
                }, 500);
                return;
            } else if (round === 0) {
                setTimeout(function() {
                    alert("tie");
                    reset();
                }, 500);
                return;
            }
        }
    }
}

//Функция сброса игры
function reset() {
    init();
    $("td").css("background-color", "transparent");
}

//Минимакс функция
function minimax(reboard, player) {
    iter++;
    let array = avail(reboard);
    if (winning(reboard, huPlayer)) {
        return {
            score: -10
        };
    } else if (winning(reboard, aiPlayer)) {
        return {
            score: 10
        };
    } else if (array.length === 0) {
        return {
            score: 0
        };
    }

    var moves = [];
    for (var i = 0; i < array.length; i++) {
        var move = {};
        move.index = reboard[array[i]];
        reboard[array[i]] = player;

        if (player == aiPlayer) {
            var g = minimax(reboard, huPlayer);
            move.score = g.score;
        } else {
            var g = minimax(reboard, aiPlayer);
            move.score = g.score;
        }
        reboard[array[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

//Возвращает массив пустых клеток
function avail(reboard) {
    return reboard.filter(s => s != huPlayer && s != aiPlayer);
}

//Проверяет выйгрышные комбинации на поле
/*function winning(board, player) {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    ) {
        return true;
    } else {
        return false;
    }
}*/

//Проверяет выйгрышные комбинации на поле
function winning(board, player) {
    if (
        horizontalWin(board,player) ||
        verticalWin(board,player)   ||
        diagonalWin(board,player)
    ) {
        return true;
    } else {
        return false;
    }
}

//Проверяет выйгрышные позиции по горизонтали
function horizontalWin(board,player){
    var findWinPos = false;
    for(var i=0; i<boardSize;i++){
        for(var j=0; j<boardSize; j++){
            console.log("horizontalWin i:"+i+" j:"+j);
            if(board[i][j] == player){
                findWinPos = true;
            } else {
                findWinPos = false;
                break;
            }
        }

        if(findWinPos)
            return true;
    }
    return false;
}

//Проверяет выйгрышные позиции по вертикали
function verticalWin(board,player){
    var findWinPos = false;
    for(i=0; i<boardSize; i++){
        for(j=i; j<boardSize; j+=boardSize){
            if(board[i][j] == player){
                findWinPos = true;
            } else {
                findWinPos = false;
                break;
            }
        }

        if(findWinPos)
            return true;
    }
    return false;
}

//Проверяет выйгрышные позиции по диагоналям
function diagonalWin(board,player){
    var findWinPos = false;
    for(var i=0; i<boardSize; i+=boardSize+1){
        if(board[i] == player){
            findWinPos = true;
        } else {
            findWinPos = false;
            break;
        }
    }

    if(findWinPos)
        return true;

    for(var i=boardSize-1; i<boardSize*boardSize-1; i+=boardSize-1){
        if(board[i] == player){
            findWinPos = true;
        } else {
            findWinPos = false;
            break;
        }
    }

    if(findWinPos)
        return true;

    return false;
}