
export function binTest() {
    let gr;
    let twoTables = {
        group1: [],
        group0: []
    }

    function startBinTest() {
        //1
        (function () {
            gr = [0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i <= 34; i++) {
                twoTables.group1.push(i);
            }
            for (let i = 35; i <= 102; i++) {
                twoTables.group0.push(i);
            }
            binCheck(1);
        })();
        //2
        (function () {
            gr = [0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i <= 34; i++) {
                twoTables.group0.push(i);
            }
            for (let i = 35; i <= 102; i++) {
                twoTables.group1.push(i);
            }
            binCheck(2);
        })();
        //3
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [0, 1, 2, 3, 4];
            binCheck(3);
        })();
        //4
        (function () {
            gr = [0];
            twoTables.group1 = [0, 1];
            twoTables.group0 = [2, 3, 4];
            binCheck(4);
        })();
        //5
        (function () {
            gr = [0];
            twoTables.group1 = [3, 4];
            twoTables.group0 = [0, 1, 2];
            binCheck(5);
        })();
        //6
        (function () {
            gr = [0];
            twoTables.group1 = [0, 1, 4];
            twoTables.group0 = [2, 3];
            binCheck(6);
        })();
        //7
        (function () {
            gr = [0];
            twoTables.group1 = [2, 3];
            twoTables.group0 = [0, 1, 4, 5];
            binCheck(7);
        })();
        //8
        (function () {
            gr = [0];
            twoTables.group1 = [2, 3, 6, 7];
            twoTables.group0 = [0, 1, 4, 5];
            binCheck(8);
        })();
        //9
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [0];
            binCheck(9);
        })();
        //10
        (function () {
            gr = [0];
            twoTables.group1 = [0];
            twoTables.group0 = [];
            binCheck(10);
        })();
        //11
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i <= 30; i++) {
                twoTables.group1.push(i);
            }
            binCheck(11);
        })();
        //12
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i <= 31; i++) {
                twoTables.group1.push(i);
            }
            binCheck(12);
        })();
        //13
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i <= 30; i++) {
                twoTables.group0.push(i);
            }
            binCheck(13);
        })();
        //14
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i <= 31; i++) {
                twoTables.group0.push(i);
            }
            binCheck(14);
        })();
        //15
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 14; i++) {
                twoTables.group0.push(i);
            }
            for (let i = 14; i < 31; i++) {
                twoTables.group1.push(i);
            }
            binCheck(15);
        })();
        //16
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 14; i++) {
                twoTables.group1.push(i);
            }
            for (let i = 14; i < 31; i++) {
                twoTables.group0.push(i);
            }
            binCheck(16);
        })();
        //17
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 14; i++) {
                twoTables.group0.push(i);
            }
            for (let i = 14; i < 32; i++) {
                twoTables.group1.push(i);
            }
            binCheck(17);
        })();
        //18
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 14; i++) {
                twoTables.group1.push(i);
            }
            for (let i = 14; i < 32; i++) {
                twoTables.group0.push(i);
            }
            binCheck(18);
        })();
        //19
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 30; i++) {
                twoTables.group0.push(i);
            }
            for (let i = 30; i < 32; i++) {
                twoTables.group1.push(i);
            }
            binCheck(19);
        })();
        //20
        (function () {
            gr = [0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 30; i++) {
                twoTables.group1.push(i);
            }
            for (let i = 30; i < 32; i++) {
                twoTables.group0.push(i);
            }
            binCheck(20);
        })();
        //21
        (function () {
            gr = [0, 0, 0, 0, 0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 31; i++) {
                twoTables.group0.push(i);
            }
            for (let i = 31; i < 255; i++) {
                twoTables.group1.push(i);
            }
            binCheck(21);
        })();
        //22
        (function () {
            gr = [0, 0, 0, 0, 0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 31; i++) {
                twoTables.group1.push(i);
            }
            for (let i = 31; i < 255; i++) {
                twoTables.group0.push(i);
            }
            binCheck(22);
        })();
        //23
        (function () {
            gr = [0, 0, 0, 0, 0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 31; i++) {
                twoTables.group0.push(i);
            }
            for (let i = 31; i < 255; i++) {
                twoTables.group1.push(i);
            }
            twoTables.group0.push(255);
            binCheck(23);
        })();
        //24
        (function () {
            gr = [0, 0, 0, 0, 0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 31; i++) {
                twoTables.group1.push(i);
            }
            for (let i = 31; i < 255; i++) {
                twoTables.group0.push(i);
            }
            twoTables.group1.push(255);
            binCheck(24);
        })();
        //25
        (function () {
            gr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 31; i++) {
                twoTables.group0.push(i);
            }
            for (let i = 31; i < 255; i++) {
                twoTables.group1.push(i);
            }
            twoTables.group0.push(255);
            twoTables.group1.push(256);
            binCheck(25);
        })();
        //26
        (function () {
            gr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 31; i++) {
                twoTables.group1.push(i);
            }
            for (let i = 31; i < 255; i++) {
                twoTables.group0.push(i);
            }
            twoTables.group1.push(255);
            twoTables.group0.push(256);
            binCheck(26);
        })();
        //27
        (function () {
            gr = [0, 0, 0, 0, 0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 33; i++) {
                twoTables.group1.push(i);
            }
            twoTables.group0.push(33);
            for (let i = 34; i < 255; i++) {
                twoTables.group1.push(i);
            }
            twoTables.group0.push(255);
            binCheck(27);
        })();
        //28
        (function () {
            gr = [0, 0, 0, 0, 0, 0, 0, 0];
            twoTables.group1 = [];
            twoTables.group0 = [];
            for (let i = 0; i < 33; i++) {
                twoTables.group0.push(i);
            }
            twoTables.group1.push(33);
            for (let i = 34; i < 255; i++) {
                twoTables.group0.push(i);
            }
            twoTables.group1.push(255);
            binCheck(28);
        })();

    }

    function binCheck(n) {

        let curItem = 0;
        let curBit = twoTables.group1[curItem];
        let nextBit = twoTables.group1[curItem];
        let shift = curBit;
        let number;
        for (let i = 0; i < gr.length; i++) {
            number = 0x0;

            while (nextBit < 32 * (i + 1)) {
                number <<= shift;
                number |= 0x1;
                curBit = twoTables.group1[curItem];
                nextBit = twoTables.group1[++curItem]
                shift = nextBit - curBit;
            }

            number <<= (31 - (curBit % 32));
            gr[gr.length - i - 1] = number;
        }

        let str = [];
        let str2 = [];
        let counter = 0;
        let fin = twoTables.group0.length + twoTables.group1.length - 1;
        for (let q = gr.length - 1; q >= 0; q--) {
            let shift = 31;
            let binNumber = (0x1 << shift);

            for (let i = 0; i < 32; i++) {

                if ((gr[q] & binNumber) === 0x0) {
                    str.push(counter);
                } else {
                    str2.push(counter);
                }

                counter++;
                binNumber = binNumber >>> 1;
                if (counter > fin)
                    break;
            }
        }

        console.log(`TEST ${n}: `, JSON.stringify(str) === JSON.stringify(twoTables.group0) &&
            JSON.stringify(str2) === JSON.stringify(twoTables.group1));
    }

    startBinTest();
}

