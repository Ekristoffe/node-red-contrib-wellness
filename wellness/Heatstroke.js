let helper = require('./helper');

module.exports = function (RED) {

    function HeatstrokeIndex(config) {
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

            msg.payload = (0.735 * data._temperature) + (0.0374 * data._humidity) + (0.00292 * data._humidity * data._temperature) - 4.064;

            node.send(msg);
        });
    }

    RED.nodes.registerType('Heatstroke-Index', HeatstrokeIndex);
};
