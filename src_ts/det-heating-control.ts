import { Node, Red, NodeProperties } from "node-red";
import { HeatingController, CONFIG } from "./HeatingControler";



const func = (RED: Red) => {
    const detHeatingControl = function (config: NodeProperties) {

        this.configText = (config as any).configText;
        this.testDate = (config as any).testDate;

        const node: Node = this;

        RED.nodes.createNode(node, config);




        /** 
         * Nodes register a listener on the input event 
         * to receive messages from the up-stream nodes in a flow.
        */
        node.on("input", async function (msg, send, done) {

            // For maximum backwards compatibility, check that send exists.
            // If this node is installed in Node-RED 0.x, it will need to
            // fallback to using `node.send`
            send = send || function () { node.send.apply(node, arguments) }



            //Throws a SyntaxError exception if the string to parse is not valid JSON.
            const evaluatedConfig = JSON.parse((node as any).configText) as CONFIG;
            const heatingController = new HeatingController(evaluatedConfig);



            const inputTemperature = parseInt(msg.payload);
            if (inputTemperature !== undefined && inputTemperature !== null) {

                const date = ((node as any).testDate !== undefined ? new Date((node as any).testDate) : new Date());

                const targetTemperature = heatingController.getTargetTemp(date);

                if (inputTemperature < targetTemperature) {
                    send({ payload: true });
                } else {
                    send({ payload: false });
                }



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
        node.on('close', function (removed, done) {
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