#!/usr/bin/env node
var argv = require('optimist').argv;
if (!argv._[0]) {
    return console.error('Usage: prompter {variables} [infile] [outfile]');
}
var outfile = argv._[1];

var fs = require('fs');
var src = fs.readFileSync(argv._[0]);
var prompter = require('../');

var s = prompter(src, argv, function (err, output) {
    process.stdin.pause();
    if (err) console.error(err)
    else if (outfile) fs.writeFile(outfile, output)
    else process.stdout.write(output)
});

s.pipe(process.stderr);
process.stdin.pipe(s);
process.stdin.resume();
