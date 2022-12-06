import { InfluxDBBatchElement } from "./InfluxDBBatchElement";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NodeProperties {

}

export interface Message {
    payload: string | any
}

export interface Nodes {
    createNode(node: Node, config: NodeProperties): void;
    registerType(name: string, fct: (config: NodeProperties) => void): void;
}

/* addWidget:
   - options
     - RED: RED object
     - options: options to create dashboard widget
       * [node] - the node that represents the control on a flow
       * format - HTML code of widget
       * [group] - group name (optional if templateScope = 'global')
       * [width] - width of widget (default automatic)
       * [height] - height of widget (default automatic)
       * [order] - property to hold the placement order of the widget (default 0)
       * [templateScope] - scope of widget/global or local (default local)
       * [emitOnlyNewValues] - boolean (default true).
             If true, it checks if the payload changed before sending it
             to the front-end. If the payload is the same no message is sent.
       * [forwardInputMessages] - boolean (default true).
             If true, forwards input messages to the output
       * [storeFrontEndInputAsState] - boolean (default true).
             If true, any message received from front-end is stored as state
        [persistantFrontEndValue] - boolean (default true).
             If true, last received message is send again when front end reconnect.
       * [convert] - callback to convert the value before sending it to the front-end
       * [beforeEmit] - callback to prepare the message that is emitted to the front-end
       * [convertBack] - callback to convert the message from front-end before sending it to the next connected node
       * [beforeSend] - callback to prepare the message that is sent to the output
       * [initController] - callback to initialize in controller
*/

export interface NodeRedDashboardConfig {
    node: Node;
    order: any;
    group: any;
    width: any;
    height: any;
    format: string;
    templateScope: string;
    emitOnlyNewValues: boolean;
    forwardInputMessages: boolean;
    storeFrontEndInputAsState: boolean;
    convertBack: (value: any) => any;
    beforeEmit: (msg: any) => any;
    beforeSend: (msg: any, orig: any) => any;
    initController: ($scope: any) => void;
}

export interface NodeRedDashboard {
    addWidget(config: NodeRedDashboardConfig): boolean;

}

export interface Red {
    require(arg0: string): (RED: Red) => NodeRedDashboard;
    nodes: Nodes
}

type OnInput = (msg: Message, send: (msgs: Message[]) => void, done: () => void) => void;
type OnClose = (removed: boolean, done: () => void) => void;

export interface Node {
    on(slot: string, fct: OnInput | OnClose): void;
    send: any;
}