interface TIME_CONFIG {
    time: string | number;
    temperature: number;
}


interface CONFIG {
    Sun: TIME_CONFIG[];
    Mon: TIME_CONFIG[];
    Tue: TIME_CONFIG[];
    Wed: TIME_CONFIG[];
    Thu: TIME_CONFIG[];
    Fri: TIME_CONFIG[];
    Sat: TIME_CONFIG[];
}
// https://dev.to/kingdaro/indexing-objects-in-typescript-1cgi
// `keyof any` is short for "string | number | symbol"
// since an object key can be any of those types, our key can too
// in TS 3.0+, putting just "string" raises an error
function hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj
}

class HeatingController {
    private config: CONFIG;


    constructor(config: CONFIG) {
        this.config = this.parseConfig(config);
    }

    /**
     *Returns the next target temperature
     *
     * @param {Date} date
     * @returns {number}
     * @memberof HeatingController
     */
    public getTargetTemp(date: Date): number {

        let temperature: number;

        const day = date.getDay();
        const dayString = this.dayOfWeekAsString(day);
        const time = date.getHours() * 60 + date.getMinutes();

        if (hasKey(this.config, dayString)) {
            const dayConfig = this.config[dayString];
            let runningElement = dayConfig.length - 1;
            let runningTime: number;

            do {
                temperature = dayConfig[runningElement].temperature;
                runningTime = dayConfig[runningElement].time as number;
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
    private parseConfig(config: CONFIG): CONFIG {
        const returnConfig = {} as CONFIG;

        for (const dayId in config) {
            if (hasKey(config, dayId)) {
                const day = config[dayId];
                returnConfig[dayId] = [];

                day.forEach((time) => {
                    const returnTime = {} as TIME_CONFIG;
                    const timeString = time.time as string;
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

    private dayOfWeekAsString(dayIndex: number): string {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",][dayIndex] || '';
    }
}

export { HeatingController, CONFIG }