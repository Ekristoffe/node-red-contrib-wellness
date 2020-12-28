module.exports = function (RED) {
    var settings = RED.settings;

    function DiscomfortIndex(config) {
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

            msg.payload = (0.81 * _temperature) + (0.01 * _humidity * ((0.99 * _temperature) - 14.3)) + 46.3;

            node.send(msg);
        });
    }

    RED.nodes.registerType('Discomfort-Index', DiscomfortIndex);
};
