"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatingController = void 0;
// https://dev.to/kingdaro/indexing-objects-in-typescript-1cgi
// `keyof any` is short for "string | number | symbol"
// since an object key can be any of those types, our key can too
// in TS 3.0+, putting just "string" raises an error
function hasKey(obj, key) {
    return key in obj;
}
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
        const dayString = this.dayOfWeekAsString(day);
        const time = date.getHours() * 60 + date.getMinutes();
        if (hasKey(this.config, dayString)) {
            const dayConfig = this.config[dayString];
            let runningElement = dayConfig.length - 1;
            let runningTime;
            do {
                temperature = dayConfig[runningElement].temperature;
                runningTime = dayConfig[runningElement].time;
                runningElement--;
            } while ((runningElement >= 0) && runningTime >= time);
        }
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
        const returnConfig = {};
        for (const dayId in config) {
            if (hasKey(config, dayId)) {
                const day = config[dayId];
                returnConfig[dayId] = [];
                day.forEach((time) => {
                    const returnTime = {};
                    const timeString = time.time;
                    const temperature = time.temperature;
                    const timeMatcher = timeString.match(/(\d+):(\d+)/);
                    const minutes = parseInt(timeMatcher[0]) * 60 + parseInt(timeMatcher[1]);
                    returnTime.temperature = temperature;
                    returnTime.time = minutes;
                    returnConfig[dayId].push(returnTime);
                });
            }
        }
        return returnConfig;
    }
    dayOfWeekAsString(dayIndex) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",][dayIndex] || '';
    }
}
exports.HeatingController = HeatingController;
//# sourceMappingURL=HeatingControler.js.map