export function studentPairTest() {
    const alpha = 1;
    const altHypTest = 'both';
    const data = {
        first: [56, 78, 93, 24, 38, 35, 29, 64],
        second: [70, 74, 88, 34, 61, 55, 32, 72]
    };
    const power = 95.00000959230226;

    const n = studentTest(alpha)
    console.log(n);
    console.log(studentTestInv(n));

    function studentTestInv(n) {
        const zAlpha = altHypTest === 'both' ? Math.norminv(alpha / 2) : Math.norminv(alpha);
        const differences = data.first.map((el, i) => el - data.second[i]);
        const d = Math.mean(differences);
        const sd = Math.stddiv.s(differences);
        const zB = (Math.sqrt(n - (zAlpha ** 2) / 2) * d) / sd - zAlpha;
        const power = 100 - Math.normdist(zB);

        return power;
    }

    function studentTest(alpha) {
        const zAlpha = altHypTest === 'both' ? Math.norminv(alpha / 2) : Math.norminv(alpha);
        const z = zAlpha + Math.norminv(100 - power);
        const differences = data.first.map((el, i) => el - data.second[i]);
        const d = Math.mean(differences);
        const sd = Math.stddiv.s(differences);
        const n = (z * sd / d) ** 2 + ((zAlpha ** 2) / 2);

        return n;
    }
}