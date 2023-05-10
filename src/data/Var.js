import nominalImg from '@img/table/scaleNominal.png';
import continuesImg from '@img/table/scaleContinues.png';
import binaryImg from '@img/table/scaleBinary.png';
import rangImg from '@img/table/scaleRang.png';

export default class Var {
    static Binary = {
        name: 'binary',
        ruName: 'дихотомический',
        img: binaryImg,
    };
    static Nominal = {
        name: 'nominal',
        ruName: 'номинативный',
        img: nominalImg,
    };
    static Continues = {
        name: 'continues',
        ruName: 'количественный',
        img: continuesImg,
    };
    static Rang = {
        name: 'rang',
        ruName: 'ранговый',
        img: rangImg,
    };

    #typeName;
    #ruTypeName;
    #name;
    #id;
    #img;
    #set = [];
    #order = [];
    #binaryGroups;
    #onlyNumbers;

    constructor(type, id, set, name, onlyNumbers) {
        if (type !== Var.Binary && type !== Var.Nominal &&
            type !== Var.Continues && type !== Var.Rang)
            throw new Error('Данный тип данных не поддерживается приложением');
        this.#typeName = type.name;
        this.#img = type.img;
        this.#ruTypeName = type.ruName;
        this.#id = id;
        this.#name = name;
        this.#onlyNumbers = onlyNumbers;
        let sortFunction = this.#typeName !== 'continues' ?
            undefined : function (a, b) {
                return a - b;
            };
        this.#set = [...set].sort(sortFunction);
        this.#order = new Array(set.size);
        for (let i = 0; i < set.size; i++) {
            this.#order[i] = i;
        }
        this.#binaryGroups = new Array(Math.ceil(set.size / 32)).fill(0);
        if (this.#typeName === 'binary')
            this.#binaryGroups[0] = (0x1 << 30);
    }

    setSettings(formData, order, twoTables) {
        const varHeader = document.getElementById(this.#id);

        this.#name = formData.get('var-name');
        varHeader.nextElementSibling.textContent = this.#name;

        this.#typeName = formData.get('var-type');
        this.#img = Object.entries(Var).find(item => item[1]['name'] === this.#typeName)[1]['img'];
        varHeader.querySelector('img').setAttribute('src', this.#img);

        this.#order = order;

        if (!twoTables.group1[0]) {
            this.#binaryGroups.fill(0);
            return;
        }

        let curItem = 0;
        let curBit = twoTables.group1[curItem];
        let nextBit = twoTables.group1[curItem];
        let shift = curBit;
        let number;
        for (let i = 0; i < this.#binaryGroups.length; i++) {
            number = 0x0;

            while (nextBit < 32 * (i + 1)) {
                number <<= shift;
                number |= 0x1;
                curBit = twoTables.group1[curItem];
                nextBit = twoTables.group1[++curItem]
                shift = nextBit - curBit;
            }

            number <<= (31 - (curBit % 32));
            this.#binaryGroups[this.#binaryGroups.length - i - 1] = number;
        }
    }
    createHTML() {
        const modal = uiControls.modalVarType;
        const name = uiControls.modalVarType.querySelector('#modal-var-types__name');
        const continuesLabel = uiControls.modalVarType.querySelector('.modal-var-types__continues-container');
        const varChooseInputs = [...uiControls.modalVarType.querySelectorAll('.modal-var-types__item-input')];
        const rangBody = modal.querySelector('.modal-var-types__rang-table-body');
        const binBodies = [...modal.querySelectorAll('.modal-var-types__binary-table-body')];

        name.value = this.#name;
        name.setAttribute('value', this.#name);


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

        let str1 = '';
        let str2 = '';
        let counter = 0;
        let fin = this.#set.length - 1;
        const getLabel = (counter, value) => {
            return `<label class="var-table__item" data-anchor=${counter}>
                        <input type="radio" name="data_value">
                        <span>${value}</span>
                    </label>`};
        const getAnchor = (counter) => `<div class='var-table__anchor var-table__anchor_${counter}'></div>`;
        for (let q = this.#binaryGroups.length - 1; q >= 0; q--) {
            let shift = 31;
            let binNumber = (0x1 << shift);

            for (let i = 0; i < 32; i++) {
                if ((this.#binaryGroups[q] & binNumber) === 0x0) {
                    str1 += getLabel(counter, this.#set[counter]);
                } else {
                    str2 += getLabel(counter, this.#set[counter]);
                }

                str1 += getAnchor(counter);
                str2 += getAnchor(counter);

                counter++;
                binNumber = binNumber >>> 1;
                if (counter > fin)
                    break;
            }
        }

        binBodies[0].innerHTML = str1;
        binBodies[1].innerHTML = str2;

        binBodies.forEach(binEl => [...binEl.querySelectorAll('.var-table__item')].forEach(el =>
            el.querySelector('input').addEventListener('change', switchChange.bind(this, el))
        ));

        varChooseInputs.forEach(element => {
            if (element.value === this.#typeName) {
                element.click();
            }
        });

        function switchChange(el) {
            if (binBodies[1].isSameNode(el.parentElement)) {
                uiControls.varTypesSwitchBtn.classList.replace('switch-button_right', 'switch-button_left');
            }
            else {
                uiControls.varTypesSwitchBtn.classList.replace('switch-button_left', 'switch-button_right');
            }
        }
    }

    //returns 0 if zero group, 1 if in first, -1 if val is not in the set 
    isValInZeroGroup(val) {
        const indexInSet = this.#set.indexOf(val);
        if (indexInSet === -1)
            return -1;
        const grLength = this.#binaryGroups.length;

        const groupIndex = grLength - Math.floor(indexInSet / 32) - 1;
        if (groupIndex < 0) {
            return -1;
        }
        const bitIndex = indexInSet % 32;
        const bit = this.#binaryGroups[groupIndex] >>> (31 - bitIndex);

        if (bit & 0x1 === 1) {
            return 1;
        }
        else {
            return 0;
        }
    }

    getOrderOfVal(val) {
        const indexInSet = this.#set.indexOf(val);
        if (indexInSet === -1)
            return -1;
        const order = this.#order.indexOf(indexInSet);

        return order !== undefined ? order : -1;
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

    getTypeName() {
        return this.#typeName;
    }

    getRuTypeName() {
        return this.#ruTypeName;
    }
}