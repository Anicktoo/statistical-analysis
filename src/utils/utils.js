Object.deepCopy = function (from) {
    return JSON.parse(JSON.stringify(from));
}

RegExp.specialSymbols = ['[', ']', '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];

window.timeout = function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// get p in percents
Math.norminv = function (p) {
    p = p / 100;
    const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
    const a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
    const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
    const b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029E-03;
    const c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
    const c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146E-03;
    const d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
    const p_low = 0.02425, p_high = 1 - p_low;
    let q, r;
    let retVal;

    if ((p < 0) || (p > 1)) {
        return undefined;
    }
    else if (p < p_low) {
        q = Math.sqrt(-2 * Math.log(p));
        retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    else if (p <= p_high) {
        q = p - 0.5;
        r = q * q;
        retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
}

// return p in percents
Math.normdist = function (z) {
    let sign = 1;
    if (z < 0)
        sign = -1;

    return 0.5 * (1.0 + sign * erf(Math.abs(z) / Math.sqrt(2))) * 100;

    function erf(x) {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        x = Math.abs(x);
        const t = 1 / (1 + p * x);
        return 1 - ((((((a5 * t + a4) * t) + a3) * t + a2) * t) + a1) * t * Math.exp(-1 * x * x);
    }
}

Math.mean = function (array) {
    return array.reduce((el, c) => el + c) / array.length;
}

Math.stddiv = {};
Math.stddiv.s = function (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => ((x - mean) ** 2)).reduce((a, b) => a + b) / (n - 1))
}

Number.resultForm = function (n, noRound) {
    return typeof n === 'number' && !Number.isNaN(n) ? (noRound ? n : Math.roundGOST(n, 2)) : '-';
}

String.resultForm = function (s) {
    return s !== undefined && s !== null ? s : '-';
}

// Math.roundFixed = function (num, dec) {
//     const mult = 10 ** dec;
//     return Math.round((num + Number.EPSILON) * mult) / mult;
// }

Math.roundGOST = function (num) {
    let tempN = Math.abs(num);
    let tempAnswer;
    if (tempN >= 10) {
        tempAnswer = num;
        if (String(tempN).split('.')[1]?.charAt(1) === '5') {
            tempAnswer += 0.01 * Math.sign(num);
        }
        return tempAnswer.toFixed(1);
    }
    else if (tempN >= 1) {
        tempAnswer = num;
        if (String(tempN).charAt(4) === '5') {
            tempAnswer += 0.001 * Math.sign(num);
        }
        return tempAnswer.toPrecision(3);
    }
    else {
        if (tempN === 0.995) {
            return Math.round(num).toFixed(2);
        }
        tempAnswer = num.toPrecision(2);
        if (tempAnswer == 1) {
            return '1.00';
        }
        else if (tempAnswer == -1) {
            return '-1.00';
        }
        else {
            return tempAnswer;
        }
    }
}