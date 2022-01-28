const helper = require('./helper');

module.exports = function (RED) {

    function FluIndex(config) {
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
                
                // https://github.com/xshellinc/smart-sense/blob/master/flu.py
                const payload = 217 * (6.1078 * Math.pow(10, (7.5 * data._temperature / (data._temperature + 237.3)))) / (data._temperature + 273.15) * data._humidity / 100;

                let alert = 0;
                if (payload >= 18) {
                    alert = 0; // Very safe
                } else if (payload >= 12) {
                    alert = 1; // Safe
                } else if (payload >= 7) {
                    alert = 2; // Caution
                } else {
                    alert = 3; // Warning
                }
                
                node.send({
                    _msgid: msg._msgid,
                    topic: "FluRiskIndex",
                    payload: payload,
                    alert: alert,
                    _event: msg._event
                });
            }
        });
    }

    RED.nodes.registerType('Flu-Index', FluIndex);
};
