var fs = require('fs');
var falafel = require('falafel');
var vm = require('vm');

var createContext = require('./lib/context');
var terminated = require('./lib/terminated');

//var src = fs.readFileSync('pkg.json', 'utf8');
var src = '{"a":[2,~9,prompt(":d")],"b":4,"c":prompt("beep"),"d":6}';

var pending = 0;
var context = createContext();

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
            if (--pending === 0) console.log(output);
        });
    }
    else {
        var s_ = JSON.stringify(res);
        node.update(s_);
    }
});
