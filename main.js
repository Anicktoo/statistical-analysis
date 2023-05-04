/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./styles/styles.scss":
/*!****************************!*\
  !*** ./styles/styles.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./ModuleIntegrator.js":
/*!*****************************!*\
  !*** ./ModuleIntegrator.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModuleIntegrator)
/* harmony export */ });
/* harmony import */ var _modules_AbstractModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @modules/AbstractModule */ "./modules/AbstractModule.js");
/* harmony import */ var _data_DataControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data/DataControls */ "./data/DataControls.js");

// import UIControls from './UIControls';


class ModuleIntegrator {
    static MODULE_FOLDERS = ['paired-sample-test', 'independent-sample-test', 'correlation-test'];
    static modules = [];
    static timerId;
    static hypotheses = [];
    static globalSettings = {
        form: document.querySelector('#module-option-form_glob'),
        name: undefined,
        FWER: undefined,
        mainHypId: undefined,
        power: undefined,
        hypCounter: 0,
        unhiddenCounter: 0,
        preciseSampleSize: undefined,
        sampleSize: undefined,
        update: null,

        getAlpha(asString = true) {
            if (this.unhiddenCounter) {
                if (asString) {
                    return Math.roundGOST(this.FWER / this.unhiddenCounter);
                }
                else {
                    return this.FWER / this.unhiddenCounter;
                }
            }
            else {
                return '-';
            }
        },
        getMainHypName() {
            const main = ModuleIntegrator.hypotheses[this.mainHypId];
            return main && main.hyp ? main.hyp.getName() : '-';
        },
        createNewHypOption(id, name) {
            const newOption = document.createElement('option');
            newOption.setAttribute('value', id);
            newOption.classList.add('main-hypothesis__option_' + id);
            newOption.textContent = name;
            UIControls.mainHypSelect.appendChild(newOption);
        },
        updateHypOption(id, name) {
            const newOption = UIControls.mainHypSelect.querySelector('.main-hypothesis__option_' + id);
            if (newOption)
                newOption.textContent = name;
        },
        deleteHypOption(id) {
            const optionToDelete = UIControls.mainHypSelect.querySelector('.main-hypothesis__option_' + id);
            if (optionToDelete)
                UIControls.mainHypSelect.removeChild(optionToDelete);
            for (let i = id + 1; i < this.hypCounter; i++) {
                const el = UIControls.mainHypSelect.querySelector('.main-hypothesis__option_' + i);
                if (el) {
                    el.setAttribute('value', i - 1);
                    el.classList.replace('main-hypothesis__option_' + i, 'main-hypothesis__option_' + (i - 1));
                }
            }
        }
    }


    static async createModuleButtons() {

        const modules = ModuleIntegrator.modules;
        for (const folder of ModuleIntegrator.MODULE_FOLDERS) {
            const { default: Module } = await __webpack_require__("./modules lazy recursive ^\\.\\/.*\\/Module\\.js$")(`./${folder}/Module.js`);
            if (_modules_AbstractModule__WEBPACK_IMPORTED_MODULE_0__["default"].isPrototypeOf(Module))
                modules.push(Module);
            else
                throw new Error(`Class ${Module.name} doesn't extends ${_modules_AbstractModule__WEBPACK_IMPORTED_MODULE_0__["default"].name} class`);
        }

        const moduleListElement = UIControls.moduleListElement;

        for (let i = 0; i < modules.length; i++) {
            modules[i].setModuleTypeId(i);
            const moduleName = modules[i].getName();
            const moduleImage = modules[i].getImage();
            moduleListElement.innerHTML += `
            <li title="Добавить новую гипотезу" class="modules__item button" data-module-id='${i}'>
                <div class="modules__item-content">
                    <div class="modules__icon">
                        <img src="${moduleImage}" alt="${moduleName}">
                    </div>
                    <span class="modules__description">${moduleName}</span>
                </div>
            </li>`;
        }

        UIControls.addModuleBtnsListeners();
        UIControls.addModuleFormListeners(UIControls.parametersGlobItem, null, true);
        ModuleIntegrator.setSettings('glob', UIControls.parametersGlobItem.querySelector('form'));
    }

    //add new hypothesis by type id and if needed to make clone with reference Hyp
    static addHypothesis(hypTypeId, refHyp = null) {
        const globalSettings = ModuleIntegrator.globalSettings;
        const newHyp = new ModuleIntegrator.modules[hypTypeId](globalSettings.hypCounter, refHyp);
        ModuleIntegrator.hypotheses.push({ hyp: newHyp, update: null });
        if (!refHyp) {
            newHyp.createHTML();
        }
        const newEl = newHyp.getElement();
        globalSettings.createNewHypOption(globalSettings.hypCounter, newHyp.getName());
        _modules_AbstractModule__WEBPACK_IMPORTED_MODULE_0__["default"].addSheetOptions(_data_DataControls__WEBPACK_IMPORTED_MODULE_1__["default"].getListOfSheets(), newHyp.getSheetSelects());
        ModuleIntegrator.refreshVarsOfHyp(globalSettings.hypCounter)
        UIControls.addModuleFormListeners(newEl, newHyp.addListeners.bind(newHyp, newEl));

        if (globalSettings.unhiddenCounter === 0) {
            globalSettings.mainHypId = globalSettings.hypCounter;
            UIControls.mainHypSelect.lastElementChild.selected = true;
        }
        globalSettings.hypCounter++;
        globalSettings.unhiddenCounter++;

        ModuleIntegrator.setSettings('glob');
    }

    //add options to sheet select of all hypotheses with sheet obj and bool (should all hyp refresh vars?) 
    static optionListAdd(newSheet, optionsEmpty = false) {
        for (let i = 0; i < ModuleIntegrator.globalSettings.hypCounter; i++) {
            _modules_AbstractModule__WEBPACK_IMPORTED_MODULE_0__["default"].addSheetOptions([newSheet], ModuleIntegrator.hypotheses[i].hyp.getSheetSelects());
            if (optionsEmpty) {
                ModuleIntegrator.refreshVarsOfHyp(i);
            }
        }
    }

    static refreshVarsOfHyp(hypID, el = null) {
        let formElements;
        if (el) {
            formElements = [el];
        }
        else {
            formElements = ModuleIntegrator.hypotheses[hypID].hyp.getFormSheets();
        }
        formElements.forEach(element => {
            const curSheetId = Number(new FormData(element).get('sheet-select'));
            ModuleIntegrator.hypotheses[hypID].hyp.displayVarsOfSheet(curSheetId, element.dataset.type);
        })
    }

    static updateVarsOfSheet(sheetId, clearSelected) {
        ModuleIntegrator.hypotheses.forEach(el => {
            if (clearSelected) {
                el.hyp.clearSelectedVars();
            }
            else {
                el.hyp.updateSelectedVarsVisual(sheetId);
            }

            const formElements = el.hyp.getFormSheets();

            formElements.forEach((element) => {
                const curSheetId = Number(new FormData(element).get('sheet-select'));
                if (curSheetId === sheetId)
                    el.hyp.displayVarsOfSheet(curSheetId, element.dataset.type);
            });
        });

        this.setSettings('glob');
    }

    static setSettings(id) {

        UIControls.resultsLoadingShow();
        if (id === 'glob') {
            ModuleIntegrator.globalSettings.update = true;
        }
        else {
            ModuleIntegrator.hypotheses[id].update = true;
        }

        function delayed() {
            ModuleIntegrator.applySettings();
            UIControls.resultsLoadingHide();
            ModuleIntegrator.timerId = 0;
        }

        if (ModuleIntegrator.timerId) {
            clearTimeout(ModuleIntegrator.timerId);
        }

        ModuleIntegrator.timerId = setTimeout(delayed, 1000);
    }

    static applySettings() {
        const hypotheses = ModuleIntegrator.hypotheses;
        const globalSettings = ModuleIntegrator.globalSettings;
        let updateAllResults = false;
        let mainHyp = hypotheses[globalSettings.mainHypId];

        if (globalSettings.update) {
            ModuleIntegrator.setGlobalSettings();
            if (globalSettings.unhiddenCounter) {
                ModuleIntegrator.setMainSettings();
            }
            else {
                globalSettings.sampleSize = '-';
            }
            mainHyp = hypotheses[globalSettings.mainHypId];
            globalSettings.update = false;
            updateAllResults = true;
        }
        else if (mainHyp?.update) {
            ModuleIntegrator.setMainSettings();
            updateAllResults = true;
        }

        if (updateAllResults) {
            ModuleIntegrator.updateResultsGlob();
            mainHyp?.hyp.updateResultsHtml(true);
        }

        const alpha = globalSettings.getAlpha(false);
        for (let i = 0; i < ModuleIntegrator.globalSettings.hypCounter; i++) {
            const { hyp, update } = hypotheses[i];

            if ((updateAllResults || update) && hyp !== mainHyp.hyp && !hyp.hidden) {
                hyp.setSettings();
                hyp.setStatPower(alpha, globalSettings.sampleSize);
                hypotheses[i].update = false;
                hyp.updateResultsHtml(false);
            }
        }
    }

