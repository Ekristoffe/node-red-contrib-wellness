/**
 * MIT License
 * 
 * Copyright (c) 2020 Christophe Icard
 **/

function nodeStatus (node, timeoutStatus, fill, shape, text, nextFill, nextShape, nextMessage) {
    clearTimeout(timeoutStatus);
    node.status({fill, shape, text});
    timeoutStatus = setTimeout(() => {
        node.status({nextFill, nextShape, nextMessage});
    }, 1000);
}

function parseMessage (node, context, timeoutStatus, msg) {

    let _topic = msg.topic || 'data';
    _topic = _topic.toLowerCase();
    let _temperature = context.get('temperature') || null;
    let _humidity = context.get('humidity') || null;
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
        default:
            _temperature = parseFloat(msg.payload.temperature);
            _humidity = parseFloat(msg.payload.humidity);
            if (_temperature !== null && _humidity !== null) {
                nodeStatus(node, timeoutStatus, 'blue', 'dot', 'temperature & humidity updated', 'green', 'dot', '');
                context.set('temperature', _temperature);
                context.set('humidity', _humidity);
            } else if (_temperature !== null) {
                nodeStatus(node, timeoutStatus, 'blue', 'dot', 'temperature updated', 'green', 'dot', '');
                context.set('temperature', _temperature);
            } else if (_humidity !== null) {
                nodeStatus(node, timeoutStatus, 'blue', 'dot', 'humidity updated', 'green', 'dot', '');
                context.set('humidity', _humidity);
            } else {
                nodeStatus(node, timeoutStatus, 'red', 'dot', 'msg.payload.temperature or/and msg.payload.humidity invalid', 'green', 'dot', '');
            }
            break;
    }
    return {
        _temperature, 
        _humidity
    };
}

exports.nodeStatus = nodeStatus;
exports.parseMessage = parseMessage;
