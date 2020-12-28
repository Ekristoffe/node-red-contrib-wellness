/**
 * MIT License
 * 
 * Copyright (c) 2020 Christophe Icard
 **/

function nodeStatus (node, timeoutStatus, fill, shape, text, nextFill, nextShape, nextMessage) {

    node.status({fill, shape, text});
    timeoutStatus = setTimeout(() => {
        node.status({nextFill, nextShape, nextMessage});
    }, 1000);

}

function parseMessage (node, context, timeoutStatus, msg) {

    const _topic = msg.topic.toLowerCase();
    let _temperature = context.get('temperature') || 20;
    let _humidity = context.get('humidity') || 20;
    switch(_topic) {
        case 'temperature':
        case 'temp':
            _temperature = parseFloat(msg.payload);
            nodeStatus(node, timeoutStatus, 'blue', 'dot', 'temperature updated', 'green', 'dot', '');
            context.set('temperature', _temperature);
            break;
        case 'humidity':
        case 'hum':
            _humidity = parseFloat(msg.payload);
            nodeStatus(node, timeoutStatus, 'blue', 'dot', 'humidity updated', 'green', 'dot', '');
            context.set('humidity', _humidity);
            break;
    }
    return {
        _temperature, 
        _humidity
    };
}
