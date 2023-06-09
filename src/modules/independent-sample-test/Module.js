import img from './img/moduleIndependent.png';
import moduleIntegrator from '@/moduleIntegrator';
import dataControls from '@data/dataControls';
import AbstractModule from '@modules/AbstractModule';
import Var from '@data/Var';

export default class Module extends AbstractModule {

    static #name = 'Сравнение независимых выборок';
    static #image = img;
    static #moduleTypeId = null;
    static testText = {
        'fisher': 'Точный тест Фишера',
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
            x: undefined,
            y: undefined,
            varX: undefined,
            varY: undefined,
        },
        fisher: {
            p0: undefined,
            p1: undefined,
            p2: undefined,
        },
        mann: {
            p: undefined,
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
        indepTable: undefined,
        depTable: undefined
    };
    #tableTwoEl;
    #tableGroupEl;
    #resultBlock;
    #switch;
    #switch1;
    #switch2;

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
        if (this.#inputType === 'data-input-two') {
            switchVar(ids1[1], 'two-column-var', this.#tableTwoEl, selectedVars[0], this.#switch);
            switchVar(ids2[1], 'two-column-var', this.#tableTwoEl, selectedVars[1], this.#switch);
        }
        else {
            switchVar(ids1[1], 'grouping-var', this.#tableGroupEl, selectedVars[0], this.#switch1);
            switchVar(ids2[1], 'grouping-var', this.#tableGroupEl, selectedVars[1], this.#switch2);
        }
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

        const tableGroup = this.#tableGroupEl;
        const [switch1, switch2] = [...tableGroup.querySelectorAll('.switch-button')];
        const leftTable = element.querySelector('.grouping-var__table-body');
        const depTable = element.querySelector('.grouping-var__dependent-table-body');
        const indepTable = element.querySelector('.grouping-var__independent-table-body');

        this.#switch = switch0;
        this.#switch1 = switch1;
        this.#switch2 = switch2;

        const insertChild = (item, toTable) => {
            const nextChild = toTable.querySelector('.var-table__anchor_' + item.dataset.varId);
            if (nextChild) {
                toTable.insertBefore(item, nextChild);
            }
        }

        const callSettings = () => {
            if ((depTable.firstElementChild && indepTable.firstElementChild) || tableData.children.length === 2) {
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
        switch1.addEventListener('click', swapItem.bind(this, leftTable, depTable, 1, switch1));
        switch2.addEventListener('click', swapItem.bind(this, leftTable, indepTable, 1, switch2));

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
        else if (type === 'grouping-var') {
            tableBody = this.#element.querySelector('.grouping-var__table-body');
            const dep = this.#tableData.depTable.firstElementChild;
            const indep = this.#tableData.indepTable.firstElementChild;
            arrOfIds.push(dep?.dataset.varId);
            arrOfIds.push(indep?.dataset.varId);
            tableBody.innerHTML = createElementsStr();
            const switchChange = (el) => {
                if (this.#tableData.indepTable.firstElementChild?.dataset.varId === el.dataset.varId) {
                    this.#switch2.classList.replace('switch-button_right', 'switch-button_left');
                }
                else if (this.#tableData.depTable.firstElementChild?.dataset.varId === el.dataset.varId) {
                    this.#switch1.classList.replace('switch-button_right', 'switch-button_left');
                }
                else {
                    this.#switch1.classList.replace('switch-button_left', 'switch-button_right');
                    this.#switch2.classList.replace('switch-button_left', 'switch-button_right');
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

        tableData = this.#tableData;
        curVars = [tableData.depTable?.firstElementChild, tableData.indepTable?.firstElementChild];
        curVarsUpdate(curVars);


    }

    clearSelectedVars() {
        this.#tableData.pair.innerHTML = '';
        this.#tableData.depTable.innerHTML = '';
        this.#tableData.indepTable.innerHTML = '';
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
                    <p>Метод проверки: Сравнение независимых выборок</p>
                    <div class="option-block__sub">
                        Тип ввода
                        <div class="option-block__list option-block__input-type">
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger form-change-trigger_${this.#id} data-input-two" type="radio" name="input-type" value="data-input-two" form="module-option-form_${this.#id}"
                                    checked>
                                <span>Вычисление по данным (два столбца)</span>
                            </label>
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger form-change-trigger_${this.#id} data-input-group" type="radio" name="input-type" value="data-input-group" form="module-option-form_${this.#id}"
                                    >
                                <span>Вычисление по данным (группировка по переменной)</span>
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
                                            name="test-type" value="fisher"
                                            form="module-option-form_${this.#id}" checked>
                                        <span>Точный тест Фишера</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="test-type" value="mann"
                                            form="module-option-form_${this.#id}">
                                        <span>Манна-Уитни</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
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
                                <div class="option-block__list option-block__hyp-check">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="hyp-check" value="both"
                                            form="module-option-form_${this.#id}" checked>
                                        <span>Двусторонняя (M1 ≠ M2)</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="hyp-check" value="right"
                                            form="module-option-form_${this.#id}">
                                        <span>Правосторонняя (M2 &#62; M1)</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio"
                                            name="hyp-check" value="left"
                                            form="module-option-form_${this.#id}">
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
                                <span>Среднее арифметическое 1-й выборки ( x&#772; ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="x" value="1" step="0.1" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Среднее арифметическое 2-й выборки ( y&#772; ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="y" value="1" step="0.1" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Дисперсия 1-й выборки ( <i>Var(x)</i> )</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="varX" value="1" step="0.1" min="0" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Дисперсия 2-й выборки ( <i>Var(y)</i> )</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="varY" value="1" step="0.1" min="0" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__fisher option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Вероятность успеха в 1-й выборке ( &#961;<sub>1</sub> ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p1" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Вероятность успеха во 2-й выборке ( &#961;<sub>2</sub> ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p2" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__mann option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Величина эффекта ( p ):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p" value="0.01" step="0.01" form="module-option-form_${this.#id}">
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


                    <div class="option-block__tables grouping-var option-block_hidden">
                        <div class="var-table">
                            <div class="var-table__header">
                                <form class="sheet-form" data-type="grouping-var">
                                    <div class="main-select">
                                        <select class="main-input grouping-var__sheet-select sheet-select"
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
        this.#tableData.indepTable = newHyp.querySelector('.grouping-var__independent-table-body');
        this.#tableData.depTable = newHyp.querySelector('.grouping-var__dependent-table-body');
        this.#tableTwoEl = newHyp.querySelector('.two-column-var');
        this.#tableGroupEl = newHyp.querySelector('.grouping-var');
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
                    this.#resultsTableData.student.x = Number(formData.get('x'));
                    this.#resultsTableData.student.y = Number(formData.get('y'));
                    this.#resultsTableData.student.varX = Number(formData.get('varX'));
                    this.#resultsTableData.student.varY = Number(formData.get('varY'));
                }
                else {
                    this.#resultsTableData.student.x = null;
                    this.#resultsTableData.student.y = null;
                    this.#resultsTableData.student.varX = null;
                    this.#resultsTableData.student.varY = null;
                }
                break;
            }
            case 'fisher': {
                if (this.#inputType === 'manual') {
                    this.#resultsTableData.fisher.p1 = Number(formData.get('p1'));
                    this.#resultsTableData.fisher.p2 = Number(formData.get('p2'));
                }
                else {
                    this.#resultsTableData.fisher.p1 = null;
                    this.#resultsTableData.fisher.p2 = null;
                }
                this.#resultsTableData.fisher.p0 = null;
                break;
            }
            case 'mann': {
                if (this.#inputType === 'manual') {
                    this.#resultsTableData.mann.p = Number(formData.get('p'));
                }
                else {
                    this.#resultsTableData.mann.p = null;
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
            const dep = tableData.depTable.firstElementChild;
            const indep = tableData.indepTable.firstElementChild;
            let selectedVars;
            let validTableData;

            if (this.#inputType === 'data-input-two') {
                selectedVars = [...tableData.pair.children];
                validTableData = (selectedVars.length === 2);
            }
            else {
                selectedVars = [dep, indep];
                validTableData = (dep && indep);
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

                const createArrayWithNoEmpties = (oldArr, newArr) => oldArr.forEach(el => el !== '' ? newArr.push(el) : null);
                createArrayWithNoEmpties(this.#data.first, data1);
                createArrayWithNoEmpties(this.#data.second, data2);
            }
            else {
                errorElement = this.#tableData.indepTable;

                if (secondVarName !== Var.Binary.name) {
                    uiControls.showError(errorElement, 'Переменная для группировки должна быть дихотомического типа');
                    return;
                }

                const indepVar = this.#vars.second;
                const minLen = Math.min(this.#data.first.length, this.#data.second.length);

                for (let i = 0; i < minLen; i++) {
                    const el = this.#data.first[i];
                    if (el === '') continue;
                    const bin = this.#data.second[i];
                    if (bin === '') continue;
                    const group = indepVar.isValInZeroGroup(bin);
                    if (group === 0) {
                        data1.push(el);
                    }
                    else if (group === 1) {
                        data2.push(el);
                    }
                    else {
                        uiControls.showError(errorElement, 'Ошибка вычисления');
                        return;
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
                case 'fisher': {
                    if (this.#inputType !== 'manual' && firstVarName !== Var.Binary.name) {
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
                case 'mann': {
                    if (this.#inputType !== 'manual' && firstVarName !== Var.Continues.name && firstVarName !== Var.Rang.name) {
                        throw new Error(errorText([Var.Continues.ruName, Var.Rang.ruName]));
                    }
                    if (this.#inputType === 'data-input-two' && firstVarName === Var.Rang.name && (!this.#vars.first.isUnitedWith(this.#vars.second))) {
                        throw new Error('Для данного теста и способа ввода данных необходимо сперва объеденить значения выборок в окне настроек столбца');
                    }
                    if (isInv) {
                        returnValue = this.#mannTestInv(alpha, arg, data1, data2);
                    }
                    else {
                        returnValue = this.#mannTest(alpha, arg, data1, data2);
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

    #studentTest(alpha, power, data1, data2) {
        let x, y, varX, varY;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);
        const z = Math.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            x = this.#resultsTableData.student.x;
            y = this.#resultsTableData.student.y;
            varX = this.#resultsTableData.student.varX;
            varY = this.#resultsTableData.student.varY;
        }
        else {
            x = Math.mean(data1);
            y = Math.mean(data2);
            varX = Math.var.s(data1);
            varY = Math.var.s(data2);

            this.#resultsTableData.student.x = x;
            this.#resultsTableData.student.y = y;
            this.#resultsTableData.student.varX = varX;
            this.#resultsTableData.student.varY = varY;
        }

        this.#resultsTableData.z = z;

        const n = (z * Math.sqrt(varX + varY) / (y - x)) ** 2 + zAlpha ** 2 / 2;
        const N = Math.ceil(n) * 2;

        if (N === undefined || typeof N !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return N;
    }

    #studentTestInv(alpha, n, data1, data2) {
        let x, y, varX, varY;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            x = this.#resultsTableData.student.x;
            y = this.#resultsTableData.student.y;
            varX = this.#resultsTableData.student.varX;
            varY = this.#resultsTableData.student.varY;
        }
        else {
            x = Math.mean(data1);
            y = Math.mean(data2);
            varX = Math.var.s(data1);
            varY = Math.var.s(data2);

            this.#resultsTableData.student.x = x;
            this.#resultsTableData.student.y = y;
            this.#resultsTableData.student.varX = varX;
            this.#resultsTableData.student.varY = varY;
        }


        let z = (Math.sqrt((n - (zAlpha ** 2)) / 2) * (y - x)) / (Math.sqrt(varX + varY));

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

    #fisherTest(alpha, power, data1, data2) {
        let p0, p1, p2;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);
        const z = Math.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            p1 = this.#resultsTableData.fisher.p1;
            p2 = this.#resultsTableData.fisher.p2;
        }
        else {
            const var1 = this.#vars.first;
            const var2 = this.#inputType === 'data-input-two' ? this.#vars.second : var1;
            const signs = this.#fisherTestGetListOfNumberOfSigns(data1, data2, var1, var2);
            p1 = signs[0] / data1.length;
            p2 = signs[1] / data2.length;

            this.#resultsTableData.fisher.p1 = p1;
            this.#resultsTableData.fisher.p2 = p2;
        }

        p0 = (p1 + p2) / 2;

        this.#resultsTableData.z = z;
        this.#resultsTableData.fisher.p0 = p0;

        const n = z ** 2 * p0 * (1 - p0) / (2 * (p1 - p0) ** 2);

        const N = Math.ceil(n) * 2;

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return N;
    }

    #fisherTestInv(alpha, n, data1, data2) {
        let p0, p1, p2;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            p1 = this.#resultsTableData.fisher.p1;
            p2 = this.#resultsTableData.fisher.p2;
        }
        else {
            const var1 = this.#vars.first;
            const var2 = this.#inputType === 'data-input-two' ? this.#vars.second : var1;
            const signs = this.#fisherTestGetListOfNumberOfSigns(data1, data2, var1, var2);
            p1 = signs[0] / data1.length;
            p2 = signs[1] / data2.length;

            this.#resultsTableData.fisher.p1 = p1;
            this.#resultsTableData.fisher.p2 = p2;
        }
        p0 = (p1 + p2) / 2;

        this.#resultsTableData.fisher.p0 = p0;

        let z = Math.sqrt((n * (p1 - p0) ** 2) / (p0 * (1 - p0)));
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

    // returns list of number of elements in 1-st group (counting from 0) in data1 and data2
    #fisherTestGetListOfNumberOfSigns(data1, data2, var1, var2) {
        const list = [0, 0];
        let firstDataColumn;
        let secondDataColumn;

        firstDataColumn = getColumnOfAdaptedVals(data1, var1);
        secondDataColumn = getColumnOfAdaptedVals(data2, var2);

        countItemsInFirstGroup(firstDataColumn, 0);
        countItemsInFirstGroup(secondDataColumn, 1);

        return list;

        function countItemsInFirstGroup(dataColumn, listIndexToPut) {
            dataColumn.forEach(el => {
                if (el === 1)
                    list[listIndexToPut]++;
            });
        }

        function getColumnOfAdaptedVals(data, curVar) {
            return data.map(el => {
                const group = curVar.isValInZeroGroup(el);
                if (group === -1)
                    throw new Error('Ошибка вычислений');
                else {
                    return group;
                }
            });
        }
    }

    #mannTest(alpha, power, data1, data2) {
        let p;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);
        const z = Math.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            p = this.#resultsTableData.mann.p;
        }
        else {
            let U;
            const U1 = Math.getU(data1, data2, Var.prototype.getOrderOfValUnited.bind(this.#vars.first));
            const n1 = data1.length;
            const m = data2.length;
            const U2 = n1 * m - U1;
            if (this.#altHypTest == 'left') {
                U = U2;
            }
            else if (this.#altHypTest == 'right') {
                U = U1;
            }
            else {
                U = Math.min(U1, U2);
            }
            p = U / (m * n1);
            this.#resultsTableData.mann.p = p;
        }

        this.#resultsTableData.z = z;

        const n = z ** 2 / (6 * (p - 0.5) ** 2);
        const N = Math.ceil(n) * 2;

        if (N === undefined || typeof N !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return N;
    }

    #mannTestInv(alpha, n, data1, data2) {
        let p;
        const zAlpha = Math.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            p = this.#resultsTableData.mann.p;
        }
        else {
            let U;
            const U1 = Math.getU(data1, data2, Var.prototype.getOrderOfValUnited.bind(this.#vars.first));
            const n1 = data1.length;
            const m = data2.length;
            const U2 = n1 * m - U1;
            if (this.#altHypTest == 'left') {
                U = U2;
            }
            else if (this.#altHypTest == 'right') {
                U = U1;
            }
            else {
                U = Math.min(U1, U2);
            }
            p = U / (m * n1);
            this.#resultsTableData.mann.p = p;
        }

        const smallN = n / 2;
        let z = smallN ** 2 * (p - 0.5) / Math.sqrt(smallN ** 3 / 6);

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
        else {
            inputTypeHeader = `
            <th>
                Зависимая переменная
            </th>
            <th>
                Переменная для группировки
            </th>`;
        }
        if (this.#testType === 'student') {
            table = `<thead>
                        <tr>
                            ${inputTypeHeader}
                            <th>
                                x&#772;
                            </th>
                            <th>
                                y&#772;
                            </th>
                            <th>
                                <i>Var(x)</i>
                            </th>
                            <th>
                                <i>Var(y)</i>
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
                                ${Number.resultForm(this.#resultsTableData.student.x)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.student.y)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.student.varX)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.student.varY)}
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
                            ${inputTypeHeader}
                            <th>
                                &#961;<sub>0</sub>
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
                                ${Number.resultForm(this.#resultsTableData.fisher.p0)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.fisher.p1)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.fisher.p2)}
                            </td>
                            <td>
                                ${Number.resultForm(this.#resultsTableData.z)}
                            </td>
                        </tr >
                    </tbody >`;
        }
        else if (this.#testType === 'mann') {
            table = `<thead>
                        <tr>
                            ${inputTypeHeader}
                            <th>
                                p
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
                                ${Number.resultForm(this.#resultsTableData.mann.p)}
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
            <p>Сравнение независимых выборок</p>
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