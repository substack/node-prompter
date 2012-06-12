var readline = require('./readline')(process.stdin);
process.stdin.resume();

module.exports = function () {
    var labels = [];
    var first = true;
    
    var c = {};
    
    c.prompt = function (text, value) {
        if (!text) text = '???'; // todo, node path
        labels.push(text);
        
        return function (cb) {
            if (first) {
                process.stdout.write(labels.shift() + ' > ');
            }
            first = false;
            
            readline(function (line) {
                cb(null, line.replace(/\r?\n$/, ''));
                
                if (labels.length) {
                    process.stdout.write(labels.shift() + ' > ');
                }
            });
        };
    }
    return c;
}; 
