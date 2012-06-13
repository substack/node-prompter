var termExps = [
    'Identifier',
    'CallExpression',
    'BinaryExpression',
    'UpdateExpression',
    'UnaryExpression',
    'FunctionExpression'
].reduce(function (acc, key) { acc[key] = true; return acc }, {});

module.exports = function (node) {
    for (var p = node; p.parent; p = p.parent) {
        if (termExps[p.type]) return true;
    }
    return false;
};
