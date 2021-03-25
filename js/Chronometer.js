/**
 * @author Francisco Javier González Sabariego
 */

class Chronometer {
    static _MAX_SECONDS_PER_DAY = 86400;

    _seconds = 0;
    _idPlay  = 0;

    constructor(time) {
        this._setTime(time);
    }

    getTime = function() {
        const [hours,minutes,seconds] = [
            this._seconds >= 3600 ? parseInt(this._seconds/3600) % 60 : 0,
            this._seconds >= 60 ? parseInt(this._seconds/60) % 60 : 0,
            this._seconds % 60
        ];
        return `${this._formatTime(hours)}:${this._formatTime(minutes)}:${this._formatTime(seconds)}`;
    }

    togglePause = function() {
        this._idPlay == 0 ? (this._idPlay = this._play()) : this._pause();
    }

    _play = function() {
        let chrono = this;
        return setInterval(
            () => {
                ++chrono._seconds;
                chrono._seconds %= Chronometer._MAX_SECONDS_PER_DAY;
            } , 1000);
    }

    _pause = function() {
        clearInterval(this._idPlay);
        this._idPlay = 0;
    };

    _setTime = function(time) {
        if (isNaN(time))
            this._setTimeFromFormat(time);
        else
            this._seconds = parseInt(time) % Chronometer._MAX_SECONDS_PER_DAY;
    }

    _setTimeFromFormat = function(time) {
        const REGEXP_TIME = /^(?<hours>[0-1]\d|2[0-3]):(?<minutes>0\d|[1-5]\d):(?<seconds>0\d|[1-5]\d)$/;
        const {groups: {hours,minutes,seconds}} = time.match(REGEXP_TIME);
        this._seconds = (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) % Chronometer._MAX_SECONDS_PER_DAY;
    }

    _formatTime = digit => digit < 10 ? `0${digit}` : digit;
}