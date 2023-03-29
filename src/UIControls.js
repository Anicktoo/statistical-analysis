import DataControls from "@data/DataControls";

export default class UIControls {

    static body;
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
    static resizeBarsEl = [];
    static results;
    static modalWindowVarChoose;
    static varIcons = [];
    static varTypesBtns = [];
    static varTypesForm;
    static curIcon;
    static modalSettings;
    static dataSettingsBtns = {
        old: [],
        new: []
    };

    static initConstUIControls() {
        UIControls.initConstElements();
        UIControls.initConstListeners();
        // UIControls.initChangableElements();
        // UIControls.initChangableListeners();
    }

    static initChangableUIControls() {
        console.log('initChangable');
        UIControls.initChangableElements();
        UIControls.initChangableListeners();
        // UIControls.footerChange();
    }

    static initConstElements() {
        UIControls.body = document.getElementsByTagName('body')[0];
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
        UIControls.parameters = UIControls.calculationWindow.querySelector('.parameters');

        UIControls.modalWindowVarChoose = document.querySelector('.modal-var-types');
        UIControls.varTypesBtns = [...UIControls.modalWindowVarChoose.querySelectorAll('.modal-var-types__btn')];
        UIControls.varTypesForm = UIControls.modalWindowVarChoose.querySelector('#var-type-form');

        UIControls.modalSettings = document.querySelector('.modal-settings');
        UIControls.modalSettingsBtns = [...UIControls.modalSettings.querySelectorAll('.modal-settings__btn')];
    }

    static initConstListeners() {
        UIControls.addBurgerListener();
        // UIControls.addMenuBtnsListeners();
        UIControls.addResizeBarsListeners();
        UIControls.addWindowResizeListeners();
        UIControls.addVarTypesBtnsListners();
        UIControls.addModalSettingsListener();
        UIControls.addModalSettingsBtnsListeners();
        UIControls.csvUploadListeners();
    }

    static initChangableElements() {
        // UIControls.dataTable = UIControls.dataContainer.querySelector('.data__table_shown'); //???????????
        UIControls.dataFooterElements.new = [...UIControls.dataFooter.querySelectorAll('.footer__item_new')];
        UIControls.varIcons = [...UIControls.dataContainer.querySelectorAll('.data__var-icon')];
        UIControls.dataSettingsBtns.new = [...UIControls.dataContainer.querySelectorAll('.dataSettingsBtn_new')];
    }

    static initChangableListeners() {
        UIControls.addVarIconsListeners();
        UIControls.addDataSettingsListener();
        UIControls.addFooterItemListeners();
    }

    static addBurgerListener() {
        UIControls.burgerMenu.addEventListener('click', UIControls.toggleMenu);
        UIControls.fadeScreen.addEventListener('click', UIControls.toggleMenu);
        // UIControls.fadeScreen.addEventListener('click', UIControls.fadeScreenTriggerFadeOut);
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

    // static addMenuBtnsListeners() {
    //     UIControls.menuBtns.forEach(btn => {
    //         btn.addEventListener('click', UIControls.toggleMenu);
    //     });
    // }

    static csvUploadListeners() {
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

    static addFooterItemListeners() {
        UIControls.dataFooterElements.new.forEach(el => {
            el.addEventListener('click', () => DataControls.selectSheet(el.id));
            el.classList.remove('footer__item_new');
            UIControls.dataFooterElements.old.push(el);
        });
        UIControls.dataFooterElements.new = [];
    }

    static openModal(event, modalWindow) {
        UIControls.curIcon = event.target;
        event.preventDefault();
        event.stopPropagation();
        modalWindow.style.left = UIControls.curIcon.getBoundingClientRect().right + 'px';
        modalWindow.style.top = UIControls.curIcon.getBoundingClientRect().bottom + 'px';
        modalWindow.style.display = 'block';
        window.addEventListener('click', () => modalWindow.style.display = 'none', { once: true });
    }

    static addVarIconsListeners() {
        UIControls.varIcons.forEach(el => {
            el.addEventListener('click', (event) => {
                UIControls.openModal(event, UIControls.modalWindowVarChoose);
            });
        });
    }

    static addVarTypesBtnsListners() {
        UIControls.varTypesBtns.forEach((el) => {
            el.addEventListener('click', chooseNewVarType);
        });

        function chooseNewVarType(event) {
            event.preventDefault();
            event.stopPropagation();
            new FormData(UIControls.varTypesForm).get("var-type");
            const imgElement = event.currentTarget.querySelector('.modal-var-types__img');
            const regex = /-img\b/;
            const oldClass = findClassWithRegex([...UIControls.curIcon.classList], regex);
            const newClass = findClassWithRegex([...imgElement.classList], regex);
            UIControls.curIcon.classList.replace(oldClass, newClass);
            UIControls.modalWindowVarChoose.style.display = 'none';

            function findClassWithRegex(classArray, regex) {
                return classArray.find(className => className.match(regex));
            }
        }
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
    }

    static addModalSettingsBtnsListeners() {
        UIControls.modalSettingsBtns.forEach(btn => {
            btn.addEventListener('click', () => UIControls.modalSettings.style.display = 'none');
        })
    }
}


