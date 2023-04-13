import '@styles/styles.scss';
import '@/utils/utils'
import { createModuleButtons } from './module-integration';
import DataControls from '@data/DataControls';
import UIControls from '@/UIControls';

// const d = Math.mean([14, -4, -5, 10, 23, 20, 3, 8]);
// console.log(Math.stddiv.s([14, -4, -5, 10, 23, 20, 3, 8]));

function a(alpha) {
    const zAlpha = this.altHypTest === 'both' ? Math.norminv(alpha / 2) : Math.norminv(alpha);
    const zB = Math.norminv(100 - this.power);
    const z = zAlpha + zB;
    console.log(zAlpha);
    console.log(zB);
    console.log(z);
    const differences = this.data.first.map((el, i) => el - this.data.second[i]);
    const d = Math.mean(differences);
    console.log(d);
    const sd = Math.stddiv.s(differences);
    console.log(sd);
    const n = (z * sd / d) ** 2 + ((zAlpha ** 2) / 2);
    return n;
}

const b = {
    altHypTest: 'both',
    power: 95,
    data: {
        first: [56, 78, 93, 24, 38, 35, 64],
        second: [70, 74, 88, 34, 61, 55, 32, 72]
    },
    func: a
}

console.log(b.func(1));

UIControls.initConstUIControls();
createModuleButtons();