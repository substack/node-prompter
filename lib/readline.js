// todo: use rlwrap somehow and this should be its own thing

module.exports = function (ondata) {
    var lines = [];
    var line = '';
    var code = '\n'.charCodeAt(0);
    var queue = [];
    
    ondata(function (buf) {
        if (typeof buf === 'string') {
            var xs = buf.split('\n').slice(0, -1);
            xs.forEach(function (x) {
                var s = x + '\n';
                if (queue.length) queue.shift()(s)
                else lines.push(s)
            });
            return;
        }
        
        for (var i = 0; i < buf.length; i++) {
            line += String.fromCharCode(buf[i]);
            
            if (buf[i] === code) {
                if (queue.length) queue.shift()(line)
                else lines.push(line)
                
                line = '';
            }
        }
    });
    
    return function (cb) {
        if (lines.length) cb(lines.shift())
        else queue.push(cb)
    };
};
