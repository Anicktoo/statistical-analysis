Object.deepCopy = function (from) {
    return JSON.parse(JSON.stringify(from));
}

RegExp.specialSymbols = ['[', ']', '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];
