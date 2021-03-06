const helper = require('./helper');

module.exports = function (RED) {

    function FluIndex(config) {
        RED.nodes.createNode(this, config);
        const context = this.context();
        const node = this;
        this.name = config.name;
        context.set('temperature', 20);
        context.set('humidity', 50);

        // Add a timeout to reset the status to green after x time (ms)
        let timeoutStatus;

        node.status({fill: 'green', shape: 'dot', text: ''});

        node.on('input', function (msg) {

            const data = helper.parseMessage(node, context, timeoutStatus, msg);

            if (data._temperature !== null && data._humidity !== null) {
                const payload = (0.735 * data._temperature) + (0.0374 * data._humidity) + (0.00292 * data._humidity * data._temperature) - 4.064;

                node.send({
                    _msgid: msg._msgid,
                    topic: "FluRiskIndex",
                    payload: payload,
                    _event: msg._event
                });
            }
        });
    }

    RED.nodes.registerType('Flu-Index', FluIndex);
};
