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
        preciseSampleSize: undefined,
        sampleSize: undefined,
        update: null,

        getAlpha(asString = true) {
            if (this.hypCounter) {
                if (asString) {
                    return Math.roundGOST(this.FWER / this.hypCounter);
                }
                else {
                    return this.FWER / this.hypCounter;
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
        UIControls.addModuleFormListeners('glob', UIControls.parametersGlobItem);
        ModuleIntegrator.setSettings('glob', UIControls.parametersGlobItem.querySelector('form'));
    }

    static addHypothesis(hypTypeId) {
        const globalSettings = ModuleIntegrator.globalSettings;
        const newHyp = new ModuleIntegrator.modules[hypTypeId](globalSettings.hypCounter);
        ModuleIntegrator.hypotheses.push({ hyp: newHyp, update: null });
        const newEls = newHyp.createHTML();
        const form = newHyp.getFormMain();
        AbstractModule.addSheetOptions(DataControls.getListOfSheets(), newHyp.getSheetSelect());
        ModuleIntegrator.refreshVarsOfHyp(globalSettings.hypCounter)
        UIControls.addModuleFormListeners(globalSettings.hypCounter, newEls.newHyp, newHyp.addListeners.bind(newHyp, newEls.newHyp));
        ModuleIntegrator.setSettings(globalSettings.hypCounter, form);

        if (ModuleIntegrator.hypotheses.length === 1) {
            globalSettings.mainHypId = globalSettings.hypCounter;
            UIControls.mainHypSelect.lastElementChild.selected = true;
        }
        globalSettings.hypCounter++;
    }

    static optionListAdd(newSheet, optionsEmpty = false) {
        const hypotheses = ModuleIntegrator.hypotheses;
        for (let i = 0; i < hypotheses.length; i++) {
            AbstractModule.addSheetOptions([newSheet], hypotheses[i].hyp.getSheetSelect());
            if (optionsEmpty) {
                ModuleIntegrator.refreshVarsOfHyp(i);
            }
        }
    }

    static refreshVarsOfHyp(hypID) {
        const formElement = ModuleIntegrator.hypotheses[hypID].hyp.getFormSheet();
        const sheetId = new FormData(formElement).get('sheet-select');
        ModuleIntegrator.hypotheses[hypID].hyp.displayVarsOfSheet(sheetId);
    }

    static updateVarsOfSheet(sheetId, clearSelected) {
        ModuleIntegrator.hypotheses.forEach(el => {
            if (clearSelected) {
                el.hyp.clearSelectedVars();
            }
            else {
                el.hyp.updateSelectedVarsVisual(sheetId);
            }

            if (new FormData(el.hyp.getFormSheet()).get('sheet-select') == sheetId) {
                el.hyp.displayVarsOfSheet(sheetId);
            }
        })
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

        ModuleIntegrator.timerId = setTimeout(delayed, 1500);
    }

    static applySettings() {
        const hypotheses = ModuleIntegrator.hypotheses;
        const globalSettings = ModuleIntegrator.globalSettings;
        let updateAllResults = false;
        let mainHyp = hypotheses[globalSettings.mainHypId];

        if (globalSettings.update) {
            ModuleIntegrator.setGlobalSettings();
            if (globalSettings.hypCounter) {
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
        for (let i = 0; i < hypotheses.length; i++) {
            const { hyp, update } = hypotheses[i];

            if ((updateAllResults || update) && hyp !== mainHyp.hyp) {
                console.log('norm ' + i);
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
        UIControls.resNumber.textContent = globalSettings.hypCounter;
        UIControls.resImportance.textContent = globalSettings.getAlpha();
        UIControls.resMainHyp.textContent = globalSettings.getMainHypName();
        UIControls.resPower.textContent = Number.resultForm(globalSettings.power);
        UIControls.resSampleSizePrecise.textContent = Number.resultForm(globalSettings.preciseSampleSize, false);
        UIControls.resSampleSize.textContent = Number.resultForm(globalSettings.sampleSize);
    }
}

