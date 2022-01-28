const helper = require('./helper');

module.exports = function (RED) {

    function DiscomfortIndex(config) {
        RED.nodes.createNode(this, config);
        const context = this.context();
        const node = this;
        this.name = config.name;
        context.set('temperature', null);
        context.set('humidity', null);

        // Add a timeout to reset the status to green after x time (ms)
        let timeoutStatus;

        node.status({fill: 'green', shape: 'dot', text: ''});

        node.on('input', function (msg) {

            const data = helper.parseMessage(node, context, timeoutStatus, msg);

            if (data._temperature !== null && data._humidity !== null) {

                // https://github.com/xshellinc/smart-sense/blob/master/thi.py
                const payload = (0.81 * data._temperature) + (0.01 * data._humidity * ((0.99 * data._temperature) - 14.3)) + 46.3;
                
                let alert = 0; // Comfortable
                if (payload >= 85) {
                    alert = 4; // Severe heat
                } else if (payload >= 80) {
                    alert = 3; // Uncomfortably hot
                } else if (payload >= 75) {
                    alert = 2; // Warm
                } else if (payload >= 70) {
                    alert = 1; // Neutral
                } else if (payload >= 65) {
                    alert = 0; // Comfortable
                } else {
                    alert = -1; // Cold
                }
                
                node.send({
                    _msgid: msg._msgid,
                    topic: "DiscomfortIndex",
                    payload: payload,
                    alert: alert,
                    _event: msg._event
                });
            }
        });
    }

    RED.nodes.registerType('Discomfort-Index', DiscomfortIndex);
};
