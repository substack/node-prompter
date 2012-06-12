module.exports = function (node) {
    var keys = [];
    for (var p = node; p.parent; p = p.parent) {
        if (p.parent.type === 'ArrayExpression') {
            keys.unshift(p.parent.elements.indexOf(p));
        }
        else if (p.type === 'Property') {
            keys.unshift(p.key.value);
        }
    }
    
    if (keys.length === 0) return '.';
    return keys.reduce(function (s, key) {
        if (/\W|^\d+$/.test(key)) {
            return s + '[' + JSON.stringify(key) + ']';
        }
        else return s + '.' + key;
    });
};
