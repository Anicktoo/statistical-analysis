import img from './img/moduleCorrelation.png';
import ModuleIntegrator from '@/ModuleIntegrator';
import DataControls from '@data/DataControls';
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
        indepTable: undefined,
        depTable: undefined
    };
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
                ModuleIntegrator.setSettings(this.#id);
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
        const vars = DataControls.getVarsBySheetId(sheetId);
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
                        const v = DataControls.getVarBySheetIdAndVarId(ids[1], ids[2]);
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
                    <div class="option-block__sub option-block__manual-input option-block__pearson option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Коэффициент корреляции Пирсона (r):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="r" value="0.5" step="0.01" max="1" min="-1" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    <div class="option-block__sub option-block__manual-input option-block__spearman option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Коэффициент корреляции Спримена (&#961;):</span>
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
                                <div class="option-block__list">
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

                if (secondVarName !== Var.Binary.name) {
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
            UIControls.showError(errorElement, err.message);
            return;
        }

        return returnValue;

        function errorText(varTypeNameArray) {
            return `Выбранный тест поддерживает следующий тип данных: ${varTypeNameArray.join(', ')}`;
        }
    }

    #pearsonTest(alpha, power, data1, data2) {
        let r;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);
        const z = this.getZ(zAlpha, power);

        if (this.#inputType === 'manual') {
            r = this.#resultsTableData.pearson.r;
        }
        else {
            const xmean = Math.mean(data1);
            const ymean = Math.mean(data2);
            const xdifarr = [];
            const ydifarr = [];
            for (let i = 0; i < data1.length; i++) {
                if (data1[i] === '' || data2[i] === '') {
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения');
                }
                xdifarr.push(data1[i] - xmean);
                ydifarr.push(data2[i] - ymean);
            }
            const initialValue = 0;
            const up = xdifarr.reduce((sum, el, ind) => sum + el * ydifarr[ind], initialValue);
            const xsqrsum = xdifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const ysqrsum = ydifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const down = Math.sqrt(xsqrsum * ysqrsum);

            r = up / down;
        }

        this.#resultsTableData.z = z;
        this.#resultsTableData.pearson.r = r;

        const n = (z / Math.fisher(r)) ** 2 + 3;

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #pearsonTestInv(alpha, n, data1, data2) {
        let r, z;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);

        if (this.#inputType === 'manual') {
            r = this.#resultsTableData.pearson.r;
        }
        else {
            const xmean = Math.mean(data1);
            const ymean = Math.mean(data2);
            const xdifarr = [];
            const ydifarr = [];
            for (let i = 0; i < data1.length; i++) {
                if (data1[i] === '' || data2[i] === '') {
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения');
                }
                xdifarr.push(data1[i] - xmean);
                ydifarr.push(data2[i] - ymean);
            }
            const initialValue = 0;
            const up = xdifarr.reduce((sum, el, ind) => sum + el * ydifarr[ind], initialValue);
            const xsqrsum = xdifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const ysqrsum = ydifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const down = Math.sqrt(xsqrsum * ysqrsum);

            r = up / down;
        }

        this.#resultsTableData.pearson.r = r;

        z = Math.sqrt(Math.fisher(r) ** 2 * (n - 3));
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

    //!!!
    #spearmanTest(alpha, power, data1, data2) {
        let p;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);
        const z = this.getZ(zAlpha, power);

        if (this.#inputType === 'manual') {
            p = this.#resultsTableData.spearman.p;
        }
        else {
            // const rankObj1 = Math.rank.avg(data1);
            // const rankObj2 = Math.rank.avg(data2);
            const xmean = Math.mean(data1);
            const ymean = Math.mean(data2);
            const xdifarr = [];
            const ydifarr = [];
            for (let i = 0; i < data1.length; i++) {
                if (data1[i] === '' || data2[i] === '') {
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения');
                }
                xdifarr.push(data1[i] - xmean);
                ydifarr.push(data2[i] - ymean);
            }
            const initialValue = 0;
            const up = xdifarr.reduce((sum, el, ind) => sum + el * ydifarr[ind], initialValue);
            const xsqrsum = xdifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const ysqrsum = ydifarr.reduce((sum, el) => sum + el ** 2, initialValue);
            const down = Math.sqrt(xsqrsum * ysqrsum);

            r = up / down;
        }

        this.#resultsTableData.z = z;
        this.#resultsTableData.spearman.p = p;

        // const n = (z / Math.fisher(r)) ** 2 + 3;

        if (n === undefined || typeof n !== 'number') {
            throw new Error('Ошибка расчета данных');
        }

        return n;
    }

    #spearmanTestInv(alpha, n, data1, data2) {

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