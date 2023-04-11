Object.deepCopy = function (from) {
    return JSON.parse(JSON.stringify(from));
}

RegExp.specialSymbols = ['[', ']', '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];

window.timeout = function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};