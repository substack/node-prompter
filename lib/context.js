var Stream = require('stream');
var readline = require('./readline');
var path = require('path');
var getKeys = require('./keys');

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
    
    if (!context.delim) context.delim = ': ';
    
    context.prompt = function (text, value) {
        return function (cb, node) {
            if (!text) text = getKeys(node);
            if (value !== undefined) {
                text += context.delim + '(' + value + ') ';
            }
            else text += context.delim;
            labels.push(text);
            
            if (first) {
                stream.emit('data', labels.shift());
            }
            first = false;
            
            read(function (line) {
                var s = line.replace(/\r?\n$/, '');
                if (s === '' && value !== undefined) {
                    cb(null, value);
                }
                else cb(null, s);
                
                if (labels.length) {
                    stream.emit('data', labels.shift());
                }
            });
        };
    };
    
    return { context : context, stream : stream };
};
