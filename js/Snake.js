/**
 * @author Francisco Javier González Sabariego
 * 
 * Snake Class:
 * 
 * La clase Serpiente crea una instancia de la serpiente del juego Snake.
 * 
 * Este objeto se encarga de gestionar el movimiento, alimento, dirección y estado (vivo o muerto)
 * de la serpiente, por cada acción que se realiza cada x tiempo.
 */

const Snake = class {
    _body               = [];
    _alive              = true;
    _direction          = 'right';
    _headDirection      = 'right';

    /**
     * Crea una instancia de la clase Serpiente para el juego Snake.
     * 
     * @param {Number} boardGameLength 
     */
    constructor(boardGameLength) {
        this._createSnakeBody(boardGameLength);
    }

    /**
     * Devuelve si la serpiente está viva.
     * 
     * @return {Boolean} 
     */
    getAlive = function () {
        return this._alive;
    }

    /**
     * Devuelve el cuerpo de la serpiente en forma de array de coordenadas.
     * 
     * @return {Array} Devuelve el conjunto de coordenadas que conforman el cuerpo de la serpiente 
     */
    getBody = function () {
        return this._body;
    }

    /**
     * Devuelve la dirección con la que debe renderizarse la cabeza de la serpiente.
     * 
     * @return {String} Dirección para renderizar la cabeza.
     */
    getHeadDirection = function () {
        return this._headDirection;
    }

    /**
     * Devuelve la dirección con la que debe renderizarse la cola de la serpiente.
     * 
     * @return {String} Dirección para renderizar la cola.
     */
    getTailDirection = function () {
        const [rowTail,colTail]             = [this._body[this._body.length - 1][0],this._body[this._body.length - 1][1]];
        const [rowBeforeTail,colBeforeTail] = [this._body[this._body.length - 2][0],this._body[this._body.length - 2][1]];
        if ( this._checkTailCrossWall(rowBeforeTail - rowTail, colBeforeTail - colTail) ) 
            return rowTail - rowBeforeTail == 0 ? (colTail < colBeforeTail ? "right" : "left") : (rowTail < rowBeforeTail ? "down" : "up");
        return rowTail - rowBeforeTail == 0 ? (colTail > colBeforeTail ? "right" : "left") : (rowTail > rowBeforeTail ? "down" : "up");
    }

    /**
     * Devuelve las coordenadas de la casilla a la que se encamina la serpiente.
     * 
     * @param {Number} boardGameLength Longitud del tablero de juego
     * @return {Array} Devuelve las coordenadas en formato de array [fila,columna];
     */
    getNextSquare = function ([width,height]) {
        let [row,col] = [this._body[0][0],this._body[0][1]];
        row += this._direction === 'up' ? -1 : this._direction === 'down' ? 1 : 0;
        col += this._direction === 'left' ? -1 : this._direction === 'right' ? 1 : 0;
        return this._adjustCoordinatesNextSquare([row,col],[width,height]);
    }

    /**
     * Reasigna la dirección a la que se encamina la serpiente siempre que sea una dirección válida.
     * 
     * @param {String} direction La nueva dirección que se quiera dar a la serpiente.
     */
    setDirection = function (direction) {
        if (!this._validateDirection(direction)) return;
        this._direction = direction;
    }

    /**
     * Alimenta a la serpiente.
     * 
     * @param {Array} coordinates Array con las coordenadas de la casilla a la que avanza la serpiente. [fila,columna] 
     */
    eat = function ([row,col]) {
        this._headDirection = this._direction;
        this._body.unshift([row,col]);
    }

    /**
     * Mueve a la serpiente.
     * 
     * @param {Array} coordinates Array con las coordenadas de la casilla a la que avanza la serpiente. [fila,columna] 
     */
    move = function ([row,col]) {
        if (this._checkSnakeBiteSelf([row,col])) {  //if snake biteself then end game
            this._alive = false;
            return;
        }
        this.eat([row,col]);
        this._body.pop();
    }

    /**
     * Comprueba si la serpiente se muerde así misma.
     * 
     * @param {Array} coordinates Array con las coordenadas de la casilla a la que avanza la serpiente. [fila,columna]
     * @return {Boolean}          Resultado de la comprobación. True or false.
     */
    _checkSnakeBiteSelf = function ([row,col]) {
        for (let i = 1; i < this._body.length - 1; i++)    //Except head and tail
            if (row == this._body[i][0] && col == this._body[i][1]) return true;
        return false;
    }

    /**
     * Ajusta las coordendas introducidas según la longitud del tablero.
     * 
     * @param {Array} coordinates       Array con las coordenadas a ajustar. [fila,columna]
     * @param {Number} boardGameLength  Longitud del tablero [width,height].
     * @return {Array}                  Coordenadas ajustadas en forma de array. [fila,columna]
     */
    _adjustCoordinatesNextSquare = function ([row,col],[width,height]) {
        row = row < 0 ? height - 1 : row > height - 1 ? 0 : row;
        col = col < 0 ? width - 1 : col > width - 1 ? 0 : col;
        return [row,col];
    }
    
    /**
     * Valida la nueva dirección que se quiere asignar a la serpiente.
     * 
     * @param {String} direction La nueva dirección que se quiere dar a la serpiente.
     * @return {Boolean}         Resultado de la validación. True or false.
     */
    _validateDirection = function (direction) {
        if (this._direction != this._headDirection) return false;
        switch (direction) {
            case direction.match(/^(UP|DOWN)$/i)?.input:
                return !(this._direction === 'down' || this._direction === 'up');
            case direction.match(/^(LEFT|RIGHT)$/i)?.input:
                return !(this._direction === 'right' || this._direction === 'left');
            default:
                return false;
        }
    }

    /**
     * Comprueba si la cola de la serpiente está cruzando los límites del tablero.
     * 
     * @param {Number} rowDiff  Diferencia entre la coordenada fila de la cola y de la sección anterior del cuerpo a la misma
     * @param {Number} colDiff  Diferencia entre la coordenada columna de la cola y de la sección anterior del cuerpo a la misma
     * @return {Boolean}        Resultado de la comprobación si la cola está cruzando el límite del tablero. Ture or false.
     */
    _checkTailCrossWall = (rowDiff,colDiff) => rowDiff > 1 || rowDiff < -1 || colDiff > 1 || colDiff < -1;

    /**
     * Creación del cuerpo de la serpiente.
     * 
     * @param {Number} boardGameLength 
     */
    _createSnakeBody = function (boardGameLength) {  //Pending dinamic creation
        const row  = parseInt((boardGameLength - 1) / 2);
        const col  = parseInt((boardGameLength - 1) / 3);
        this._body = [[row,col],[row,col - 1],[row,col - 2],[row,col - 3]];
    }
}