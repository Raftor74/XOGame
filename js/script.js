/**
 * Created by Андрей on 10.03.2017.
 */

//Инициализация
$(document).ready(function() {
    //Если выбран белый квадрат
    //Устанавливаем цвет для компьютера и игрока
    $(".dots").click(function() {
        $(".guys, p").css("visibility", "hidden");
        $("td").css("visibility", "visible");
        //Установка цветов для игроков
        aiCo = "#333";
        huCo = "white";
    });
    //Если выбран черный квадрат
    //Устанавливаем цвет для компьютера и игрока
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
//Кол-во раундов
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
    //Глубина рекурсии
    iter++;
    //Создаём массив пустых клеток для перемещения
    let array = avail(reboard);
    //Проверяем на конечные состояния
    //Если позиция конечная, то устанавливаем ей очки.
    //+10 если выигрывает AI, -10 если выигрывает человек, 0 при патовой ситуации
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

    //Создаём массив перемещений
    var moves = [];
    //Проходим по всем свободным клеткам
    for (var i = 0; i < array.length; i++) {
        //Создаем объект "перемещение"
        var move = {};
        //Устанавливаем ему свойство index со значением пустого поля.
        move.index = reboard[array[i]];
        reboard[array[i]] = player;

        //Если ход игрока - запускаем Минимакс для компьютера
        //Иначе - для человека
        if (player == aiPlayer) {
            var g = minimax(reboard, huPlayer);
            //Сохраняем очки хода
            move.score = g.score;
        } else {
            var g = minimax(reboard, aiPlayer);
            move.score = g.score;
        }
        reboard[array[i]] = move.index;
        moves.push(move);
    }

    //Находим лучший ход для человека и компьютера
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

//Проверяет выигрышные комбинации на поле
function winning(board, player) {
    if (horizontalWin(board,player) || verticalWin(board,player) || diagonalWin(board,player)) {
        return true;
    } else {
        return false;
    }
}

//Проверяет выигрышные позиции по горизонтали
function horizontalWin(board,player){
    var findWinPos = false;
    for(var i=0; i<boardSize;i++){
        for(var j=i*boardSize; j<boardSize*(i+1); j++){
            if(board[j] == player){
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

//Проверяет выигрышные позиции по вертикали
function verticalWin(board,player){
    var findWinPos = false;
    for(var i=0; i<boardSize; i++){
        for(var j=i; j<boardSize*boardSize; j+=boardSize){
            if(board[j] == player){
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

//Проверяет выигрышные позиции по диагоналям
function diagonalWin(board,player){
    var findWinPos = false;
    for(var i=0; i<boardSize*boardSize; i+=boardSize+1){
        if(board[i] == player){
            findWinPos = true;
        } else {
            findWinPos = false;
            break;
        }
    }

    if(findWinPos)
        return true;

    findWinPos = false;
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