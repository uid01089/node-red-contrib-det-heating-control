"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const HeatingControler_1 = require("./HeatingControler");
const func = (RED) => {
    const detHeatingControl = function (config) {
        this.configText = config.configText;
        this.testDate = config.testDate;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const node = this;
        RED.nodes.createNode(node, config);
        /**
         * Nodes register a listener on the input event
         * to receive messages from the up-stream nodes in a flow.
        */
        node.on("input", function (msg, send, done) {
            return __awaiter(this, void 0, void 0, function* () {
                // For maximum backwards compatibility, check that send exists.
                // If this node is installed in Node-RED 0.x, it will need to
                // fallback to using `node.send`
                // eslint-disable-next-line prefer-spread, prefer-rest-params
                send = send || function () { node.send.apply(node, arguments); };
                //Throws a SyntaxError exception if the string to parse is not valid JSON.
                const evaluatedConfig = JSON.parse(node.configText);
                const heatingController = new HeatingControler_1.HeatingController(evaluatedConfig);
                const inputTemperature = parseInt(msg.payload);
                if (inputTemperature !== undefined && inputTemperature !== null) {
                    const date = (node.testDate !== undefined ? new Date(node.testDate) : new Date());
                    const targetTemperature = heatingController.getTargetTemp(date);
                    const currentIndex = targetTemperature.index;
                    const currentEntry = targetTemperature.dayConfig[currentIndex];
                    const nextEntry = targetTemperature.dayConfig[Math.min(currentIndex + 1, targetTemperature.dayConfig.length - 1)];
                    const switchOnHeating = (inputTemperature < currentEntry.temperature ? "On" : "Off");
                    send([{ payload: switchOnHeating },
                        { payload: currentEntry.temperature.toString() },
                        { payload: currentEntry.day + " " + currentEntry.time + " " + currentEntry.temperature },
                        { payload: nextEntry.day + " " + nextEntry.time + " " + nextEntry.temperature },
                    ]);
                }
                // Once finished, call 'done'.
                // This call is wrapped in a check that 'done' exists
                // so the node will work in earlier versions of Node-RED (<1.0)
                if (done) {
                    done();
                }
            });
        });
        /**
         * Whenever a new flow is deployed, the existing nodes are deleted.
         * If any of them need to tidy up state when this happens, such as
         * disconnecting from a remote system, they should register a listener
         * on the close event.
        */
        node.on('close', function (removed, done) {
            if (removed) {
                // This node has been disabled/deleted
            }
            else {
                // This node is being restarted
            }
            done();
        });
    };
    RED.nodes.registerType("det-heating-control", detHeatingControl);
};
module.exports = func;
//# sourceMappingURL=det-heating-control.js.map