prompter
========

Create json files, prompting for input and evaluating expressions.

[![build status](https://secure.travis-ci.org/substack/node-prompter.png)](http://travis-ci.org/substack/node-prompter)

example
=======

First create a json file with embedded expressions:

``` js
{
  "a": 1 + 2,
  "b": prompt('To be or not to be?', '!2b'),
  "c": {
    "x": prompt(),
    "y": tmpdir + "/y/file.txt"
  }
}
```

Now run the json file with the command-line tool (or write a script) to generate
a valid json file, prompting from the user as necessary:

```
$ prompter --tmpdir=/tmp simple.json > output.json
To be or not to be?: (!2b) 
c.x: 55
$ cat output.json
{
  "a": 3,
  "b": "!2b",
  "c": {
    "x": "55",
    "y": "/tmp/y/file.txt"
  }
}
```

json methods
============

prompt(text, value, cb)
-----------------------

Like `window.prompt()`, prompt the user with `text` and an optional default
`value`. If `text` isn't provided, the long key path from the root of the json
document is used.

If `cb` is specified, use the return value of `cb(s)` for the string `s`
obtained from the user.

readline(cb)
------------

Fetch a line from the input stream, including a trailing newline.

functions
---------

Every value that resolves to a function in the final output will be executed with
a callback function: `fn(cb)`. Inside the function `fn`, `cb(err, value)` should
be called to give the new value or abort the transaction.

api methods
===========

``` js
var prompter = require('prompter')
```

prompter(src, context={}, cb)
-----------------------------

Evaluate the string source `src` under some optional `context`, calling
`cb(err, output)` with the completed file contents.

Control the delimiter by passing in a value for `context.delim`, which defaults
to `': '`.

Returns a readable/writable stream that should be pipe into and out of a user's
stdin/stdout.

usage
=====

```
Usage: prompter {variables} [infile] [outfile]
```

install
=======

To install the library, with [npm](http://npmjs.org) do:

```
npm install prompter
```

or to get the command-line tool, do:

```
npm install -g prompter
```

license
=======

MIT
