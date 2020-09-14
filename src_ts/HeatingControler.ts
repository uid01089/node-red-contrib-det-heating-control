interface TIME_CONFIG {
    time: string | number;
    temperature: number;
}

interface DAY_CONFIG {
    timeConfig: TIME_CONFIG[];
}

interface CONFIG {
    dayConfig: DAY_CONFIG[];
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
        const time = date.getHours() * 60 + date.getMinutes();

        const dayConfig = this.config.dayConfig[day];
        let runningElement = dayConfig.timeConfig.length - 1;
        let runningTime: number;

        do {
            temperature = dayConfig.timeConfig[runningElement].temperature;
            runningTime = dayConfig.timeConfig[runningElement].time as number;
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
    private parseConfig(config: CONFIG): CONFIG {
        const returnConfig = { dayConfig: [] } as CONFIG;
        config.dayConfig.forEach((day) => {
            const returnDay = { timeConfig: [] } as DAY_CONFIG;
            day.timeConfig.forEach((time) => {

                const returnTime = {} as TIME_CONFIG;

                const timeString = time.time as string;
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

export { HeatingController, CONFIG }