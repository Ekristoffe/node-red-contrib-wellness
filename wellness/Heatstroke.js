const helper = require('./helper');

module.exports = function (RED) {

    function HeatstrokeIndex(config) {
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
                
                // https://github.com/xshellinc/smart-sense/blob/master/wbgt.py
                const payload = (0.735 * data._temperature) + (0.0374 * data._humidity) + (0.00292 * data._humidity * data._temperature) - 4.064;
                
                let alert = 0; // Almost safe
                if (payload >= 31) {
                    alert = 4; // Danger
                } else if (payload >= 28) {
                    alert = 3; // Severe warning
                } else if (payload >= 25) {
                    alert = 2; // Warning
                } else if (payload >= 21) {
                    alert = 1; // Caution
                }

                node.send({
                    _msgid: msg._msgid,
                    topic: "HeatstrokeIndex",
                    payload: payload,
                    alert: alert,
                    _event: msg._event
                });
            }
        });
    }

    RED.nodes.registerType('Heatstroke-Index', HeatstrokeIndex);
};