    static setGlobalSettings() {
        const globalSettings = ModuleIntegrator.globalSettings;
        const formData = new FormData(globalSettings.form);
        globalSettings.name = formData.get('name');
        globalSettings.FWER = Number(formData.get('FWER'));
        if (globalSettings.FWER <= 0 || globalSettings.FWER >= 100) {
            UIControls.showError(UIControls.FWERInput, 'Значение FWER должно быть больше, чем 0% и меньше, чем 100%');
        }
        globalSettings.mainHypId = Number(formData.get('mainHypothesis'));
        globalSettings.power = Number(formData.get('power'));
        if (globalSettings.power <= 0 || globalSettings.power >= 100) {
            UIControls.showError(UIControls.powerInput, 'Значение мощности должно быть больше, чем 0% и меньше, чем 100%');
        }
    }

    static setMainSettings() {
        const globalSettings = ModuleIntegrator.globalSettings;
        const mainHyp = ModuleIntegrator.hypotheses[globalSettings.mainHypId];
        mainHyp.hyp.setSettings();
        const n = mainHyp.hyp.getN(globalSettings.getAlpha(false), globalSettings.power);
        globalSettings.preciseSampleSize = n;
        globalSettings.sampleSize = Math.ceil(n);
        mainHyp.update = false;
    }

    static updateResultsGlob() {
        const globalSettings = ModuleIntegrator.globalSettings;

        UIControls.resName.textContent = globalSettings.name;
        UIControls.resFwer.textContent = Number.resultForm(globalSettings.FWER);
        UIControls.resNumber.textContent = globalSettings.unhiddenCounter;
        UIControls.resImportance.textContent = globalSettings.getAlpha();
        UIControls.resMainHyp.textContent = globalSettings.getMainHypName();
        UIControls.resPower.textContent = Number.resultForm(globalSettings.power);
        UIControls.resSampleSizePrecise.textContent = Number.resultForm(globalSettings.preciseSampleSize, false);
        UIControls.resSampleSize.textContent = Number.resultForm(globalSettings.sampleSize);
    }

    //extra functions 

    static hideUnhideHyp(id) {
        const hypotheses = ModuleIntegrator.hypotheses;
        const hyp = hypotheses[id];
        const globalSettings = ModuleIntegrator.globalSettings;
        const optionEl = UIControls.mainHypSelect.querySelector('.main-hypothesis__option_' + id);
        if (hyp.hidden) {
            unhide();
        }
        else {
            hide();
        }
        ModuleIntegrator.setSettings('glob');

        function hide() {
            optionEl.disabled = true;
            globalSettings.unhiddenCounter--;
            hyp.hidden = true;
            if (id === globalSettings.mainHypId) {
                optionEl.selected = false;
                if (globalSettings.unhiddenCounter === 0) {
                    globalSettings.mainHypId = null;
                    UIControls.mainHypSelectNullOption.selected = true;
                }
                else {
                    globalSettings.mainHypId = hypotheses.findIndex((el) => !el.hidden);
                    UIControls.mainHypSelect.querySelector('.main-hypothesis__option_' + globalSettings.mainHypId).selected = true;
                }
            }

            hyp.hyp.changeVisibilityResultsHtml(true);
        }

        function unhide() {
            optionEl.disabled = false;

            if (globalSettings.unhiddenCounter === 0) {
                globalSettings.mainHypId = id;
                optionEl.selected = true;
            }

            globalSettings.unhiddenCounter++;
            hyp.hidden = false;

            hyp.hyp.changeVisibilityResultsHtml(false);
        }
    }

    static nameChange(id, name) {
        const hyp = ModuleIntegrator.hypotheses[id];
        if (hyp) {
            hyp.hyp.setName(name);
            ModuleIntegrator.globalSettings.updateHypOption(id, name);
        }
    }

    static duplicateHyp(id) {
        const hyp = ModuleIntegrator.hypotheses[id];
        if (hyp) {
            ModuleIntegrator.addHypothesis(hyp.hyp.constructor.getModuleTypeId(), hyp.hyp);
        }
    }

    static deleteHyp(id) {
        const hyp = ModuleIntegrator.hypotheses[id];
        if (!hyp) {
            return;
        }
        const globalSettings = ModuleIntegrator.globalSettings;
        const optionEl = UIControls.mainHypSelect.querySelector('.main-hypothesis__option_' + id);
        ModuleIntegrator.globalSettings.deleteHypOption(id);

        globalSettings.hypCounter--;
        if (!hyp.hidden) {
            globalSettings.unhiddenCounter--;
        }

        hyp.hyp.deleteSelf();
        ModuleIntegrator.hypotheses[id] = null;

        for (let i = id; i < globalSettings.hypCounter; i++) {
            ModuleIntegrator.hypotheses[i] = ModuleIntegrator.hypotheses[i + 1];
            ModuleIntegrator.hypotheses[i].hyp.setId(i);
        }

        ModuleIntegrator.hypotheses = ModuleIntegrator.hypotheses.slice(0, -1);

        optionEl.selected = false;
        if (globalSettings.unhiddenCounter === 0) {
            globalSettings.mainHypId = null;
            UIControls.mainHypSelectNullOption.selected = true;
        }
        else {
            globalSettings.mainHypId = ModuleIntegrator.hypotheses.findIndex((el) => !el.hidden);
            UIControls.mainHypSelect.querySelector('.main-hypothesis__option_' + globalSettings.mainHypId).selected = true;
        }

        ModuleIntegrator.setSettings('glob');
    }

    static exportResults() {
        const resultsBlock = UIControls.resultsContainer;
        const htmlString = getHtmlString(resultsBlock);

        const blob = new Blob([htmlString], { type: 'text/html' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `${ModuleIntegrator.globalSettings.name}.html`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);

        function getHtmlString(resultsBlock) {
            return `
            <html>
              <head>
                <style>
                    body,
                    h1,
                    h2,
                    h3,
                    h4,
                    p,
                    ul[class],
                    ol[class],
                    li,
                    figure,
                    figcaption,
                    fieldset,
                    blockquote,
                    dl,
                    dd {
                        margin: 0;
                    }
                    body {
                        font-family: "Open Sans", sans-serif;
                        color: #000000;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 19px;
                        min-height: 100vh;
                        scroll-behavior: smooth;
                        text-rendering: optimizeSpeed;
                    }

                    p, th , td {
                        color: #000000;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 19px;
                    }
                    
                    h1 {
                        font-weight: 700;
                        font-size: 24px;
                        line-height: 33px;
                    }
                    
                    h2 {
                        font-weight: 700;
                        font-size: 20px;
                        line-height: 27px;
                    }
                    
                    b {
                        font-weight: 600;
                        font-size: 14px;
                        line-height: 19px;
                    }
                    
                    small {
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 16px;
                    }

                    .results__container {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        gap: 56px;
                        padding: 10px 24px 24px 24px;
                        max-width: 1048px;

                        font-weight: 400;
                        font-size: 14px;
                    }

                    .results__header {
                        overflow-wrap: break-word;
                        max-width: 100%;
                    }

                    .results__block {
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                        min-width: 1000px;
                        max-width: 1000px;
                        flex-shrink: 1;
                    }
                
                    .results__block-inner {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        max-width: 1000px;
                    }
                
                    .results__table {
                        border-bottom: 2px solid #000000;
                        border-collapse: collapse;
                        width: max-content;
                        max-width: 100%;
                    }

                    .results__table th {
                        white-space: nowrap;
                        border-top: 1px solid #000000;
                        border-bottom: 1px solid #000000;
                    }
            
                    .results__table th,
                    .results__table td {
                        padding: 0 16px 0 16px;
                        text-align: center;
                    }
            
                    .results__table td {
                        white-space: normal;
                        word-wrap: break-word;
                        width: max-content;
                        max-width: 200px;
                    }
            
                    .results__table caption {
                        caption-side: bottom;
                        text-align: left;
                    }
                </style>
              </head>
              <body>
                ${resultsBlock.outerHTML}
              </body>
            </html>
          `;
        }
    }
}



/***/ }),

