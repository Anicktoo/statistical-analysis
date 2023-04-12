import './styles/style.scss';
import UIControls from '@/UIControls';
import { setSettings } from '@/module-integration';
import DataControls from '@data/DataControls';
import img from './img/modulePair.png';
import AbstractModule from '@modules/AbstractModule';

export default class Module extends AbstractModule {

    static #name = 'Сравнение парных выборок';
    static #image = img;
    #id;
    #data = {
        first: undefined,
        second: undefined
    }
    #power;
    #element
    #form;
    #formSheet;
    #sheetSelect;
    #testType;
    #altHypTest;
    #vars = {
        first: undefined,
        second: undefined
    }

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

    addListeners(element) {
        const tables = element.querySelector('.paired-sample__tables');
        const switchBtn = tables.querySelector('.switch-button');
        const firstTable = tables.querySelector('.paired-sample__table-body');
        const secondTableItem = tables.querySelector('.target-table-data');

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

            if (parentOfItem.isSameNode(secondTableItem)) {
                parentOfItem.removeChild(checkedItem);
                insertChild(checkedItem, firstTable);
            }
            else {
                if (secondTableItem.children.length === 2) {
                    // const removed = secondTableItem.removeChild(secondTableItem.firstElementChild);
                    // insertChild(removed, firstTable);
                    return;
                }
                parentOfItem.removeChild(checkedItem);
                secondTableItem.appendChild(checkedItem);
            }

            setSettings(this.#id, this.#form, secondTableItem);
        });
    }

    createHTML() {
        const name = 'Гипотеза ' + (this.#id + 1);
        const parametersContainer = UIControls.parametersContainer;
        const resultsContainer = UIControls.resultsContainer;
        const mainHypSelect = parametersContainer.querySelector('#main-hypothesis');
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
                                <input class="main-radio form-change-trigger" type="radio" name="input-type" value="data" form="module-option-form_${this.#id}"
                                    checked>
                                <span>Вычисление по данным</span>
                            </label>
                            <label class="radio-line">
                                <input class="main-radio form-change-trigger" type="radio" name="input-type" value="manual" form="module-option-form_${this.#id}">
                                <span>Ввести величину эффекта</span>
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
                                <div class="option-block__list">
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
        const htmlRes = `
        <h2>Гипотеза 1</h2>
        <div class="results__block-inner">
            <p>Основная гипотеза</p>
            <p>Планируемая мощность: 95%</p>
            <p>Сравнение парных выборок</p>
            <p>Тест Стьюдента</p>
            <table class="results__table">
                <caption><small>Правосторонняя проверка альтернативной гипотезы (M2 > M1)</small>
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
        newHyp.innerHTML = htmlParam;
        newRes.innerHTML = htmlRes;
        newOption.textContent = name;
        parametersContainer.appendChild(newHyp);
        resultsContainer.appendChild(newRes);
        mainHypSelect.appendChild(newOption);
        this.#element = newHyp;
        this.#form = newHyp.querySelector('.module-option-form');
        this.#formSheet = newHyp.querySelector('.sheet-form');
        this.#sheetSelect = newHyp.querySelector('.sheet-select');
        return { newHyp, newRes };
    }

    displayVarsOfSheet(sheetId) {
        const vars = DataControls.getVarsBySheetId(sheetId);
        if (!vars)
            return;
        const tableBody = this.#element.querySelector('.paired-sample__table-body');
        const tableSecondItem = this.#element.querySelector('.target-table-data');
        const arrOfIds = [];
        arrOfIds.push(tableSecondItem.firstElementChild?.dataset.varId);
        arrOfIds.push(tableSecondItem.lastElementChild?.dataset.varId);
        let str = '';
        vars.forEach(element => {
            const item = document.createElement('div');
            const curVarID = element.getID();
            let stringElement = `
            <label class="var-table__item" data-var-id=${curVarID}>
                <input type="radio" name="data_value">
                <img src=${element.getImg()} alt="${element.getTypeName()}" class="var-table__img">
                <span>${element.getName()}</span>
            </label>`;
            item.innerHTML = stringElement;
            if (!arrOfIds.includes(curVarID)) {
                str += stringElement;
            }
            str += `<div class='var-table__anchor var-table__anchor_${curVarID}'></div>`;
        });
        tableBody.innerHTML = str;
    }

    getFormMain() {
        return this.#form;
    }

    getFormSheet() {
        return this.#formSheet;
    }

    getSheetSelect() {
        return this.#sheetSelect;
    }

    setSettings(allData) {
        const formData = allData.formData;
        const tableData = allData.tableData;
        this.#testType = formData.get('test-type');
        this.#altHypTest = formData.get('hyp-check');

        const data = [];
        if (tableData) {
            const selectedVars = [...tableData?.children];
            if (selectedVars.length == 2) {
                selectedVars.forEach(el => {
                    const ids = el.dataset.varId.split('_');
                    data.push(DataControls.getDataBySheetAndVarId(ids[1], ids[2]));
                });
                this.#data.first = data[0];
                this.#data.second = data[1];
            }
        }
    }

    getN(alpha) {

    }

    setStatPower(sampleSize) {

    }
}