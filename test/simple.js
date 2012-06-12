var test = require('tap').test;
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/simple.json');
var prompter = require('../');
var Stream = require('stream');

test('simple', function (t) {
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
                b : '!2b',
                c : {
                    x : 55,
                    y : '/tmp/y/file.txt',
                }
            },
            JSON.parse(output)
        );
        t.equal(data, 'To be or not to be?: c.x: ');
    });
    s.pipe(rw);
    rw.pipe(s);
    
    rw.emit('data', '\n');
    rw.emit('data', '55\n');
});
