"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatingController = void 0;
class HeatingController {
    constructor(config) {
        this.config = this.parseConfig(config);
    }
    /**
     *Returns the next target temperature
     *
     * @param {Date} date
     * @returns {number}
     * @memberof HeatingController
     */
    getTargetTemp(date) {
        let temperature;
        const day = date.getDay();
        const time = date.getHours() * 60 + date.getMinutes();
        const dayConfig = this.config.dayConfig[day];
        let runningElement = dayConfig.timeConfig.length - 1;
        let runningTime;
        do {
            temperature = dayConfig.timeConfig[runningElement].temperature;
            runningTime = dayConfig.timeConfig[runningElement].time;
            runningElement--;
        } while ((runningElement >= 0) && runningTime >= time);
        return temperature;
    }
    /**
     *Parses the configuration
     *
     * @private
     * @param {CONFIG} config
     * @returns {CONFIG}
     * @memberof HeatingController
     */
    parseConfig(config) {
        const returnConfig = { dayConfig: [] };
        config.dayConfig.forEach((day) => {
            const returnDay = { timeConfig: [] };
            day.timeConfig.forEach((time) => {
                const returnTime = {};
                const timeString = time.time;
                const temperature = time.temperature;
                const timeMatcher = timeString.match(/(\d+):(\d+)/);
                const minutes = parseInt(timeMatcher[0]) * 60 + parseInt(timeMatcher[1]);
                returnTime.temperature = temperature;
                returnTime.time = minutes;
                returnDay.timeConfig.push(returnTime);
            });
            returnConfig.dayConfig.push(returnDay);
        });
        return returnConfig;
    }
}
exports.HeatingController = HeatingController;
//# sourceMappingURL=HeatingControler.js.map