/***/ "./UIControls.js":
/*!***********************!*\
  !*** ./UIControls.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data_DataControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @data/DataControls */ "./data/DataControls.js");
/* harmony import */ var _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/ModuleIntegrator */ "./ModuleIntegrator.js");



class UIControls {

    static body;
    static moduleListElement;
    static modulesItems = [];
    static burgerMenu;
    static burgerMenuInput;
    static fadeScreen;
    static menuBtns = [];
    static csvUploadBtn;
    static exportBtn;
    static settingsForm;
    static dataContainer;
    static dataTable;
    static dataFooter;
    static footerList;
    static dataFooterElements = {
        old: [],
        new: []
    };
    static calculationWindow;
    static parameters;
    static parametersContainer;
    static parametersGlobItem;
    static FWERInput;
    static powerInput;
    static mainHypSelect;
    static mainHypSelectNullOption;

    static resizeBarsEl = [];
    static results;
    static resultsContainer;
    static resultsLoader;

    static resBlock;
    static resFwer;
    static resNumber;
    static resImportance;
    static resMainHyp;
    static resPower;
    static resSampleSizePrecise;
    static resSampleSize;


    static modalVarType;
    static varIcons = {
        old: [],
        new: []
    };
    static varTypesBtns = [];
    static varTypesForm;
    static rangTable;
    static binSettings;
    static binTables;
    static varTypesLevelControls = {
        up: undefined,
        down: undefined
    };
    static varTypesSwitchBtn;
    static modalVarTypeBtns;
    static curIcon;
    static modalSettings;
    static dataSettingsBtns = {
        old: [],
        new: []
    };
    static modalSettingsBtns;
    static errorElement;

    static initConstUIControls() {
        UIControls.initConstElements();
        UIControls.initConstListeners();
    }

    static initConstElements() {
        UIControls.body = document.getElementsByTagName('body')[0];
        UIControls.moduleListElement = document.querySelector('.modules__list');

        UIControls.dataContainer = document.querySelector('.data__container');
        UIControls.dataFooter = UIControls.dataContainer.querySelector('.data__footer');
        UIControls.footerList = UIControls.dataContainer.querySelector('.footer__list');
        UIControls.burgerMenu = document.querySelector('.burger-menu');
        UIControls.burgerMenuInput = UIControls.burgerMenu.querySelector('#burger-menu__input');
        UIControls.fadeScreen = document.querySelector('.fade');
        UIControls.menuBtns = [...document.querySelectorAll('.sidebar__item')];

        UIControls.csvUploadBtn = document.getElementById('csvUpload');
        UIControls.exportBtn = document.getElementById('export-results');
        UIControls.settingsForm = document.getElementById('settings-form');

        UIControls.calculationWindow = document.querySelector('.calculation-window');
        UIControls.resizeBarsEl = [...UIControls.calculationWindow.querySelectorAll('.resize-bar')];
        UIControls.results = UIControls.calculationWindow.querySelector('.results');
        UIControls.resultsLoader = UIControls.results.querySelector('.loader');
        UIControls.resultsContainer = UIControls.results.querySelector('.results__container');

        UIControls.resBlock = UIControls.resultsContainer.querySelector('#global-results');
        UIControls.resName = UIControls.resBlock.querySelector('#results-name');
        UIControls.resFwer = UIControls.resBlock.querySelector('#results-FWER');
        UIControls.resNumber = UIControls.resBlock.querySelector('#results-number');
        UIControls.resImportance = UIControls.resBlock.querySelector('#results-importance');
        UIControls.resMainHyp = UIControls.resBlock.querySelector('#results-main-hyp');
        UIControls.resPower = UIControls.resBlock.querySelector('#results-power');
        UIControls.resSampleSize = UIControls.resBlock.querySelector('#results-sample-size');
        UIControls.resSampleSizePrecise = UIControls.resBlock.querySelector('#results-sample-size-precise');

        UIControls.parameters = UIControls.calculationWindow.querySelector('.parameters');
        UIControls.parametersContainer = UIControls.parameters.querySelector('.parameters__container');
        UIControls.parametersGlobItem = UIControls.parameters.querySelector('#parameters__item_glob');
        UIControls.FWERInput = UIControls.parametersGlobItem.querySelector('#FWER-input');
        UIControls.powerInput = UIControls.parametersGlobItem.querySelector('#power-input');
        UIControls.mainHypSelect = UIControls.parametersContainer.querySelector('#main-hypothesis');
        UIControls.mainHypSelectNullOption = UIControls.mainHypSelect.querySelector('.main-hypothesis__option_null');

        UIControls.modalVarType = document.querySelector('.modal-var-types');
        UIControls.varTypesForm = UIControls.modalVarType.querySelector('#var-type-form');
        UIControls.rangTable = UIControls.modalVarType.querySelector('.modal-var-types__rang-table-body');
        UIControls.binSettings = UIControls.modalVarType.querySelector('.modal-var-types__binary-settings');
        UIControls.binTables = [...UIControls.modalVarType.querySelectorAll('.modal-var-types__binary-table-body')];
        UIControls.varTypesLevelControls.up = UIControls.modalVarType.querySelector('.switch-button_up');
        UIControls.varTypesLevelControls.down = UIControls.modalVarType.querySelector('.switch-button_down');
        UIControls.modalVarTypeBtns = [...UIControls.modalVarType.querySelectorAll('.modal-var-types__btn')];
        UIControls.varTypesSwitchBtn = UIControls.binSettings.querySelector('.switch-button');
        UIControls.modalSettings = document.querySelector('.modal-settings');
        UIControls.modalSettingsBtns = [...UIControls.modalSettings.querySelectorAll('.modal-settings__btn')];

        UIControls.errorElement = document.querySelector('#error-show');
    }

    static initConstListeners() {
        UIControls.addBurgerListener();
        // UIControls.addMenuBtnsListeners();
        UIControls.addResizeBarsListeners();
        UIControls.addWindowResizeListeners();
        UIControls.addModalSettingsListener();
        UIControls.addModalVarChooseListener();
        UIControls.addCsvUploadListeners();
        UIControls.addExportBtnListeners();
    }

    static initNewSheetControls() {
        UIControls.initNewSheetElements();
        UIControls.initNewSheetListeners();
    }

    static initNewSheetElements() {
        UIControls.dataFooterElements.new = [...UIControls.dataFooter.querySelectorAll('.footer__item_new')];
        UIControls.varIcons.new = [...UIControls.dataContainer.querySelectorAll('.data__var-icon_new')];
        UIControls.dataSettingsBtns.new = [...UIControls.dataContainer.querySelectorAll('.dataSettingsBtn_new')];
    }

    static initNewSheetListeners() {
        UIControls.addVarIconsListeners();
        UIControls.addDataSettingsListener();
        UIControls.addFooterItemListeners();
    }

    // LISTENERS //

    static addBurgerListener() {
        UIControls.burgerMenu.addEventListener('click', UIControls.toggleMenu);
        UIControls.fadeScreen.addEventListener('click', UIControls.toggleMenu);
        // UIControls.fadeScreen.addEventListener('click', UIControls.fadeScreenTriggerFadeOut);
    }

    // static addMenuBtnsListeners() {
    //     UIControls.menuBtns.forEach(btn => {
    //         btn.addEventListener('click', UIControls.toggleMenu);
    //     });
    // }

    static addCsvUploadListeners() {
        UIControls.csvUploadBtn.addEventListener('click', function () {
            this.value = null;
        });

        UIControls.csvUploadBtn.addEventListener('change', (event) => {
            _data_DataControls__WEBPACK_IMPORTED_MODULE_0__["default"].readSingleFile(event);
            UIControls.toggleMenu();
        });
    }

