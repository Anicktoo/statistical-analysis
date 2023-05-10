import dataControls from '@data/dataControls';
import moduleIntegrator from '@/moduleIntegrator';

window.uiControls = {

    body: undefined,
    pageBody: undefined,
    moduleListElement: undefined,
    modulesItems: [],
    burgerMenu: undefined,
    burgerMenuInput: undefined,
    burgerUpLine: undefined,
    burgerDownLine: undefined,
    fadeScreen: undefined,
    sidebar: undefined,
    menuBtns: [],
    csvUploadBtn: undefined,
    exportBtn: undefined,
    settingsForm: undefined,
    dataContainer: undefined,
    dataTable: undefined,
    dataFooter: undefined,
    footerList: undefined,
    dataFooterElements: {
        old: [],
        new: []
    },
    calculationWindow: undefined,
    parameters: undefined,
    parametersContainer: undefined,
    parametersGlobItem: undefined,
    FWERInput: undefined,
    powerInput: undefined,
    mainHypSelect: undefined,
    mainHypSelectNullOption: undefined,

    resizeBarsEl: [],
    results: undefined,
    resultsContainer: undefined,
    resultsLoader: undefined,

    resBlock: undefined,
    resFwer: undefined,
    resNumber: undefined,
    resImportance: undefined,
    resMainHyp: undefined,
    resPower: undefined,
    resSampleSizePrecise: undefined,
    resSampleSize: undefined,


    modalVarType: undefined,
    varIcons: {
        old: [],
        new: []
    },
    varTypesBtns: [],
    varTypesForm: undefined,
    rangTable: undefined,
    binSettings: undefined,
    binTables: undefined,
    varTypesLevelControls: {
        up: undefined,
        down: undefined
    },
    varTypesSwitchBtn: undefined,
    modalVarTypeBtns: undefined,
    curIcon: undefined,
    modalSettings: undefined,
    dataSettingsBtns: {
        old: [],
        new: []
    },
    modalSettingsBtns: undefined,
    errorElement: undefined,

    initConstuiControls() {
        uiControls.initConstElements();
        uiControls.initConstListeners();
    },

    initConstElements() {
        uiControls.body = document.getElementsByTagName('body')[0];
        uiControls.pageBody = document.querySelector('.page-body');
        uiControls.moduleListElement = document.querySelector('.modules__list');

        uiControls.dataContainer = document.querySelector('.data__container');
        uiControls.dataFooter = uiControls.dataContainer.querySelector('.data__footer');
        uiControls.footerList = uiControls.dataContainer.querySelector('.footer__list');
        uiControls.burgerMenu = document.querySelector('.burger-menu');
        uiControls.burgerMenuInput = uiControls.burgerMenu.querySelector('#burger-menu__input');
        uiControls.burgerUpLine = uiControls.burgerMenu.querySelector('.burger-menu__line-up');
        uiControls.burgerDownLine = uiControls.burgerMenu.querySelector('.burger-menu__line-down');
        uiControls.sidebar = document.querySelector('.sidebar');
        uiControls.fadeScreen = document.querySelector('.fade');
        uiControls.menuBtns = [...document.querySelectorAll('.sidebar__item')];

        uiControls.csvUploadBtn = document.getElementById('csvUpload');
        uiControls.exportBtn = document.getElementById('export-results');
        uiControls.settingsForm = document.getElementById('settings-form');

        uiControls.calculationWindow = document.querySelector('.calculation-window');
        uiControls.resizeBarsEl = [...uiControls.calculationWindow.querySelectorAll('.resize-bar')];
        uiControls.results = uiControls.calculationWindow.querySelector('.results');
        uiControls.resultsLoader = uiControls.results.querySelector('.loader');
        uiControls.resultsContainer = uiControls.results.querySelector('.results__container');

        uiControls.resBlock = uiControls.resultsContainer.querySelector('#global-results');
        uiControls.resName = uiControls.resBlock.querySelector('#results-name');
        uiControls.resFwer = uiControls.resBlock.querySelector('#results-FWER');
        uiControls.resNumber = uiControls.resBlock.querySelector('#results-number');
        uiControls.resImportance = uiControls.resBlock.querySelector('#results-importance');
        uiControls.resMainHyp = uiControls.resBlock.querySelector('#results-main-hyp');
        uiControls.resPower = uiControls.resBlock.querySelector('#results-power');
        uiControls.resSampleSize = uiControls.resBlock.querySelector('#results-sample-size');
        uiControls.resSampleSizePrecise = uiControls.resBlock.querySelector('#results-sample-size-precise');

        uiControls.parameters = uiControls.calculationWindow.querySelector('.parameters');
        uiControls.parametersContainer = uiControls.parameters.querySelector('.parameters__container');
        uiControls.parametersGlobItem = uiControls.parameters.querySelector('#parameters__item_glob');
        uiControls.FWERInput = uiControls.parametersGlobItem.querySelector('#FWER-input');
        uiControls.powerInput = uiControls.parametersGlobItem.querySelector('#power-input');
        uiControls.mainHypSelect = uiControls.parametersContainer.querySelector('#main-hypothesis');
        uiControls.mainHypSelectNullOption = uiControls.mainHypSelect.querySelector('.main-hypothesis__option_null');

        uiControls.modalVarType = document.querySelector('.modal-var-types');
        uiControls.varTypesForm = uiControls.modalVarType.querySelector('#var-type-form');
        uiControls.rangTable = uiControls.modalVarType.querySelector('.modal-var-types__rang-table-body');
        uiControls.binSettings = uiControls.modalVarType.querySelector('.modal-var-types__binary-settings');
        uiControls.binTables = [...uiControls.modalVarType.querySelectorAll('.modal-var-types__binary-table-body')];
        uiControls.varTypesLevelControls.up = uiControls.modalVarType.querySelector('.switch-button_up');
        uiControls.varTypesLevelControls.down = uiControls.modalVarType.querySelector('.switch-button_down');
        uiControls.modalVarTypeBtns = [...uiControls.modalVarType.querySelectorAll('.modal-var-types__btn')];
        uiControls.varTypesSwitchBtn = uiControls.binSettings.querySelector('.switch-button');
        uiControls.modalSettings = document.querySelector('.modal-settings');
        uiControls.modalSettingsBtns = [...uiControls.modalSettings.querySelectorAll('.modal-settings__btn')];

        uiControls.errorElement = document.querySelector('#error-show');
    },

    initConstListeners() {
        uiControls.addBurgerListener();
        uiControls.addResizeBarsListeners();
        uiControls.addWindowResizeListeners();
        uiControls.addModalSettingsListener();
        uiControls.addModalVarChooseListener();
        uiControls.addCsvUploadListeners();
        uiControls.addExportBtnListeners();
    },

    initNewSheetControls() {
        uiControls.initNewSheetElements();
        uiControls.initNewSheetListeners();
    },

    initNewSheetElements() {
        uiControls.dataFooterElements.new = [...uiControls.dataFooter.querySelectorAll('.footer__item_new')];
        uiControls.varIcons.new = [...uiControls.dataContainer.querySelectorAll('.data__var-icon_new')];
        uiControls.dataSettingsBtns.new = [...uiControls.dataContainer.querySelectorAll('.dataSettingsBtn_new')];
    },

    initNewSheetListeners() {
        uiControls.addVarIconsListeners();
        uiControls.addDataSettingsListener();
        uiControls.addFooterItemListeners();
    },

    // LISTENERS //

    addBurgerListener() {
        uiControls.burgerMenu.addEventListener('click', uiControls.toggleMenu);
        uiControls.fadeScreen.addEventListener('click', uiControls.toggleMenu);
    },

    addCsvUploadListeners() {
        uiControls.csvUploadBtn.addEventListener('click', function () {
            this.value = null;
        });

        uiControls.csvUploadBtn.addEventListener('change', (event) => {
            dataControls.readSingleFile(event);
            uiControls.toggleMenu();
        });
    },

    addExportBtnListeners() {
        uiControls.exportBtn.addEventListener('click', () => {
            moduleIntegrator.exportResults();
            uiControls.toggleMenu();
        });
    },

    addResizeBarsListeners() {
        uiControls.resizeBarsEl.forEach(el => {
            el.addEventListener('mousedown', mousedown);
        });

        function mousedown(e) {
            e.preventDefault();
            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            const startX = e.clientX;
            const startWidth = uiControls.calculationWindow.offsetWidth;


            function mousemove(e) {
                e.preventDefault();
                uiControls.calculationWindow.style.width = (startWidth - (e.clientX - startX)) + 'px';
            }

            function mouseup() {
                uiControls.resizeBarCheckBounds();
                uiControls.footerChange();

                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            }
        }
    },

    addWindowResizeListeners() {
        window.addEventListener('DOMContentLoaded', uiControls.footerChange);
        window.addEventListener('resize', uiControls.footerChange);
        window.addEventListener('resize', uiControls.resizeBarCheckBounds);
    },

    addFooterItemListeners() {
        uiControls.dataFooterElements.new.forEach(el => {
            el.addEventListener('click', () => dataControls.selectSheet(el.id));
            el.classList.remove('footer__item_new');
            uiControls.dataFooterElements.old.push(el);
        });
        uiControls.dataFooterElements.new = [];
    },

    addVarIconsListeners() {
        uiControls.varIcons.new.forEach(el => {
            el.addEventListener('click', (event) => {
                const create = dataControls.createVarSettings.bind(null, event.currentTarget.getAttribute('id'));
                uiControls.openModal(event, uiControls.modalVarType, create);
            });
            el.classList.remove('data__var-icon_new');
        });
        uiControls.varIcons.new = [];
    },

    addDataSettingsListener() {
        uiControls.dataSettingsBtns.new.forEach(el => {
            el.addEventListener('click', (event) => {
                uiControls.openModal(event, uiControls.modalSettings);
            });
            el.classList.remove('dataSettingsBtn_new');
            uiControls.dataSettingsBtns.old.push(el);
        })
        uiControls.dataSettingsBtns.new = [];
    },

    addModalSettingsListener() {
        uiControls.modalSettings.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        uiControls.settingsForm.addEventListener('submit', (event) => {
            dataControls.submitSettings(event, new FormData(uiControls.settingsForm));
        });

        uiControls.modalSettingsBtns.forEach(btn => {
            btn.addEventListener('click', () => uiControls.modalSettings.style.display = 'none');
        });

        uiControls.modalSettings.querySelector('.modal-window__header').addEventListener('mousedown', (event) => {
            uiControls.dragMouseDown(event, uiControls.modalSettings);
        });
    },

    addModalVarChooseListener() {
        uiControls.modalVarType.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        const varTypeInputs = [...uiControls.modalVarType.querySelectorAll('.modal-var-types__item-input')];
        const rangInput = uiControls.modalVarType.querySelector('.modal-var-types__rang');
        const rangSettings = uiControls.modalVarType.querySelector('.modal-var-types__rang-settings');
        const binInput = uiControls.modalVarType.querySelector('.modal-var-types__binary');
        const binSettings = uiControls.modalVarType.querySelector('.modal-var-types__binary-settings');

        varTypeInputs.forEach(el => el.addEventListener('click', () => {
            if (el.isSameNode(binInput)) {
                binSettings.style.display = 'block';
            }
            else {
                binSettings.style.display = 'none';
            }
            if (el.isSameNode(rangInput)) {
                rangSettings.style.display = 'block';
            }
            else {
                rangSettings.style.display = 'none';
            }
        }));

        uiControls.varTypesLevelControls.up.addEventListener('click', () => { moveLabel(false) });
        uiControls.varTypesLevelControls.down.addEventListener('click', () => { moveLabel(true) });
        uiControls.varTypesSwitchBtn.addEventListener('click', switchLabel);

        uiControls.varTypesForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newOrder = [...uiControls.rangTable.querySelectorAll('.var-table__item')].map(el => Number(el.dataset.order));
            const twoTables = {
                group0: [...uiControls.binTables[0].querySelectorAll('.var-table__item')].map(el => el.dataset.anchor),
                group1: [...uiControls.binTables[1].querySelectorAll('.var-table__item')].map(el => el.dataset.anchor)
            };
            dataControls.setVarSettings(new FormData(uiControls.varTypesForm), newOrder, twoTables);
        });

        uiControls.modalVarTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => uiControls.modalVarType.style.display = 'none');
        });

        uiControls.modalVarType.querySelector('.modal-window__header').addEventListener('mousedown', (event) => {
            uiControls.dragMouseDown(event, uiControls.modalVarType);
        });


        function switchLabel() {
            const curLabel = uiControls.binSettings.querySelector('input[type="radio"]:checked').parentElement;
            const curTableBody = curLabel.parentElement;

            curTableBody.removeChild(curLabel);

            const insertChild = (toTable) => {
                toTable.insertBefore(curLabel, toTable.querySelector('.var-table__anchor_' + curLabel.dataset.anchor));
            }

            if (curTableBody.isSameNode(uiControls.binTables[0])) {
                insertChild(uiControls.binTables[1]);
                uiControls.varTypesSwitchBtn.classList.replace('switch-button_right', 'switch-button_left');
            }
            else {
                insertChild(uiControls.binTables[0]);
                uiControls.varTypesSwitchBtn.classList.replace('switch-button_left', 'switch-button_right');
            }
        }
        function moveLabel(isDown) {
            const rangTable = uiControls.rangTable;
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
    },

    // MODULE LISTENERS //

    addModuleBtnsListeners() {
        const modulesItems = [...document.querySelectorAll('.modules__item')];
        uiControls.modulesItems = modulesItems;
        modulesItems.forEach(el => {
            const id = el.dataset.moduleId;
            el.addEventListener('click', () => {
                const newHypId = moduleIntegrator.addHypothesis(id);
                const newHyp = moduleIntegrator.getHypElementById(newHypId);
                const newRes = moduleIntegrator.getResultElementById(newHypId);
                uiControls.scrollCenter(uiControls.parametersContainer, newHyp);
                uiControls.scrollCenter(uiControls.resultsContainer, newRes);
            });
        });
    },

    scrollCenter(parentEl, toEl) {
        let y = toEl.offsetTop - uiControls.pageBody.getBoundingClientRect().height / 2 + toEl.getBoundingClientRect().height / 2;
        parentEl.scrollTo(({ behavior: "smooth", top: y, left: 0 }));
    },

    addModuleFormListeners(element, moduleCallbackFunction, isGlob) {
        const elementFormMain = element.querySelector('.module-option-form');
        const triggers = [...element.querySelectorAll('.form-change-trigger')];
        const collapsibleInput = element.querySelector('.collapsible__input');
        const collapsibleSymbol = element.querySelector('.collapsible__symbol');
        const collapsibleContent = element.querySelector('.collapsible__content');

        collapsibleInput.addEventListener('click', () => {
            collapsibleSymbol.classList.toggle('collapsible__symbol_checked');
            collapsibleContent.classList.toggle('collapsible__content_checked');
        });

        if (isGlob) {
            triggers.forEach(el => el.addEventListener('change', () => {
                moduleIntegrator.setSettings('glob', elementFormMain, elementFormMain.querySelector('.target-table-data'));
            }));
            return;
        }

        triggers.forEach(el => el.addEventListener('change', () => {
            moduleIntegrator.setSettings(getId(element), elementFormMain, elementFormMain.querySelector('.target-table-data'));
        }));

        const elementFormSheets = [...element.querySelectorAll('.sheet-form')];
        elementFormSheets.forEach(el => {
            el.addEventListener('change', () => {
                moduleIntegrator.refreshVarsOfHyp(getId(element), el);
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

        const hideBtn = element.querySelector('.parameters__hide-button');
        const hideInput = hideBtn.querySelector('input');
        const content = element.querySelector('.parameters__content');
        const titleContainer = element.querySelector('.parameters__title-container');
        hideInput.addEventListener('click', () => {
            content.classList.toggle('parameters__content_hidden');
            titleContainer.classList.toggle('parameters__title-container_hidden');
            hideBtn.classList.toggle('parameters__hide-button_hidden');
            moduleIntegrator.hideUnhideHyp(getId(element));
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
                uiControls.showError(elementHeaderInput, 'Заполните это поле');
                return;
            }
            elementHeaderInput.removeEventListener('focusout', focusListener);
            elementHeaderInput.removeEventListener('keypress', enterListener);
            elementHeader.style.display = 'inline';
            elementHeaderInput.style.display = 'none';
            moduleIntegrator.nameChange(getId(element), elementHeaderInput.value);
        }

        //dublicate

        const dupbtn = element.querySelector('.parameters__duplicate-button');
        dupbtn.addEventListener('click', () => {
            moduleIntegrator.duplicateHyp(getId(element));
        });

        //delete 

        const deleteBtn = element.querySelector('.parameters__delete-button');
        deleteBtn.addEventListener('click', () => {
            moduleIntegrator.deleteHyp(getId(element));
        });

        function getId(el) {
            return Number(el.querySelector('.module-option-form').dataset.id);
        }
    },

    // COMMON FUNCTIONS //

    resizeBarCheckBounds() {
        const calculationWindowWidth = uiControls.calculationWindow.offsetWidth;
        const resizeBarWidth = uiControls.resizeBarsEl[0].offsetWidth;
        const resultsWidth = resizeBarWidth + uiControls.results.offsetWidth;
        const parametersWidth = resizeBarWidth + uiControls.parameters.offsetWidth;
        const bodyWidth = uiControls.body.clientWidth;

        if (resultsWidth >= bodyWidth) {
            uiControls.calculationWindow.style.width = parametersWidth + bodyWidth + 'px';
        }
        else if (calculationWindowWidth < resizeBarWidth) {
            uiControls.calculationWindow.style.width = resizeBarWidth + 'px';
        }
    },

    toggleMenu() {
        if (uiControls.burgerMenuInput.checked)
            fadeOut();
        else
            fadeIn();

        function fadeIn() {
            uiControls.sidebar.classList.add('sidebar_checked');
            uiControls.burgerUpLine.classList.add('burger-menu__line-up_checked');
            uiControls.burgerDownLine.classList.add('burger-menu__line-down_checked');
            uiControls.fadeScreen.style['z-index'] = '1';
            uiControls.burgerMenuInput.checked = true;
            uiControls.fadeScreen.style.opacity = '1';
        }

        function fadeOut() {
            uiControls.sidebar.classList.remove('sidebar_checked');
            uiControls.burgerUpLine.classList.remove('burger-menu__line-up_checked');
            uiControls.burgerDownLine.classList.remove('burger-menu__line-down_checked');
            uiControls.fadeScreen.style['z-index'] = '-1';
            uiControls.burgerMenuInput.checked = false;
            uiControls.fadeScreen.style.opacity = '0';
        }
    },

    footerChange() {
        const dataTable = uiControls.dataContainer.querySelector('.data__table_shown');
        const dataContainer = uiControls.dataContainer;
        const dataFooter = uiControls.dataFooter;

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
    },

    openModal(event, modalWindow, createModalFunc) {
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
    },

    dragMouseDown(e, elmnt) {
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
    },

    resultsLoadingShow() {
        uiControls.resultsContainer.style.opacity = '0.1';
        uiControls.resultsLoader.style.display = 'block';
    },

    resultsLoadingHide() {
        uiControls.resultsContainer.style.opacity = '1';
        uiControls.resultsLoader.style.display = 'none';
    },

    showError(el, errorText) {
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

        uiControls.errorElement.style.left = x + 'px';
        uiControls.errorElement.style.top = y + 'px';
        uiControls.errorElement.setCustomValidity(errorText);
        uiControls.errorElement.reportValidity();
    }
}

