var fs = require('fs');
var falafel = require('falafel');
var vm = require('vm');

var termExps = [
    'Identifier',
    'CallExpression',
    'BinaryExpression',
    'UpdateExpression',
    'UnaryExpression'
].reduce(function (acc, key) { acc[key] = true; return acc }, {});

function terminated (node) {
    for (var p = node; p.parent; p = p.parent) {
        if (termExps[p.type]) return true;
    }
    return false;
}

//var src = fs.readFileSync('pkg.json', 'utf8');
var src = '{"a":[2,~9,prompt(":d")],"b":4,"c":prompt("beep"),"d":6}';

var output = falafel('(' + src + ')', function (node) {
    var isLeaf = node.parent
        && !terminated(node.parent) && terminated(node)
    ;
    
    if (isLeaf) {
        var s = node.source();
        var res = vm.runInNewContext('(' + s + ')', {
            prompt : function (x) {
                return function (cb) {
                    setTimeout(function () {
                        cb(null, x.toUpperCase())
                    }, Math.random() * 50);
                };
            }
        });
        if (typeof res === 'function') {
            res(function (err, s_) {
                node.update(s_);
                console.log(output);
            });
        }
        else {
            var s_ = JSON.stringify(res);
            node.update(s_);
        }
    }
});
