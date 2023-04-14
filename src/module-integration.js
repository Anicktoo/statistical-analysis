import AbstractModule from '@modules/AbstractModule';
import UIControls from './UIControls';
import DataControls from './data/DataControls';

const MODULE_FOLDERS = ['paired-sample-test', 'independent-sample-test', 'correlation-test'];
const modules = [];
// const resultsEl = UIControls.resultsEl;
const hypotheses = [];
const globalSettings = {
    form: document.querySelector('#module-option-form_glob'),
    name: undefined,
    FWER: undefined,
    mainHypId: undefined,
    power: undefined,
    hypCounter: 0,
    sampleSize: undefined,
    update: null,
    getAlpha() {
        if (this.hypCounter) {
            return this.FWER / this.hypCounter;
        }
        else {
            return '-';
        }
    }
}


export async function createModuleButtons() {

    for (const folder of MODULE_FOLDERS) {
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
    setSettings('glob', UIControls.parametersGlobItem.querySelector('form'));
}

export function addHypothesis(hypTypeId) {
    const newHyp = new modules[hypTypeId](globalSettings.hypCounter);
    if (hypotheses.length === 0) {
        globalSettings.mainHypId = globalSettings.hypCounter;
    }
    hypotheses.push({ hyp: newHyp, update: null });
    const newEls = newHyp.createHTML();
    const form = newHyp.getFormMain();
    AbstractModule.addSheetOptions(DataControls.getListOfSheets(), newHyp.getSheetSelect());
    refreshVarsOfHyp(globalSettings.hypCounter)
    UIControls.addModuleFormListeners(globalSettings.hypCounter, newEls.newHyp, newHyp.addListeners.bind(newHyp, newEls.newHyp));
    setSettings(globalSettings.hypCounter, form);
    globalSettings.hypCounter++;
}

export function optionListAdd(newSheet, optionsEmpty = false) {
    for (let i = 0; i < hypotheses.length; i++) {
        AbstractModule.addSheetOptions([newSheet], hypotheses[i].hyp.getSheetSelect());
        if (optionsEmpty) {
            refreshVarsOfHyp(i);
        }
    }
}

export function refreshVarsOfHyp(hypID) {
    const formElement = hypotheses[hypID].hyp.getFormSheet();
    const sheetId = new FormData(formElement).get('sheet-select');
    hypotheses[hypID].hyp.displayVarsOfSheet(sheetId);
}

export function updateVarsOfSheet(sheetId, clearSelected) {
    hypotheses.forEach(el => {
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

let timerId;
export function setSettings(id) {
    UIControls.resultsLoadingShow();
    if (id === 'glob') {
        globalSettings.update = true;
    }
    else {
        hypotheses[id].update = true;
    }

    function delayed() {
        applySettings();
        UIControls.resultsLoadingHide();
        timerId = 0;
    }

    if (timerId) {
        clearTimeout(timerId);
    }

    timerId = setTimeout(delayed, 1500);
}

function applySettings() {
    let updateAllResults = false;
    const mainHyp = hypotheses[globalSettings.mainHypId];

    if (globalSettings.update) {
        setGlobalAndMainHypSettings();
        updateAllResults = true;
    }
    else if (mainHyp?.update) {
        setMainSettings();
        updateAllResults = true;
    }

    for (let i = 0; i < hypotheses.length; i++) {
        const { hyp, update } = hypotheses[i];

        if ((updateAllResults || update) && hyp !== mainHyp) {
            console.log('norm ' + i);
            if (update) {
                hyp.setSettings();
            }
            hyp.setStatPower();
            hypotheses[i].update = false;
            updateResults();
        }
    }
}

function setGlobalAndMainHypSettings() {
    console.log('glob');
    const formData = new FormData(globalSettings.form);
    globalSettings.name = formData.get('name');
    globalSettings.FWER = formData.get('FWER');
    globalSettings.mainHypId = Number(formData.get('mainHypothesis'));
    globalSettings.power = formData.get('power');
    if (globalSettings.hypCounter) {
        // globalSettings.sampleSize = hypotheses[globalSettings.mainHypId].hyp.getN(globalSettings.getAlpha());
        setMainSettings();
    }
    else {
        globalSettings.sampleSize = '-';
    }
    globalSettings.update = false;
}

function setMainSettings() {
    console.log('main');
    const mainHyp = hypotheses[globalSettings.mainHypId];
    mainHyp.hyp.setSettings(globalSettings.power);
    globalSettings.sampleSize = mainHyp.hyp.getN(globalSettings.getAlpha());
    mainHyp.update = false;
}

function updateResults(id) {

}

//master

