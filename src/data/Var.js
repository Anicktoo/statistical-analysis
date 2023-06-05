import nominalImg from '@img/table/scaleNominal.png';
import continuesImg from '@img/table/scaleContinues.png';
import binaryImg from '@img/table/scaleBinary.png';
import rangImg from '@img/table/scaleRang.png';
import rangUnitedImg from '@img/table/scaleRangUnited.png';
import dataControls from '@data/dataControls';

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

    _unionLoaded = false;
    _unionSaved = false;
    _toRemoveUnion = false;
    _tmpUnitedPair = undefined;
    _tmpUnitedObj = {
        unitedOrder: [],
        unitedSet: [],
    };
    _unitedPair = undefined;
    _unitedObj = {
        unitedOrder: [],
        unitedSet: [],
    };

    _typeName;
    _ruTypeName;
    _name;
    _id;
    _img;
    _set = [];
    _order = [];
    _binaryGroups = [];
    _onlyNumbers;

    constructor(type, id, set, name, onlyNumbers) {
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

    removeUnion() {
        const rangBody = uiControls.rangTable;
        let str = '';
        for (let i = 0; i < this._set.length; i++) {
            str += `
            <label class="var-table__item" data-order="${this._order[i]}">
            <input type="radio" name="data_value">
            <span>${this._set[this._order[i]]}</span>
            </label>`;
        }
        rangBody.innerHTML = str;
        this._tmpUnitedObj = {};
        this._tmpUnitedPair = null;
        this._toRemoveUnion = true;
        uiControls.varTypesUniteBtn.parentElement.classList.remove('hidden');
        uiControls.varTypesUnitedContainer.classList.add('hidden');
    }

    setUnionWithAnotherVar(varObj) {
        const varSet = varObj.getSet();
        const newSet = new Set([...this._set, ...varSet])
        const newSetArray = [...newSet].customSort(this.isOnlyNumbers() && varObj.isOnlyNumbers());
        const newOrder = newSetArray.map((el, ind) => ind);
        this._tmpUnitedObj.unitedOrder = newOrder;
        this._tmpUnitedObj.unitedSet = newSetArray;
        this._tmpUnitedPair = varObj;
        this._toRemoveUnion = false;

        const rangBody = uiControls.rangTable;
        let str = '';
        for (let i = 0; i < newSetArray.length; i++) {
            str += `
            <label class="var-table__item" data-order="${newOrder[i]}">
            <input type="radio" name="data_value">
            <span>${newSetArray[newOrder[i]]}</span>
            </label>`;
        }
        rangBody.innerHTML = str;

        uiControls.varTypesUniteBtn.parentElement.classList.add('hidden');
        uiControls.varTypesUnitedContainer.classList.remove('hidden');
        const name = this._tmpUnitedPair.getName();
        uiControls.varTypesUnitedName.textContent = name;
        uiControls.varTypesUnitedName.parentElement.setAttribute('title', name);
    }

    setUnionWithObject(varObj, unitedObj) {
        this._unitedPair = varObj;
        this._unitedObj = unitedObj;
    }

    clearUnited(fromVar) {
        if (!fromVar && this._unitedPair) {
            this._unitedPair.setType(Var.Rang);
            this._unitedPair.clearUnited(true);
        }
        this._tmpUnitedPair = null;
        this._tmpUnitedObj = {};
        this._unitedPair = null;
        this._unitedObj = {};
    }

    static refreshVarsOfUniteModal(vars, curId) {

        const tableBody = uiControls.uniteTableBody;

        const createElementsStr = () => {
            let strBody = '';
            vars.forEach(element => {
                const curVarID = element.getID();
                if (curVarID === curId || element.isUnited()) {
                    return;
                }
                let stringElement = `
                <label title="${element.getName()}" class="var-table__item var-table__item_${curVarID}" data-var-id=${curVarID}>
                <input type="radio" name="unite_data_value" form="unite-form" value="${curVarID}">
                <img src=${element.getImg()} alt="${element.getTypeName()}" class="var-table__img">
                <span>${element.getName()}</span>
                </label>
                <div class='var-table__anchor var-table__anchor_${curVarID}'></div>`;

                strBody += stringElement;
            });
            return strBody;
        }

        tableBody.innerHTML = createElementsStr();
    }

    static addSheetOptions(listOfSheets) {
        const arrOfOptions = [];
        for (let el of listOfSheets) {
            if (!uiControls.sheetSelectUnite.querySelector(`.select-option-${el.id}`)) {
                const option = document.createElement('option');
                option.classList.add(`select-option-${el.id}`);
                option.value = el.id;
                option.textContent = el.name;
                arrOfOptions.push(option);
            }
        }

        uiControls.sheetSelectUnite.append(...arrOfOptions);
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
        varHeader.querySelector('img').setAttribute('src', Var.imgDir + this._img);

        if (this._unitedPair && !this._unionLoaded) {
            const ids = this._unitedPair.split('_');
            const pair = dataControls.getVarBySheetIdAndVarId(ids[1], ids[2]);
            pair.setPair(this);
            pair.setUnitedObject(this._unitedObj);
            pair.setUnionLoaded();
            this._unitedPair = pair;
        }

        this._unionLoaded = false;
    }

    setSettings(formData, order, twoTables) {
        const varHeader = document.getElementById(this._id);
        this._name = formData.get('var-name');
        varHeader.nextElementSibling.textContent = this._name;

        const typeName = formData.get('var-type');
        const type = Object.entries(Var).find(item => item[1]['name'] === typeName)[1];
        this.setType(type);

        if (this._typeName === 'rang') {
            //add union
            if (this._tmpUnitedPair && this._tmpUnitedPair !== this._unitedPair) {
                if (this._unitedPair) {
                    this._unitedPair.clearUnited(true);
                    this._unitedPair.setType(Var.Rang);
                }
                this._unitedObj.unitedOrder = order;
                this._unitedObj.unitedSet = this._tmpUnitedObj.unitedSet;
                this._unitedPair = this._tmpUnitedPair;
                this._unitedPair.setUnionWithObject(this, this._unitedObj);
                this.setImg(Var.Rang.imgU)
                this._unitedPair.setType(Var.Rang);
                this._unitedPair.setImg(Var.Rang.imgU);
                const pairVarEl = document.getElementById(this._unitedPair.getID());
                pairVarEl.querySelector('img').setAttribute('src', Var.imgDir + Var.Rang.imgU);
            }
            //remove union
            else if (this._toRemoveUnion) {
                this._order = order;
                this.clearUnited();
            }
            //keep union
            else if (this._unitedPair) {
                this._unitedObj.unitedOrder = order;
                this.setImg(Var.Rang.imgU);
            }
            //keep ordinary
            else {
                this._order = order;
            }
            return;
        }

        this.clearUnited();

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
        const uni = this._unitedObj;
        this._toRemoveUnion = false;
        this._tmpUnitedPair = null;
        this._tmpUnitedObj = {};

        if (this.isUnited()) {
            curOrder = uni.unitedOrder;
            curSet = uni.unitedSet;
            uiControls.varTypesUniteBtn.parentElement.classList.add('hidden');
            uiControls.varTypesUnitedContainer.classList.remove('hidden');
            uiControls.varTypesUnitedName.textContent = this._unitedPair.getName();
        }
        else {
            curOrder = this._order;
            curSet = this._set;
            uiControls.varTypesUnitedContainer.classList.add('hidden');
            uiControls.varTypesUniteBtn.parentElement.classList.remove('hidden');
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

    getOrderOfValUnited(val) {
        const indexInSet = this._unitedObj.unitedSet.indexOf(val);
        if (indexInSet === -1)
            return -1;
        const order = this._unitedObj.unitedOrder.indexOf(indexInSet);

        return order !== undefined ? order + 1 : -1;
    }

    isOnlyNumbers() {
        return this._onlyNumbers;
    }

    isUnited() {
        return !!this._unitedPair;
    }

    isUnitedWith(varObj) {
        return this._unitedPair === varObj;
    }

    getData() {
        const pairObj = this._unitedPair;
        this._unitedPair = null;
        this._tmpUnitedPair = null;
        const obj = Object.deepCopy(this);
        this._unitedPair = pairObj;
        delete obj._toRemoveUnion;
        delete obj._tmpUnitedPair;
        delete obj._tmpUnitedObj;
        delete obj._unionLoaded;
        delete obj._unionSaved;

        if (this.isUnited()) {
            if (this._unionSaved) {
                delete obj._unitedPair;
                delete obj._unitedObj;
                this._unionSaved = false;
            }
            else {
                this._unitedPair.setUnionSaved();
                obj._unitedPair = this._unitedPair.getID();
            }
        }
        else {
            delete obj._unitedPair;
            delete obj._unitedObj;
        }

        return obj;
    }

    setPair(varObj) {
        this._unitedPair = varObj;
    }

    setUnitedObject(varObj) {
        this._unitedObj = varObj;
    }

    setUnionLoaded() {
        this._unionLoaded = true;
    }

    setUnionSaved() {
        this._unionSaved = true;
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

    setType(type) {
        this._typeName = type.name;
        this._ruTypeName = type.ruName;
        this.setImg(type.img);
    }

    setImg(img) {
        this._img = img;
        document.getElementById(this._id).querySelector('img').setAttribute('src', Var.imgDir + this._img);
    }

    getTypeName() {
        return this._typeName;
    }

    getRuTypeName() {
        return this._ruTypeName;
    }
}