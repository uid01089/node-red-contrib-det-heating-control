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
        const result = {
            index: 0,
            dayConfig: []
        };
        const day = date.getDay();
        const dayString = this.dayOfWeekAsString(day);
        const dayStringPredecessor = this.dayOfWeekAsString(day - 1 + 7);
        const dayStringSuccessor = this.dayOfWeekAsString(day + 1);
        const time = date.getHours() * 60 + date.getMinutes();
        const dayConfig = this.config[dayString];
        const dayConfigPredecessor = this.config[dayStringPredecessor];
        const dayConfigSuccessor = this.config[dayStringSuccessor];
        const lastTimeConfigOfPredecessor = dayConfigPredecessor[dayConfigPredecessor.length - 1];
        const fistTimeConfigOfSuccessor = dayConfigSuccessor[0];
        const alignedTimeConfig = [];
        // First add last time from predecessor als time 0
        alignedTimeConfig.push({ temperature: lastTimeConfigOfPredecessor.temperature, time: lastTimeConfigOfPredecessor.time, timeMinutes: 0 - lastTimeConfigOfPredecessor.timeMinutes, day: dayStringPredecessor });
        // 2nd all other time entries for this day
        dayConfig.forEach(timeConfig => {
            alignedTimeConfig.push({ temperature: timeConfig.temperature, time: timeConfig.time, timeMinutes: timeConfig.timeMinutes, day: dayString });
        });
        // Add First time from successor
        alignedTimeConfig.push({ temperature: fistTimeConfigOfSuccessor.temperature, time: fistTimeConfigOfSuccessor.time, timeMinutes: 24 * 60 + fistTimeConfigOfSuccessor.timeMinutes, day: dayStringSuccessor });
        let runningElement = 0;
        // Running from front to back
        while ((runningElement <= alignedTimeConfig.length) && (alignedTimeConfig[runningElement].timeMinutes < time)) {
            result.dayConfig = alignedTimeConfig;
            result.index = runningElement;
            runningElement++;
        }
        return result;
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
        const returnConfig = {};
        for (const dayId in config) {
            const day = config[dayId];
            returnConfig[dayId] = [];
            day.forEach((time) => {
                const returnTime = {};
                const timeString = time.time;
                const temperature = time.temperature;
                const timeMatcher = timeString.match(/(\d+):(\d+)/);
                const minutes = parseInt(timeMatcher[0]) * 60 + parseInt(timeMatcher[1]);
                returnTime.temperature = temperature;
                returnTime.timeMinutes = minutes;
                returnTime.time = timeString;
                returnConfig[dayId].push(returnTime);
            });
        }
        return returnConfig;
    }
    dayOfWeekAsString(dayIndex) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",][(dayIndex % 7)] || '';
    }
    dayOfWeekAsIndix(dayAsString) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",].findIndex((value, index, obj) => { value === dayAsString; });
    }
}
exports.HeatingController = HeatingController;
//# sourceMappingURL=HeatingControler.js.map