    static addExportBtnListeners() {
        UIControls.exportBtn.addEventListener('click', () => {
            _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].exportResults();
            UIControls.toggleMenu();
        });
    }

    static addResizeBarsListeners() {
        UIControls.resizeBarsEl.forEach(el => {
            el.addEventListener('mousedown', mousedown);
        });

        function mousedown(e) {

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            const startX = e.clientX;
            const startWidth = UIControls.calculationWindow.offsetWidth;


            function mousemove(event) {
                event.preventDefault();
                UIControls.calculationWindow.style.width = (startWidth - (event.clientX - startX)) + 'px';
            }

            function mouseup() {
                UIControls.resizeBarCheckBounds();
                UIControls.footerChange();

                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            }
        }
    }

    static addWindowResizeListeners() {
        window.addEventListener('DOMContentLoaded', UIControls.footerChange);
        window.addEventListener('resize', UIControls.footerChange);
        window.addEventListener('resize', UIControls.resizeBarCheckBounds);
    }

    static addFooterItemListeners() {
        UIControls.dataFooterElements.new.forEach(el => {
            el.addEventListener('click', () => _data_DataControls__WEBPACK_IMPORTED_MODULE_0__["default"].selectSheet(el.id));
            el.classList.remove('footer__item_new');
            UIControls.dataFooterElements.old.push(el);
        });
        UIControls.dataFooterElements.new = [];
    }

    static addVarIconsListeners() {
        UIControls.varIcons.new.forEach(el => {
            el.addEventListener('click', (event) => {
                const create = _data_DataControls__WEBPACK_IMPORTED_MODULE_0__["default"].createVarSettings.bind(null, event.currentTarget.getAttribute('id'));
                UIControls.openModal(event, UIControls.modalVarType, create);
            });
            el.classList.remove('data__var-icon_new');
        });
        UIControls.varIcons.new = [];
    }

    static addDataSettingsListener() {
        UIControls.dataSettingsBtns.new.forEach(el => {
            el.addEventListener('click', (event) => {
                UIControls.openModal(event, UIControls.modalSettings);
            });
            el.classList.remove('dataSettingsBtn_new');
            UIControls.dataSettingsBtns.old.push(el);
        })
        UIControls.dataSettingsBtns.new = [];
    }

    static addModalSettingsListener() {
        UIControls.modalSettings.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        UIControls.settingsForm.addEventListener('submit', (event) => {
            _data_DataControls__WEBPACK_IMPORTED_MODULE_0__["default"].submitSettings(event, new FormData(UIControls.settingsForm));
        });

        UIControls.modalSettingsBtns.forEach(btn => {
            btn.addEventListener('click', () => UIControls.modalSettings.style.display = 'none');
        });

        UIControls.modalSettings.querySelector('.modal-window__header').addEventListener('mousedown', (event) => {
            UIControls.dragMouseDown(event, UIControls.modalSettings);
        });
    }

    static addModalVarChooseListener() {
        UIControls.modalVarType.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        UIControls.varTypesLevelControls.up.addEventListener('click', () => { moveLabel(false) });
        UIControls.varTypesLevelControls.down.addEventListener('click', () => { moveLabel(true) });
        UIControls.varTypesSwitchBtn.addEventListener('click', switchLabel);

        UIControls.varTypesForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newOrder = [...UIControls.rangTable.querySelectorAll('.var-table__item')].map(el => Number(el.dataset.order));
            const twoTables = {
                group0: [...UIControls.binTables[0].querySelectorAll('.var-table__item')].map(el => el.dataset.anchor),
                group1: [...UIControls.binTables[1].querySelectorAll('.var-table__item')].map(el => el.dataset.anchor)
            };
            _data_DataControls__WEBPACK_IMPORTED_MODULE_0__["default"].setVarSettings(new FormData(UIControls.varTypesForm), newOrder, twoTables);
        });

        UIControls.modalVarTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => UIControls.modalVarType.style.display = 'none');
        });

        UIControls.modalVarType.querySelector('.modal-window__header').addEventListener('mousedown', (event) => {
            UIControls.dragMouseDown(event, UIControls.modalVarType);
        });


        function switchLabel() {
            const curLabel = UIControls.binSettings.querySelector('input[type="radio"]:checked').parentElement;
            const curTableBody = curLabel.parentElement;

            curTableBody.removeChild(curLabel);

            const insertChild = (toTable) => {
                toTable.insertBefore(curLabel, toTable.querySelector('.var-table__anchor_' + curLabel.dataset.anchor));
            }

            if (curTableBody.isSameNode(UIControls.binTables[0])) {
                insertChild(UIControls.binTables[1]);
            }
            else {
                insertChild(UIControls.binTables[0]);
            }

        }
        function moveLabel(isDown) {
            const rangTable = UIControls.rangTable;
            const curLabel = rangTable.querySelector('input[type="radio"]:checked').parentElement;
            if (!curLabel)
                return;

            let sibling;
            if (isDown && curLabel.nextElementSibling) {
                sibling = curLabel.nextElementSibling;
                rangTable.removeChild(curLabel);
                rangTable.insertBefore(curLabel, sibling.nextElementSibling);
            }
            else if (!isDown && curLabel.previousElementSibling) {
                sibling = curLabel.previousElementSibling;
                rangTable.removeChild(curLabel);
                rangTable.insertBefore(curLabel, sibling);
            }
        }
    }

    // MODULE LISTENERS //

    static addModuleBtnsListeners() {
        const modulesItems = [...document.querySelectorAll('.modules__item')];
        UIControls.modulesItems = modulesItems;
        modulesItems.forEach(el => {
            const id = el.dataset.moduleId;
            el.addEventListener('click', () => {
                _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].addHypothesis(id);
            });
        });
    }

    static addModuleFormListeners(element, moduleCallbackFunction, isGlob) {
        const elementFormMain = element.querySelector('.module-option-form');
        const triggers = [...element.querySelectorAll('.form-change-trigger')];

        if (isGlob) {
            triggers.forEach(el => el.addEventListener('change', () => {
                _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].setSettings('glob', elementFormMain, elementFormMain.querySelector('.target-table-data'));
            }));
            return;
        }

        triggers.forEach(el => el.addEventListener('change', () => {
            _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].setSettings(getId(element), elementFormMain, elementFormMain.querySelector('.target-table-data'));
        }));

        const elementFormSheets = [...element.querySelectorAll('.sheet-form')];
        elementFormSheets.forEach(el => {
            el.addEventListener('change', () => {
                _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].refreshVarsOfHyp(getId(element), el);
            });
        });

        // manual input listener

        const manualInput = element.querySelector('.manual-input-on');
        const dataInputTwo = element.querySelector('.data-input-two');
        const dataInputGroup = element.querySelector('.data-input-group');
        const tableTwo = element.querySelector('.two-column-var');
        const tableGroup = element.querySelector('.grouping-var');
        const testTypeBlock = element.querySelector('.option-block__test-type');
        const manualEllements = [...element.querySelectorAll(`.option-block__manual-input`)];

        manualInput?.addEventListener('click', () => {
            const testName = testTypeBlock.querySelector('input:checked').value;
            const manualEllement = element.querySelector(`.option-block__${testName}`);
            manualEllement.classList.remove('option-block_hidden');
            tableTwo?.classList.add('option-block_hidden');
            tableGroup?.classList.add('option-block_hidden');
        });

        dataInputTwo?.addEventListener('click', () => {
            hideAllManualOptionBlocks();
            tableGroup?.classList.add('option-block_hidden');
            tableTwo.classList.remove('option-block_hidden');
        });

        dataInputGroup?.addEventListener('click', () => {
            hideAllManualOptionBlocks();
            tableTwo?.classList.add('option-block_hidden');
            tableGroup.classList.remove('option-block_hidden');
        });

        if (testTypeBlock) {
            const testTypeInputs = [...testTypeBlock.querySelectorAll('input')];
            testTypeInputs.forEach((el) => {
                el.addEventListener('click', () => {
                    if (manualInput.checked) {
                        hideAllManualOptionBlocks();
                        const manualEllement = element.querySelector(`.option-block__${el.value}`);
                        manualEllement.classList.remove('option-block_hidden');
                    }
                });
            });
        }

        function hideAllManualOptionBlocks() {
            manualEllements?.forEach((el) => {
                el.classList.add('option-block_hidden');
            });
        }

        //unique listeners
        if (moduleCallbackFunction) {
            moduleCallbackFunction();
        }

        //extra

        //hide

        const hideBtn = element.querySelector('.parameters__hide-button').querySelector('input');
        hideBtn.addEventListener('click', (e) => {
            _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].hideUnhideHyp(getId(element));
        });



        //rename

        const renamebtn = element.querySelector('.parameters__edit-button');
        const elementHeader = element.querySelector('.parameters__title');
        const elementHeaderInput = element.querySelector('.parameters__title-input');
        elementHeaderInput.value = elementHeader.textContent;
        const focusListener = function () {
            submitNewName();
        }
        const enterListener = function (e) {
            if (e.key === 'Enter')
                submitNewName();
        }

        renamebtn.addEventListener('click', () => {
            elementHeader.style.display = 'none';
            elementHeaderInput.style.display = 'block';
            elementHeaderInput.focus();
            elementHeaderInput.addEventListener('focusout', focusListener);
            elementHeaderInput.addEventListener('keypress', enterListener);
        });

        function submitNewName() {
            if (elementHeaderInput.value.trim() === '') {
                UIControls.showError(elementHeaderInput, 'Заполните это поле');
                return;
            }
            elementHeaderInput.removeEventListener('focusout', focusListener);
            elementHeaderInput.removeEventListener('keypress', enterListener);
            elementHeader.style.display = 'inline';
            elementHeaderInput.style.display = 'none';
            _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].nameChange(getId(element), elementHeaderInput.value);
        }

        //dublicate

        const dupbtn = element.querySelector('.parameters__duplicate-button');
        dupbtn.addEventListener('click', () => {
            _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].duplicateHyp(getId(element));
        });

        //delete 

        const deleteBtn = element.querySelector('.parameters__delete-button');
        deleteBtn.addEventListener('click', () => {
            _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_1__["default"].deleteHyp(getId(element));
        });

        function getId(el) {
            return Number(el.querySelector('.module-option-form').dataset.id);
        }
    }

    // COMMON FUNCTIONS //

    static resizeBarCheckBounds() {
        const calculationWindowWidth = UIControls.calculationWindow.offsetWidth;
        const resizeBarWidth = UIControls.resizeBarsEl[0].offsetWidth;
        const resultsWidth = resizeBarWidth + UIControls.results.offsetWidth;
        const parametersWidth = resizeBarWidth + UIControls.parameters.offsetWidth;
        const bodyWidth = UIControls.body.clientWidth;

        if (resultsWidth >= bodyWidth) {
            UIControls.calculationWindow.style.width = parametersWidth + bodyWidth + 'px';
        }
        else if (calculationWindowWidth < resizeBarWidth) {
            UIControls.calculationWindow.style.width = resizeBarWidth + 'px';
        }
    }

    static toggleMenu() {
        if (UIControls.burgerMenuInput.checked)
            fadeOut();
        else
            fadeIn();

        function fadeIn() {
            UIControls.fadeScreen.style['z-index'] = '1';
            UIControls.burgerMenuInput.checked = true;
            UIControls.fadeScreen.style.opacity = '1';
        }

        function fadeOut() {
            UIControls.fadeScreen.style['z-index'] = '-1';
            UIControls.burgerMenuInput.checked = false;
            UIControls.fadeScreen.style.opacity = '0';
        }
    }

    static footerChange() {
        const dataTable = UIControls.dataContainer.querySelector('.data__table_shown');
        const dataContainer = UIControls.dataContainer;
        const dataFooter = UIControls.dataFooter;

        if (!dataTable) {
            dataFooter.style.width = 0;
            return;
        }
        dataFooter.style.width = dataContainer.offsetWidth > dataTable.offsetWidth ? '100%' : dataTable.offsetWidth + 'px';
        if (dataContainer.offsetHeight > dataTable.offsetHeight) {
            dataFooter.style.position = 'absolute';
        }
        else {
            dataFooter.style.position = 'sticky';
        }
    }

    static openModal(event, modalWindow, createModalFunc) {
        const curIcon = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        modalWindow.style.left = curIcon.getBoundingClientRect().right + 'px';
        modalWindow.style.top = curIcon.getBoundingClientRect().bottom + 'px';
        if (createModalFunc) {
            createModalFunc();
        }
        modalWindow.style.display = 'block';

        // Убрать окно по клику снаружи

        window.addEventListener('click', closeModal, { once: true });
        function closeModal() {
            modalWindow.style.display = 'none';
        }
    }

    static dragMouseDown(e, elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    static resultsLoadingShow() {
        UIControls.resultsContainer.style.opacity = '0.1';
        UIControls.resultsLoader.style.display = 'block';
    }

    static resultsLoadingHide() {
        UIControls.resultsContainer.style.opacity = '1';
        UIControls.resultsLoader.style.display = 'none';
    }

    static showError(el, errorText) {
        const rect = el.getBoundingClientRect();
        const x = countCoord((rect.x + rect.width / 2), window.innerWidth);
        const y = countCoord((rect.y + rect.height), window.innerHeight);
        function countCoord(c, max, gap = 10) {
            if (c > gap) {
                const realMax = max - gap;
                if (c < realMax) {
                    return c;
                }
                else {
                    return realMax;
                }
            }
            else {
                return gap;
            }
        }

        UIControls.errorElement.style.left = x + 'px';
        UIControls.errorElement.style.top = y + 'px';
        UIControls.errorElement.setCustomValidity(errorText);
        UIControls.errorElement.reportValidity();
    }
}

