module.exports = function (RED) {
    var settings = RED.settings;

    function HeatstrokeIndex(config) {
        RED.nodes.createNode(this, config);
		const context = this.context();
        const node = this;
        this.name = config.name;
		context.set("temperature", 20);
		context.set("humidity", 50);

		// Add a timeout to reset the status to green after x time (ms)
		let timeoutStatus;

		node.status({fill: "green", shape: "dot", text: ""});

        node.on('input', function (msg) {
			const _topic = msg.topic.toLowerCase();
			let _temperature = context.get("temperature") || 20;
			let _humidity = context.get("humidity") || 20;
			switch(_topic) {
				case "temperature":
				case "temp":
					_temperature = parseFloat(msg.payload);
					clearTimeout(timeoutStatus);
					node.status({fill: "blue", shape: "dot", text: "temperature updated"});
					timeoutStatus = setTimeout(() => {
						node.status({fill: "green", shape: "dot", text: ""});
					}, 1000);
					context.set("temperature", _temperature);
					break;
				case "humidity":
				case "hum":
					_humidity = parseFloat(msg.payload);
					clearTimeout(timeoutStatus);
					node.status({fill: "blue", shape: "dot", text: "humidity updated"});
					timeoutStatus = setTimeout(() => {
						node.status({fill: "green", shape: "dot", text: ""});
					}, 1000);
					context.set("humidity", _humidity);
					break;
			}

			msg.payload = (0.735 * _temperature) + (0.0374 * _humidity) + (0.00292 * _humidity * _temperature) - 4.064;

            node.send(msg);
        });
    }

    RED.nodes.registerType("Heatstroke-Index", HeatstrokeIndex);
};
