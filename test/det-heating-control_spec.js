
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
        dayConfig: [
            {// Sun
                timeConfig: [
                    { time: "01:00", temperature: 5 },
                    { time: "05:00", temperature: 10 },
                    { time: "10:00", temperature: 15 },
                    { time: "12:00", temperature: 20 },
                    { time: "17:00", temperature: 15 },
                    { time: "20:00", temperature: 10 }
                ]
            },
            {// Mon
                timeConfig: [
                    { time: "01:00", temperature: 5 + 1 },
                    { time: "05:00", temperature: 10 + 1 },
                    { time: "10:00", temperature: 15 + 1 },
                    { time: "12:00", temperature: 20 + 1 },
                    { time: "17:00", temperature: 15 + 1 },
                    { time: "20:00", temperature: 10 + 1 }
                ]
            },
            {//Tue
                timeConfig: [
                    { time: "01:00", temperature: 5 + 2 },
                    { time: "05:00", temperature: 10 + 2 },
                    { time: "10:00", temperature: 15 + 2 },
                    { time: "12:00", temperature: 20 + 2 },
                    { time: "17:00", temperature: 15 + 2 },
                    { time: "20:00", temperature: 10 + 2 }
                ]
            },
            {//Wed
                timeConfig: [
                    { time: "01:00", temperature: 5 + 3 },
                    { time: "05:00", temperature: 10 + 3 },
                    { time: "10:00", temperature: 15 + 3 },
                    { time: "12:00", temperature: 20 + 3 },
                    { time: "17:00", temperature: 15 + 3 },
                    { time: "20:00", temperature: 10 + 3 }
                ]
            },
            {//Thu
                timeConfig: [
                    { time: "01:00", temperature: 5 + 4 },
                    { time: "05:00", temperature: 10 + 4 },
                    { time: "10:00", temperature: 15 + 4 },
                    { time: "12:00", temperature: 20 + 4 },
                    { time: "17:00", temperature: 15 + 4 },
                    { time: "20:00", temperature: 10 + 4 }
                ]
            },
            {//Fri
                timeConfig: [
                    { time: "01:00", temperature: 5 + 5 },
                    { time: "05:00", temperature: 10 + 5 },
                    { time: "10:00", temperature: 15 + 5 },
                    { time: "12:00", temperature: 20 + 5 },
                    { time: "17:00", temperature: 15 + 5 },
                    { time: "20:00", temperature: 10 + 5 }
                ]
            },
            {//Sat
                timeConfig: [
                    { time: "01:00", temperature: 5 + 6 },
                    { time: "05:00", temperature: 10 + 6 },
                    { time: "10:00", temperature: 15 + 6 },
                    { time: "12:00", temperature: 20 + 6 },
                    { time: "17:00", temperature: 15 + 6 },
                    { time: "20:00", temperature: 10 + 6 }
                ]
            },
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

    it('should return Device', function (done) {

        const flow = [
            {
                id: "DetHeatingControl", type: "det-heating-control", name: "DetHeatingControlName", configText: JSON.stringify(heaterConfig),
                testDate: 'August 31, 2020 00:00:00', wires: [["Relay"]]
            },
            { id: "Relay", type: "helper" }

        ];


        helper.load(lowerNode, flow, function () {
            var helperNode = helper.getNode("Relay");
            var underTestNode = helper.getNode("DetHeatingControl");

            helperNode.on("input", function (msg) {

                msg.should.have.property('payload', false);
                done();
            });
            underTestNode.receive({ payload: "13" });
        });
    });

});