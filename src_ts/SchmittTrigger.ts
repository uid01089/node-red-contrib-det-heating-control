class SchmittTrigger {
    readonly debounceValue: number;
    oldResult: boolean;
    threshold: number;


    constructor(debounceValue: number) {
        this.debounceValue = debounceValue;
        this.oldResult = false;
        this.threshold = 0;
    }

    public setValue(value: number, threshold: number): boolean {

        const debounceValue = (this.threshold !== threshold ? 0 : this.debounceValue);

        if (this.oldResult) {
            // It was ON, we have to reach threshold - debounceValue;
            if (value < threshold - debounceValue) {
                this.oldResult = false;
            }

        } else {
            // It was OFF, we have to reach threshold + debounceValue;
            if (value > threshold + debounceValue) {
                this.oldResult = true;
            }
        }



        return this.oldResult;
    }


}

export { SchmittTrigger };