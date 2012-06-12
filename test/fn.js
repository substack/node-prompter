var test = require('tap').test;
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/fn.json');
var prompter = require('../');
var Stream = require('stream');

test('prompt callback param', function (t) {
    t.plan(2);
    
    var rw = new Stream;
    rw.readable = true;
    rw.writable = true;
    
    var data = '';
    rw.write = function (buf) { data += buf };
    rw.end = function () {};
    
    var ctx = { tmpdir : '/tmp' }
    var s = prompter(src, ctx, function (err, output) {
        t.same(
            {
                a : 3,
                b : '!2B...',
                c : {
                    x : 5500,
                    y : '/tmp/y/file.txt',
                }
            },
            JSON.parse(output)
        );
        t.equal('To be or not to be?: (!2b) c.x: ', data);
    });
    s.pipe(rw);
    rw.pipe(s);
    
    rw.emit('data', '\n');
    rw.emit('data', '55\n');
});
