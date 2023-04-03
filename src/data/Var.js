import nominalImg from '@img/table/scaleNominal.png';
import continuesImg from '@img/table/scaleContinues.png';
import binaryImg from '@img/table/scaleBinary.png';
import rangImg from '@img/table/scaleRang.png';
import UIControls from '../UIControls';

export default class Var {
    static Binary = {
        name: 'binary',
        img: binaryImg,
    };
    static Nominal = {
        name: 'nominal',
        img: nominalImg,
    };
    static Continues = {
        name: 'continues',
        img: continuesImg,
    };
    static Rang = {
        name: 'rang',
        img: rangImg,
    };

    #typeName;
    #name;
    #id;
    #img;
    #set = [];
    #order = [];
    #grouping;
    #onlyNumbers;

    constructor(type, id, set, name, onlyNumbers) {
        this.#typeName = type.name;
        this.#img = type.img;
        this.#id = id;
        this.#name = name;
        this.#onlyNumbers = onlyNumbers;
        this.#set = [...set].sort();
        this.#order = new Array(set.size);
        for (let i = 0; i < set.size; i++) {
            this.#order[i] = i;
        }
        this.#grouping = new Array(Math.ceil(set.size / 31)).fill(0);
        if (this.#typeName === 'binary')
            this.#grouping[0] = 1;
    }

    setSettings(formData, order, twoTables) {
        const varHeader = document.getElementById(this.#id);

        this.#name = formData.get('var-name');
        varHeader.nextElementSibling.textContent = this.#name;

        this.#typeName = formData.get('var-type');
        console.log(Object.entries(Var));

        this.#img = Object.entries(Var).find(item => item[1]['name'] === this.#typeName)[1]['img'];
        varHeader.querySelector('img').setAttribute('src', this.#img);

        this.#order = order;

        if (!twoTables.group1[0]) {
            this.#grouping.fill(0);
            return;
        }

        let curBit = 0;
        let nextBit = 0;
        let shift = 0;
        let curItem = 0;
        let number = 0;
        for (let i = 0; i < this.#grouping.length; i++) {

            curBit = twoTables.group1[curItem];
            // nextBit = twoTables.group1[curItem + 1];
            shift = curBit;
            number = 0;

            while (curBit >= 32 * (i + 1)) {
                number <<= shift;
                number |= 1;
                curItem++;
                curBit = twoTables.group1[curItem];
                nextBit = twoTables.group1[curItem + 1]
                shift = nextBit - curBit;
            }
        }


        // let curBit = 0;
        // let nextBit = 0;
        // let shift = 0;
        // let curItem = 0;
        // let number = 0;
        // for (let i = 0; i < this.#grouping.length; i++) {
        //     number = 0;
        //     while (curBit) {
        //         number |= 1;
        //         curBit = twoTables.group1[curItem];
        //         nextBit = twoTables.group1[curItem + 1];
        //         if (nextBit >= 64 * (i + 1)) {
        //             break;
        //         }
        //         curItem++;
        //         shift = nextBit - curBit;
        //         number <<= shift;
        //     }
        // }
    }
    createHTML() {
        const modal = UIControls.modalVarType;
        const name = UIControls.modalVarType.querySelector('#modal-var-types__name');
        const continuesLabel = UIControls.modalVarType.querySelector('.modal-var-types__continues-container');
        const varChooseInputs = [...UIControls.modalVarType.querySelectorAll('.modal-var-types__item-input')];
        const rangBody = modal.querySelector('.modal-var-types__rang-table-body');
        const binBodies = [...modal.querySelectorAll('.modal-var-types__binary-table-body')];

        name.value = this.#name;
        name.setAttribute('value', this.#name);

        varChooseInputs.forEach(element => {
            element.checked = element.value === this.#typeName;
        });
        if (!this.#onlyNumbers) {
            continuesLabel.classList.add('radio-line_disabled');
            continuesLabel.firstElementChild.disabled = true;
        }
        else {
            continuesLabel.classList.remove('radio-line_disabled');
            continuesLabel.firstElementChild.disabled = false;
        }

        let str = '';
        for (let i = 0; i < this.#set.length; i++) {
            str += `
            <label class="var-table__item" data-order="${this.#order[i]}">
                <input type="radio" name="data_value">
                <span>${this.#set[this.#order[i]]}</span>
            </label>`;
        }
        rangBody.innerHTML = str;

        str = '';
        let str2 = '';
        let counter = this.#set.length - 1;
        const getLabel = (counter, value) => {
            return `<label class="var-table__item" data-anchor=${counter}>
                        <input type="radio" name="data_value">
                        <span>${value}</span>
                    </label>`};
        const getAnchor = (counter) => `<div class='var-table__anchor var-table__anchor_${counter}'></div>`;

        for (let q = this.#grouping.length - 1; q >= 0; q--) {
            let binNumber = this.#grouping[q];

            for (let i = 0; i < 32; i++) {

                str = getAnchor(counter) + str;
                str2 = getAnchor(counter) + str2;

                if ((binNumber & 1) === 0) {
                    str = getLabel(counter, this.#set[counter]) + str;
                } else {
                    str2 = getLabel(counter, this.#set[counter]) + str2;
                }

                counter--;
                binNumber = binNumber >>> 1;
                if (counter < 0)
                    break;
            }
        }

        binBodies[0].innerHTML = str;
        binBodies[1].innerHTML = str2;

    }

    getID() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getImg() {
        return this.#img;
    }
}