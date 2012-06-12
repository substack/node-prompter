var fs = require('fs');
var path = require('path');
var prompter = require('../');

var src = fs.readFileSync(__dirname + '/pkg.json', 'utf8');
var ctx = { basename : path.basename(process.cwd()) };

var s = prompter(src, ctx, function (err, output) {
    console.log(output);
    process.stdin.pause();
});
s.pipe(process.stdout);

process.stdin.pipe(s);
process.stdin.resume();
