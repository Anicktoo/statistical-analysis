import AbstractModule from '@modules/AbstractModule';
// import UIControls from './UIControls';
import DataControls from './data/DataControls';

export default class ModuleIntegrator {
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
            const { default: Module } = await import(`@modules/${folder}/Module.js`);
            if (AbstractModule.isPrototypeOf(Module))
                modules.push(Module);
            else
                throw new Error(`Class ${Module.name} doesn't extends ${AbstractModule.name} class`);
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
        AbstractModule.addSheetOptions(DataControls.getListOfSheets(), newHyp.getSheetSelects());
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
            AbstractModule.addSheetOptions([newSheet], ModuleIntegrator.hypotheses[i].hyp.getSheetSelects());
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

