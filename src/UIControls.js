import DataControls from '@data/DataControls';
import ModuleIntegrator from '@/ModuleIntegrator';

class UIControls {

    static body;
    static moduleListElement;
    static modulesItems = [];
    static burgerMenu;
    static burgerMenuInput
    static fadeScreen;
    static menuBtns = [];
    static csvUploadBtn
    static settingsForm
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
    }

    static initNewSheetControls() {
        UIControls.initNewSheetElements();
        UIControls.initNewSheetListeners();
    }

    static initNewSheetElements() {
        // UIControls.dataTable = UIControls.dataContainer.querySelector('.data__table_shown'); //???????????
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
            DataControls.readSingleFile(event);
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
            el.addEventListener('click', () => DataControls.selectSheet(el.id));
            el.classList.remove('footer__item_new');
            UIControls.dataFooterElements.old.push(el);
        });
        UIControls.dataFooterElements.new = [];
    }

    static addVarIconsListeners() {
        UIControls.varIcons.new.forEach(el => {
            el.addEventListener('click', (event) => {
                const create = DataControls.createVarSettings.bind(null, event.currentTarget.getAttribute('id'));
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
            DataControls.submitSettings(event, new FormData(UIControls.settingsForm));
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
            DataControls.setVarSettings(new FormData(UIControls.varTypesForm), newOrder, twoTables);
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
                ModuleIntegrator.addHypothesis(id);
            });
        });
    }

    static addModuleFormListeners(id, element, moduleCallbackFunction) {
        const elementFormMain = element.querySelector('.module-option-form');
        const triggers = [...element.querySelectorAll('.form-change-trigger')];
        triggers.forEach(el => el.addEventListener('change', () => {
            ModuleIntegrator.setSettings(id, elementFormMain, elementFormMain.querySelector('.target-table-data'));
        }));

        if (id === 'glob') {
            return;
        }

        const elementFormSheets = [...element.querySelectorAll('.sheet-form')];
        elementFormSheets.forEach(el => {
            el.addEventListener('change', () => {
                // ModuleIntegrator.setSettings(id, elementFormMain, elementFormMain.querySelector('.target-table-data'));
                ModuleIntegrator.refreshVarsOfHyp(id, el);
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
            ModuleIntegrator.hideUnhideHyp(id);
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
            ModuleIntegrator.nameChange(id, elementHeaderInput.value);
        }

        //dublicate

        const dupbtn = element.querySelector('.parameters__duplicate-button');
        dupbtn.addEventListener('click', (e) => {
            ModuleIntegrator.duplicateHyp(id);
        });
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

