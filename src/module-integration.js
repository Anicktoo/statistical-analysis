import AbstractModule from '@modules/AbstractModule';
import UIControls from './UIControls';
import DataControls from './data/DataControls';

const MODULE_FOLDERS = ['paired-sample-test', 'independent-sample-test', 'correlation-test'];
const modules = [];
// const resultsEl = UIControls.resultsEl;
const hypotheses = [];
const mainSettings = {
    name: undefined,
    FWER: undefined,
    mainHypId: undefined,
    alpha: undefined,
    hypCounter: 0,
    sampleSize: undefined,
    update: null
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
    UIControls.addModuleFormListeners('main', UIControls.parametersMainItem);
}

export function addHypothesis(hypTypeId) {
    const newHyp = new modules[hypTypeId](mainSettings.hypCounter);
    if (hypotheses.length === 0) {
        mainSettings.mainHypId = mainSettings.hypCounter;
    }
    hypotheses.push({ hyp: newHyp, update: null });
    const newEls = newHyp.createHTML();
    const form = newHyp.getFormMain();
    AbstractModule.addSheetOptions(DataControls.getListOfSheets(), newHyp.getSheetSelect());
    displayVars(mainSettings.hypCounter)
    UIControls.addModuleFormListeners(mainSettings.hypCounter, newEls.newHyp, newHyp.addListeners.bind(newHyp, newEls.newHyp));
    setSettings(mainSettings.hypCounter, form);
    mainSettings.hypCounter++;
}

export function optionListAdd(newSheet, optionsEmpty = false) {
    for (let i = 0; i < hypotheses.length; i++) {
        AbstractModule.addSheetOptions([newSheet], hypotheses[i].hyp.getSheetSelect());
        if (optionsEmpty) {
            displayVars(i);
        }
    }
}

let timerId;
export function setSettings(id, formElement, tableData) {
    UIControls.resultsLoadingShow();
    if (id === 'main') {
        mainSettings.update = new FormData(formElement);
    }
    else {
        hypotheses[id].update = { formData: new FormData(formElement), tableData };
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

    if (mainSettings.update) {
        setGlobalSettings(mainSettings.update);
        mainSettings.update = null;
        updateAllResults = true;
    }

    const mainHyp = hypotheses[mainSettings.mainHypId];

    if (mainHyp?.update) {
        setMainSettings(mainHyp.update);
        mainHyp.update = null;
        updateAllResults = true;
    }

    for (let i = 0; i < hypotheses.length; i++) {
        const { hyp, update } = hypotheses[i];

        if ((updateAllResults || update) && hyp !== mainHyp) {
            console.log('norm ' + i);
            if (update) {
                hyp.setSettings(update);
            }
            hyp.setStatPower();
            hypotheses[i].formEl = null;
            updateResults();
        }
    }
}

function setGlobalSettings(formaData) {
    console.log('glob');
    mainSettings.name = formaData.get('name');
    mainSettings.FWER = formaData.get('FWER');
    mainSettings.mainHypId = Number(formaData.get('mainHypothesis'));
    mainSettings.power = formaData.get('power');
    if (mainSettings.hypCounter) {
        mainSettings.alpha = mainSettings.FWER / mainSettings.hypCounter;
        mainSettings.sampleSize = hypotheses[mainSettings.mainHypId].hyp.getN(mainSettings.alpha);
    }
    else {
        mainSettings.alpha = '-';
        mainSettings.sampleSize = '-';
    }

}

function setMainSettings(formaData) {
    console.log('main');
    hypotheses[mainSettings.mainHypId].hyp.setSettings(formaData);
    mainSettings.sampleSize = hypotheses[mainSettings.mainHypId].hyp.getN(mainSettings.alpha);
}

function updateResults(id) {

}

export function displayVars(hypID) {
    const formElement = hypotheses[hypID].hyp.getFormSheet();
    const sheetId = new FormData(formElement).get('sheet-select');
    hypotheses[hypID].hyp.displayVarsOfSheet(sheetId);
}

export function displayVarsBySheetId(sheetId) {
    hypotheses.forEach(el => {
        if (new FormData(el.hyp.getFormSheet()).get('sheet-select') == sheetId) {
            el.hyp.displayVarsOfSheet(sheetId);
        }
    })
}