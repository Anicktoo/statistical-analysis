import nominalImg from '@img/table/scaleNominal.png';
import continuesImg from '@img/table/scaleContinues.png';
import binaryImg from '@img/table/scaleBinary.png';
import rangImg from '@img/table/scaleRang.png';
import rangUnitedImg from '@img/table/scaleRangUnited.png';

export default class Var {
    static Binary = {
        name: 'binary',
        ruName: 'дихотомический',
        img: Object.getNameFromPath(binaryImg),
    };
    static Nominal = {
        name: 'nominal',
        ruName: 'номинативный',
        img: Object.getNameFromPath(nominalImg),
    };
    static Continues = {
        name: 'continues',
        ruName: 'количественный',
        img: Object.getNameFromPath(continuesImg),
    };
    static Rang = {
        name: 'rang',
        ruName: 'ранговый',
        img: Object.getNameFromPath(rangImg),
        imgU: Object.getNameFromPath(rangUnitedImg),
    };
    static Empty = {
        name: 'empty',
        ruName: 'пустой',
        img: null
    };

    static imgDir = Object.getDirFromPath(rangImg);

    static unitedRangs = [];
    static unitedOrder = [];
    static unitedSet = [];

    _typeName;
    _ruTypeName;
    _name;
    _id;
    _img;
    _set = [];
    _order = [];
    _binaryGroups = [];
    _onlyNumbers;
    _united;

    constructor(type, id, set, name, onlyNumbers) {
        this._united = false;
        if (type !== Var.Binary && type !== Var.Nominal &&
            type !== Var.Continues && type !== Var.Rang && type !== Var.Empty) {
            throw new Error('Данный тип данных не поддерживается приложением');
        }
        this._id = id;
        this._typeName = type.name;
        this._ruTypeName = type.ruName;
        this._name = name;
        if (type === Var.Empty) {
            return;
        }
        this._img = type.img;
        this._onlyNumbers = onlyNumbers;
        this._set = [...set].customSort(this._typeName === 'continues');
        this._order = new Array(set.size);
        for (let i = 0; i < set.size; i++) {
            this._order[i] = i;
        }
        this._binaryGroups = new Array(Math.ceil(set.size / 32)).fill(0);
        if (this._typeName === 'binary')
            this._binaryGroups[0] = (0x1 << 31);
    }

    static clearUnited() {
        Var.unitedRangs = [];
        Var.unitedOrder = [];
        Var.unitedSet = [];
    }

    static getGlobalSettings() {
        const unitedRangsIds = Var.unitedRangs.map(el => el.getID());

        return {
            unitedRangsIds,
            unitedOrder: Var.unitedOrder,
            unitedSet: Var.unitedSet,
        };
    }

    //CHECK IT
    static setGlobalSettingsWithObject(settingsObject, unitedVars) {
        Var.unitedRangs = unitedVars;
        Var.unitedOrder = settingsObject.unitedOrder;
        Var.unitedSet = settingsObject.unitedSet;
    }

    switchUnitedVar(on) {
        if (on) {
            this.showUnitedOrder();
        }
        else {
            this.showNormalOrder();
        }
    }

    showUnitedOrder() {
        if (!Var.unitedRangs[0]) {
            return;
        }
        const rangBody = uiControls.rangTable;
        const newSet = new Set([...Var.unitedRangs[0].getSet(), ...this._set]);
        const curSet = [...newSet].customSort(this.isOnlyNumbers() && Var.unitedRangs[0].isOnlyNumbers());
        Var.tmpSet = curSet;
        const curOrder = curSet.map((el, ind) => ind);
        let str = '';
        for (let i = 0; i < curSet.length; i++) {
            str += `
            <label class="var-table__item" data-order="${curOrder[i]}">
                <input type="radio" name="data_value">
                <span>${curSet[curOrder[i]]}</span>
            </label>`;
        }
        rangBody.innerHTML = str;
    }

    showNormalOrder() {
        const rangBody = uiControls.rangTable;
        const curOrder = this._order;
        const curSet = this._set;
        let str = '';
        for (let i = 0; i < curSet.length; i++) {
            str += `
            <label class="var-table__item" data-order="${curOrder[i]}">
                <input type="radio" name="data_value">
                <span>${curSet[curOrder[i]]}</span>
            </label>`;
        }
        rangBody.innerHTML = str;
    }

    addUnitedVar(order) {
        document.getElementById(this._id).querySelector('img').setAttribute('src', Var.imgDir + Var.Rang.imgU);
        Var.unitedOrder = order;
        this._united = true;

        if (Var.unitedRangs[0] === this || Var.unitedRangs[1] === this) {
            return;
        }
        Var.unitedRangs.push(this);
        const newSet = new Set([...Var.unitedRangs[0].getSet(), ...this._set]);
        Var.unitedSet = [...newSet].customSort(this.isOnlyNumbers() && Var.unitedRangs[0].isOnlyNumbers());
    }

    removeUnitedVar() {
        if (Var.unitedRangs[0] === this) {
            Var.unitedRangs.shift();
        }
        else if (Var.unitedRangs[1] === this) {
            Var.unitedRangs.pop();
        }
        else {
            return;
        }
        if (Var.unitedRangs[0]) {
            Var.unitedSet = Var.unitedRangs[0].getSet();
            Var.unitedOrder = Var.unitedRangs[0].getOrder();
        }
        else {
            Var.unitedSet = [];
            Var.unitedOrder = [];
        }
        this._united = false;
    }

    setSettingsWithObject(settingsObject) {
        const keys = Object.keys(settingsObject);
        for (let key of keys) {
            this[key] = settingsObject[key];
        }
        if (this._typeName === 'empty')
            return;
        const varHeader = document.getElementById(this._id);
        varHeader.nextElementSibling.textContent = this._name;
        if (this._united) {
            varHeader.querySelector('img').setAttribute('src', Var.imgDir + this._img);
        }
        else {
            varHeader.querySelector('img').setAttribute('src', Var.imgDir + this._img);
        }
    }

