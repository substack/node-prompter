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

var offsets = [];
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
                    }, 50);
                };
            }
        });
        if (typeof res === 'function') {
            var ix = offsets.length;
            offsets.push(offsets[offsets.length - 1] || 0);
            
            res(function (err, s_) {
                var delta = s_.length - (node.range[1] - node.range[0] + 1);
                for (var i = ix + 1; i < offsets.length; i++) {
                    offsets[i] += delta;
                }
                var offset = offsets[ix];
                console.dir('offset=' + offset);
                var xs = output.split('');
                
                xs.splice(node.range[0] + offset, s.length, s_);
                output = xs.join('');
                console.dir(output);
            });
            //node.update(res());
        }
        else {
            var s_ = JSON.stringify(res);
            var delta = s_.length - (node.range[1] - node.range[0] + 1);
            var prev = offsets[offsets.length - 1] || 0;
            offsets.push(prev + delta);
            node.update(s_);
        }
    }
});
console.log(output);