window.UIControls = UIControls;



/***/ }),

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @styles/styles.scss */ "./styles/styles.scss");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/utils */ "./utils/utils.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_utils_utils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _UIControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/UIControls */ "./UIControls.js");
/* harmony import */ var _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/ModuleIntegrator */ "./ModuleIntegrator.js");




// import DataControls from '@data/DataControls';
// import UIControls from '@/UIControls';
// import { binTest } from '@/tests';

UIControls.initConstUIControls();
_ModuleIntegrator__WEBPACK_IMPORTED_MODULE_3__["default"].createModuleButtons();

/***/ }),

/***/ "./data/DataControls.js":
/*!******************************!*\
  !*** ./data/DataControls.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DataControls)
/* harmony export */ });
/* harmony import */ var _data_Sheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @data/Sheet */ "./data/Sheet.js");
/* harmony import */ var _data_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @data/Settings */ "./data/Settings.js");



class DataControls {
    static #sheets = [];
    static #currentSheet;

    static readSingleFile(event) {
        const file = event.target.files[0];
        if (file) {
            DataControls.addSheet(file);
        } else {
            alert("Failed to load file");
        }
    }

    static submitSettings(event, formData) {
        event.preventDefault();
        const applyTo = formData.get('apply-to');
        const curSheet = DataControls.#currentSheet;

        if (applyTo === 'this') {
            curSheet.setSettings(formData);
        }
        else if (applyTo === 'all') {
            console.log('all', formData);
            _data_Settings__WEBPACK_IMPORTED_MODULE_1__["default"].setGlobalSettings(formData);
            DataControls.#sheets.forEach(sheet => sheet.setSettings(formData));
        }
        curSheet.applySettingsAndShow();
    }

    static createVarSettings(varId) {
        DataControls.#currentSheet.createVarSettings(varId);
    }

    static setVarSettings(formData, newOrder, twoTables) {
        DataControls.#currentSheet.setVarSettings(formData, newOrder, twoTables);
    }

    static addSheet(file) {
        const arrayLength = DataControls.#sheets.length;
        DataControls.#currentSheet?.hide();
        const name = file.name.split('.').slice(0, -1).join('');
        const newSheet = new _data_Sheet__WEBPACK_IMPORTED_MODULE_0__["default"](name, file, arrayLength)
        DataControls.#sheets.push(newSheet);
        DataControls.#currentSheet = newSheet;

    }

    static selectSheet(sheetId) {
        const sheet = DataControls.#sheets[sheetId];
        if (DataControls.#currentSheet == sheet)
            return;

        DataControls.#currentSheet?.hide();
        DataControls.#currentSheet = sheet;
        if (sheet.readyToShow()) {
            sheet.show();
        }
        else {
            sheet.applySettingsAndShow();
        }
    }

    static getListOfSheets() {
        return this.#sheets.map((el, index) => {
            return {
                name: el.getName(),
                id: el.getID()
            };
        })
    }

    static getSheetById(id) {
        return this.#sheets[id];
    }

    static getVarsBySheetId(id) {
        if (DataControls.#sheets[id]) {
            return DataControls.#sheets[id].getVars();
        }
        return null;
    }

    static getVarBySheetIdAndVarId(sheetId, varId) {
        if (DataControls.#sheets[sheetId]) {
            return DataControls.#sheets[sheetId].getVarById(varId);
        }
        return null;
    }

    static getDataBySheetAndVarId(sheetId, varId) {
        return this.#sheets[sheetId].getDataByVarId(varId);
    }
}



/***/ }),

/***/ "./data/Settings.js":
/*!**************************!*\
  !*** ./data/Settings.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _initial_settings_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./initial-settings.json */ "./data/initial-settings.json");


class Settings {
    static #form = document.getElementById('settings-form');
    static #skipInput = Settings.#form.querySelector('#skip-options');
    static #encodingInput = Settings.#form.querySelector('#encoding-options');
    static #colDelimiterInput = Settings.#form.querySelector('#col-delimiter-options');
    static #decimalDelimiterInput = Settings.#form.querySelector('#decimal-delimiter-options');

    static #globalSettings = _initial_settings_json__WEBPACK_IMPORTED_MODULE_0__;
    #skip;
    #encoding;
    #colDelimiter;
    #decimalDelimiter;

