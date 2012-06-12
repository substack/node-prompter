var fs = require('fs');
var src = fs.readFileSync(__dirname + '/pkg.json', 'utf8');
var prompter = require('../');

var s = prompter(src, function (output) {
    console.log(output);
    process.stdin.pause();
});
s.pipe(process.stdout);

process.stdin.pipe(s);
process.stdin.resume();
