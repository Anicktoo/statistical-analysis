import './styles/style.scss';
import ModuleIntegrator from '@/ModuleIntegrator';
import DataControls from '@data/DataControls';
import img from './img/modulePair.png';
import AbstractModule from '@modules/AbstractModule';
import Var from '@data/Var';

export default class Module extends AbstractModule {

    static #name = 'Сравнение парных выборок';
    static #image = img;
    static comElements = {
        parametersContainer: document.querySelector('.parameters__container'),
        resultsContainer: document.querySelector('.results__container'),
        mainHypSelect: document.querySelector('#main-hypothesis')
    }
    static testText = {
        'student': 'Парный тест Стьюдента',
        'wilcoxon': 'Тест Уилкоксона',
        'sign': 'Тест знаков'
    }
    static altHypText = {
        'both': 'Двусторонняя проверка альтернативной гипотезы (M2 ≠ M1)',
        'right': 'Правосторонняя проверка альтернативной гипотезы (M2 &#62; M1)',
        'left': 'Левосторонняя проверка альтернативной гипотезы (M2 &#60; M1)',

    }
    #id;
    #data = {
        first: undefined,
        second: undefined
    }
    #power;
    #resultsTableData = {
        z: undefined,
        student: {
            d: undefined,
            sd: undefined,
        },
        sign: {
            p0: undefined,
            p1: undefined,
            p2: undefined,
        }
    }
    #testType;
    #inputType;
    #altHypTest;
    #vars = {
        first: undefined,
        second: undefined
    }

    #hypName;
    #element
    #form;
    #formSheet;
    #sheetSelect;
    #tableData;
    #resultBlock;

    constructor(id) {
        super();
        this.#id = id;
    }

    static getName() {
        return this.#name;
    }

    static getImage() {
        return this.#image;
    }

    getName() {
        return this.#hypName;
    }

    getFormSheet() {
        return this.#formSheet;
    }

    getSheetSelect() {
        return this.#sheetSelect;
    }

    addListeners(element) {
        const tables = element.querySelector('.paired-sample__tables');
        const switchBtn = tables.querySelector('.switch-button');
        const firstTable = tables.querySelector('.paired-sample__table-body');
        const tableData = tables.querySelector('.target-table-data');

        const insertChild = (item, toTable) => {
            const nextChild = toTable.querySelector('.var-table__anchor_' + item.dataset.varId);
            if (nextChild) {
                toTable.insertBefore(item, nextChild);
            }
        }

        switchBtn.addEventListener('click', () => {
            const checkedInput = tables.querySelector('input:checked');
            if (!checkedInput)
                return;
            const checkedItem = checkedInput.parentElement;
            const parentOfItem = checkedItem.parentElement;

            if (parentOfItem.isSameNode(tableData)) {
                parentOfItem.removeChild(checkedItem);
                insertChild(checkedItem, firstTable);
            }
            else {
                if (tableData.children.length === 2) {
                    // const removed = tableData.removeChild(tableData.firstElementChild);
                    // insertChild(removed, firstTable);
                    return;
                }
                parentOfItem.removeChild(checkedItem);
                tableData.appendChild(checkedItem);
            }

            ModuleIntegrator.setSettings(this.#id, this.#form, tableData);
        });
    }

    displayVarsOfSheet(sheetId) {
        const vars = DataControls.getVarsBySheetId(sheetId);
        if (!vars)
            return;
        const tableBody = this.#element.querySelector('.paired-sample__table-body');
        const tableSecondItem = this.#tableData;
        const arrOfIds = [];
        arrOfIds.push(tableSecondItem.firstElementChild?.dataset.varId);
        arrOfIds.push(tableSecondItem.lastElementChild?.dataset.varId);
        let strBody = '';
        vars.forEach(element => {
            const curVarID = element.getID();
            let stringElement = `
            <label title="${element.getName()}" class="var-table__item" data-var-id=${curVarID}>
                <input type="radio" name="data_value">
                <img src=${element.getImg()} alt="${element.getTypeName()}" class="var-table__img">
                <span>${element.getName()}</span>
            </label>`;

            if (!arrOfIds.includes(curVarID)) {
                strBody += stringElement;
            }
            strBody += `<div class='var-table__anchor var-table__anchor_${curVarID}'></div>`;
        });
        tableBody.innerHTML = strBody;
    }

    updateSelectedVarsVisual(sheetId) {
        // const tableSecond = this.#tableData;
        const tableData = this.#tableData;
        let curVars = [...tableData.querySelectorAll('label')];
        curVars.forEach((el => {
            const ids = el.dataset.varId.split('_');
            if (ids[1] == sheetId) {
                const v = DataControls.getVarBySheetIdAndVarId(ids[1], ids[2]);
                const elImg = el.querySelector('img');
                el.querySelector('span').innerHTML = v.getName();
                elImg.setAttribute('src', v.getImg());
                elImg.setAttribute('alt', v.getTypeName());
            }
        }));
    }

    clearSelectedVars() {
        this.#tableData.innerHTML = '';
    }

    createHTML() {
        const name = 'Гипотеза ' + (this.#id + 1);
        const parametersContainer = Module.comElements.parametersContainer;
        const resultsContainer = Module.comElements.resultsContainer;
        const mainHypSelect = Module.comElements.mainHypSelect;
        const newHyp = document.createElement('div');
        const newRes = document.createElement('div');
        const newOption = document.createElement('option');
        newHyp.classList.add('parameters__item', 'collapsible', 'paired-sample');
        newRes.classList.add('results__block');
        newOption.setAttribute('value', this.#id);
        const htmlParam = `
        <label class="collapsible__head">
            <input class="collapsible__input" type="checkbox" checked>
            <div class="parameters__head">
                <div class="parameters__title-container">
                    <div class="collapsible__symbol"></div>
                    <h2 class="parameters__title">${name}</h2>
                </div>
                <div class="parameters__extra-container">
                    <button title="Изменить название гипотезы"
                        class="parameters__extra-item parameters__edit-button main-button"></button>
                    <label title="Убрать гипотезу из вычислений"
                        class="parameters__extra-item parameters__hide-button main-button">
                        <input type="checkbox">
                    </label>
                    <button title="Дублировать гипотезу"
                        class="parameters__extra-item parameters__duplicate-button main-button"></button>
                    <button title="Удалить гипотезу"
                        class="parameters__extra-item parameters__delete-button main-button"></button>
                </div>
            </div>
        </label>
        <div class="collapsible__content">
            <div class="parameters__content">
            <form id="module-option-form_${this.#id}" class="module-option-form"></form>
                <div class="option-block">
                    <p>Метод проверки: Сравнение парных выборок</p>
                    <div class="option-block__sub">
                        Тип ввода
                        <div class="option-block__list">
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger manual-input-off" type="radio" name="input-type" value="data" form="module-option-form_${this.#id}"
                                    checked>
                                <span>Вычисление по данным</span>
                            </label>
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger manual-input-on" type="radio" name="input-type" value="manual" form="module-option-form_${this.#id}">
                                <span>Ввести величину эффекта</span>
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__student option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                Средняя разность (d):
                                <input type="number" class="main-input main-input_number form-change-trigger" name="d" value="1" step="0.1" min="0" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                Стандартное отклонение (sd):
                                <input type="number" class="main-input main-input_number form-change-trigger" name="sd" value="1" step="0.1" min="0" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__sign option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Доля нулевых разностей (&#961;<sub>&#965;</sub>):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger" name="p0" value="0" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Доля положительных разностей (&#961;<sub>1</sub>):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger" name="p1" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__tables paired-sample__tables">
                        <div class="var-table">
                            <div class="var-table__header">
                                <form id="sheet-form-${this.#id}" class="sheet-form">
                                    <div class="main-select">
                                       <select class="main-input paired-sample__sheet-select sheet-select" name="sheet-select"></select>
                                    </div>
                                </form>
                            </div>
                            <div class="var-table__body paired-sample__table-body"></div>
                        </div>
                        <div class="paired-sample__switch-container">
                            <div class="switch-button switch-button_right">
                                <div class="switch-button__symbol"></div>
                            </div>
                        </div>
                        <div class="var-table">
                            <div class="var-table__header">Парные переменные</div>
                            <div class="var-table__body paired-sample__table-body">
                                <div class="paired-sample__item target-table-data">
                                    
                                </div>
                                <div class="paired-sample__delimiter"></div>
                            </div>
                        </div>
                    </div>
                    <div class="option-block__two-column">
                        <div class="option-block">
                            <div class="option-block__sub">
                                Тест
                                <div class="option-block__list option-block__test-type">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio" name="test-type"
                                            value="student" form="module-option-form_${this.#id}" checked>
                                        <span>Стьюдента</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio" name="test-type"
                                            value="wilcoxon" form="module-option-form_${this.#id}">
                                        <span>Уилкоксона</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio" name="test-type"
                                            value="sign" form="module-option-form_${this.#id}">
                                        <span>Тест знаков</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="option-block">
                            <div class="option-block__sub">
                                Проверка альтернативной гипотезы
                                <div class="option-block__list">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio" name="hyp-check"
                                            value="both" form="module-option-form_${this.#id}" checked>
                                        <span>Двусторонняя (M1 ≠ M2)</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio" name="hyp-check"
                                            value="right" form="module-option-form_${this.#id}">
                                        <span>Правосторонняя (M2 &#62; M1)</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio" name="hyp-check"
                                            value="left" form="module-option-form_${this.#id}">
                                        <span>Левосторонняя (M2 &#60; M1)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        newHyp.innerHTML = htmlParam;
        newOption.textContent = name;
        parametersContainer.appendChild(newHyp);
        resultsContainer.appendChild(newRes);
        mainHypSelect.appendChild(newOption);
        this.#element = newHyp;
        this.#form = newHyp.querySelector('.module-option-form');
        this.#formSheet = newHyp.querySelector('.sheet-form');
        this.#sheetSelect = newHyp.querySelector('.sheet-select');
        this.#tableData = newHyp.querySelector('.target-table-data');
        this.#resultBlock = newRes;
        this.#hypName = name;
        return { newHyp, newRes };
    }

    setSettings() {
        const formData = new FormData(this.#form);
        const tableData = this.#tableData;
        this.#testType = formData.get('test-type');
        this.#altHypTest = formData.get('hyp-check');
        this.#inputType = formData.get('input-type');
        switch (this.#testType) {
            case 'student': {
                if (this.#inputType === 'manual') {
                    this.#resultsTableData.student.d = Number(formData.get('d'));
                    this.#resultsTableData.student.sd = Number(formData.get('sd'));
                }
                else {
                    this.#resultsTableData.student.d = null;
                    this.#resultsTableData.student.sd = null;
                }
                break;
            }
            case 'sign': {
                if (this.#inputType === 'manual') {
                    this.#resultsTableData.sign.p0 = Number(formData.get('p0'));
                    this.#resultsTableData.sign.p1 = Number(formData.get('p1'));
                }
                else {
                    this.#resultsTableData.sign.p0 = null;
                    this.#resultsTableData.sign.p1 = null;
                    this.#resultsTableData.sign.p2 = null;
                }
                break;
            }
        }
        this.#resultsTableData.z = null;

        const data = [];
        this.#data.first = null;
        this.#data.second = null;
        const vars = [];
        this.#vars.first = null;
        this.#vars.second = null;
        if (tableData) {
            const selectedVars = [...tableData?.children];
            if (selectedVars.length == 2) {
                selectedVars.forEach(el => {
                    const ids = el.dataset.varId.split('_');
                    data.push(DataControls.getDataBySheetAndVarId(ids[1], ids[2]).slice(1));
                    vars.push(DataControls.getVarBySheetIdAndVarId(ids[1], ids[2]));
                });
                this.#data.first = data[0];
                this.#data.second = data[1];
                this.#vars.first = vars[0];
                this.#vars.second = vars[1];
            }
        }
    }

    getN(alpha, power) {
        if (!alpha || Number.isNaN(alpha) || typeof alpha !== 'number') {
            return null;
        }
        if (!power || Number.isNaN(power) || typeof power !== 'number') {
            return;
        }
        return this.#testChoose(false, alpha, power);
    }

    setStatPower(alpha, sampleSize) {
        if (!alpha || Number.isNaN(alpha) || typeof alpha !== 'number') {
            return null;
        }
        if (!sampleSize || Number.isNaN(sampleSize) || typeof sampleSize !== 'number') {
            return;
        }
        this.#power = this.#testChoose(true, alpha, sampleSize);
    }

    #testChoose(isInv, alpha, arg) {

        let firstVarName, secondVarName;
        let errorElement;

        if (this.#inputType !== 'manual') {
            errorElement = this.#tableData;

            if (!this.#data.first || !this.#data.second) {
                return;
            }
            firstVarName = this.#vars.first.getTypeName();
            secondVarName = this.#vars.second.getTypeName();
            if (firstVarName !== secondVarName) {
                UIControls.showError(errorElement, 'Нельзя сравнить данные разного типа');
                return;
            }
            if (this.#data.first.length !== this.#data.second.length) {
                UIControls.showError(errorElement, 'Выбранные наборы данных имеют разный размер');
                return;
            }

        }
        else {
            errorElement = this.#element;
        }

        let returnValue;
        try {
            switch (this.#testType) {
                case 'student': {
                    if (this.#inputType !== 'manual' && firstVarName !== Var.Continues.name) {
                        errorElement = this.#tableData;
                        throw new Error(errorText([Var.Continues.ruName]));
                    }
                    if (isInv) {
                        returnValue = this.#studentTestInv(alpha, arg);
                    }
                    else {
                        returnValue = this.#studentTest(alpha, arg);
                    }
                    break;
                }
                case 'sign': {
                    if (this.#inputType !== 'manual' && firstVarName === Var.Nominal.name) {
                        errorElement = this.#tableData;
                        throw new Error(errorText([Var.Continues.ruName, Var.Rang.ruName, Var.Binary.ruName]));
                    }
                    if (isInv) {
                        returnValue = this.#signTestInv(alpha, arg);
                    }
                    else {
                        returnValue = this.#signTest(alpha, arg);
                    }
                    break;
                }
            }
        }
        catch (err) {
            UIControls.showError(errorElement, err.message);
            return;
        }

        return returnValue;

        function errorText(varTypeNameArray) {
            return `Выбранный тест поддерживает следующий тип данных: ${varTypeNameArray.join(', ')}`;
        }
    }

    #studentTest(alpha, power) {
        let d, sd;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);
        const z = this.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            d = this.#resultsTableData.student.d;
            sd = this.#resultsTableData.student.sd;
        }
        else {
            const differences = this.#data.first.map((el, i) => {
                if (el === '' || this.#data.second[i] === '')
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения')
                return el - this.#data.second[i];
            });
            d = Math.abs(Math.mean(differences));
            sd = Math.stddiv.s(differences);
        }
        if (d === 0) {
            throw new Error('Средняя разность равна нулю. Проверьте, что сравниваются разные наборы данных')
        }

        const n = (z * sd / d) ** 2 + ((zAlpha ** 2) / 2);

        if (n === undefined || Number.isNaN(n)) {
            throw new Error('Ошибка расчета данных');
        }

        this.#resultsTableData.z = z;
        this.#resultsTableData.student.d = d;
        this.#resultsTableData.student.sd = sd;

        return n;
    }

    #studentTestInv(alpha, n) {
        let d, sd;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            d = this.#resultsTableData.student.d;
            sd = this.#resultsTableData.student.sd;
        }
        else {
            const differences = this.#data.first.map((el, i) => {
                if (el === '' || this.#data.second[i] === '')
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения')
                return el - this.#data.second[i];
            });
            d = Math.abs(Math.mean(differences));
            sd = Math.stddiv.s(differences);
        }

        if (d === 0) {
            throw new Error('Средняя разность равна нулю. Проверьте, что сравниваются разные наборы данных')
        }

        let z = (Math.sqrt(n - ((zAlpha ** 2) / 2)) * d) / sd * -1;
        if (z > 0) {
            z *= -1;
        }
        const zB = z - zAlpha;
        const power = 100 - Math.normdist(zB);

        if (power === undefined || Number.isNaN(power)) {
            throw new Error('Ошибка расчета данных');
        }

        this.#resultsTableData.z = z;
        this.#resultsTableData.student.d = d;
        this.#resultsTableData.student.sd = sd;

        return power;
    }

    #signTest(alpha, power) {
        let p0, p1, p2;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);
        const z = this.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            p0 = this.#resultsTableData.sign.p0;
            p1 = this.#resultsTableData.sign.p1;
        }
        else {
            const signs = this.#signTestGetListOfNumberOfSigns(this.#vars.first.getTypeName());
            const dataLength = signs[1] + signs[2];
            p0 = signs[0] / this.#data.first.length;
            p1 = signs[1] / dataLength;
        }

        p2 = 1 - p1;

        const n = (z ** 2) / (4 * (1 - p0) * ((p1 - 0.5) ** 2));

        if (n === undefined || Number.isNaN(n)) {
            throw new Error('Ошибка расчета данных');
        }

        this.#resultsTableData.z = z;
        this.#resultsTableData.sign.p0 = p0;
        this.#resultsTableData.sign.p1 = p1;
        this.#resultsTableData.sign.p2 = p2;

        return n;
    }

    #signTestInv(alpha, n) {
        let p0, p1, p2;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            p0 = this.#resultsTableData.sign.p0;
            p1 = this.#resultsTableData.sign.p1;
        }
        else {
            const signs = this.#signTestGetListOfNumberOfSigns(this.#vars.first.getTypeName());
            const dataLength = signs[1] + signs[2];
            p0 = signs[0] / this.#data.first.length;
            p1 = signs[1] / dataLength;
        }
        p2 = 1 - p1;

        let z = Math.sqrt(n * 4 * ((p1 - 0.5) ** 2) * (1 - p0));
        if (z > 0) {
            z *= -1;
        }
        const zB = z - zAlpha;
        const power = 100 - Math.normdist(zB);

        if (power === undefined || Number.isNaN(power)) {
            throw new Error('Ошибка расчета данных');
        }

        this.#resultsTableData.z = z;
        this.#resultsTableData.sign.p0 = p0;
        this.#resultsTableData.sign.p1 = p1;
        this.#resultsTableData.sign.p2 = p2;

        return power;
    }

    // returns list of number of 0-s, positive and negative differences
    #signTestGetListOfNumberOfSigns(type) {
        const list = [0, 0, 0];
        let callback;
        let firstDataColumn;
        let secondDataColumn;

        if (type === 'binary') {
            callback = this.#vars.first.isValInZeroGroup;
        }
        else if (type === 'rang') {
            callback = this.#vars.first.getOrderOfVal;
        }

        if (type === 'continues') {
            firstDataColumn = this.#data.first;
            secondDataColumn = this.#data.second;
        }
        else {
            firstDataColumn = getColumnOfAdaptedVals(this.#data.first, this.#vars.first, callback);
            secondDataColumn = getColumnOfAdaptedVals(this.#data.second, this.#vars.second, callback);
        }

        console.log(firstDataColumn, secondDataColumn);

        firstDataColumn.forEach((el, index) => {
            if (el === '' || secondDataColumn[index] === '')
                throw new Error('Невозможно обработать набор данных, имеются пропущенные значения')
            const dif = el - secondDataColumn[index];
            if (dif === 0) {
                list[0]++;
            }
            else if (dif > 0) {
                list[1]++;
            }
            else if (dif < 0) {
                list[2]++;
            }
        });

        return list;

        function getColumnOfAdaptedVals(data, curVar, callback) {
            return data.map(el => {
                const group = callback.call(curVar, el);
                if (group === -1)
                    throw new Error('Ошибка вычислений');
                else {
                    return group;
                }
            });
        }
    }

    updateResultsHtml(isMain) {
        const name = this.#hypName;
        const powerString = isMain ? `<p><b>Основная гипотеза</b></p>` : `<p>Статистическая мощность: ${Number.resultForm(this.#power)}%</p>`;
        let table;
        if (this.#testType === 'student') {
            table = `<thead>
                        <tr>
                            <th>
                                M1
                            </th>
                            <th>
                                M2
                            </th>
                            <th>
                                d mean
                            </th>
                            <th>
                                sd
                            </th>
                            <th>
                                z
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                ${String.resultForm(this.#vars.first?.getName())}
                            </td>
                            <td>
                                ${String.resultForm(this.#vars.second?.getName())}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.student.d)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.student.sd)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.z)}
                            </td>
                        </tr >
                    </tbody >`;
        }
        else if (this.#testType === 'sign') {
            table = `<thead>
                        <tr>
                            <th>
                                M1
                            </th>
                            <th>
                                M2
                            </th>
                            <th>
                                &#961;<sub>&#965;</sub>
                            </th>
                            <th>
                                &#961;<sub>1</sub>
                            </th>
                            <th>
                                &#961;<sub>2</sub>
                            </th>
                            <th>
                                z
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                ${String.resultForm(this.#vars.first?.getName())}
                            </td>
                            <td>
                                ${String.resultForm(this.#vars.second?.getName())}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.sign.p0)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.sign.p1)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.sign.p2)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.z)}
                            </td>
                        </tr >
                    </tbody >`;
        }
        const htmlRes = `
        <h2>${name}</h2>
        <div class="results__block-inner">
            ${powerString}
            <p>Сравнение парных выборок</p>
            <p>${Module.testText[this.#testType]}</p>
            ${Module.altHypText[this.#altHypTest]}
            <table class="results__table">
                <caption><small>${this.#inputType === 'manual' ? 'Данные введены вручную' : ''}</small>
                </caption>
                ${table}
            </table >
        </div > `;

        this.#resultBlock.innerHTML = htmlRes;
    }
}