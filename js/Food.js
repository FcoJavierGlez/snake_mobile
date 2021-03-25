/**
 * @author Francisco Javier González Sabariego
 * 
 * Food Class:
 * 
 * La clase Food crea un elemento comida para el juego Snake:
 * 
 * Puede ser de dos tipos, una comida normal que permanece en el tablero hasta ser comida, 
 * o de tipo especial (de mayor valor) que posee un tiempo de duración y que, de no ser
 * consumida antes de acabar su tiempo, acabará desapareciendo.
 */
class Food {
    static _CLASS_NORMAL_FOOD  = 'square food';
    static _CLASS_SPECIAL_FOOD = 'square special-food';
    _points   = 0;
    _time     = 0;
    _idRender = 0;
    _element  = null;
    _nameThis = '';

    /**
     * Crea un objeto de la clase Food.
     * 
     * @param {Element} element Elemento del árbol DOM en el que está insertado este objeto
     * @param {Number} score    Los puntos que vale este objeto
     * @param {String} nameObj  Nombre dado al atributo en el que está almacenado este objeto
     * @param {Number} time     OPCIONAL: El tiempo en segundos que durará este objeto. 
     *                          Por defecto vale -1, es decir, nunca desaparece por agotar tiempo.
     */
    constructor(element,score,nameObj,time = -1) {
        this._element  = element;
        this._points   = score;
        this._nameThis = nameObj;
        this._time     = time;
        //this._idRender = this._render();
    }

    /**
     * Nombre dado al atributo en el que está almacenado este objeto
     * 
     * @return {String} Nombre del atributo en el elemento donde se almacena el objeto food
     */
    getName = function() {
        return this._nameThis;
    }

    /**
     * El alimento es comido (o eliminado por agotarse su tiempo de existencia)
     */
    eated = function() {
        const points = this._points;
        let obj = Object.values(this._element).find( e => e instanceof Food );
        if (obj == undefined ) return;
        clearInterval(this._idRender);
        this._element.classList = 'square empty';
        this._element[obj.getName()] = null;
        return points;
    }

    /**
     * Pausa o reanuda el juego.
     */
    togglePause = function() {
        this._idRender > 0 ? (this._pauseRender()) : (this._idRender = this._render());
    }

    /**
     * El alimento se renderiza
     */
    _render = function() {
        let food = this;
        return setInterval(
            () => {
                food._element.classList = food._time < 0 ? Food._CLASS_NORMAL_FOOD : Food._CLASS_SPECIAL_FOOD;
                food._time = (food._time -= food._time > 0 ? 0.1 : 0).toFixed(1);
                if (food._time == 0) food.eated();
            }, 100);
    }

    /**
     * Pausa el renderizado del alimento
     */
    _pauseRender = function() {
        clearInterval(this._idRender);
        this._idRender = 0;
    }
}