import img from './img/moduleCorrelation.png';
import moduleIntegrator from '@/moduleIntegrator';
import dataControls from '@data/dataControls';
import AbstractModule from '@modules/AbstractModule';
import Var from '@data/Var';

export default class Module extends AbstractModule {

    static #name = 'Проверка корреляции';
    static #image = img;
    static #moduleTypeId = null;
    static testText = {
        'pearson': 'Тест Пирсона',
        'spearman': 'Тест Спирмена'
    }
    static altHypText = {
        'both': 'Наличие корреляции (r ≠ 0)',
        'right': 'Положительная корреляция (r &#62; 0)',
        'left': 'Отрицательная корреляция (r &#60; 0)',

    }
    #id;
    #data = {
        first: undefined,
        second: undefined
    }
    #power;
    #resultsTableData = {
        z: undefined,
        pearson: {
            r: undefined
        },
        spearman: {
            p: undefined
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
    #formSheets = [];
    #sheetSelects = [];
    #tableData = {
        pair: undefined,
    };
    #tableTwoEl;
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

    setName(name) {
        this.#hypName = name;
        this.#element.querySelector('.parameters__title').textContent = name;
        this.#resultBlock.querySelector('.results__header').textContent = name;
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
                    <input class="parameters__title-input" type='text'>
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
        <div class="collapsible__content collapsible__content_checked">
            <div class="parameters__content">
                <form id="module-option-form_${this.#id}" class="module-option-form" data-id=${this.#id}></form>
                <div class="option-block">
                    <p>Метод проверки: Проверка корреляции</p>
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
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="test-type" value="pearson"
                                            form="module-option-form_${this.#id}" checked>
                                        <span>Пирсона</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="test-type" value="spearman"
                                            form="module-option-form_${this.#id}">
                                        <span>Спирмена</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="option-block">
                            <div class="option-block__sub">
                                Проверка альтернативной гипотезы
                                <div class="option-block__list option-block__hyp-check">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="hyp-check" value="both"
                                            form="module-option-form_${this.#id}" checked>
                                        <span>${Module.altHypText['both']}</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="hyp-check" value="right"
                                            form="module-option-form_${this.#id}">
                                        <span>${Module.altHypText['right']}</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="hyp-check" value="left"
                                            form="module-option-form_${this.#id}">
                                        <span>${Module.altHypText['left']}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__pearson option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Коэффициент корреляции Пирсона ( r ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="r" value="0.5" step="0.01" max="1" min="-1" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__spearman option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Коэффициент корреляции Спирмена ( &#961; ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p" value="0.5" step="0.01" max="1" min="-1" form="module-option-form_${this.#id}">
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
                            <div class="var-table__header">Сравниваемые переменные</div>
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
            case 'pearson': {
                if (this.#inputType === 'manual') {
                    this.#resultsTableData.pearson.r = Number(formData.get('r'));
                }
                else {
                    this.#resultsTableData.pearson.r = null;
                }
                break;
            }
            case 'spearman': {
                if (this.#inputType === 'manual') {
                    this.#resultsTableData.spearman.p = Number(formData.get('p'));
                }
                else {
                    this.#resultsTableData.spearman.p = null;
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
                case 'pearson': {
                    if (this.#inputType !== 'manual' && firstVarName !== Var.Continues.name) {
                        throw new Error(errorText([Var.Continues.ruName]));
                    }
                    if (isInv) {
                        returnValue = this.#pearsonTestInv(alpha, arg, data1, data2);
                    }
                    else {
                        returnValue = this.#pearsonTest(alpha, arg, data1, data2);
                    }
                    break;
                }
                case 'spearman': {
                    if (this.#inputType !== 'manual' && firstVarName !== Var.Rang.name) {
                        throw new Error(errorText([Var.Rang.ruName]));
                    }
                    if (isInv) {
                        returnValue = this.#spearmanTestInv(alpha, arg, data1, data2);
                    }
                    else {
                        returnValue = this.#spearmanTest(alpha, arg, data1, data2);
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

    #pearsonTest(alpha, power, data1, data2) {
        let r;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);
        const z = Math.getZ(zAlpha, power);

        if (this.#inputType === 'manual') {
            r = this.#resultsTableData.pearson.r;
        }
        else {
            const xmean = Math.mean(data1);
            const ymean = Math.mean(data2);
            const xdifarr = [];
            const ydifarr = [];
            for (let i = 0; i < data1.length; i++) {
                xdifarr.push(data1[i] - xmean);
                ydifarr.push(data2[i] - ymean);
            }
            const initialValue = 0;
            const up = xdifarr.reduce((sum, el, ind) => sum + el * ydifarr[ind], initialValue);
            const xsqrsum = xdifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const ysqrsum = ydifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const down = Math.sqrt(xsqrsum * ysqrsum);

            r = up / down;
            this.#resultsTableData.pearson.r = r;
        }

        this.#resultsTableData.z = z;

        const n = (z / Math.fisher(r)) ** 2 + 3;

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #pearsonTestInv(alpha, n, data1, data2) {
        let r, z;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            r = this.#resultsTableData.pearson.r;
        }
        else {
            const xmean = Math.mean(data1);
            const ymean = Math.mean(data2);
            const xdifarr = [];
            const ydifarr = [];
            for (let i = 0; i < data1.length; i++) {
                xdifarr.push(data1[i] - xmean);
                ydifarr.push(data2[i] - ymean);
            }
            const initialValue = 0;
            const up = xdifarr.reduce((sum, el, ind) => sum + el * ydifarr[ind], initialValue);
            const xsqrsum = xdifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const ysqrsum = ydifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const down = Math.sqrt(xsqrsum * ysqrsum);

            r = up / down;
            this.#resultsTableData.pearson.r = r;
        }


        z = Math.fisher(r) * Math.sqrt((n - 3));
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

    #spearmanTest(alpha, power, data1, data2) {
        let p;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);
        const z = Math.getZ(zAlpha, power);

        if (this.#inputType === 'manual') {
            p = this.#resultsTableData.spearman.p;
        }
        else {
            const rankArr1 = Math.rank.avg(data1, this.#vars.first.getOrderOfVal.bind(this.#vars.first));
            const rankArr2 = Math.rank.avg(data2, this.#vars.second.getOrderOfVal.bind(this.#vars.second));
            const xmean = (data1.length + 1) / 2;
            const ymean = (data2.length + 1) / 2;
            const xdifarr = [];
            const ydifarr = [];
            for (let i = 0; i < data1.length; i++) {
                xdifarr.push(rankArr1.get(data1[i]) - xmean);
                ydifarr.push(rankArr2.get(data2[i]) - ymean);
            }
            const initialValue = 0;
            const up = xdifarr.reduce((sum, el, ind) => sum + el * ydifarr[ind], initialValue);
            const xsqrsum = xdifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const ysqrsum = ydifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const down = Math.sqrt(xsqrsum * ysqrsum);

            p = up / down;
            this.#resultsTableData.spearman.p = p;
        }

        this.#resultsTableData.z = z;

        const n = 1.06 * ((z / Math.fisher(p)) ** 2) + 3;

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #spearmanTestInv(alpha, n, data1, data2) {
        let p, z;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            p = this.#resultsTableData.spearman.p;
        }
        else {
            const rankArr1 = Math.rank.avg(data1, this.#vars.first.getOrderOfVal.bind(this.#vars.first));
            const rankArr2 = Math.rank.avg(data2, this.#vars.second.getOrderOfVal.bind(this.#vars.second));
            const xmean = (data1.length + 1) / 2;
            const ymean = (data2.length + 1) / 2;
            const xdifarr = [];
            const ydifarr = [];
            for (let i = 0; i < data1.length; i++) {
                xdifarr.push(rankArr1.get(data1[i]) - xmean);
                ydifarr.push(rankArr2.get(data2[i]) - ymean);
            }
            const initialValue = 0;
            const up = xdifarr.reduce((sum, el, ind) => sum + el * ydifarr[ind], initialValue);
            const xsqrsum = xdifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const ysqrsum = ydifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const down = Math.sqrt(xsqrsum * ysqrsum);

            p = up / down;
            this.#resultsTableData.spearman.p = p;
        }


        z = Math.fisher(p) * Math.sqrt((n - 3) / 1.06);
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
        if (this.#testType === 'pearson') {
            table = `<thead>
                        <tr>
                            ${inputTypeHeader}
                            <th>
                                r
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
                                ${Number.resultForm(this.#resultsTableData.pearson.r)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.z)}
                            </td>
                        </tr >
                    </tbody >`;
        }
        else if (this.#testType === 'spearman') {
            table = `<thead>
                        <tr>
                            ${inputTypeHeader}
                            <th>
                                &#961;
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
                                ${Number.resultForm(this.#resultsTableData.spearman.p)}
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
            <p>Проверка корреляции</p>
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