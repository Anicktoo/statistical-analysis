"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["modules_paired-sample-test_Module_js"],{

/***/ "./modules/paired-sample-test/Module.js":
/*!**********************************************!*\
  !*** ./modules/paired-sample-test/Module.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Module)
/* harmony export */ });
/* harmony import */ var _img_modulePair_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./img/modulePair.png */ "./modules/paired-sample-test/img/modulePair.png");
/* harmony import */ var _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/ModuleIntegrator */ "./ModuleIntegrator.js");
/* harmony import */ var _data_DataControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @data/DataControls */ "./data/DataControls.js");
/* harmony import */ var _modules_AbstractModule__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @modules/AbstractModule */ "./modules/AbstractModule.js");
/* harmony import */ var _data_Var__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @data/Var */ "./data/Var.js");






class Module extends _modules_AbstractModule__WEBPACK_IMPORTED_MODULE_3__["default"] {

    static #name = 'Сравнение парных выборок';
    static #image = _img_modulePair_png__WEBPACK_IMPORTED_MODULE_0__;
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
    #formSheets = [];
    #sheetSelects = [];
    #tableData = {
        pair: undefined,
        indepTable: undefined,
        depTable: undefined
    };
    #resultBlock;

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
        UIControls.parametersContainer.removeChild(this.#element);
        UIControls.resultsContainer.removeChild(this.#resultBlock);
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

        const parametersContainer = UIControls.parametersContainer;
        const resultsContainer = UIControls.resultsContainer;
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
        UIControls.parametersContainer.insertBefore(this.#element, refData.element.nextElementSibling);
        UIControls.resultsContainer.insertBefore(this.#resultBlock, refData.resultBlock.nextElementSibling);
    }

    getAllData() {
        const data = {};
        data.id = this.#id;
        data.data = Object.assign({}, this.#data);
        data.power = this.#power;
        data.resultsTableData = Object.deepCopy(this.#resultsTableData);
        data.testType = this.#testType;
        data.inputType = this.#inputType;
        data.altHypTest = this.#altHypTest;
        data.vars = Object.assign({}, this.#vars);
        data.hypName = this.#hypName;
        data.element = this.#element;
        data.resultBlock = this.#resultBlock;
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

    getFormSheets() {
        return this.#formSheets;
    }

    getSheetSelects() {
        return this.#sheetSelects;
    }

    addListeners(element) {
        const tableTwo = element.querySelector('.two-column-var');
        const switch0 = tableTwo.querySelector('.switch-button');
        const firstTable = tableTwo.querySelector('.two-column-var__table-body');
        const tableData = tableTwo.querySelector('.target-table-data');

        const tableGroup = element.querySelector('.grouping-var');
        const [switch1, switch2] = [...tableGroup.querySelectorAll('.switch-button')];
        const leftTable = element.querySelector('.grouping-var__table-body');
        const depTable = element.querySelector('.grouping-var__dependent-table-body');
        const indepTable = element.querySelector('.grouping-var__independent-table-body');

        const insertChild = (item, toTable) => {
            const nextChild = toTable.querySelector('.var-table__anchor_' + item.dataset.varId);
            if (nextChild) {
                toTable.insertBefore(item, nextChild);
            }
        }

        const callSettings = () => {
            if ((depTable.firstElementChild && indepTable.firstElementChild) || tableData.children.length === 2) {
                _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].setSettings(this.#id);
            }
        }

        const swapItem = function (firstTable, secondTable, maxItemsInSecondTable) {
            const checkedInput = firstTable.querySelector('input:checked') || secondTable.querySelector('input:checked');
            if (!checkedInput)
                return;
            const checkedItem = checkedInput.parentElement;
            const parentOfItem = checkedItem.parentElement;
            if (parentOfItem.isSameNode(secondTable)) {
                parentOfItem.removeChild(checkedItem);
                insertChild(checkedItem, firstTable);
            }
            else {
                if (secondTable.children.length === maxItemsInSecondTable) {
                    return;
                }
                parentOfItem.removeChild(checkedItem);
                secondTable.appendChild(checkedItem);
            }

            callSettings();
        }

        switch0.addEventListener('click', swapItem.bind(this, firstTable, tableData, 2));
        switch1.addEventListener('click', swapItem.bind(this, leftTable, depTable, 1));
        switch2.addEventListener('click', swapItem.bind(this, leftTable, indepTable, 1));

    }

    displayVarsOfSheet(sheetId, type) {
        const vars = _data_DataControls__WEBPACK_IMPORTED_MODULE_2__["default"].getVarsBySheetId(sheetId);
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
        }
        else if (type === 'grouping-var') {
            tableBody = this.#element.querySelector('.grouping-var__table-body');
            const dep = this.#tableData.depTable.firstElementChild;
            const indep = this.#tableData.indepTable.firstElementChild;
            arrOfIds.push(dep?.dataset.varId);
            arrOfIds.push(indep?.dataset.varId);
            tableBody.innerHTML = createElementsStr();
        }

        function createElementsStr() {
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
            return strBody;
        }
    }

    updateSelectedVarsVisual(sheetId) {
        let tableData = this.#tableData.pair;
        let curVars = [...tableData.querySelectorAll('label')];
        curVarsUpdate(curVars);

        tableData = this.#tableData;
        curVars = [tableData.depTable?.firstElementChild, tableData.indepTable?.firstElementChild];
        curVarsUpdate(curVars);


        function curVarsUpdate(curVars) {
            curVars.forEach((el => {
                if (el) {
                    const ids = el.dataset.varId.split('_');
                    if (ids[1] == sheetId) {
                        const v = _data_DataControls__WEBPACK_IMPORTED_MODULE_2__["default"].getVarBySheetIdAndVarId(ids[1], ids[2]);
                        const elImg = el.querySelector('img');
                        el.querySelector('span').innerHTML = v.getName();
                        elImg.setAttribute('src', v.getImg());
                        elImg.setAttribute('alt', v.getTypeName());
                    }
                }
            }));
        }
    }

    clearSelectedVars() {
        this.#tableData.pair.innerHTML = '';
        this.#tableData.depTable.innerHTML = '';
        this.#tableData.indepTable.innerHTML = '';
    }

    createHTML() {
        const name = 'Гипотеза ' + (this.#id + 1);
        const parametersContainer = UIControls.parametersContainer;
        const resultsContainer = UIControls.resultsContainer;
        const newHyp = document.createElement('div');
        const newRes = document.createElement('div');
        newHyp.classList.add('parameters__item', 'collapsible');
        newRes.classList.add('results__block');
        const htmlParam = `
        <label class="collapsible__head">
            <input class="collapsible__input" type="checkbox" checked>
            <div class="parameters__head">
                <div class="parameters__title-container">
                    <div class="collapsible__symbol"></div>
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
        <div class="collapsible__content">
            <div class="parameters__content">
            <form id="module-option-form_${this.#id}" class="module-option-form" data-id=${this.#id}></form>
                <div class="option-block">
                    <p>Метод проверки: Сравнение парных выборок</p>
                    <div class="option-block__sub">
                        Тип ввода
                        <div class="option-block__list">
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
                    <div class="option-block__sub option-block__manual-input option-block__student option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                Средняя разность (d):
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="d" value="1" step="0.1" min="0" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                Стандартное отклонение (sd):
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="sd" value="1" step="0.1" min="0" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__sign option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Доля нулевых разностей (&#961;<sub>&#965;</sub>):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p0" value="0" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Доля положительных разностей (&#961;<sub>1</sub>):</span>
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

                    
                    <div class="option-block__two-column">
                        <div class="option-block">
                            <div class="option-block__sub">
                                Тест
                                <div class="option-block__list option-block__test-type">
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="test-type"
                                            value="student" form="module-option-form_${this.#id}" checked>
                                        <span>Стьюдента</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="test-type"
                                            value="wilcoxon" form="module-option-form_${this.#id}">
                                        <span>Уилкоксона</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#id}" type="radio" name="test-type"
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
                    data.push(_data_DataControls__WEBPACK_IMPORTED_MODULE_2__["default"].getDataBySheetAndVarId(ids[1], ids[2]).slice(1));
                    vars.push(_data_DataControls__WEBPACK_IMPORTED_MODULE_2__["default"].getVarBySheetIdAndVarId(ids[1], ids[2]));
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
                    UIControls.showError(errorElement, 'Нельзя сравнить данные разного типа');
                    return;
                }
                if (this.#data.first.length !== this.#data.second.length) {
                    UIControls.showError(errorElement, 'Выбранные наборы данных должны иметь равный размер');
                    return;
                }

                data1 = [...this.#data.first];
                data2 = [...this.#data.second];
            }
            else {
                errorElement = this.#tableData.indepTable;

                if (secondVarName !== _data_Var__WEBPACK_IMPORTED_MODULE_4__["default"].Binary.name) {
                    UIControls.showError(errorElement, 'Переменная для группировки должна быть дихотомического типа');
                    return;
                }
                if (this.#data.first.length !== this.#data.second.length) {
                    UIControls.showError(errorElement, 'Размеры данных зависимой переменной и переменной для группировки должны совпадать');
                    return;
                }

                const indepVar = this.#vars.second;
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
                if (data1.length !== data2.length) {
                    UIControls.showError(errorElement, 'Выборки должны иметь равный размер');
                    return;
                }
            }
            if (data1.length === 0 || data2.length === 0) {
                UIControls.showError(errorElement, 'Присутствует пустая выборка, невозможно провести вычисления');
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
                    if (this.#inputType !== 'manual' && firstVarName !== _data_Var__WEBPACK_IMPORTED_MODULE_4__["default"].Continues.name) {
                        throw new Error(errorText([_data_Var__WEBPACK_IMPORTED_MODULE_4__["default"].Continues.ruName]));
                    }
                    if (isInv) {
                        returnValue = this.#studentTestInv(alpha, arg, data1, data2);
                    }
                    else {
                        returnValue = this.#studentTest(alpha, arg, data1, data2);
                    }
                    break;
                }
                case 'sign': {
                    if (this.#inputType !== 'manual' && firstVarName === _data_Var__WEBPACK_IMPORTED_MODULE_4__["default"].Nominal.name) {
                        throw new Error(errorText([_data_Var__WEBPACK_IMPORTED_MODULE_4__["default"].Continues.ruName, _data_Var__WEBPACK_IMPORTED_MODULE_4__["default"].Rang.ruName, _data_Var__WEBPACK_IMPORTED_MODULE_4__["default"].Binary.ruName]));
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
            UIControls.showError(errorElement, err.message);
            return;
        }

        return returnValue;

        function errorText(varTypeNameArray) {
            return `Выбранный тест поддерживает следующий тип данных: ${varTypeNameArray.join(', ')}`;
        }
    }

    #studentTest(alpha, power, data1, data2) {
        let d, sd;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);
        const z = this.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            d = this.#resultsTableData.student.d;
            sd = this.#resultsTableData.student.sd;
        }
        else {
            const differences = data1.map((el, i) => {
                if (el === '' || data2[i] === '')
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения');
                return el - data2[i];
            });
            d = Math.abs(Math.mean(differences));
            sd = Math.stddiv.s(differences);
        }

        this.#resultsTableData.z = z;
        this.#resultsTableData.student.d = d;
        this.#resultsTableData.student.sd = sd;

        const n = (z * sd / d) ** 2 + ((zAlpha ** 2) / 2);

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #studentTestInv(alpha, n, data1, data2) {
        let d, sd, z;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            d = this.#resultsTableData.student.d;
            sd = this.#resultsTableData.student.sd;
        }
        else {
            const differences = data1.map((el, i) => {
                if (el === '' || data2[i] === '')
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения')
                return el - data2[i];
            });
            d = Math.abs(Math.mean(differences));
            sd = Math.stddiv.s(differences);
        }

        this.#resultsTableData.student.d = d;
        this.#resultsTableData.student.sd = sd;

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

    #signTest(alpha, power, data1, data2) {
        let p0, p1, p2;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);
        const z = this.getZ(zAlpha, power);
        if (this.#inputType === 'manual') {
            p0 = this.#resultsTableData.sign.p0;
            p1 = this.#resultsTableData.sign.p1;
        }
        else {
            const var1 = this.#vars.first;
            const var2 = this.#inputType === 'data-input-two' ? this.#vars.second : var1;
            const signs = this.#signTestGetListOfNumberOfSigns(this.#vars.first.getTypeName(), data1, data2, var1, var2);
            const dataLength = signs[1] + signs[2];
            p0 = signs[0] / data1.length;
            p1 = signs[1] / dataLength;
        }

        p2 = 1 - p1;

        this.#resultsTableData.z = z;
        this.#resultsTableData.sign.p0 = p0;
        this.#resultsTableData.sign.p1 = p1;
        this.#resultsTableData.sign.p2 = p2;

        const n = (z ** 2) / (4 * (1 - p0) * ((p1 - 0.5) ** 2));

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #signTestInv(alpha, n, data1, data2) {
        let p0, p1, p2;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            p0 = this.#resultsTableData.sign.p0;
            p1 = this.#resultsTableData.sign.p1;
        }
        else {
            const var1 = this.#vars.first;
            const var2 = this.#inputType === 'data-input-two' ? this.#vars.second : var1;
            const signs = this.#signTestGetListOfNumberOfSigns(this.#vars.first.getTypeName(), data1, data2, var1, var2);
            const dataLength = signs[1] + signs[2];
            p0 = signs[0] / data1.length;
            p1 = signs[1] / dataLength;
        }
        p2 = 1 - p1;

        this.#resultsTableData.sign.p0 = p0;
        this.#resultsTableData.sign.p1 = p1;
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
            callback = var1.getOrderOfVal;
        }

        if (type === 'continues') {
            firstDataColumn = data1;
            secondDataColumn = data2;
        }
        else {
            firstDataColumn = getColumnOfAdaptedVals(data1, var1, callback);
            secondDataColumn = getColumnOfAdaptedVals(data2, var2, callback);
        }

        console.log(firstDataColumn, secondDataColumn);

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
                if (el === '')
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения');
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

/***/ }),

/***/ "./modules/paired-sample-test/img/modulePair.png":
/*!*******************************************************!*\
  !*** ./modules/paired-sample-test/img/modulePair.png ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "e121201de7736b84a3aa.png";

/***/ })

}]);
//# sourceMappingURL=modules_paired-sample-test_Module_js.js.map