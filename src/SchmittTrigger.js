"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchmittTrigger = void 0;
class SchmittTrigger {
    constructor(debounceValue) {
        this.debounceValue = debounceValue;
        this.oldResult = false;
        this.threshold = 0;
    }
    setValue(value, threshold) {
        const debounceValue = (this.threshold !== threshold ? 0 : this.debounceValue);
        if (this.oldResult) {
            // It was ON, we have to reach threshold - debounceValue;
            if (value < threshold - debounceValue) {
                this.oldResult = false;
            }
        }
        else {
            // It was OFF, we have to reach threshold + debounceValue;
            if (value > threshold + debounceValue) {
                this.oldResult = true;
            }
        }
        return this.oldResult;
    }
}
exports.SchmittTrigger = SchmittTrigger;
//# sourceMappingURL=SchmittTrigger.js.map