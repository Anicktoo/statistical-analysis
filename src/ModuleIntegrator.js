import AbstractModule from '@modules/AbstractModule';
import dataControls from '@data/dataControls';

const moduleIntegrator = {
    _MODULE_FOLDERS: ['paired-sample-test', 'independent-sample-test', 'correlation-test'],
    _modules: [],
    _timerId: undefined,
    _hypotheses: [],
    _globalSettings: {
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
            const main = moduleIntegrator._hypotheses[this.mainHypId];
            return main && main.hyp ? main.hyp.getName() : '-';
        },
        createNewHypOption(id, name) {
            const newOption = document.createElement('option');
            newOption.setAttribute('value', id);
            newOption.classList.add('main-hypothesis__option_' + id);
            newOption.textContent = name;
            uiControls.mainHypSelect.appendChild(newOption);
        },
        updateHypOption(id, name) {
            const newOption = uiControls.mainHypSelect.querySelector('.main-hypothesis__option_' + id);
            if (newOption)
                newOption.textContent = name;
        },
        deleteHypOption(id) {
            const optionToDelete = uiControls.mainHypSelect.querySelector('.main-hypothesis__option_' + id);
            if (optionToDelete)
                uiControls.mainHypSelect.removeChild(optionToDelete);
            for (let i = id + 1; i < this.hypCounter; i++) {
                const el = uiControls.mainHypSelect.querySelector('.main-hypothesis__option_' + i);
                if (el) {
                    el.setAttribute('value', i - 1);
                    el.classList.replace('main-hypothesis__option_' + i, 'main-hypothesis__option_' + (i - 1));
                }
            }
        }
    },

    async createModuleButtons() {

        const modules = moduleIntegrator._modules;
        for (const folder of moduleIntegrator._MODULE_FOLDERS) {
            const { default: Module } = await import(`@modules/${folder}/Module.js`);
            if (AbstractModule.isPrototypeOf(Module))
                modules.push(Module);
            else
                throw new Error(`Class ${Module.name} doesn't extends ${AbstractModule.name} class`);
        }

        const moduleListElement = uiControls.moduleListElement;

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

        uiControls.addModuleBtnsListeners();
        uiControls.addModuleFormListeners(uiControls.parametersGlobItem, null, true);
        moduleIntegrator.setSettings('glob', uiControls.parametersGlobItem.querySelector('form'));
    },

    getData() {
        return 'module';
    },

    getHypElementById(id) {
        if (id || id === 0) {
            return moduleIntegrator._hypotheses[id].hyp.getElement();
        }
    },

    getResultElementById(id) {
        if (id || id === 0) {
            return moduleIntegrator._hypotheses[id].hyp.getResultElement();
        }
    },

    //add new hypothesis by type id and if needed to make clone with reference Hyp. returns new hypothesis ID
    addHypothesis(hypTypeId, refHyp = null) {
        const globalSettings = moduleIntegrator._globalSettings;
        const newHyp = new moduleIntegrator._modules[hypTypeId](globalSettings.hypCounter, refHyp);
        moduleIntegrator._hypotheses.push({ hyp: newHyp, update: null });
        if (!refHyp) {
            newHyp.createHTML();
        }
        const newEl = newHyp.getElement();
        globalSettings.createNewHypOption(globalSettings.hypCounter, newHyp.getName());
        newHyp.setSheetOptions(dataControls.getListOfSheets());
        moduleIntegrator.refreshVarsOfHyp(globalSettings.hypCounter)
        uiControls.addModuleFormListeners(newEl, newHyp.addListeners.bind(newHyp, newEl));

        if (globalSettings.unhiddenCounter === 0) {
            globalSettings.mainHypId = globalSettings.hypCounter;
            uiControls.mainHypSelect.lastElementChild.selected = true;
        }
        globalSettings.hypCounter++;
        globalSettings.unhiddenCounter++;

        moduleIntegrator.setSettings('glob');

        return globalSettings.hypCounter - 1;
    },

    //add options to sheet select of all hypotheses with sheet obj and bool (should all hyp refresh vars?) 
    optionListAdd(newSheet, optionsEmpty = false) {
        for (let i = 0; i < moduleIntegrator._globalSettings.hypCounter; i++) {
            moduleIntegrator._hypotheses[i].hyp.addSheetOptions([newSheet]);
            if (optionsEmpty) {
                moduleIntegrator.refreshVarsOfHyp(i);
            }
        }
    },

    refreshVarsOfHyp(hypID, el = null) {
        let formElements;
        if (el) {
            formElements = [el];
        }
        else {
            formElements = moduleIntegrator._hypotheses[hypID].hyp.getFormSheets();
        }
        formElements.forEach(element => {
            const curSheetId = Number(new FormData(element).get('sheet-select'));
            moduleIntegrator._hypotheses[hypID].hyp.displayVarsOfSheet(curSheetId, element.dataset.type);
        })
    },

    updateVarsOfSheet(sheetId, clearSelected) {
        moduleIntegrator._hypotheses.forEach(el => {
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
    },

    setSettings(id) {

        uiControls.resultsLoadingShow();
        if (id === 'glob') {
            moduleIntegrator._globalSettings.update = true;
        }
        else {
            moduleIntegrator._hypotheses[id].update = true;
        }

        function delayed() {
            moduleIntegrator.applySettings();
            uiControls.resultsLoadingHide();
            moduleIntegrator._timerId = 0;
        }

        if (moduleIntegrator._timerId) {
            clearTimeout(moduleIntegrator._timerId);
        }

        moduleIntegrator._timerId = setTimeout(delayed, 1000);
    },

    applySettings() {
        const hypotheses = moduleIntegrator._hypotheses;
        const globalSettings = moduleIntegrator._globalSettings;
        let updateAllResults = false;
        let mainHyp = hypotheses[globalSettings.mainHypId];

        if (globalSettings.update) {
            moduleIntegrator.setGlobalSettings();
            if (globalSettings.unhiddenCounter) {
                moduleIntegrator.setMainSettings();
            }
            else {
                globalSettings.sampleSize = '-';
            }
            mainHyp = hypotheses[globalSettings.mainHypId];
            globalSettings.update = false;
            updateAllResults = true;
        }
        else if (mainHyp?.update) {
            moduleIntegrator.setMainSettings();
            updateAllResults = true;
        }

        if (updateAllResults) {
            moduleIntegrator.updateResultsGlob();
            mainHyp?.hyp.updateResultsHtml(true);
        }

        const alpha = globalSettings.getAlpha(false);
        for (let i = 0; i < moduleIntegrator._globalSettings.hypCounter; i++) {
            const { hyp, update, hidden } = hypotheses[i];

            if ((updateAllResults || update) && hyp !== mainHyp.hyp && !hidden) {
                hyp.setSettings();
                hyp.setStatPower(alpha, globalSettings.sampleSize);
                hypotheses[i].update = false;
                hyp.updateResultsHtml(false);
            }
        }
    },

    setGlobalSettings() {
        const globalSettings = moduleIntegrator._globalSettings;
        const formData = new FormData(globalSettings.form);
        globalSettings.name = formData.get('name');
        globalSettings.FWER = Number(formData.get('FWER'));
        if (globalSettings.FWER <= 0 || globalSettings.FWER >= 100) {
            uiControls.showError(uiControls.FWERInput, 'Значение FWER должно быть больше, чем 0% и меньше, чем 100%');
        }
        globalSettings.mainHypId = Number(formData.get('mainHypothesis'));
        globalSettings.power = Number(formData.get('power'));
        if (globalSettings.power <= 0 || globalSettings.power >= 100) {
            uiControls.showError(uiControls.powerInput, 'Значение мощности должно быть больше, чем 0% и меньше, чем 100%');
        }
    },

    setMainSettings() {
        const globalSettings = moduleIntegrator._globalSettings;
        const mainHyp = moduleIntegrator._hypotheses[globalSettings.mainHypId];
        mainHyp.hyp.setSettings();
        const n = mainHyp.hyp.getN(globalSettings.getAlpha(false), globalSettings.power);
        globalSettings.preciseSampleSize = n;
        globalSettings.sampleSize = Math.ceil(n);
        mainHyp.update = false;
    },

    updateResultsGlob() {
        const globalSettings = moduleIntegrator._globalSettings;

        uiControls.resName.textContent = globalSettings.name;
        uiControls.resFwer.textContent = Number.resultForm(globalSettings.FWER);
        uiControls.resNumber.textContent = globalSettings.unhiddenCounter;
        uiControls.resImportance.textContent = globalSettings.getAlpha();
        uiControls.resMainHyp.textContent = globalSettings.getMainHypName();
        uiControls.resPower.textContent = Number.resultForm(globalSettings.power);
        uiControls.resSampleSizePrecise.textContent = Number.resultForm(globalSettings.preciseSampleSize);
        uiControls.resSampleSize.textContent = Number.resultForm(globalSettings.sampleSize, true);
    },

    //extra functions 

    hideUnhideHyp(id) {
        const hypotheses = moduleIntegrator._hypotheses;
        const hyp = hypotheses[id];
        const globalSettings = moduleIntegrator._globalSettings;
        const optionEl = uiControls.mainHypSelect.querySelector('.main-hypothesis__option_' + id);
        if (hyp.hidden) {
            unhide();
        }
        else {
            hide();
        }
        moduleIntegrator.setSettings('glob');

        function hide() {
            optionEl.disabled = true;
            globalSettings.unhiddenCounter--;
            hyp.hidden = true;
            if (id === globalSettings.mainHypId) {
                optionEl.selected = false;
                if (globalSettings.unhiddenCounter === 0) {
                    globalSettings.mainHypId = null;
                    uiControls.mainHypSelectNullOption.selected = true;
                }
                else {
                    globalSettings.mainHypId = hypotheses.findIndex((el) => !el.hidden);
                    uiControls.mainHypSelect.querySelector('.main-hypothesis__option_' + globalSettings.mainHypId).selected = true;
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
    },

    nameChange(id, name) {
        const hyp = moduleIntegrator._hypotheses[id];
        if (hyp) {
            hyp.hyp.setName(name);
            moduleIntegrator._globalSettings.updateHypOption(id, name);
        }
    },

    duplicateHyp(id) {
        const hyp = moduleIntegrator._hypotheses[id];
        if (hyp) {
            moduleIntegrator.addHypothesis(hyp.hyp.constructor.getModuleTypeId(), hyp.hyp);
        }
    },

    deleteHyp(id) {
        const hyp = moduleIntegrator._hypotheses[id];
        if (!hyp) {
            return;
        }
        const globalSettings = moduleIntegrator._globalSettings;
        const optionEl = uiControls.mainHypSelect.querySelector('.main-hypothesis__option_' + id);
        moduleIntegrator._globalSettings.deleteHypOption(id);

        globalSettings.hypCounter--;
        if (!hyp.hidden) {
            globalSettings.unhiddenCounter--;
        }

        hyp.hyp.deleteSelf();
        moduleIntegrator._hypotheses[id] = null;

        for (let i = id; i < globalSettings.hypCounter; i++) {
            moduleIntegrator._hypotheses[i] = moduleIntegrator._hypotheses[i + 1];
            moduleIntegrator._hypotheses[i].hyp.setId(i);
        }

        moduleIntegrator._hypotheses = moduleIntegrator._hypotheses.slice(0, -1);

        optionEl.selected = false;
        if (globalSettings.unhiddenCounter === 0) {
            globalSettings.mainHypId = null;
            uiControls.mainHypSelectNullOption.selected = true;
        }
        else {
            globalSettings.mainHypId = moduleIntegrator._hypotheses.findIndex((el) => !el.hidden);
            uiControls.mainHypSelect.querySelector('.main-hypothesis__option_' + globalSettings.mainHypId).selected = true;
        }

        moduleIntegrator.setSettings('glob');
    },

    exportResults() {
        const resultsBlock = uiControls.resultsContainer;
        const htmlString = getHtmlString(resultsBlock);

        const blob = new Blob([htmlString], { type: 'text/html' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `${moduleIntegrator._globalSettings.name}.html`;
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
                        overflow: auto;
                        height: 100%;
                        padding: 10px 24px 24px 24px;
                        max-width: 100%;

                        font-weight: 400;
                        font-size: 14px;
                    }

                    .results__container::after {
                        display: block;
                        content: '';
                        width: 0px;
                        height: 50%;
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
                        margin-bottom: 56px;

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
    },
}

export default moduleIntegrator;