    constructor() {
        this.init(Settings.#globalSettings);
    }

    init(settings) {
        this.#skip = Object.deepCopy(settings['skip']);
        this.#encoding = Object.deepCopy(settings['encoding']);
        this.#colDelimiter = Object.deepCopy(settings['col-delimiter']);
        this.#decimalDelimiter = Object.deepCopy(settings['decimal-delimiter']);
    }

    createHTML() {
        Settings.#skipInput.setAttribute('value', `${this.#skip.value}`);
        Settings.#skipInput.value = this.#skip.value;

        createOptions(this.#encoding, Settings.#encodingInput);
        createOptions(this.#colDelimiter, Settings.#colDelimiterInput);
        createOptions(this.#decimalDelimiter, Settings.#decimalDelimiterInput);

        function createOptions(settingName, settingElement) {
            settingElement.innerHTML = '';
            for (let option of Object.entries(settingName.select)) {
                settingElement.innerHTML += `<option value="${option[0]}" ${settingName.selected === option[0] ? 'selected' : ''}>${option[1]}</option>`;
            }
        }
    }

    getSettings() {
        return {
            skip: this.#skip,
            encoding: this.#encoding,
            colDelimiter: this.#colDelimiter,
            decimalDelimiter: this.#decimalDelimiter,
        };
    }

    setSettings(formData) {
        this.#skip.value = formData.get('skip');
        this.#encoding.selected = formData.get('encoding');
        this.#colDelimiter.selected = formData.get('col-delimiter');
        this.#decimalDelimiter.selected = formData.get('decimal-delimiter');
    }

    static setGlobalSettings(formData) {
        Settings.#globalSettings['skip'].value = formData.get('skip');
        Settings.#globalSettings['encoding'].selected = formData.get('encoding');
        Settings.#globalSettings['col-delimiter'].selected = formData.get('col-delimiter');
        Settings.#globalSettings['decimal-delimiter'].selected = formData.get('decimal-delimiter');
    }
}

/***/ }),

/***/ "./data/Sheet.js":
/*!***********************!*\
  !*** ./data/Sheet.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Sheet)
/* harmony export */ });
/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! papaparse */ "../node_modules/papaparse/papaparse.min.js");
/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(papaparse__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings */ "./data/Settings.js");
/* harmony import */ var _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/ModuleIntegrator */ "./ModuleIntegrator.js");
/* harmony import */ var _Var__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Var */ "./data/Var.js");


// import UIControls from '@/UIControls';



