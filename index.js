var falafel = require('falafel');
var vm = require('vm');

var createContext = require('./lib/context');
var terminated = require('./lib/terminated');

module.exports = function (src, context, cb) {
    if (typeof context === 'function') {
        cb = context;
        context = {};
    }
    
    var c = createContext(context);
    
    process.nextTick(function () {
        transform(c.context, src, cb);
    });
    
    return c.stream;
};

function transform (context, src, cb) {
    var pending = 0;
    var output = falafel('(' + src + ')', function (node) {
        var isLeaf = node.parent
            && !terminated(node.parent) && terminated(node)
        ;
        if (!isLeaf) return;
        
        var s = node.source();
        var res = vm.runInNewContext('(' + s + ')', context);
        if (typeof res === 'function') {
            pending ++;
            
            res(function (err, s_) {
                if (err) return cb(err);
                
                var pos = computePos(node, src);
                var indent = computeIndent(node, src);
                node.update(stringify(s_, pos, indent));
                process.nextTick(function () {
                    if (--pending === 0) {
                        cb(null, String(output).replace(/^\(|\)$/g, ''));
                    }
                });
            }, node);
        }
        else {
            var s_ = JSON.stringify(res);
            node.update(s_);
        }
    });
} 

function computeIndent (node, src) {
    if (!node.parent) return 2;
    var x = computePos(node.parent, src);
    if (!node.parent.parent) return x;
    var y = computePos(node.parent.parent, src);
    return Math.abs(x - y);
}

function computePos (node, src) {
    var p = node.parent && node.parent.range[0] || node.range[0];
    var xs = String(src).split('');
    for (var i = p; i >= 0; i--) {
        if (xs[i] === '\n') break;
    }
    return Math.max(0, p - (i + 2));
}

function stringify (s, pos, indent) {
    var res = JSON.stringify(s, null, indent);
    return res.split('\n').map(function (x, i) {
        if (i == 0) return x;
        return Array(pos + 1).join(' ') + x;
    }).join('\n');
}
