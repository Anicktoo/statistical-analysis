import img from './img/moduleIndependent.png';
import ModuleIntegrator from '@/ModuleIntegrator';
import DataControls from '@data/DataControls';
import AbstractModule from '@modules/AbstractModule';
import Var from '@data/Var';

export default class Module extends AbstractModule {

    static #name = 'Сравнение независимых выборок';
    static #image = img;
    static #moduleTypeId = null;
    static comElements = {
        parametersContainer: document.querySelector('.parameters__container'),
        resultsContainer: document.querySelector('.results__container'),
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

        const parametersContainer = Module.comElements.parametersContainer;
        const resultsContainer = Module.comElements.resultsContainer;
        const newHyp = refData.element.cloneNode(true);
        const newRes = document.createElement('div');
        newRes.classList.add('results__block');

        this.#setElements(newHyp, newRes);

        this.#element.querySelector('#module-option-form_' + refData.id).setAttribute('id', 'module-option-form_' + this.#id);
        [...this.#element.querySelectorAll('.form-change-trigger_' + refData.id)].forEach(el => {
            el.classList.replace('form-change-trigger_' + refData.id, 'form-change-trigger_' + this.#id);
            el.setAttribute('form', 'module-option-form_' + this.#id);
        });
        Module.comElements.parametersContainer.insertBefore(this.#element, refData.element.nextElementSibling);
        Module.comElements.resultsContainer.insertBefore(this.#resultBlock, refData.resultBlock.nextElementSibling);
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

    static getName() {
        return this.#name;
    }

    static getImage() {
        return this.#image;
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
                ModuleIntegrator.setSettings(this.#id);
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

    displayVarsOfSheet(sheetId) {
        const vars = DataControls.getVarsBySheetId(sheetId);
        if (!vars)
            return;
        let tableBody = this.#element.querySelector('.two-column-var__table-body');
        const tableSecondItem = this.#tableData.pair;
        let arrOfIds = [];
        arrOfIds.push(tableSecondItem.firstElementChild?.dataset.varId);
        arrOfIds.push(tableSecondItem.lastElementChild?.dataset.varId);

        tableBody.innerHTML = createElementsStr();

        tableBody = this.#element.querySelector('.grouping-var__table-body');
        const dep = this.#tableData.depTable.firstElementChild;
        const indep = this.#tableData.indepTable.firstElementChild;
        arrOfIds = [];
        arrOfIds.push(dep?.dataset.varId);
        arrOfIds.push(indep?.dataset.varId);

        tableBody.innerHTML = createElementsStr();

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
        const parametersContainer = Module.comElements.parametersContainer;
        const resultsContainer = Module.comElements.resultsContainer;
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
                <form id="module-option-form_${this.#id}" class="module-option-form"></form>
                <div class="option-block">
                    <p>Метод проверки: Сравнение независимых выборок</p>
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
                    <div class="option-block__sub option-block__manual-input option-block__fisher option-block_hidden">
                        Введите параметры:
                        <div class="option-block__list">
                            <label class="input-line">
                                <span>Вероятность успеха в 1-й выборке (&#961;<sub>1</sub>):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p1" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                            <label class="input-line">
                                <span>Вероятность успеха во 2-й выборке (&#961;<sub>2</sub>):</span>
                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#id}" name="p2" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#id}">
                            </label>
                        </div>
                    </div>
                    
                    <div class="option-block__tables two-column-var">
                        <div class="var-table">
                            <div class="var-table__header">
                                <form class="sheet-form">
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
                                <form class="sheet-form">
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
                                <div class="option-block__list">
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
    #studentTest(alpha, power, data1, data2) {
        // let d, sd;
        // const zAlpha = this.getZAlpha(this.#altHypTest, alpha);
        // const z = this.getZ(zAlpha, power);
        // if (this.#inputType === 'manual') {
        //     d = this.#resultsTableData.student.d;
        //     sd = this.#resultsTableData.student.sd;
        // }
        // else {
        //     const differences = this.#data.first.map((el, i) => {
        //         if (el === '' || this.#data.second[i] === '')
        //             throw new Error('Невозможно обработать набор данных, имеются пропущенные значения')
        //         return el - this.#data.second[i];
        //     });
        //     d = Math.abs(Math.mean(differences));
        //     sd = Math.stddiv.s(differences);
        // }
        // if (d === 0) {
        //     throw new Error('Средняя разность равна нулю. Проверьте, что сравниваются разные наборы данных')
        // }

        // const n = (z * sd / d) ** 2 + ((zAlpha ** 2) / 2);

        // if (n === undefined || Number.isNaN(n)) {
        //     throw new Error('Ошибка расчета данных');
        // }

        // this.#resultsTableData.z = z;
        // this.#resultsTableData.student.d = d;
        // this.#resultsTableData.student.sd = sd;

        // return n;
    }

    //!
    #studentTestInv(alpha, n) {
        // let d, sd;
        // const zAlpha = this.getZAlpha(this.#altHypTest, alpha);

        // if (this.#inputType === 'manual') {
        //     d = this.#resultsTableData.student.d;
        //     sd = this.#resultsTableData.student.sd;
        // }
        // else {
        //     const differences = this.#data.first.map((el, i) => {
        //         if (el === '' || this.#data.second[i] === '')
        //             throw new Error('Невозможно обработать набор данных, имеются пропущенные значения')
        //         return el - this.#data.second[i];
        //     });
        //     d = Math.abs(Math.mean(differences));
        //     sd = Math.stddiv.s(differences);
        // }

        // if (d === 0) {
        //     throw new Error('Средняя разность равна нулю. Проверьте, что сравниваются разные наборы данных')
        // }

        // let z = (Math.sqrt(n - ((zAlpha ** 2) / 2)) * d) / sd * -1;
        // if (z > 0) {
        //     z *= -1;
        // }
        // const zB = z - zAlpha;
        // const power = 100 - Math.normdist(zB);

        // if (power === undefined || Number.isNaN(power)) {
        //     throw new Error('Ошибка расчета данных');
        // }

        // this.#resultsTableData.z = z;
        // this.#resultsTableData.student.d = d;
        // this.#resultsTableData.student.sd = sd;

        // return power;
    }

    #fisherTest(alpha, power, data1, data2) {
        let p0, p1, p2;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);
        const z = this.getZ(zAlpha, power);
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
        }

        p0 = (p1 + p2) / 2;

        this.#resultsTableData.z = z;
        this.#resultsTableData.fisher.p0 = p0;
        this.#resultsTableData.fisher.p1 = p1;
        this.#resultsTableData.fisher.p2 = p2;

        if (p1 === p0) {
            return Infinity;
        }

        const n = z ** 2 * p0 * (1 - p0) / (2 * (p1 - p0) ** 2);

        console.log(n);

        const N = Math.ceil(n) * 2;

        if (N === undefined || Number.isNaN(N)) {
            throw new Error('Ошибка расчета данных');
        }

        return N;
    }

    #fisherTestInv(alpha, n, data1, data2) {
        let p0, p1, p2;
        const zAlpha = this.getZAlpha(this.#altHypTest, alpha);

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
        }
        p0 = (p1 + p2) / 2;

        this.#resultsTableData.fisher.p0 = p0;
        this.#resultsTableData.fisher.p1 = p1;
        this.#resultsTableData.fisher.p2 = p2;

        if (p0 === 1 || p0 === 0) {
            this.#resultsTableData.z = Infinity;
            return 0;
        }

        let z = Math.sqrt((2 * n * (p1 - p0) ** 2) / (2 * p0 * (1 - p0)));
        if (z > 0) {
            z *= -1;
        }
        this.#resultsTableData.z = z;
        const zB = z - zAlpha;
        const power = 100 - Math.normdist(zB);

        if (power === undefined || Number.isNaN(power)) {
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

        console.log(firstDataColumn, secondDataColumn);

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
                if (el === '')
                    throw new Error('Невозможно обработать набор данных, имеются пропущенные значения');
                const group = curVar.isValInZeroGroup(el);
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
                M1
            </th>
            <th>
                M2
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