class Sheet {
    #name;
    #id;
    #data;
    #dataVars = [];
    #settings = {
        obj: {},
        props: {}
    };
    #tableElement;
    #footerElement;
    #file;
    #needToApplySettings = false;
    #openedVar;


    constructor(name, file, id) {
        this.#id = id;
        this.#name = name;
        this.#settings.obj = new _Settings__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this.#settings.props = this.#settings.obj.getSettings();;
        this.#createTableElement();
        this.#createFooterElement();
        this.importFile(file);
    }

    importFile(file) {
        this.#file = file;
        this.#parseDataInFile(true);
    }

    setSettings(settingsFormData) {
        this.#needToApplySettings = true;
        this.#settings.obj.setSettings(settingsFormData);
        this.#settings.props = this.#settings.obj.getSettings();
    }

    applySettingsAndShow() {
        this.#needToApplySettings = false;
        this.#parseDataInFile(false);
    }

    createVarSettings(varID) {
        const changedVar = this.#dataVars[Number(varID.split('_')[2])]
        changedVar.createHTML();
        this.#openedVar = changedVar;
    }

    setVarSettings(formData, order, twoTables) {
        this.#openedVar.setSettings(formData, order, twoTables);
        _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_2__["default"].updateVarsOfSheet(this.#id, false);
    }

    readyToShow() {
        return !this.#needToApplySettings;
    }

    show() {
        this.#settings.obj.createHTML();
        this.#tableElement.classList.add('data__table_shown');
        this.#footerElement.classList.add('footer__item_selected');
        UIControls.footerChange();
    }

    hide() {
        this.#tableElement.classList.remove('data__table_shown');
        this.#footerElement.classList.remove('footer__item_selected');
    }

    setId(id) {
        this.#id = id;
        this.#footerElement.setAttribute('id', id);
    }

    #createTableElement() {
        this.#tableElement = UIControls.dataContainer.insertBefore(document.createElement('table'), UIControls.dataContainer.firstChild);
        this.#tableElement.classList.add('data__table');
        this.#tableElement.setAttribute('id', this.#id);
        this.#tableElement.innerHTML = `
        <thead>
            <tr>
                <th title="Настройки импортированных данных" id="dataSettingsBtn" class="dataSettingsBtn_new">
                    <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
                        width="19px" height="19px">
                        <path
                            d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z" />
                    </svg>
                </th>
            </tr>
        </thead>
        <tbody>
        </tbody>`;
    }

    #createFooterElement() {
        this.#footerElement = UIControls.footerList.appendChild(document.createElement('li'));
        this.#footerElement.classList.add('footer__item', 'footer__item_selected', 'footer__item_new');
        this.#footerElement.setAttribute('id', this.#id);
        this.#footerElement.innerHTML = `
        <div class="footer__item-content">
            <span class="footer__item-text">
                ${this.#name}
            </span>
        </div>`;
    }

    #createHTML() {
        const createThead = () => {
            const createTh = (name, index) => {
                return `<th>
                    <div class="data__column-header">
                        <div title="Сменить тип данных колонки" id=${this.#dataVars[index].getID()} class="data__var-icon data__var-icon_new">
                            <img src="${this.#dataVars[index].getImg()}" alt="${this.#dataVars[index].getName()}">
                        </div>
                        <span class="data__var-name">${name}</span>
                    </div>
                </th>`;
            };

            const headersArray = this.#data[0].map((el, index) => createTh(el, index));
            return headersArray.reduce((ths, element) => ths + element);

        };

        const createTbody = () => {
            let curRow = 1;

            const createTr = (vals) => {
                return `
                <tr>
                    <td>${curRow++}</td>
                    ${vals.reduce((tds, element) => tds + element)}
                </tr>`;
            };

            return this.#data.slice(1).map(row =>
                createTr(row.map(val =>
                    `<td class='${typeof val == 'number' ? 'number' : ''}'>${val}</td>`
                ))).join('');

        };

        const createInnerHtml = (createHeader, createBody) => {
            const head = this.#tableElement.querySelector('tr');
            const btn = head.querySelector('#dataSettingsBtn');
            const body = this.#tableElement.querySelector('tbody');

            head.innerHTML = createHeader ? createThead() : '';
            head.insertBefore(btn, head.firstElementChild);

            body.innerHTML = createBody ? createTbody() : '';
        };


        switch (this.#data.length) {
            case 0: {
                createInnerHtml(false, false);
                break;
            }
            case 1: {
                createInnerHtml(true, false);
                break
            }
            default: {
                createInnerHtml(true, true);
            }
        }

        UIControls.initNewSheetControls();
        this.show();
    }

    #parseDataInFile(isNewFile) {
        const del = this.#settings.props.decimalDelimiter.selected;
        let regExpReadyDel = del;
        if (RegExp.specialSymbols.includes(del)) {
            regExpReadyDel = '\\' + del;
        }
        const regex = new RegExp(`^-?(?:\\d+(?:${regExpReadyDel}\\d+)?|\\d+(?:${regExpReadyDel}\\d+)?(?:e|E)(?:\\+|-)?\\d+)$`);

        papaparse__WEBPACK_IMPORTED_MODULE_0__.parse(this.#file, {
            encoding: this.#settings.props.encoding.selected,
            delimiter: this.#settings.props.colDelimiter.selected,
            transform: (val, col) => {
                let valTrimmed = val.trim();

                if (regex.test(valTrimmed)) {
                    return Number(valTrimmed.replace(del, '.'));
                }
                else {
                    return valTrimmed;
                }
            },
            skipEmptyLines: true,
            complete: (results) => {
                const skip = this.#settings.props.skip.value;
                if (skip != 0) {
                    results.data = results.data.slice(skip);
                }
                this.#data = results.data;
                this.#initVars();
                this.#createHTML();
                if (isNewFile) {
                    _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_2__["default"].optionListAdd({
                        name: this.#name,
                        id: this.#id
                    });
                }
                if (this.#id === 0 || !isNewFile) {
                    _ModuleIntegrator__WEBPACK_IMPORTED_MODULE_2__["default"].updateVarsOfSheet(this.#id, true);
                }
            }
        });
    }

    #initVars() {
        if (this.#data.length === 0)
            return;

        let i = 0;
        const idName = () => 'var' + '_' + this.#id + '_' + (i++);
        const dataVars = this.#data[0].map((_, colIndex) => getColumnVar(this.#data.map(row => row[colIndex])));
        this.#dataVars = dataVars;

        function getColumnVar(column) {
            const columnData = column.slice(1);
            const uniqueValues = new Set(columnData);
            const notANumber = columnData.find(val => typeof val !== 'number');

            const newVar = (type) => new _Var__WEBPACK_IMPORTED_MODULE_3__["default"](type, idName(), uniqueValues, column[0], (notANumber == undefined));

            if (columnData.length === 0) {
                return newVar(_Var__WEBPACK_IMPORTED_MODULE_3__["default"].Nominal);
            }

            if (uniqueValues.size === 2) {
                return newVar(_Var__WEBPACK_IMPORTED_MODULE_3__["default"].Binary);
            }

            if (notANumber) {
                return newVar(_Var__WEBPACK_IMPORTED_MODULE_3__["default"].Nominal);
            }
            return newVar(_Var__WEBPACK_IMPORTED_MODULE_3__["default"].Continues);
        }
    }

    getName() {
        return this.#name;
    }

    getID() {
        return this.#id;
    }

    getVars() {
        return this.#dataVars;
    }

    getVarById(varId) {
        return this.#dataVars[varId];
    }

    getDataByVarId(varId) {
        return this.#data.map((arr) => arr[varId]);
    }
}

/***/ }),

/***/ "./data/Var.js":
/*!*********************!*\
  !*** ./data/Var.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Var)
/* harmony export */ });
/* harmony import */ var _img_table_scaleNominal_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @img/table/scaleNominal.png */ "./img/table/scaleNominal.png");
/* harmony import */ var _img_table_scaleContinues_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @img/table/scaleContinues.png */ "./img/table/scaleContinues.png");
/* harmony import */ var _img_table_scaleBinary_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @img/table/scaleBinary.png */ "./img/table/scaleBinary.png");
/* harmony import */ var _img_table_scaleRang_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @img/table/scaleRang.png */ "./img/table/scaleRang.png");




// import UIControls from '../UIControls';

class Var {
    static Binary = {
        name: 'binary',
        ruName: 'дихотомический',
        img: _img_table_scaleBinary_png__WEBPACK_IMPORTED_MODULE_2__,
    };
    static Nominal = {
        name: 'nominal',
        ruName: 'номинативный',
        img: _img_table_scaleNominal_png__WEBPACK_IMPORTED_MODULE_0__,
    };
    static Continues = {
        name: 'continues',
        ruName: 'количественный',
        img: _img_table_scaleContinues_png__WEBPACK_IMPORTED_MODULE_1__,
    };
    static Rang = {
        name: 'rang',
        ruName: 'ранговый',
        img: _img_table_scaleRang_png__WEBPACK_IMPORTED_MODULE_3__,
    };

    #typeName;
    #ruTypeName;
    #name;
    #id;
    #img;
    #set = [];
    #order = [];
    #binaryGroups;
    #onlyNumbers;

    constructor(type, id, set, name, onlyNumbers) {
        this.#typeName = type.name;
        this.#img = type.img;
        this.#ruTypeName = type.ruName;
        this.#id = id;
        this.#name = name;
        this.#onlyNumbers = onlyNumbers;
        let sortFunction = this.#typeName !== 'continues' ?
            undefined : function (a, b) {
                return a - b;
            };
        this.#set = [...set].sort(sortFunction);
        this.#order = new Array(set.size);
        for (let i = 0; i < set.size; i++) {
            this.#order[i] = i;
        }
        this.#binaryGroups = new Array(Math.ceil(set.size / 32)).fill(0);
        if (this.#typeName === 'binary')
            this.#binaryGroups[0] = (0x1 << 30);
    }

    setSettings(formData, order, twoTables) {
        const varHeader = document.getElementById(this.#id);

        this.#name = formData.get('var-name');
        varHeader.nextElementSibling.textContent = this.#name;

        this.#typeName = formData.get('var-type');
        this.#img = Object.entries(Var).find(item => item[1]['name'] === this.#typeName)[1]['img'];
        varHeader.querySelector('img').setAttribute('src', this.#img);

        this.#order = order;

        if (!twoTables.group1[0]) {
            this.#binaryGroups.fill(0);
            return;
        }

        let curItem = 0;
        let curBit = twoTables.group1[curItem];
        let nextBit = twoTables.group1[curItem];
        let shift = curBit;
        let number;
        for (let i = 0; i < this.#binaryGroups.length; i++) {
            number = 0x0;

            while (nextBit < 32 * (i + 1)) {
                number <<= shift;
                number |= 0x1;
                curBit = twoTables.group1[curItem];
                nextBit = twoTables.group1[++curItem]
                shift = nextBit - curBit;
            }

            number <<= (31 - (curBit % 32));
            this.#binaryGroups[this.#binaryGroups.length - i - 1] = number;
        }
    }
    createHTML() {
        const modal = UIControls.modalVarType;
        const name = UIControls.modalVarType.querySelector('#modal-var-types__name');
        const continuesLabel = UIControls.modalVarType.querySelector('.modal-var-types__continues-container');
        const varChooseInputs = [...UIControls.modalVarType.querySelectorAll('.modal-var-types__item-input')];
        const rangBody = modal.querySelector('.modal-var-types__rang-table-body');
        const binBodies = [...modal.querySelectorAll('.modal-var-types__binary-table-body')];

        name.value = this.#name;
        name.setAttribute('value', this.#name);

        varChooseInputs.forEach(element => {
            element.checked = element.value === this.#typeName;
        });
        if (!this.#onlyNumbers) {
            continuesLabel.classList.add('radio-line_disabled');
            continuesLabel.firstElementChild.disabled = true;
        }
        else {
            continuesLabel.classList.remove('radio-line_disabled');
            continuesLabel.firstElementChild.disabled = false;
        }

        let str = '';
        for (let i = 0; i < this.#set.length; i++) {
            str += `
            <label class="var-table__item" data-order="${this.#order[i]}">
                <input type="radio" name="data_value">
                <span>${this.#set[this.#order[i]]}</span>
            </label>`;
        }
        rangBody.innerHTML = str;

        let str1 = '';
        let str2 = '';
        let counter = 0;
        let fin = this.#set.length - 1;
        const getLabel = (counter, value) => {
            return `<label class="var-table__item" data-anchor=${counter}>
                        <input type="radio" name="data_value">
                        <span>${value}</span>
                    </label>`};
        const getAnchor = (counter) => `<div class='var-table__anchor var-table__anchor_${counter}'></div>`;
        for (let q = this.#binaryGroups.length - 1; q >= 0; q--) {
            let shift = 31;
            let binNumber = (0x1 << shift);

            for (let i = 0; i < 32; i++) {
                if ((this.#binaryGroups[q] & binNumber) === 0x0) {
                    str1 += getLabel(counter, this.#set[counter]);
                } else {
                    str2 += getLabel(counter, this.#set[counter]);
                }

                str1 += getAnchor(counter);
                str2 += getAnchor(counter);

                counter++;
                binNumber = binNumber >>> 1;
                if (counter > fin)
                    break;
            }
        }

        binBodies[0].innerHTML = str1;
        binBodies[1].innerHTML = str2;

    }

    //returns 0 if zero group, 1 if in first, -1 if val is not in the set 
    isValInZeroGroup(val) {
        const indexInSet = this.#set.indexOf(val);
        if (indexInSet === -1)
            return -1;
        const grLength = this.#binaryGroups.length;

        const groupIndex = grLength - Math.floor(indexInSet / 32) - 1;
        if (groupIndex < 0) {
            return -1;
        }
        const bitIndex = indexInSet % 32;
        const bit = this.#binaryGroups[groupIndex] >>> (31 - bitIndex);

        if (bit & 0x1 === 1) {
            return 1;
        }
        else {
            return 0;
        }
    }

    getOrderOfVal(val) {
        const indexInSet = this.#set.indexOf(val);
        if (indexInSet === -1)
            return -1;
        const order = this.#order.indexOf(indexInSet);

        return order !== undefined ? order : -1;
    }

    getID() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getImg() {
        return this.#img;
    }

    getTypeName() {
        return this.#typeName;
    }

    getRuTypeName() {
        return this.#ruTypeName;
    }
}

/***/ }),

/***/ "./modules/AbstractModule.js":
/*!***********************************!*\
  !*** ./modules/AbstractModule.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractModule)
/* harmony export */ });
class AbstractModule {

    static comElements = {
        parametersContainer: document.querySelector('.parameters__container'),
        resultsContainer: document.querySelector('.results__container'),
    }

    constructor() {
        if (AbstractModule === new.target)
            throw new Error("Can't create an instance of an abstract class");
    }

    static setModuleTypeId(id) {
        throw new Error('This method must be implemented');
    }

    static getModuleTypeId() {
        throw new Error('This method must be implemented');
    }

    static getName() {
        throw new Error('This method must be implemented');
    }

    static getImage() {
        throw new Error('This method must be implemented');
    }

    deleteSelf() {
        throw new Error('This method must be implemented');
    }

    getAllData() {
        throw new Error('This method must be implemented');

    }

    setName(name) {
        throw new Error('This method must be implemented');
    }

    setId(id) {
        throw new Error('This method must be implemented');
    }

    getName() {
        throw new Error('This method must be implemented');
    }

    getElement() {
        throw new Error('This method must be implemented');
    }

    getFormSheets() {
        throw new Error('This method must be implemented');
    }

    getSheetSelects() {
        throw new Error('This method must be implemented');
    }

    addListeners(element) {
        throw new Error('This method must be implemented');
    }

    displayVarsOfSheet(sheetId, type) {
        throw new Error('This method must be implemented');
    }

    updateSelectedVarsVisual(sheetId) {
        throw new Error('This method must be implemented');
    }

    clearSelectedVars() {
        throw new Error('This method must be implemented');
    }

    createHTML() {
        throw new Error('This method must be implemented');
    }

    setSettings() {
        throw new Error('This method must be implemented');
    }

    getN(alpha, power) {
        throw new Error('This method must be implemented');
    }

    setStatPower(alpha, sampleSize) {
        throw new Error('This method must be implemented');
    }

    updateResultsHtml(isMain) {
        throw new Error('This method must be implemented');
    }

    changeVisibilityResultsHtml(hide) {
        throw new Error('This method must be implemented');
    }

    //ABSTRACT ONLY

    static addSheetOptions(listOfSheets, selects) {
        let str = '';
        for (let el of listOfSheets) {
            if (!selects[0].querySelector(`.select-option-${el.id}`)) {
                const option = `<option class='select-option-${el.id}' value="${el.id}">${el.name}</option>`
                str += option;
            }
        }

        for (let select of selects) {
            select.innerHTML += str;
        }
    }

    getZAlpha(altHypTest, alpha) {
        return altHypTest === 'both' ? Math.norminv(alpha / 2) : Math.norminv(alpha)
    }

    getZ(zAlpha, power) {
        return zAlpha + Math.norminv(100 - power);
    }
}



/***/ }),

/***/ "./modules lazy recursive ^\\.\\/.*\\/Module\\.js$":
/*!*************************************************************!*\
  !*** ./modules/ lazy ^\.\/.*\/Module\.js$ namespace object ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./correlation-test/Module.js": [
		"./modules/correlation-test/Module.js",
		"modules_correlation-test_Module_js"
	],
	"./independent-sample-test/Module.js": [
		"./modules/independent-sample-test/Module.js",
		"modules_independent-sample-test_Module_js"
	],
	"./paired-sample-test/Module.js": [
		"./modules/paired-sample-test/Module.js",
		"modules_paired-sample-test_Module_js"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./modules lazy recursive ^\\.\\/.*\\/Module\\.js$";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./utils/utils.js":
/*!************************!*\
  !*** ./utils/utils.js ***!
  \************************/
/***/ (() => {

Object.deepCopy = function (from) {
    return JSON.parse(JSON.stringify(from));
}

RegExp.specialSymbols = ['[', ']', '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];

window.timeout = function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// get p in percents
Math.norminv = function (p) {
    p = p / 100;
    const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
    const a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
    const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
    const b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029E-03;
    const c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
    const c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146E-03;
    const d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
    const p_low = 0.02425, p_high = 1 - p_low;
    let q, r;
    let retVal;

    if ((p < 0) || (p > 1)) {
        return undefined;
    }
    else if (p < p_low) {
        q = Math.sqrt(-2 * Math.log(p));
        retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    else if (p <= p_high) {
        q = p - 0.5;
        r = q * q;
        retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
}

// return p in percents
Math.normdist = function (z) {
    let sign = 1;
    if (z < 0)
        sign = -1;

    return 0.5 * (1.0 + sign * erf(Math.abs(z) / Math.sqrt(2))) * 100;

    function erf(x) {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        x = Math.abs(x);
        const t = 1 / (1 + p * x);
        return 1 - ((((((a5 * t + a4) * t) + a3) * t + a2) * t) + a1) * t * Math.exp(-1 * x * x);
    }
}

Math.mean = function (array) {
    return array.reduce((el, c) => el + c) / array.length;
}

Math.stddiv = {};
Math.stddiv.s = function (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => ((x - mean) ** 2)).reduce((a, b) => a + b) / (n - 1))
}

Math.fisher = function (number) {
    return 0.5 * Math.log((1 + number) / (1 - number));
}

Number.resultForm = function (n, noRound) {
    return typeof n === 'number' && !Number.isNaN(n) ? (noRound ? n : Math.roundGOST(n, 2)) : '-';
}

String.resultForm = function (s) {
    return s !== undefined && s !== null ? s : '-';
}

// Math.roundFixed = function (num, dec) {
//     const mult = 10 ** dec;
//     return Math.round((num + Number.EPSILON) * mult) / mult;
// }

Math.roundGOST = function (num) {
    let tempN = Math.abs(num);
    let tempAnswer;
    if (tempN >= 10) {
        tempAnswer = num;
        if (String(tempN).split('.')[1]?.charAt(1) === '5') {
            tempAnswer += 0.01 * Math.sign(num);
        }
        return tempAnswer.toFixed(1);
    }
    else if (tempN >= 1) {
        tempAnswer = num;
        if (String(tempN).charAt(4) === '5') {
            tempAnswer += 0.001 * Math.sign(num);
        }
        return tempAnswer.toPrecision(3);
    }
    else {
        if (tempN === 0.995) {
            return Math.round(num).toFixed(2);
        }
        tempAnswer = num.toPrecision(2);
        if (tempAnswer == 1) {
            return '1.00';
        }
        else if (tempAnswer == -1) {
            return '-1.00';
        }
        else {
            return tempAnswer;
        }
    }
}

//Возможно нужно ранжировать значения обоих выборок как одной
Math.rank = {};
Math.rank.avg = function (array, getRankFunc) {
    const obj = {
        get(i) {
            if (this[i])
                return this[i].avg;
        }
    };
    for (let el of array) {
        if (obj[el]) {
            obj[el].count++;
        }
        else {
            obj[el] = {
                avg: el.getRankFunc(),
                count: 1
            }
        }
    }
    let curRank = 0;
    let nextRank = 1;
    let curKey = getKeyByValue(obj, curRank);
    let nextKey = getKeyByValue(obj, nextRank);
    while (curKey !== undefined) {
        obj[key].avg = obj[key].avg + obj[key].count * 0.5 - 0.5;
        obj[nextKey].avg += obj[key].count - 1;
        curRank = nextRank;
        nextRank = nextRank + 1;
        curKey = nextKey;
        nextKey = getKeyByValue(obj, nextRank);
    }

    return obj;

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }
}

/***/ }),

/***/ "./img/table/scaleBinary.png":
/*!***********************************!*\
  !*** ./img/table/scaleBinary.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "58c46c2b0032b8505b9d.png";

/***/ }),

/***/ "./img/table/scaleContinues.png":
/*!**************************************!*\
  !*** ./img/table/scaleContinues.png ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6509e67c0ca32b030024.png";

/***/ }),

/***/ "./img/table/scaleNominal.png":
/*!************************************!*\
  !*** ./img/table/scaleNominal.png ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4811c0d6fa606c9bc636.png";

/***/ }),

/***/ "./img/table/scaleRang.png":
/*!*********************************!*\
  !*** ./img/table/scaleRang.png ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "eaea2495a0d40b237a4e.png";

/***/ }),

/***/ "./data/initial-settings.json":
/*!************************************!*\
  !*** ./data/initial-settings.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"skip":{"value":"0"},"encoding":{"select":{"windows-1251":"Windows-1251","utf-8":"UTF-8"},"selected":"windows-1251"},"col-delimiter":{"select":{",":"Запятая (,)",".":"Точка (.)",";":"Точка c запятой (;)"},"selected":","},"decimal-delimiter":{"select":{",":"Запятая (,)",".":"Точка (.)"},"selected":"."}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			};
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_papaparse_papaparse_min_js"], () => (__webpack_require__("./app.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map