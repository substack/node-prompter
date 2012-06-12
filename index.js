var falafel = require('falafel');
var vm = require('vm');

var createContext = require('./lib/context');
var terminated = require('./lib/terminated');

module.exports = function (src, cb) {
    var context = createContext();
    
    process.nextTick(function () {
        transform(context, src, cb);
    });
    
    return context.stream;
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
                node.update(s_);
                if (--pending === 0) {
                    cb(String(output).replace(/^\(|\)$/g, ''));
                }
            });
        }
        else {
            var s_ = JSON.stringify(res);
            node.update(s_);
        }
    });
} 