    setSettings(formData, order, twoTables) {
        const varHeader = document.getElementById(this._id);
        this._name = formData.get('var-name');
        varHeader.nextElementSibling.textContent = this._name;

        this._typeName = formData.get('var-type');
        this._img = Object.entries(Var).find(item => item[1]['name'] === this._typeName)[1]['img'];
        varHeader.querySelector('img').setAttribute('src', Var.imgDir + this._img);
        const isUnited = formData.get('unite');

        if (this._typeName === 'rang') {
            if (isUnited) {
                this._img = Var.Rang.imgU;
                this.addUnitedVar(order);
            }
            else {
                this.removeUnitedVar();
                this._order = order;
            }
            return;
        }

        this.removeUnitedVar();

        if (!twoTables.group1[0]) {
            this._binaryGroups.fill(0);
            return;
        }

        let curItem = 0;
        let curBit = twoTables.group1[curItem];
        let nextBit = twoTables.group1[curItem];
        let shift = curBit;
        let number;
        for (let i = 0; i < this._binaryGroups.length; i++) {
            number = 0x0;

            while (nextBit < 32 * (i + 1)) {
                number <<= shift;
                number |= 0x1;
                curBit = twoTables.group1[curItem];
                nextBit = twoTables.group1[++curItem]
                shift = nextBit - curBit;
            }

            number <<= (31 - (curBit % 32));
            this._binaryGroups[this._binaryGroups.length - i - 1] = number;
        }
    }

    createHTML() {
        const name = uiControls.modalVarType.querySelector('#modal-var-types__name');
        const continuesLabel = uiControls.modalVarType.querySelector('.modal-var-types__continues-container');
        const varChooseInputs = [...uiControls.modalVarType.querySelectorAll('.modal-var-types__item-input')];
        const rangBody = uiControls.rangTable;
        const binBodies = uiControls.binTables;
        uiControls.uniteCheckbox.dataset.id = this._id;

        name.value = this._name;
        name.setAttribute('value', this._name);


        if (!this._onlyNumbers) {
            continuesLabel.classList.add('radio-line_disabled');
            continuesLabel.firstElementChild.disabled = true;
        }
        else {
            continuesLabel.classList.remove('radio-line_disabled');
            continuesLabel.firstElementChild.disabled = false;
        }

        let str = '';
        let curOrder, curSet;

        if (this._united) {
            curOrder = Var.unitedOrder;
            curSet = Var.unitedSet;
            uiControls.uniteCheckbox.parentElement.classList.remove('disabled');
            uiControls.uniteCheckbox.checked = true;

        }
        else {
            curOrder = this._order;
            curSet = this._set;
            if (Var.unitedRangs.length === 2) {
                uiControls.uniteCheckbox.parentElement.classList.add('disabled');
            }
            else {
                uiControls.uniteCheckbox.parentElement.classList.remove('disabled');
            }
            uiControls.uniteCheckbox.checked = false;
        }

        for (let i = 0; i < curSet.length; i++) {
            str += `
            <label class="var-table__item" data-order="${curOrder[i]}">
                <input type="radio" name="data_value">
                <span>${curSet[curOrder[i]]}</span>
            </label>`;
        }
        rangBody.innerHTML = str;

        let str1 = '';
        let str2 = '';
        let counter = 0;
        let fin = this._set.length - 1;
        const getLabel = (counter, value) => {
            return `<label class="var-table__item" data-anchor=${counter}>
                        <input type="radio" name="data_value">
                        <span>${value}</span>
                    </label>`};
        const getAnchor = (counter) => `<div class='var-table__anchor var-table__anchor_${counter}'></div>`;
        for (let q = this._binaryGroups.length - 1; q >= 0; q--) {
            let shift = 31;
            let binNumber = (0x1 << shift);

            for (let i = 0; i < 32; i++) {
                if ((this._binaryGroups[q] & binNumber) === 0x0) {
                    str1 += getLabel(counter, this._set[counter]);
                } else {
                    str2 += getLabel(counter, this._set[counter]);
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
            if (element.value === this._typeName) {
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
        const indexInSet = this._set.indexOf(val);
        if (indexInSet === -1)
            return -1;
        const grLength = this._binaryGroups.length;

        const groupIndex = grLength - Math.floor(indexInSet / 32) - 1;
        if (groupIndex < 0) {
            return -1;
        }
        const bitIndex = indexInSet % 32;
        const bit = this._binaryGroups[groupIndex] >>> (31 - bitIndex);

        if (bit & 0x1 === 1) {
            return 1;
        }
        else {
            return 0;
        }
    }

    //resturns rang of value strating with 1
    getOrderOfVal(val) {
        const indexInSet = this._set.indexOf(val);
        if (indexInSet === -1)
            return -1;
        const order = this._order.indexOf(indexInSet);

        return order !== undefined ? order + 1 : -1;
    }

    static getOrderOfValUnited(val) {
        const indexInSet = Var.unitedSet.indexOf(val);
        if (indexInSet === -1)
            return -1;
        const order = Var.unitedOrder.indexOf(indexInSet);

        return order !== undefined ? order + 1 : -1;
    }

    isOnlyNumbers() {
        return this._onlyNumbers;
    }

    isUnited() {
        return this._united;
    }

    getID() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getImg() {
        return this._img;
    }

    getSet() {
        return this._set;
    }

    getOrder() {
        return this._order;
    }

    getTypeName() {
        return this._typeName;
    }

    getRuTypeName() {
        return this._ruTypeName;
    }
}