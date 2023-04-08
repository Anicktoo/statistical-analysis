import AbstractModule from '@modules/AbstractModule';
import UIControls from './UIControls';

const MODULE_FOLDERS = ['paired-sample-test', 'independent-sample-test', 'correlation-test'];
const resultsEl = UIControls.resultsEl;
const hypotheses = [];
let mainHyp = null;

export async function createModuleButtons() {

    const modules = [];
    for (const folder of MODULE_FOLDERS) {
        const { default: Module } = await import(`@modules/${folder}/Module.js`);
        if (AbstractModule.isPrototypeOf(Module))
            modules.push(Module);
        else
            throw new Error(`Class ${Module.name} doesn't extends ${AbstractModule.name} class`);
    }

    const moduleListElement = document.querySelector('.modules__list');

    for (const module of modules) {
        const moduleName = module.getName();
        const moduleImage = module.getImage();
        moduleListElement.innerHTML += `
        <li title="Добавить новую гипотезу" class="modules__item button">
            <div class="modules__item-content">
                <div class="modules__icon">
                    <img src="${moduleImage}" alt="${moduleName}">
                </div>
                <span class="modules__description">${moduleName}</span>
            </div>
        </li>`;
    }
}

export async function setSettings(formId, formData) {

}

function processData() {

}

function updateResults() {

}