var Stream = require('stream');
var readline = require('./readline');
var path = require('path');

module.exports = function (context) {
    if (!context) context = {};
    var labels = [];
    var first = true;
    
    var stream = new Stream;
    stream.writable = true;
    stream.readable = true;
    
    var listeners = [];
    function ondata (cb) { listeners.push(cb) }
    var read = readline(ondata);
    
    stream.write = function (buf) {
        listeners.forEach(function (cb) { cb(buf) });
    };
    
    stream.end = function () {};
    
    context.prompt = function (text, value) {
        if (!text) text = '???'; // todo, node path
        labels.push(text);
        
        return function (cb) {
            if (first) {
                stream.emit('data', labels.shift() + ' > ');
            }
            first = false;
            
            read(function (line) {
                cb(null, line.replace(/\r?\n$/, ''));
                
                if (labels.length) {
                    stream.emit('data', labels.shift() + ' > ');
                }
            });
        };
    };
    
    return { context : context, stream : stream };
};
