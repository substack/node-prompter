#!/usr/bin/env node
var argv = require('optimist').argv;
if (!argv._[0]) return console.error('Usage: prompter [file]');

var fs = require('fs');
var src = fs.readFileSync(argv._[0]);
var prompter = require('../');

var s = prompter(src, argv, function (output) {
    console.log(output);
    process.stdin.pause();
});
s.pipe(process.stdout);

process.stdin.pipe(s);
process.stdin.resume();
