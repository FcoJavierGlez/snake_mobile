/**
 * @author Francisco Javier González Sabariego
 * 
 * SnakeGame Class:
 * 
 * La clase SnakeGame permite crear un objeto encargado del funcionamiento del juego Snake.
 * 
 */

const SnakeGame = class {
    static _POINTS_FOOD         = 5;    //Constant
    static _POINTS_SPECIAL_FOOD = 15;   //Constant
    static _MAX_SCORE           = 0;
    _score     = 0;
    _idPlay    = 0;
    _boardGame = [];
    _snake     = null;

    /**
     * Constructor de la clase SnakeGame
     * 
     * @param {Array} boardGame Array bidimensional del conjunto de elementos del árbol DOm que conforman el tablero de juego
     * @param {Number} maxScore La puntuación máxima acumulada en una cookie en el navegador.
     */
    constructor(boardGame,maxScore) {
        SnakeGame._MAX_SCORE = maxScore == undefined ? SnakeGame._MAX_SCORE : maxScore;
        this._snake     = new Snake(boardGame.length);
        this._boardGame = boardGame;
        this._resetBoardGame();
        this._renderSnake();
        this._createFood();
        this.togglePause();
    }

    /**
     * Devuelve la puntuación máxima alcanzada en alguna partida.
     * 
     * @param {Boolean} format Opcional: Booleano para solicitar la puntuación formateada '005' ó '5'
     * @return {String}        Puntuación máxima acumulada.
     */
    static getMaxScore = function (format = false) {
        return format ? SnakeGame._formatScore(SnakeGame._MAX_SCORE) : SnakeGame._MAX_SCORE;
    }

    /**
     * Devuelve la puntuación actual.
     * 
     * @param {Boolean} format Opcional: Booleano para solicitar la puntuación formateada '005' ó '5'
     * @return {String}        Puntuación actual.
     */
    getScore = function (format = false) {
        return format ? this._formatScore(this._score) : this._score;
    }

    /**
     * Devuelve si el juego está actualmente pausado.
     * 
     * @return {Boolean} Si el juego está pausado. True or false.
     */
    getPaused = function () {
        return this._idPlay == 0;
    }

    /**
     * Devuelve el estado del juego: Ganado, perdido o sin finalizar.
     * 
     * @return {String} Estado del juego: Ganado = 'WIN' | Perdido = 'LOSE' | Sin finalizar = ''
     */
    getStatusGame = function () {
        return this._snake.getBody().length == this._boardGame.length * this._boardGame[0].length ? 'WIN' : !this._snake.getAlive() ? 'LOSE' : '';
    }

    /**
     * Asigna la nueva dirección a la que queramos orientar a la serpiente  siempre que el juego esté en marcha.
     * Sólo aceptará las siguientes entradas: 'up','down','left' y 'right'.
     * 
     * @param {String} direction La nueva dirección que queramos asignar a la serpiente.
     *                           Sólo acepta: 'up','down','left' y 'right'.
     */
    setDirection = function (direction) {
        direction = direction.toLowerCase();
        if (this._idPlay == 0) return;
        if ( !(direction == 'up' || direction == 'down' || direction == 'left' || direction == 'right') ) return;
        this._snake.setDirection(direction);
    }

    /**
     * Pausa o reanuda el juego.
     */
    togglePause = function () {
        if (this.getStatusGame() !== '') return;
        this._idPlay == 0 ? (this._idPlay = this._play()) : this._pause();
        this._togglePauseFoodTimer();
    }

    /**
     * Reinicia el juego una vez terminado.
     */
    resetGame = function() { //Pending
        this._score    = 0;
        this._idPlay   = 0;
        this._snake    = new Snake(this._boardGame.length);
        this._resetBoardGame();
        this._renderSnake();
        this._createFood();
        this.togglePause();
    }

    /**
     * Pone en marcha el juego.
     */
    _play = function () { 
        let game = this;
        return setInterval( function () {
            const [nextRow,nextCol] = game._snake.getNextSquare([game._boardGame[0].length,game._boardGame.length]);
            if (game._boardGame[nextRow][nextCol].food == null) {
                game._snake.move([nextRow,nextCol]);
                game._renderBoardGame();
            }
            else {
                const points = game._feedSnake([nextRow,nextCol]);
                game._renderBoardGame();
                if (!(points == SnakeGame._POINTS_SPECIAL_FOOD)) //if snake hasn't just eaten a special food
                    game._createFood();
                if (game._checkCreateSpecialFood()) 
                    game._createFood(true);
                game._pause();
                game._idPlay = game._play();
            }
            if (game.getStatusGame() != '')
                game._finishGame();
        }, 600 - game._snake.getBody().length * 5);
    }

    /**
     * Pausa el juego.
     */
    _pause = function() {
        clearInterval(this._idPlay);
        this._idPlay = 0;
    }

    /**
     * Da de comer a la serpiente.
     * 
     * @param {Array} coordinates Inserta las coordenadas de la casilla donde está el alimento.
     * 
     * @return {Number}           La puntuación correspondiente al valor del alimento.
     */
    _feedSnake = function([nextRow,nextCol]) {
        let points = 0;
        this._score += (points = this._boardGame[nextRow][nextCol].food.eated()) == undefined ? SnakeGame._POINTS_SPECIAL_FOOD : points;
        this._snake.eat([nextRow,nextCol]);
        return points == undefined ? SnakeGame._POINTS_SPECIAL_FOOD : points;
    }

    /**
     * Comprueba si debe crearse una comida especial.
     * 
     * @return {Boolean} Resultado de la comprobación. True or false.
     */
    _checkCreateSpecialFood = function() {
        return this._snake.getBody().length % 8 == 0 && this._snake.getBody().length <= this._boardGame.length * this._boardGame[0].length - 2
    }

    /**
     * Crea un nuevo alimento en el juego. Éste alimento puede ser especial, 
     * con un temporizador interno y una puntuación mayor del alimento normal.
     * 
     * Por defecto siempre será normal. Para crear un alimento especial 
     * pasar booleano 'true' como parámetro. 
     * 
     * @param {Boolean} special Opcional: Booleano para crear un alimento especial. True = especial, false = normal.
     */
    _createFood = function(special = false) {
        let [row,col] = [undefined,undefined];
        do {
            row = parseInt(Math.random() * this._boardGame.length);
            col = parseInt(Math.random() * this._boardGame[0].length);
        } while (this._boardGame[row][col].className !== 'square empty');
        this._boardGame[row][col].food = special ? 
            new Food(this._boardGame[row][col],SnakeGame._POINTS_SPECIAL_FOOD,'food',3 + parseFloat( (Math.random() * 3).toFixed(1) )) : 
            new Food(this._boardGame[row][col],SnakeGame._POINTS_FOOD,'food');
        if (this._score > 0)
            this._boardGame[row][col].food.togglePause();
    }

    /**
     * Pausa los temporizadores de los alimentos que haya en el tablero.
     */
    _togglePauseFoodTimer = function() {
        for (let i = 0; i < this._boardGame.length; i++) 
            for (let j = 0; j < this._boardGame[0].length; j++) 
                this._boardGame[i][j].food?.togglePause();
    }

    /**
     * Finaliza el juego.
     */
    _finishGame = function () {
        SnakeGame._MAX_SCORE = this._score > SnakeGame._MAX_SCORE ? this._score : SnakeGame._MAX_SCORE;
        this._pause();
        this._togglePauseFoodTimer();
    }

    /**
     * Devuelve la puntación pasada como parámetro en formato de 3 dígitos.
     * 
     * @param {Number} score Puntuación a formatear.
     * 
     * @return {String}      Puntuación formateada input: '5' -> output: '005'
     */
    _formatScore = score => score < 10 ? `00${score}` : score < 100 ? `0${score}` : score

    /**
     * Renderiza el tablero de juego.
     */
    _renderBoardGame = function() {
        for (let i = 0; i < this._boardGame.length; i++) 
            for (let j = 0; j < this._boardGame[0].length; j++) {
                if (this._boardGame[i][j].food != null) continue;
                this._boardGame[i][j].classList = `square empty`;
            }
        this._renderSnake();
    }

    /**
     * Renderiza la serpiente dentro del tablero
     */
    _renderSnake = function () {
        this._snake.getBody().forEach( (e,i) => this._boardGame[e[0]][e[1]].classList = i == 0 ? `square head ${this._snake.getHeadDirection()}` : 
            i == this._snake.getBody().length - 1 ? `square tail ${this._snake.getTailDirection()}` : `square snake`);
    }

    /**
     * Resetea el tablero de juego.
     */
    _resetBoardGame = function () {
        for (let i = 0; i < this._boardGame.length; i++) 
            for (let j = 0; j < this._boardGame[0].length; j++) {
                this._boardGame[i][j].food?.eated();
                this._boardGame[i][j].classList = `square empty`;
            }
    }
}