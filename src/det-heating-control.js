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
const SchmittTrigger_1 = require("./SchmittTrigger");
const func = (RED) => {
    /**
     * A ui-node must always contain the following function.
     * function HTML(config) {}
     * This function will build the HTML necessary to display the lineargauge on the dashboard.
     * It will also pass in the node's config so that the parameters may be referenced from the flow editor.
     */
    function HTML(config) {
        const html = String.raw `
        <div id="elementId_{{$id}}">
        <div id="lg_{{$id}}>
        <div id="valueContainer">
            <text class="lgText" dx="10" dy="3">HIIHIHIHIHIH` + `</text>
        </div>        
        `;
        return html;
    }
    /**
     * A ui-node must always contain the following function.
     * This function will verify that the configuration is valid
     * by making sure the node is part of a group. If it is not,
     * it will throw a "no-group" error.
     * You must enter your node name that you are registering here.
     */
    function checkConfig(node, conf) {
        if (!conf || !conf.hasOwnProperty("group")) {
            //node.error(RED._("ui_lineargauge.error.no-group"));
            return false;
        }
        return true;
    }
    let ui = undefined; // instantiate a ui variable to link to the dashboard
    const detHeatingControl = function detHeatingControl(config) {
        this.configText = config.configText;
        this.testDate = config.testDate;
        this.schmittTrigger = new SchmittTrigger_1.SchmittTrigger(parseFloat(config.debounceValue));
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const node = this;
        if (ui === undefined) {
            ui = RED.require("node-red-dashboard")(RED);
        }
        RED.nodes.createNode(node, config);
        if (checkConfig(node, config)) {
            const html = HTML(config); // *REQUIRED* get the HTML for this node using the function from above
            const done = ui.addWidget({
                node: node,
                order: config.order,
                group: config.group,
                width: config.width,
                height: config.height,
                format: html,
                templateScope: "local",
                emitOnlyNewValues: false,
                forwardInputMessages: false,
                storeFrontEndInputAsState: false,
                convertBack: function (value) {
                    console.log("");
                    return value;
                },
                beforeEmit: function (msg) {
                    console.log("");
                    return { msg: msg };
                },
                beforeSend: function (msg, orig) {
                    console.log("");
                    if (orig) {
                        return orig.msg;
                    }
                },
                /**
                 * The initController is where most of the magic happens.
                 * This is the section where you will write the Javascript needed for your node to function.
                 * The 'msg' object will be available here.
                 */
                initController: function ($scope) {
                    $scope.flag = true; // not sure if this is needed?
                    $scope.$watch('msg', function (msg) {
                        if (!msg) {
                            // Ignore undefined msg
                            return;
                        }
                        debugger;
                        /**
                         * In order to reference an element within the HTML of the node, we must make a call
                         * to the $scope to get the $id of the element we want to interact with.
                         * We do this by calling
                         *  $scope.$eval('$id')
                         * This will return the unique identifier as a number to which is associated with
                         * this particular node.
                         * In order to interact with an element, we must also declare an object to reference
                         * the element.
                         * This is done by accessing the DOM via Javascript
                         * 	document.getElementById("elementId_"+$scope.$eval('$id))
                         * Note that in order for this to work, you must have also entered the element id
                         * in the HTML. For example.
                         * 	<div id="elementId_{{$id}}">
                         * This is an Angular expression that will inject a unique ID number where ever you place {{$id}}.
                         * During creation of the ui node on the dashboard, only one ID number will be used during the
                         * time of creation.
                         */
                        var ptr = document.getElementById("elementId_" + $scope.$eval('$id')); //get the pointer object
                        $(ptr).html("Hi");
                    });
                }
            });
        }
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
                const inputTemperature = parseFloat(msg.payload);
                if (inputTemperature !== undefined && inputTemperature !== null) {
                    const date = (node.testDate !== undefined ? new Date(node.testDate) : new Date());
                    const targetTemperature = heatingController.getTargetTemp(date);
                    const currentIndex = targetTemperature.index;
                    const currentEntry = targetTemperature.dayConfig[currentIndex];
                    const nextEntry = targetTemperature.dayConfig[Math.min(currentIndex + 1, targetTemperature.dayConfig.length - 1)];
                    const level = node.schmittTrigger.setValue(inputTemperature, currentEntry.temperature);
                    const switchOnHeating = (!level ? "On" : "Off");
                    const influxElement = {
                        measurement: "HeatingCtr_" + this.name,
                        fields: {
                            do_heating: !level,
                            do_heating_0_100: !level ? 100 : 0,
                            current_temperature: inputTemperature,
                            target_temperature: currentEntry.temperature,
                        }
                    };
                    send([{ payload: switchOnHeating },
                        { payload: currentEntry.temperature.toString() },
                        { payload: currentEntry.day + " " + currentEntry.time + " " + currentEntry.temperature },
                        { payload: nextEntry.day + " " + nextEntry.time + " " + nextEntry.temperature },
                        { payload: [influxElement] },
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