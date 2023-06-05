import img from './img/modulePair.png';
import moduleIntegrator from '@/moduleIntegrator';
import dataControls from '@data/dataControls';
import AbstractModule from '@modules/AbstractModule';
import Var from '@data/Var';

export default class Module extends AbstractModule {

    static #name = 'Сравнение парных выборок';
    static #image = img;
    static #moduleTypeId = null;

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
        second: undefined,
    }
    #power;
    #resultsTableData = {
        z: undefined,
        sign: {
            p0: undefined,
            p1: undefined,
            p2: undefined,
        },
        wilcoxon: {
            v: undefined,
        },
        student: {
            d: undefined,
            sd: undefined,
        },

    }
    #testType;
    #inputType;
    #altHypTest;
    #vars = {
        first: undefined,
        second: undefined,
    }

    #hypName;
    #element
    #form;
    #formSheets = [];
    #sheetSelects = [];
    #tableData = {
        pair: undefined,
    };
    #tableTwoEl
    #resultBlock;
    #switch;

    constructor(id, reference = null) {
        super();
        this.#id = id;

        if (reference) {
            this.#makeCopy(reference);
        }
    }

    static setModuleTypeId(id) {
        Module.#moduleTypeId = id;
    }

    static getModuleTypeId() {
        return Module.#moduleTypeId;
    }

    static getName() {
        return Module.#name;
    }

    static getImage() {
        return Module.#image;
    }

    deleteSelf() {
        uiControls.parametersContainer.removeChild(this.#element);
        uiControls.resultsContainer.removeChild(this.#resultBlock);
    }

    #makeCopy(reference) {
        const refData = reference.getAllData();
        this.#data = refData.data;
        this.#power = refData.power;
        this.#resultsTableData = refData.resultsTableData;
        this.#testType = refData.testType;
        this.#inputType = refData.inputType;
        this.#altHypTest = refData.altHypTest;
        this.#vars = refData.vars;
        this.#hypName = refData.hypName;

        const newHyp = refData.element.cloneNode(true);
        const newRes = document.createElement('div');
        newRes.classList.add('results__block');

        this.#setElements(newHyp, newRes);

        const optFormEl = this.#element.querySelector('#module-option-form_' + refData.id)
        optFormEl.setAttribute('id', 'module-option-form_' + this.#id);
        optFormEl.dataset.id = this.#id;
        [...this.#element.querySelectorAll('.form-change-trigger_' + refData.id)].forEach(el => {
            el.classList.replace('form-change-trigger_' + refData.id, 'form-change-trigger_' + this.#id);
            el.setAttribute('form', 'module-option-form_' + this.#id);
        });
        uiControls.parametersContainer.insertBefore(this.#element, refData.element.nextElementSibling);
        uiControls.resultsContainer.insertBefore(this.#resultBlock, refData.resultBlock.nextElementSibling);
    }

    getAllData(forSaving) {
        const data = {};
        data.hypName = this.#hypName;
        data.inputType = this.#inputType;
        data.testType = this.#testType;
        data.altHypTest = this.#altHypTest;
        data.resultsTableData = Object.deepCopy(this.#resultsTableData);
        if (forSaving) {
            data.moduleTypeId = Module.#moduleTypeId;
            data.varIds = [this.#vars.first?.getID(), this.#vars.second?.getID()];
            return data;
        }
        data.element = this.#element;
        data.resultBlock = this.#resultBlock;
        data.vars = Object.assign({}, this.#vars);
        data.power = this.#power;
        data.data = Object.assign({}, this.#data);
        data.id = this.#id;
        return data;
    }

    setId(id) {
        const oldId = this.#id;
        const optFormEl = this.#element.querySelector('#module-option-form_' + oldId)
        optFormEl.setAttribute('id', 'module-option-form_' + id);
        optFormEl.dataset.id = id;
        [...this.#element.querySelectorAll('.form-change-trigger_' + oldId)].forEach(el => {
            el.classList.replace('form-change-trigger_' + oldId, 'form-change-trigger_' + id);
            el.setAttribute('form', 'module-option-form_' + id);
        });
        this.#id = id;
    }

    setLoadingData(inputType, testType, altHypTest, resultsTableData, selectedVars) {

        const manualCheck = (blockClass, chosenValue) => {
            const inputs = [...this.#element.querySelector('.option-block__' + blockClass).querySelectorAll(`input`)];
            inputs.forEach(el => {
                if (el.value == chosenValue) {
                    el.click();
                }
            });
        };

        const manualInput = (testName, values) => {
            const block = this.#element.querySelector('.option-block__' + testName);
            values.forEach(el => {
                const name = `input[name='${el[0]}']`;
                const input = block.querySelector(name);
                if (input && el[1] !== null && el[1] !== undefined) {
                    input.value = el[1];
                }
            });
        };

        this.#inputType = inputType;
        this.#testType = testType;
        this.#altHypTest = altHypTest;
        this.#resultsTableData = resultsTableData;

        manualCheck('input-type', inputType);
        manualCheck('test-type', testType);
        manualCheck('hyp-check', altHypTest);

        for (let key in this.#resultsTableData) {
            if (key === 'z')
                continue;
            manualInput(key, Object.entries(this.#resultsTableData[key]));
        }

        if (this.#inputType === 'manual' || (!selectedVars[0] && !selectedVars[1])) {
            return;
        }
        const ids1 = selectedVars[0].split('_');
        const ids2 = selectedVars[1].split('_');
        const switchVar = (sheetId, typeName, tableEl, varFullId, switchEl) => {
            this.displayVarsOfSheet(sheetId, typeName);
            const element = tableEl.querySelector('.var-table__item_' + varFullId);
            element.click();
            switchEl.click();
        };
        switchVar(ids1[1], 'two-column-var', this.#tableTwoEl, selectedVars[0], this.#switch);
        switchVar(ids2[1], 'two-column-var', this.#tableTwoEl, selectedVars[1], this.#switch);

    }

    setName(name) {
        this.#hypName = name;
        this.#element.querySelector('.parameters__title').textContent = name;
        this.#resultBlock.querySelector('.results__header').textContent = name;
    }

    getName() {
        return this.#hypName;
    }

    getElement() {
        return this.#element;
    }

    getResultElement() {
        return this.#resultBlock;
    }

    getFormSheets() {
        return this.#formSheets;
    }

    getSheetSelects() {
        return this.#sheetSelects;
    }

    setSheetOptions(listOfSheets) {
        let str = '';
        for (let el of listOfSheets) {
            const option = `<option class='select-option-${el.id}' value="${el.id}">${el.name}</option>`
            str += option;
        }

        for (let select of this.#sheetSelects) {
            select.innerHTML = str;
        }
    }

    addSheetOptions(listOfSheets) {
        const arrOfOptions = [];
        for (let el of listOfSheets) {
            if (!this.#sheetSelects[0].querySelector(`.select-option-${el.id}`)) {
                const option = document.createElement('option');
                option.classList.add(`select-option-${el.id}`);
                option.value = el.id;
                option.textContent = el.name;
                arrOfOptions.push(option);
            }
        }

        this.#sheetSelects.forEach(el => {
            const arrOfOptionsClone = arrOfOptions.map(el => el.cloneNode(true));
            el.append(...arrOfOptionsClone);
        });
    }

    addListeners(element) {
        const tableTwo = this.#tableTwoEl;
        const switch0 = tableTwo.querySelector('.switch-button');
        const firstTable = tableTwo.querySelector('.two-column-var__table-body');
        const tableData = tableTwo.querySelector('.target-table-data');

        this.#switch = switch0;

        const insertChild = (item, toTable) => {
            const nextChild = toTable.querySelector('.var-table__anchor_' + item.dataset.varId);
            if (nextChild) {
                toTable.insertBefore(item, nextChild);
            }
        }

        const callSettings = () => {
            if (tableData.children.length === 2) {
                moduleIntegrator.setSettings(this.#id);
            }
        }

        const swapItem = function (firstTable, secondTable, maxItemsInSecondTable, switchEl) {
            const checkedInput = firstTable.querySelector('input:checked') || secondTable.querySelector('input:checked');
            if (!checkedInput)
                return;
            const checkedItem = checkedInput.parentElement;
            const parentOfItem = checkedItem.parentElement;
            if (parentOfItem.isSameNode(secondTable)) {
                parentOfItem.removeChild(checkedItem);
                insertChild(checkedItem, firstTable);
                switchEl.classList.replace('switch-button_left', 'switch-button_right');
            }
            else {
                if (secondTable.children.length === maxItemsInSecondTable) {
                    return;
                }
                parentOfItem.removeChild(checkedItem);
                secondTable.appendChild(checkedItem);
                switchEl.classList.replace('switch-button_right', 'switch-button_left');
            }

            callSettings();
        }

        switch0.addEventListener('click', swapItem.bind(this, firstTable, tableData, 2, switch0));
    }

    displayVarsOfSheet(sheetId, type) {
        const vars = dataControls.getVarsBySheetId(sheetId);
        if (!vars)
            return;

        let tableBody;
        let arrOfIds = [];

        if (type === 'two-column-var') {
            tableBody = this.#element.querySelector('.two-column-var__table-body');
            const tableSecondItem = this.#tableData.pair;
            arrOfIds.push(tableSecondItem.firstElementChild?.dataset.varId);
            arrOfIds.push(tableSecondItem.lastElementChild?.dataset.varId);
            tableBody.innerHTML = createElementsStr();
            const switchChange = (el) => {
                const var1 = this.#tableData.pair.firstElementChild;
                const var2 = this.#tableData.pair.lastElementChild;
                if (var1?.dataset.varId !== el.dataset.varId && var2?.dataset.varId !== el.dataset.varId) {
                    this.#switch.classList.replace('switch-button_left', 'switch-button_right');
                }
                else {
                    this.#switch.classList.replace('switch-button_right', 'switch-button_left');
                }
            }
            [...tableBody.querySelectorAll('.var-table__item')].forEach(el =>
                el.querySelector('input').addEventListener('change', switchChange.bind(this, el))
            );
        }

        function createElementsStr() {
            let strBody = '';
            vars.forEach(element => {
                const curVarID = element.getID();
                let stringElement = `
                <label title="${element.getName()}" class="var-table__item var-table__item_${curVarID}" data-var-id=${curVarID}>
                    <input type="radio" name="data_value">
                    <img src=${element.getImg()} alt="${element.getTypeName()}" class="var-table__img">
                    <span>${element.getName()}</span>
                </label>`;

                if (!arrOfIds.includes(curVarID)) {
                    strBody += stringElement;
                }
                strBody += `<div class='var-table__anchor var-table__anchor_${curVarID}'></div>`;
            });
            return strBody;
        }
    }

    updateSelectedVarsVisual(sheetId) {

        const curVarsUpdate = (curVars) => {
            curVars.forEach((el => {
                if (el) {
                    const ids = el.dataset.varId.split('_');
                    if (ids[1] == sheetId) {
                        const v = dataControls.getVarBySheetIdAndVarId(ids[1], ids[2]);
                        if (!v) {
                            this.#tableData.pair.removeChild(el);
                            return;
                        }
                        const elImg = el.querySelector('img');
                        el.querySelector('span').innerHTML = v.getName();
                        elImg.setAttribute('src', v.getImg());
                        elImg.setAttribute('alt', v.getTypeName());
                    }
                }
            }));
        }

        let tableData = this.#tableData.pair;
        let curVars = [...tableData.querySelectorAll('label')];
        curVarsUpdate(curVars);
    }

    clearSelectedVars() {
        this.#tableData.pair.innerHTML = '';
    }

    createHTML() {
        const name = 'Гипотеза ' + (this.#id + 1);
        const parametersContainer = uiControls.parametersContainer;
        const resultsContainer = uiControls.resultsContainer;
        const newHyp = document.createElement('div');
        const newRes = document.createElement('div');
        newHyp.classList.add('parameters__item', 'collapsible');
        newRes.classList.add('results__block');
        const htmlParam = `
        <label class="collapsible__head">
            <input class="collapsible__input" type="checkbox" checked>
            <div class="parameters__head">
                <div class="parameters__title-container">
                    <div class="collapsible__symbol collapsible__symbol_checked"></div>
                    <h2 class="parameters__title">${name}</h2>
                    <input class="parameters__title-input hidden" type='text'>
                </div>
                <div class="parameters__extra-container">
                    <button title="Изменить название гипотезы"
                        class="extra extra_edit-button main-button"></button>
                    <label title="Убрать гипотезу из вычислений"
                        class="extra extra_hide-button main-button">
                        <input type="checkbox">
                    </label>
                    <button title="Дублировать гипотезу"
                        class="extra extra_duplicate-button main-button"></button>
                    <button title="Удалить гипотезу"
                        class="extra extra_delete-button main-button"></button>
                </div>
            </div>
        </label>
        <div class="collapsible__content collapsible__content_checked">
            <div class="parameters__content">
            <form id="module-option-form_${this.#id}" class="module-option-form" data-id=${this.#id}></form>
                <div class="option-block">
                    <p>Метод проверки: Сравнение парных выборок</p>
                    <div class="option-block__sub">
                        Тип ввода
                        <div class="option-block__list option-block__input-type">
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger form-change-trigger_${this.#id} data-input-two" type="radio" name="input-type" value="data-input-two" form="module-option-form_${this.#id}"
                                    checked>
                                <span>Вычисление по данным (два столбца)</span>
                            </label>
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger form-change-trigger_${this.#id} manual-input-on" type="radio" name="input-type" value="manual" form="module-option-form_${this.#id}">
                                <span>Ввести величину эффекта</span>
                            </label>
                        </div>
                    </div>
                    <div class="option-block__two-column">
                        <div class="option-block">
                            <div class="option-block__sub">
                                Тест
                                <div class="option-block__list option-block__test-type">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="test-type"
                                            value="sign" form="module-option-form_${this.#id}" checked>
                                        <span>Тест знаков</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="test-type"
                                            value="wilcoxon" form="module-option-form_${this.#id}">
                                        <span>Уилкоксона</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="test-type"
                                            value="student" form="module-option-form_${this.#id}">
                                        <span>Стьюдента</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="option-block">
                            <div class="option-block__sub">
                                Проверка альтернативной гипотезы
                                <div class="option-block__list option-block__hyp-check">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="hyp-check"
                                            value="both" form="module-option-form_${this.#id}" checked>
                                        <span>Двусторонняя (M1 ≠ M2)</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="hyp-check"
                                            value="right" form="module-option-form_${this.#id}">
                                        <span>Правосторонняя (M2 &#62; M1)</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="hyp-check"
                                            value="left" form="module-option-form_${this.#id}">
                                        <span>Левосторонняя (M2 &#60; M1)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="option-block__sub option-block__manual-input option-block__student option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Средняя разность ( d&#772; ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="d" value="1" step="0.1" min="0" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Стандартное отклонение разностей ( s<sub>d</sub> ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="sd" value="1" step="0.1" min="0" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__wilcoxon option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Величина эффекта ( v ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="v" value="0.01" step="0.01" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__sign option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Доля нулевых разностей ( &#961;<sub>&#965;</sub> ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p0" value="0" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Доля положительных разностей ( &#961;<sub>1</sub> ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p1" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>


                    <div class="option-block__tables two-column-var">
                        <div class="var-table">
                            <div class="var-table__header">
                                <form class="sheet-form" data-type="two-column-var">
                                    <div class="main-select">
                                       <select class="main-input two-column-var__sheet-select sheet-select" name="sheet-select"></select>
                                    </div>
                                </form>
                            </div>
                            <div class="var-table__body two-column-var__table-body"></div>
                        </div>
                        <div class="two-column-var__switch-container">
                            <div class="switch-button switch-button_right">
                                <div class="switch-button__symbol"></div>
                            </div>
                        </div>
                        <div class="var-table">
                            <div class="var-table__header">Парные переменные</div>
                            <div class="var-table__body two-column-var__table-body">
                                <div class="two-column-var__item target-table-data">
                                </div>
                                <div class="two-column-var__delimiter"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        newHyp.innerHTML = htmlParam;
        this.#setElements(newHyp, newRes);
        this.#hypName = name;
        parametersContainer.appendChild(newHyp);
        resultsContainer.appendChild(newRes);
    }

    #setElements(newHyp, newRes) {
        this.#element = newHyp;
        this.#form = newHyp.querySelector('.module-option-form');
        this.#formSheets = [...newHyp.querySelectorAll('.sheet-form')];
        this.#sheetSelects = [...newHyp.querySelectorAll('.sheet-select')];
        this.#tableData.pair = newHyp.querySelector('.target-table-data');
        this.#tableTwoEl = newHyp.querySelector('.two-column-var');
        this.#resultBlock = newRes;
    }

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
            case 'wilcoxon': {
                if (this.#inputType === 'manual') {
                    this.#resultsTableData.wilcoxon.v = Number(formData.get('v'));
                }
                else {
                    this.#resultsTableData.wilcoxon.v = null;
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
                }
                this.#resultsTableData.sign.p2 = null;
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

        if (this.#inputType !== 'manual') {

            const tableData = this.#tableData;
            let selectedVars;
            let validTableData;

            if (this.#inputType === 'data-input-two') {
                selectedVars = [...tableData.pair.children];
                validTableData = (selectedVars.length === 2);
            }

            if (validTableData) {
                selectedVars.forEach(el => {
                    const ids = el.dataset.varId.split('_');
                    data.push(dataControls.getDataBySheetAndVarId(ids[1], ids[2]));
                    vars.push(dataControls.getVarBySheetIdAndVarId(ids[1], ids[2]));
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
        let data1 = [], data2 = [];

        if (this.#inputType !== 'manual') {

            if (!this.#data.first || !this.#data.second) {
                return;
            }

            firstVarName = this.#vars.first.getTypeName();
            secondVarName = this.#vars.second.getTypeName();

            if (this.#inputType === 'data-input-two') {
                errorElement = this.#tableData.pair;

                if (firstVarName !== secondVarName) {
                    uiControls.showError(errorElement, 'Нельзя сравнить данные разного типа');
                    return;
                }
                // removeEmpties;
                const minLen = Math.min(this.#data.first.length, this.#data.second.length);

                for (let i = 0; i < minLen; i++) {
                    const first = this.#data.first[i];
                    const second = this.#data.second[i];
                    if (first !== '' && second !== '') {
                        data1.push(first);
                        data2.push(second);
                    }
                }
            }
            if (data1.length === 0 || data2.length === 0) {
                uiControls.showError(errorElement, 'Присутствует пустая выборка, невозможно провести вычисления');
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
                        throw new Error(errorText([Var.Continues.ruName]));
                    }
                    if (isInv) {
                        returnValue = this.#studentTestInv(alpha, arg, data1, data2);
                    }
                    else {
                        returnValue = this.#studentTest(alpha, arg, data1, data2);
                    }
                    break;
                }
                case 'wilcoxon': {
                    if (this.#inputType !== 'manual' && firstVarName !== Var.Continues.name && firstVarName !== Var.Rang.name) {
                        throw new Error(errorText([Var.Continues.ruName, Var.Rang.name]));
                    }
                    if (this.#inputType !== 'manual' && firstVarName === Var.Rang.name && (!this.#vars.first.isUnitedWith(this.#vars.second))) {
                        throw new Error('Для данного теста и способа ввода данных необходимо сперва объеденить значения выборок в окне настроек столбца');
                    }
                    if (isInv) {
                        returnValue = this.#wilcoxonTestInv(alpha, arg, data1, data2);
                    }
                    else {
                        returnValue = this.#wilcoxonTest(alpha, arg, data1, data2);
                    }
                    break;
                }
                case 'sign': {
                    if (this.#inputType !== 'manual' && firstVarName === Var.Nominal.name) {
                        throw new Error(errorText([Var.Continues.ruName, Var.Rang.ruName, Var.Binary.ruName]));
                    }
                    if (this.#inputType !== 'manual' && firstVarName === Var.Rang.name && (!this.#vars.first.isUnitedWith(this.#vars.second))) {
                        throw new Error('Для данного теста и способа ввода данных необходимо сперва объеденить значения выборок в окне настроек столбца');
                    }
                    if (isInv) {
                        returnValue = this.#signTestInv(alpha, arg, data1, data2);
                    }
                    else {
                        returnValue = this.#signTest(alpha, arg, data1, data2);
                    }
                    break;
                }
            }
        }
        catch (err) {
            uiControls.showError(errorElement, err.message);
            return;
        }

        return returnValue;

        function errorText(varTypeNameArray) {
            return `Выбранный тест поддерживает следующий тип данных: ${varTypeNameArray.join(', ')}`;
        }
    }

    #signTest(alpha, power, data1, data2) {
        let p0, p1, p2;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);
        const z = Math.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            p0 = this.#resultsTableData.sign.p0;
            p1 = this.#resultsTableData.sign.p1;
        }
        else {
            const var1 = this.#vars.first;
            const var2 = this.#inputType === 'data-input-two' ? this.#vars.second : var1;
            const signs = this.#signTestGetListOfNumberOfSigns(var1.getTypeName(), data1, data2, var1, var2);
            const dataLength = signs[1] + signs[2];
            p0 = signs[0] / data1.length;
            p1 = signs[1] / dataLength;

            this.#resultsTableData.sign.p0 = p0;
            this.#resultsTableData.sign.p1 = p1;
        }

        p2 = 1 - p1;

        this.#resultsTableData.z = z;
        this.#resultsTableData.sign.p2 = p2;

        const n = (z ** 2) / (4 * (1 - p0) * ((p1 - 0.5) ** 2));

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #signTestInv(alpha, n, data1, data2) {
        let p0, p1, p2;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            p0 = this.#resultsTableData.sign.p0;
            p1 = this.#resultsTableData.sign.p1;
        }
        else {
            const var1 = this.#vars.first;
            const var2 = this.#inputType === 'data-input-two' ? this.#vars.second : var1;
            const signs = this.#signTestGetListOfNumberOfSigns(var1.getTypeName(), data1, data2, var1, var2);
            const dataLength = signs[1] + signs[2];
            p0 = signs[0] / data1.length;
            p1 = signs[1] / dataLength;

            this.#resultsTableData.sign.p0 = p0;
            this.#resultsTableData.sign.p1 = p1;
        }
        p2 = 1 - p1;

        this.#resultsTableData.sign.p2 = p2;

        let z = Math.sqrt(n * 4 * ((p1 - 0.5) ** 2) * (1 - p0));
        if (z > 0) {
            z *= -1;
        }
        this.#resultsTableData.z = z;
        const zB = z - zAlpha;
        const power = 100 - Math.normdist(zB);

        if (power === undefined || typeof power !== 'number') {
            throw new Error('Ошибка расчета данных');
        }
        return power;
    }

    #wilcoxonTest(alpha, power, data1, data2) {
        let v;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);
        const z = Math.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            v = this.#resultsTableData.wilcoxon.v;
        }
        else {
            const varGetRangFunc = Var.prototype.getOrderOfValUnited.bind(this.#vars.first);
            let res = Math.getW(data1, data2, this.#vars.first.getTypeName() === Var.Rang.name ? varGetRangFunc : null);
            const W = res.W;
            const nn = res.nn;
            v = W / (nn ** 2);
            this.#resultsTableData.wilcoxon.v = v;
        }

        this.#resultsTableData.z = z;


        const n = (z ** 2) / (3 * (v ** 2));

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #wilcoxonTestInv(alpha, n, data1, data2) {
        let v;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            v = this.#resultsTableData.wilcoxon.v;
        }
        else {
            const varGetRangFunc = Var.prototype.getOrderOfValUnited.bind(this.#vars.first);
            let res = Math.getW(data1, data2, this.#vars.first.getTypeName() === Var.Rang.name ? varGetRangFunc : null);
            const W = res.W;
            const nn = res.nn;
            v = W / (nn ** 2);
            this.#resultsTableData.wilcoxon.v = v;
        }

        const z = -Math.sqrt(v ** 2 * 3 * n);

        this.#resultsTableData.z = z;
        const zB = z - zAlpha;
        const power = 100 - Math.normdist(zB);

        if (power === undefined || typeof power !== 'number') {
            throw new Error('Ошибка расчета данных');
        }
        return power;
    }

    #studentTest(alpha, power, data1, data2) {
        let d, sd;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);
        const z = Math.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            d = this.#resultsTableData.student.d;
            sd = this.#resultsTableData.student.sd;
        }
        else {
            const differences = data1.map((el, i) => el - data2[i]);
            d = Math.abs(Math.mean(differences));
            sd = Math.stddev.s(differences);

            this.#resultsTableData.student.d = d;
            this.#resultsTableData.student.sd = sd;
        }

        this.#resultsTableData.z = z;

        const n = (z * sd / d) ** 2 + ((zAlpha ** 2) / 2);

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #studentTestInv(alpha, n, data1, data2) {
        let d, sd, z;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            d = this.#resultsTableData.student.d;
            sd = this.#resultsTableData.student.sd;
        }
        else {
            const differences = data1.map((el, i) => el - data2[i]);
            d = Math.abs(Math.mean(differences));
            sd = Math.stddev.s(differences);

            this.#resultsTableData.student.d = d;
            this.#resultsTableData.student.sd = sd;
        }


        z = (Math.sqrt(n - ((zAlpha ** 2) / 2)) * d) / sd;
        if (z > 0) {
            z *= -1;
        }
        this.#resultsTableData.z = z;
        const zB = z - zAlpha;
        const power = 100 - Math.normdist(zB);

        if (power === undefined || typeof power !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return power;
    }



    // returns list of number of 0-s, positive and negative differences
    #signTestGetListOfNumberOfSigns(type, data1, data2, var1, var2) {
        const list = [0, 0, 0];
        let callback;
        let firstDataColumn;
        let secondDataColumn;

        if (type === 'binary') {
            callback = var1.isValInZeroGroup;
        }
        else if (type === 'rang') {
            callback = Var.prototype.getOrderOfValUnited.bind(var1);
        }

        if (type === 'continues') {
            firstDataColumn = data1;
            secondDataColumn = data2;
        }
        else {
            firstDataColumn = getColumnOfAdaptedVals(data1, var1, callback);
            secondDataColumn = getColumnOfAdaptedVals(data2, var2, callback);
        }

        firstDataColumn.forEach((el, index) => {
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
        let inputTypeHeader;
        if (this.#inputType === 'manual') {
            inputTypeHeader = `
            <th>
            </th>
            <th>
            </th>`;
        }
        else if (this.#inputType === 'data-input-two') {
            inputTypeHeader = `
            <th>
                Выборка 1
            </th>
            <th>
                Выборка 2
            </th>`;
        }
        if (this.#testType === 'student') {
            table = `<thead>
                        <tr>
                            ${inputTypeHeader}
                            <th>
                                d&#772;
                            </th>
                            <th>
                                s<sub>d</sub>
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
                            ${inputTypeHeader}
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
        else if (this.#testType === 'wilcoxon') {
            table = `<thead>
                        <tr>
                            ${inputTypeHeader}
                            <th>
                                v
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
                                ${Number.resultForm(this.#resultsTableData.wilcoxon.v)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.z)}
                            </td>
                        </tr >
                    </tbody >`;
        }
        const htmlRes = `
        <h2 class="results__header">${name}</h2>
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

    changeVisibilityResultsHtml(hide) {
        this.#resultBlock.style.display = hide ? 'none' : '';
    }
}