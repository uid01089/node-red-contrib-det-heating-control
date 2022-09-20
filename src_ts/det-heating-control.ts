import { NodeProperties, Red, Node } from "./node-red-types"
import { HeatingController, CONFIG } from "./HeatingControler";
import { SchmittTrigger } from "./SchmittTrigger";



interface MyNodeProperties extends NodeProperties {
    configText: string;
    testDate: string;
    debounceValue: string;
}

interface MyNode extends Node {
    configText: string;
    testDate: string;
    schmittTrigger: SchmittTrigger;
}




const func = (RED: Red) => {
    const detHeatingControl = function (config: MyNodeProperties) {

        this.configText = config.configText;
        this.testDate = config.testDate;
        this.schmittTrigger = new SchmittTrigger(parseInt(config.debounceValue));


        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const node: MyNode = this;

        RED.nodes.createNode(node, config);

        /** 
         * Nodes register a listener on the input event 
         * to receive messages from the up-stream nodes in a flow.
        */
        node.on("input", async function (msg, send, done) {

            // For maximum backwards compatibility, check that send exists.
            // If this node is installed in Node-RED 0.x, it will need to
            // fallback to using `node.send`
            // eslint-disable-next-line prefer-spread, prefer-rest-params
            send = send || function () { node.send.apply(node, arguments) }



            //Throws a SyntaxError exception if the string to parse is not valid JSON.
            const evaluatedConfig = JSON.parse(node.configText) as CONFIG;
            const heatingController = new HeatingController(evaluatedConfig);



            const inputTemperature = parseInt(msg.payload);

            if (inputTemperature !== undefined && inputTemperature !== null) {

                const date = (node.testDate !== undefined ? new Date(node.testDate) : new Date());

                const targetTemperature = heatingController.getTargetTemp(date);

                const currentIndex = targetTemperature.index;
                const currentEntry = targetTemperature.dayConfig[currentIndex];
                const nextEntry = targetTemperature.dayConfig[Math.min(currentIndex + 1, targetTemperature.dayConfig.length - 1)];

                const level = node.schmittTrigger.setValue(inputTemperature, currentEntry.temperature);
                const switchOnHeating = (!level ? "On" : "Off");

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


        /** 
         * Whenever a new flow is deployed, the existing nodes are deleted. 
         * If any of them need to tidy up state when this happens, such as 
         * disconnecting from a remote system, they should register a listener 
         * on the close event.
        */
        node.on('close', function (removed: boolean, done: () => void) {
            if (removed) {
                // This node has been disabled/deleted
            } else {
                // This node is being restarted
            }
            done();
        });

    }
    RED.nodes.registerType("det-heating-control", detHeatingControl);
}

module.exports = func;