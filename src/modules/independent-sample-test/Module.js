import img from './img/moduleIndependent.png';
import ModuleIntegrator from '@/ModuleIntegrator';
import DataControls from '@data/DataControls';
import AbstractModule from '@modules/AbstractModule';
import Var from '@data/Var';

export default class Module extends AbstractModule {

    static #name = 'Сравнение независимых выборок';
    static #image = img;
    static comElements = {
        parametersContainer: document.querySelector('.parameters__container'),
        resultsContainer: document.querySelector('.results__container'),
        mainHypSelect: document.querySelector('#main-hypothesis')
    }
    static testText = {
        'fisher': 'Точный тест фишера',
        'mann': 'Тест Манна-Уитни',
        'student': 'Независимый тест Стьюдента'
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
        fisher: {
            // p0: undefined,
            // p1: undefined,
            // p2: undefined,
        }
    }
    #testType;
    #inputType;
    #altHypTest;
    #vars = {
        dep: undefined,
        indep: undefined
    }

    #hypName;
    #element
    #form;
    #formSheet;
    #sheetSelect;
    #tableData = {
        indepTable: undefined,
        depTable: undefined
    };
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
        const [switch1, switch2] = [...element.querySelectorAll('.switch-button')];
        const leftTable = element.querySelector('.grouping-var__table-body');
        const depTable = element.querySelector('.grouping-var__dependent-table-body');
        const indepTable = element.querySelector('.grouping-var__independent-table-body');

        const insertChild = (item, toTable) => {
            const nextChild = toTable.querySelector('.var-table__anchor_' + item.dataset.varId);
            if (nextChild) {
                toTable.insertBefore(item, nextChild);
            }
        }

        const swapItem = function (secondTable) {
            const checkedInput = leftTable.querySelector('input:checked') || secondTable.querySelector('input:checked');
            if (!checkedInput)
                return;
            const checkedItem = checkedInput.parentElement;
            const parentOfItem = checkedItem.parentElement;
            if (parentOfItem.isSameNode(secondTable)) {
                parentOfItem.removeChild(checkedItem);
                insertChild(checkedItem, leftTable);
            }
            else {
                if (secondTable.children.length === 1) {
                    return;
                }
                parentOfItem.removeChild(checkedItem);
                secondTable.appendChild(checkedItem);
            }

            if (depTable.firstElementChild && indepTable.firstElementChild) {
                ModuleIntegrator.setSettings(this.#id, this.#form, { depTable, indepTable });
            }
        }

        switch1.addEventListener('click', swapItem.bind(this, depTable));
        switch2.addEventListener('click', swapItem.bind(this, indepTable));
    }

    displayVarsOfSheet(sheetId) {
        const vars = DataControls.getVarsBySheetId(sheetId);
        if (!vars)
            return;
        const tableBody = this.#element.querySelector('.grouping-var__table-body');
        const { depTable, indepTable } = this.#tableData;
        const dep = depTable.firstElementChild;
        const indep = indepTable.firstElementChild;
        const arrOfIds = [];
        arrOfIds.push(dep?.dataset.varId);
        arrOfIds.push(indep?.dataset.varId);
        let strBody = '';
        vars.forEach(element => {
            const curVarID = element.getID();
            let stringElement = `
            <label class="var-table__item" data-var-id=${curVarID}>
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
        const tableData = this.#tableData;
        let curVars = [tableData.depTable?.firstElementChild, tableData.indepTable?.firstElementChild];
        curVars.forEach((el => {
            if (el) {
                const ids = el.dataset.varId.split('_');
                if (ids[1] == sheetId) {
                    const v = DataControls.getVarBySheetIdAndVarId(ids[1], ids[2]);
                    const elImg = el.querySelector('img');
                    el.querySelector('span').innerHTML = v.getName();
                    elImg.setAttribute('src', v.getImg());
                    elImg.setAttribute('alt', v.getTypeName());
                }
            }
        }));
    }

    clearSelectedVars() {
        this.#tableData.depTable.innerHTML = '';
        this.#tableData.indepTable.innerHTML = '';
    }

    createHTML() {
        const name = 'Гипотеза ' + (this.#id + 1);
        const parametersContainer = Module.comElements.parametersContainer;
        const resultsContainer = Module.comElements.resultsContainer;
        const mainHypSelect = Module.comElements.mainHypSelect;
        const newHyp = document.createElement('div');
        const newRes = document.createElement('div');
        const newOption = document.createElement('option');
        newHyp.classList.add('parameters__item', 'collapsible', 'grouping-var');
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
                    <p>Метод проверки: Сравнение независимых выборок</p>
                    <div class="option-block__sub">
                        Тип ввода
                        <div class="option-block__list">
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger" type="radio" name="input-type"
                                    value="data" form="module-option-form_${this.#id}" checked>
                                <span>Вычисление по данным</span>
                            </label>
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger" type="radio" name="input-type"
                                    value="manual" form="module-option-form_${this.#id}">
                                <span>Ввести величину эффекта</span>
                            </label>
                        </div>
                    </div>
                    <div class="option-block__tables grouping-var__tables">
                        <div class="var-table">
                            <div class="var-table__header">
                                <form id="sheet-form-${this.#id}" class="sheet-form">
                                    <div class="main-select">
                                        <select
                                            class="main-input grouping-var__sheet-select sheet-select"
                                            name="sheet-select"></select>
                                    </div>
                                </form>
                            </div>
                            <div class="var-table__body grouping-var__table-body">
                            </div>
                        </div>
                        <div class="grouping-var__tables-and-switches">
                            <div class="grouping-var__container">
                                <div class="grouping-var__switch-container">
                                    <div class="switch-button switch-button_right">
                                        <div class="switch-button__symbol"></div>
                                    </div>
                                </div>
                                <div class="var-table">
                                    <div class="var-table__header">Зависимая переменная</div>
                                    <div class="var-table__body grouping-var__dependent-table-body">
                                    </div>
                                </div>
                            </div>
                            <div class="grouping-var__container">
                                <div class="grouping-var__switch-container">
                                    <div class="switch-button switch-button_right">
                                        <div class="switch-button__symbol"></div>
                                    </div>
                                </div>
                                <div class="var-table">
                                    <div class="var-table__header">Группировка по переменной</div>
                                    <div class="var-table__body grouping-var__independent-table-body">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="option-block__two-column">
                        <div class="option-block">
                            <div class="option-block__sub">
                                Тест
                                <div class="option-block__list">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio"
                                            name="test-type" value="fisher"
                                            form="module-option-form_${this.#id}" checked>
                                        <span>Точный тест Фишера</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio"
                                            name="test-type" value="mann"
                                            form="module-option-form_${this.#id}">
                                        <span>Манна-Уитни</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio"
                                            name="test-type" value="student"
                                            form="module-option-form_${this.#id}">
                                        <span>Стьюдента</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="option-block">
                            <div class="option-block__sub">
                                Проверка альтернативной гипотезы
                                <div class="option-block__list">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio"
                                            name="hyp-check" value="both"
                                            form="module-option-form_${this.#id}" checked>
                                        <span>Двусторонняя (M1 ≠ M2)</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio"
                                            name="hyp-check" value="right"
                                            form="module-option-form_${this.#id}">
                                        <span>Правосторонняя (M2 &#62; M1)</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio"
                                            name="hyp-check" value="left"
                                            form="module-option-form_${this.#id}">
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
        this.#tableData.indepTable = newHyp.querySelector('.grouping-var__independent-table-body');
        this.#tableData.depTable = newHyp.querySelector('.grouping-var__dependent-table-body');
        this.#resultBlock = newRes;
        this.#hypName = name;
        return { newHyp, newRes };
    }

    //!
    setSettings() {
        const formData = new FormData(this.#form);
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
            case 'fisher': {
                // if (this.#inputType === 'manual') {
                //     this.#resultsTableData.sign.p0 = Number(formData.get('p0'));
                //     this.#resultsTableData.sign.p1 = Number(formData.get('p1'));
                // }
                // else {
                //     this.#resultsTableData.sign.p0 = null;
                //     this.#resultsTableData.sign.p1 = null;
                //     this.#resultsTableData.sign.p2 = null;
                // }
                break;
            }
        }
        this.#resultsTableData.z = null;

        const data = [];
        this.#data.first = null;
        this.#data.second = null;
        const vars = [];
        this.#vars.dep = null;
        this.#vars.indep = null;

        const tableData = this.#tableData;
        const dep = tableData.depTable.firstElementChild;
        const indep = tableData.indepTable.firstElementChild;
        const selectedVars = [dep, indep];

        if (dep && indep) {
            selectedVars.forEach(el => {
                const ids = el.dataset.varId.split('_');
                data.push(DataControls.getDataBySheetAndVarId(ids[1], ids[2]).slice(1));
                vars.push(DataControls.getVarBySheetIdAndVarId(ids[1], ids[2]));
            });
            this.#data.first = data[0];
            this.#data.second = data[1];
            this.#vars.dep = vars[0];
            this.#vars.indep = vars[1];
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

    //!
    #testChoose(isInv, alpha, arg) {
        let depVarName, indepVarName;
        let errorElement;
        let data1 = [], data2 = [];

        if (this.#inputType !== 'manual') {

            if (!this.#data.first || !this.#data.second) {
                return;
            }
            errorElement = this.#tableData.indepTable;

            depVarName = this.#vars.first.getTypeName();
            indepVarName = this.#vars.second.getTypeName();

            if (indepVarName !== Var.Binary.name) {
                UIControls.showError(errorElement, 'Переменная для группировки должна быть дихотомического типа');
                return;
            }
            if (this.#data.first.length !== this.#data.second.length) {
                UIControls.showError(errorElement, 'Размеры данных зависимой переменной и переменной для группировки должны совпадать');
                return;
            }

            //ПРОВЕРИТЬ !!!!!!!!!!!!!!
            const indepVar = this.#vars.indep;
            this.#data.first.forEach((el, ind) => {
                const group = indepVar.isValInZeroGroup(this.#data.second[ind]);
                if (group === 0) {
                    data1.push(el);
                }
                else if (group === 1) {
                    data2.push(el);
                }
                else {
                    UIControls.showError(errorElement, 'Ошибка вычисления');
                    return;
                }
            });
        }
        else {
            errorElement = this.#element;
            data1 = null, data2 = null;
        }

        let returnValue;
        try {
            switch (this.#testType) {
                case 'student': {
                    // if (this.#inputType !== 'manual' && depVarName !== Var.Binary.name) {
                    //     errorElement = this.#tableData.depTable;
                    //     throw new Error(errorText([Var.Binary.ruName]));
                    // }
                    // if (isInv) {
                    //     returnValue = this.#studentTestInv(alpha, arg);
                    // }
                    // else {
                    //     returnValue = this.#studentTest(alpha, arg);
                    // }
                    break;
                }
                case 'fisher': {
                    if (this.#inputType !== 'manual' && depVarName === Var.Binary.name) {
                        errorElement = this.#tableData.depTable;
                        throw new Error(errorText([Var.Binary.ruName]));
                    }

                    if (isInv) {
                        returnValue = this.#fisherTestInv(alpha, arg, data1, data2);
                    }
                    else {
                        returnValue = this.#fisherTest(alpha, arg, data1, data2);
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

    //!
    #studentTest(alpha, power) {
        let d, sd;
        const zAlpha = this.getZAlpha(alpha);
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

    //!
    #studentTestInv(alpha, n) {
        let d, sd;
        const zAlpha = this.getZAlpha(alpha);

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

    #fisherTest(alpha, power, data1, data2) {
        const zAlpha = this.getZAlpha(alpha);
        const z = this.getZ(zAlpha, power);


    }

    #fisherTestInv(alpha, n, data1, data2) {

    }

    updateResultsHtml(isMain) {
        const name = this.#hypName;
        const powerString = isMain ? `<p><b>Основная гипотеза</b></p>` : `<p>Статистическая мощность: ${Number.resultForm(this.#power)}%</p>`;
        let table;
        if (this.#testType === 'student') {
            table = `<thead>
                        <tr>
                            <th>
                                Зависимая переменная
                            </th>
                            <th>
                                Переменная для группировки
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
                                ${String.resultForm(this.#vars.dep?.getName())}
                            </td>
                            <td>
                                ${String.resultForm(this.#vars.indep?.getName())}
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
        else if (this.#testType === 'fisher') {
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