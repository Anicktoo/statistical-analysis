import img from './img/moduleIndependent.png';
import './styles/style.scss';
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
        'sign': 'Независимый тест Стьюдента'
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
    #testType;
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

    //!
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

    createHTML() {
        const name = 'Гипотеза ' + (this.#id + 1);
        const parametersContainer = Module.comElements.parametersContainer;
        const resultsContainer = Module.comElements.resultsContainer;
        const mainHypSelect = Module.comElements.mainHypSelect;
        const newHyp = document.createElement('div');
        const newRes = document.createElement('div');
        const newOption = document.createElement('option');
        newHyp.classList.add('parameters__item', 'collapsible', 'independent-sample');
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
                    <div class="option-block__tables independent-sample__tables">
                        <div class="var-table">
                            <div class="var-table__header">
                                <form id="sheet-form-${this.#id}" class="sheet-form">
                                    <div class="main-select">
                                        <select
                                            class="main-input independent-sample__sheet-select sheet-select"
                                            name="sheet-select"></select>
                                    </div>
                                </form>
                            </div>
                            <div class="var-table__body independent-sample__table-body">
                                <label class="var-table__item">
                                    <input type="radio" name="data_value">
                                    <img src=# class="var-table__img">
                                    <span>Hello world!</span>
                                </label>
                            </div>
                        </div>
                        <div class="independent-sample__tables-and-switches">
                            <div class="independent-sample__container">
                                <div class="independent-sample__switch-container">
                                    <div class="switch-button switch-button_right">
                                        <div class="switch-button__symbol"></div>
                                    </div>
                                </div>
                                <div class="var-table">
                                    <div class="var-table__header">Зависимая переменная</div>
                                    <div class="var-table__body independent-sample__dependent-table-body">
                                        <label class="var-table__item">
                                            <input type="radio" name="data_value">
                                            <img src=# class="var-table__img">
                                            <span>Hello world!</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="independent-sample__container">
                                <div class="independent-sample__switch-container">
                                    <div class="switch-button switch-button_right">
                                        <div class="switch-button__symbol"></div>
                                    </div>
                                </div>
                                <div class="var-table">
                                    <div class="var-table__header">Группировка по переменной</div>
                                    <div class="var-table__body independent-sample__independent-table-body">
                                        <label class="var-table__item">
                                            <input type="radio" name="data_value">
                                            <img src=# class="var-table__img">
                                            <span>Hello world!</span>
                                        </label>
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
                                            name="test-type" value="sign"
                                            form="module-option-form_${this.#id}" checked>
                                        <span>Точный тест Фишера</span>
                                    </label>
                                    <label class="radio-line">
                                        <input class="main-radio form-change-trigger" type="radio"
                                            name="test-type" value="wilcoxon"
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
        this.#tableData = newHyp.querySelector('.target-table-data');
        this.#resultBlock = newRes;
        this.#hypName = name;
        return { newHyp, newRes };
    }

    //!
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

    //!
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

    //!
    clearSelectedVars() {
        this.#tableData.innerHTML = '';
    }

    getFormMain() {
        return this.#form;
    }

    //!
    getFormSheet() {
        return this.#formSheet;
    }

    getSheetSelect() {
        return this.#sheetSelect;
    }

    //!
    setSettings() {
        const formData = new FormData(this.#form);
        const tableData = this.#tableData;
        this.#testType = formData.get('test-type');
        this.#altHypTest = formData.get('hyp-check');

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
        if (!this.#data.first || !this.#data.second) {
            return;
        }
        const firstVarName = this.#vars.first.getTypeName();
        const secondVarName = this.#vars.second.getTypeName();
        if (firstVarName !== secondVarName) {
            UIControls.showError(this.#tableData, 'Нельзя сравнить данные разного типа');
            return;
        }
        if (this.#data.first.length !== this.#data.second.length) {
            UIControls.showError(this.#tableData, 'Выбранные наборы данных имеют разную длину');
            return;
        }

        let returnValue;
        switch (this.#testType) {
            case 'student': {
                if (firstVarName !== Var.Continues.name) {
                    UIControls.showError(this.#tableData, errorText([Var.Continues.ruName, Var.Rang.ruName]));
                    return;
                }
                if (isInv) {
                    returnValue = this.#studentTestInv(alpha, arg);
                }
                else {
                    returnValue = this.#studentTest(alpha, arg);
                }
            }
        }

        if (!returnValue || Number.isNaN(returnValue)) {
            UIControls.showError(this.#tableData, 'Ошибка расчета данных');
        }
        return returnValue;

        function errorText(varTypeNameArray) {
            return `Выбранный тест поддерживает следующий тип данных: ${varTypeNameArray.join(', ')}`;
        }
    }

    //ПРОВЕРКИ НА ПРОПУЩЕННЫЕ ЗНАЧЕНИЯ. ЧТО С НИМИ ДЕЛАТЬ???

    #studentTest(alpha, power) {
        const zAlpha = this.#altHypTest === 'both' ? Math.norminv(alpha / 2) : Math.norminv(alpha);
        const z = zAlpha + Math.norminv(100 - power);
        const differences = this.#data.first.map((el, i) => el - this.#data.second[i]);
        const d = Math.abs(Math.mean(differences));
        const sd = Math.stddiv.s(differences);
        const n = (z * sd / d) ** 2 + ((zAlpha ** 2) / 2);

        return n;
    }

    #studentTestInv(alpha, n) {
        const zAlpha = this.#altHypTest === 'both' ? Math.norminv(alpha / 2) : Math.norminv(alpha);
        const differences = this.#data.first.map((el, i) => el - this.#data.second[i]);
        const d = Math.abs(Math.mean(differences));
        const sd = Math.stddiv.s(differences);
        let tmp = Math.sqrt(n - ((zAlpha ** 2) / 2));
        const z = (tmp * d) / sd * -1;
        const zB = z - zAlpha;
        const power = 100 - Math.normdist(zB);

        return power;
    }

    updateResultsHtml(isMain) {
        const name = this.#hypName;
        const powerString = isMain ? `<p><b>Основная гипотеза</b></p>` : `<p>Статистическая мощность: ${this.#power ? this.#power : '-'}</p>`;
        const htmlRes = `
        <h2>${name}</h2>
        <div class="results__block-inner">
            ${powerString}
            <p>Сравнение парных выборок</p>
            <p>${Module.testText[this.#testType]}</p>
            <table class="results__table">
                <caption><small>${Module.altHypText[this.#altHypTest]}</small>
                </caption>
                <thead>
                    <tr>
                        <th>
                            M1
                        </th>
                        <th>
                            M2
                        </th>
                        <th>
                            t
                        </th>
                        <th>
                            df
                        </th>
                        <th>
                            p
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            Столбец1
                        </td>
                        <td>
                            Столбец2
                        </td>
                        <td>
                            4.232
                        </td>
                        <td>
                            3
                        </td>
                        <td>
                            0.02
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`;

        this.#resultBlock.innerHTML = htmlRes;
    }
}