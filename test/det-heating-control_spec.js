
const helper = require("node-red-node-test-helper");
const lowerNode = require("../src/det-heating-control.js");



describe('det-heating-control Node', function () {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload();
        helper.stopServer(done);
    });


    const heaterConfig = {
        Sun: [
            { time: "01:00", temperature: 5 },
            { time: "05:00", temperature: 10 },
            { time: "10:00", temperature: 15 },
            { time: "12:00", temperature: 20 },
            { time: "17:00", temperature: 15 },
            { time: "20:00", temperature: 10 }
        ],
        Mon: [
            { time: "01:00", temperature: 5 + 1 },
            { time: "05:00", temperature: 10 + 1 },
            { time: "10:00", temperature: 15 + 1 },
            { time: "12:00", temperature: 20 + 1 },
            { time: "17:00", temperature: 15 + 1 },
            { time: "20:00", temperature: 10 + 1 }
        ],
        Tue: [
            { time: "01:00", temperature: 5 + 2 },
            { time: "05:00", temperature: 10 + 2 },
            { time: "10:00", temperature: 15 + 2 },
            { time: "12:00", temperature: 20 + 2 },
            { time: "17:00", temperature: 15 + 2 },
            { time: "20:00", temperature: 10 + 2 }
        ],
        Wed: [
            { time: "01:00", temperature: 5 + 3 },
            { time: "05:00", temperature: 10 + 3 },
            { time: "10:00", temperature: 15 + 3 },
            { time: "12:00", temperature: 20 + 3 },
            { time: "17:00", temperature: 15 + 3 },
            { time: "20:00", temperature: 10 + 3 }
        ],
        Thu: [
            { time: "01:00", temperature: 5 + 4 },
            { time: "05:00", temperature: 10 + 4 },
            { time: "10:00", temperature: 15 + 4 },
            { time: "12:00", temperature: 20 + 4 },
            { time: "17:00", temperature: 15 + 4 },
            { time: "20:00", temperature: 10 + 4 }
        ],
        Fri: [
            { time: "01:00", temperature: 5 + 5 },
            { time: "05:00", temperature: 10 + 5 },
            { time: "10:00", temperature: 15 + 5 },
            { time: "12:00", temperature: 20 + 5 },
            { time: "17:00", temperature: 15 + 5 },
            { time: "20:00", temperature: 10 + 5 }
        ],
        Sat: [
            { time: "01:00", temperature: 5 + 6 },
            { time: "05:00", temperature: 10 + 6 },
            { time: "10:00", temperature: 15 + 6 },
            { time: "12:00", temperature: 20 + 6 },
            { time: "17:00", temperature: 15 + 6 },
            { time: "20:00", temperature: 10 + 6 }
        ]

    };






    it('should be loaded', function (done) {
        var flow = [{ id: "DetHeatingControl", type: "det-heating-control", name: "DetHeatingControlName", configText: "{}" }];
        helper.load(lowerNode, flow, function () {
            var underTestNode = helper.getNode("DetHeatingControl");
            underTestNode.should.have.property('name', 'DetHeatingControlName');
            done();
        });
    });

    it('should return false for August 31, 2020 00:00:00 13 °C', function (done) {

        const flow = [
            {
                id: "DetHeatingControl", type: "det-heating-control", name: "DetHeatingControlName", configText: JSON.stringify(heaterConfig),
                testDate: 'August 31, 2020 00:00:00', wires: [["Relay1"], ["Relay2"], ["Relay3"], ["Relay4"]]
            },
            { id: "Relay1", type: "helper" },
            { id: "Relay2", type: "helper" },
            { id: "Relay3", type: "helper" },
            { id: "Relay4", type: "helper" },

        ];


        helper.load(lowerNode, flow, function () {
            var helperNode1 = helper.getNode("Relay1");
            var helperNode2 = helper.getNode("Relay2");
            var helperNode3 = helper.getNode("Relay3");
            var helperNode4 = helper.getNode("Relay4");
            var underTestNode = helper.getNode("DetHeatingControl");

            helperNode1.on("input", function (msg) {

                msg.should.have.property('payload', "Off");

            });

            helperNode2.on("input", function (msg) {

                msg.should.have.property('payload', "10");

            });

            helperNode3.on("input", function (msg) {

                msg.should.have.property('payload', "Sun 20:00 10");

            });

            helperNode4.on("input", function (msg) {

                msg.should.have.property('payload', "Mon 01:00 6");
                done();
            });

            underTestNode.receive({ payload: "13" });
        });
    });

    it('should return true for August 31, 2020 00:00:00 9 °C', function (done) {

        const flow = [
            {
                id: "DetHeatingControl", type: "det-heating-control", name: "DetHeatingControlName", configText: JSON.stringify(heaterConfig),
                testDate: 'August 31, 2020 00:00:00', wires: [["Relay1"], ["Relay2"], ["Relay3"], ["Relay4"]]
            },
            { id: "Relay1", type: "helper" },
            { id: "Relay2", type: "helper" },
            { id: "Relay3", type: "helper" },
            { id: "Relay4", type: "helper" },

        ];


        helper.load(lowerNode, flow, function () {
            var helperNode1 = helper.getNode("Relay1");
            var helperNode2 = helper.getNode("Relay2");
            var helperNode3 = helper.getNode("Relay3");
            var helperNode4 = helper.getNode("Relay4");
            var underTestNode = helper.getNode("DetHeatingControl");

            helperNode1.on("input", function (msg) {

                msg.should.have.property('payload', "On");

            });

            helperNode2.on("input", function (msg) {

                msg.should.have.property('payload', "10");

            });

            helperNode3.on("input", function (msg) {

                msg.should.have.property('payload', "Sun 20:00 10");

            });

            helperNode4.on("input", function (msg) {

                msg.should.have.property('payload', "Mon 01:00 6");
                done();
            });

            underTestNode.receive({ payload: "9" });
        });
    });

    it('should return true for September 19, 2022 23:59:00 9 °C', function (done) {

        const flow = [
            {
                id: "DetHeatingControl", type: "det-heating-control", name: "DetHeatingControlName", configText: JSON.stringify(heaterConfig),
                testDate: 'September 19, 2022 23:59:00', wires: [["Relay1"], ["Relay2"], ["Relay3"], ["Relay4"]]
            },
            { id: "Relay1", type: "helper" },
            { id: "Relay2", type: "helper" },
            { id: "Relay3", type: "helper" },
            { id: "Relay4", type: "helper" },

        ];


        helper.load(lowerNode, flow, function () {
            var helperNode1 = helper.getNode("Relay1");
            var helperNode2 = helper.getNode("Relay2");
            var helperNode3 = helper.getNode("Relay3");
            var helperNode4 = helper.getNode("Relay4");
            var underTestNode = helper.getNode("DetHeatingControl");

            helperNode1.on("input", function (msg) {

                msg.should.have.property('payload', "On");

            });

            helperNode2.on("input", function (msg) {

                msg.should.have.property('payload', "11");

            });

            helperNode3.on("input", function (msg) {

                msg.should.have.property('payload', "Mon 20:00 11");

            });

            helperNode4.on("input", function (msg) {

                msg.should.have.property('payload', "Tue 01:00 7");
                done();
            });

            underTestNode.receive({ payload: "9" });
        });
    });

    it('should return true for September 18, 2022 00:01:00 9 °C', function (done) {

        const flow = [
            {
                id: "DetHeatingControl", type: "det-heating-control", name: "DetHeatingControlName", configText: JSON.stringify(heaterConfig),
                testDate: 'September 18, 2022 00:01:00', wires: [["Relay1"], ["Relay2"], ["Relay3"], ["Relay4"]]
            },
            { id: "Relay1", type: "helper" },
            { id: "Relay2", type: "helper" },
            { id: "Relay3", type: "helper" },
            { id: "Relay4", type: "helper" },

        ];


        helper.load(lowerNode, flow, function () {
            var helperNode1 = helper.getNode("Relay1");
            var helperNode2 = helper.getNode("Relay2");
            var helperNode3 = helper.getNode("Relay3");
            var helperNode4 = helper.getNode("Relay4");
            var underTestNode = helper.getNode("DetHeatingControl");

            helperNode1.on("input", function (msg) {

                msg.should.have.property('payload', "On");

            });

            helperNode2.on("input", function (msg) {

                msg.should.have.property('payload', "16");

            });

            helperNode3.on("input", function (msg) {

                msg.should.have.property('payload', "Sat 20:00 16");

            });

            helperNode4.on("input", function (msg) {

                msg.should.have.property('payload', "Sun 01:00 5");
                done();
            });

            underTestNode.receive({ payload: "9" });
        });
    });

    it('should return true for September 19, 2022 21:43:00 9 °C', function (done) {

        const flow = [
            {
                id: "DetHeatingControl", type: "det-heating-control", name: "DetHeatingControlName", configText: JSON.stringify(heaterConfig),
                testDate: 'September 19, 2022 21:43:00', wires: [["Relay1"], ["Relay2"], ["Relay3"], ["Relay4"]]
            },
            { id: "Relay1", type: "helper" },
            { id: "Relay2", type: "helper" },
            { id: "Relay3", type: "helper" },
            { id: "Relay4", type: "helper" },

        ];


        helper.load(lowerNode, flow, function () {
            var helperNode1 = helper.getNode("Relay1");
            var helperNode2 = helper.getNode("Relay2");
            var helperNode3 = helper.getNode("Relay3");
            var helperNode4 = helper.getNode("Relay4");
            var underTestNode = helper.getNode("DetHeatingControl");

            helperNode1.on("input", function (msg) {

                msg.should.have.property('payload', "On");

            });

            helperNode2.on("input", function (msg) {

                msg.should.have.property('payload', "16");

            });

            helperNode3.on("input", function (msg) {

                msg.should.have.property('payload', "Sat 20:00 16");

            });

            helperNode4.on("input", function (msg) {

                msg.should.have.property('payload', "Sun 01:00 5");
                done();
            });

            underTestNode.receive({ payload: "9" });
        });
    });


});