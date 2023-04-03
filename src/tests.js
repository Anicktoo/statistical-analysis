let gr;
let twoTables = {
    group1: [],
    group0: []
}

export default function startTest() {
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
        check(1);
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
        check(2);
    })();
    //3
    (function () {
        gr = [0];
        twoTables.group1 = [];
        twoTables.group0 = [0, 1, 2, 3, 4];
        check(3);
    })();
    //4
    (function () {
        gr = [0];
        twoTables.group1 = [0, 1];
        twoTables.group0 = [2, 3, 4];
        check(4);
    })();
    //5
    (function () {
        gr = [0];
        twoTables.group1 = [3, 4];
        twoTables.group0 = [0, 1, 2];
        check(5);
    })();
    //6
    (function () {
        gr = [0];
        twoTables.group1 = [0, 1, 4];
        twoTables.group0 = [2, 3];
        check(6);
    })();
    //7
    (function () {
        gr = [0];
        twoTables.group1 = [2, 3];
        twoTables.group0 = [0, 1, 4, 5];
        check(7);
    })();
    //8
    (function () {
        gr = [0];
        twoTables.group1 = [2, 3, 6, 7];
        twoTables.group0 = [0, 1, 4, 5];
        check(8);
    })();
    //9
    (function () {
        gr = [0];
        twoTables.group1 = [];
        twoTables.group0 = [0];
        check(9);
    })();
    //10
    (function () {
        gr = [0];
        twoTables.group1 = [0];
        twoTables.group0 = [];
        check(10);
    })();
    //11
    (function () {
        gr = [0];
        twoTables.group1 = [];
        twoTables.group0 = [];
        for (let i = 0; i <= 30; i++) {
            twoTables.group1.push(i);
        }
        check(11);
    })();
    //12
    (function () {
        gr = [0, 0];
        twoTables.group1 = [];
        twoTables.group0 = [];
        for (let i = 0; i <= 31; i++) {
            twoTables.group1.push(i);
        }
        check(12);
    })();
    //13
    (function () {
        gr = [0];
        twoTables.group1 = [];
        twoTables.group0 = [];
        for (let i = 0; i <= 30; i++) {
            twoTables.group0.push(i);
        }
        check(13);
    })();
    //14
    (function () {
        gr = [0, 0];
        twoTables.group1 = [];
        twoTables.group0 = [];
        for (let i = 0; i <= 31; i++) {
            twoTables.group0.push(i);
        }
        check(14);
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
        check(15);
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
        check(16);
    })();
    //17
    (function () {
        gr = [0, 0];
        twoTables.group1 = [];
        twoTables.group0 = [];
        for (let i = 0; i < 14; i++) {
            twoTables.group0.push(i);
        }
        for (let i = 14; i < 32; i++) {
            twoTables.group1.push(i);
        }
        check(17);
    })();
    //18
    (function () {
        gr = [0, 0];
        twoTables.group1 = [];
        twoTables.group0 = [];
        for (let i = 0; i < 14; i++) {
            twoTables.group1.push(i);
        }
        for (let i = 14; i < 32; i++) {
            twoTables.group0.push(i);
        }
        check(18);
    })();
    //19
    (function () {
        gr = [0, 0];
        twoTables.group1 = [];
        twoTables.group0 = [];
        for (let i = 0; i < 30; i++) {
            twoTables.group0.push(i);
        }
        for (let i = 30; i < 32; i++) {
            twoTables.group1.push(i);
        }
        check(19);
    })();
    //20
    (function () {
        gr = [0, 0];
        twoTables.group1 = [];
        twoTables.group0 = [];
        for (let i = 0; i < 30; i++) {
            twoTables.group1.push(i);
        }
        for (let i = 30; i < 32; i++) {
            twoTables.group0.push(i);
        }
        check(20);
    })();
    //21
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
        check(21);
    })();
    //22
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
        check(22);
    })();
    //23
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
        check(23);
    })();
    //24
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
        check(24);
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
        check(25);
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
        check(26);
    })();
    //27
    (function () {
        gr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
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
        check(27);
    })();
    //28
    (function () {
        gr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
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
        check(28);
    })();

}

function check(n) {

    let curItem = 0;
    let curBit = twoTables.group1[curItem];
    let nextBit = twoTables.group1[curItem];
    // let last = twoTables.group0[twoTables.group0.length - 1];
    let shift = curBit;
    let number;
    for (let i = 0; i < gr.length; i++) {
        number = 0;

        while (nextBit < 31 * (i + 1)) {
            number <<= shift;
            number |= 1;
            curBit = twoTables.group1[curItem];
            nextBit = twoTables.group1[curItem + 1]
            curItem++;
            shift = nextBit - curBit;
        }

        // if (nextBit) {
        number <<= (30 - (curBit % 31));
        // }
        // else {
        //     let lastInNumber = i === gr.length - 1 ? last : 30;
        //     if (last / i - curBit > 0) {
        //         number <<= last - curBit;
        //     }
        // }
        gr[gr.length - i - 1] = number;
    }

    // gr.forEach(el => {
    //     console.log(el, el.toString(2));
    // })

    let str = [];
    let str2 = [];
    let counter = 0;
    let fin = twoTables.group0.length + twoTables.group1.length - 1;
    for (let q = gr.length - 1; q >= 0; q--) {
        // let shift = q === 0 ? fin - counter : 30;
        let shift = 30;
        let binNumber = (0x1 << shift);

        for (let i = 0; i < 31; i++) {

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
    // console.log('gr0', str);
    // console.log('gr1', str2);

    console.log(`TEST ${n}: `, JSON.stringify(str) === JSON.stringify(twoTables.group0) &&
        JSON.stringify(str2) === JSON.stringify(twoTables.group1));
}