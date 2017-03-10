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

    //Если нажали на какую-то ячейку
    $("td").click(function() {
        move(this, huPlayer, huCo);
    });
});

var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var huPlayer = "P";
var aiPlayer = "C";
//Глубина рекурсии
var iter = 0;
var round = 0;
var aiCo = "white";
var huCo = "#333";

//Функция хода
//Принимает текущий элемент доски, игрока и цвет
function move(element, player, color) {
    //Проверяем не занята ли уже клетка
    if (board[element.id] != "P" && board[element.id] != "C") {
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
    round = 0;
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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
function winning(board, player) {
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
}