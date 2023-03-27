import DataControls from "@data/DataControls";

export default class UIControls {

    static body;
    static burgerMenu;
    static burgerMenuInput
    static fadeScreen;
    static csvUploadBtn
    static settingsForm
    static dataContainer;
    static dataTable;
    static dataFooter;
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
    static dataSettingsBtn;

    static initConstUIControls() {
        UIControls.initConstElements();
        UIControls.initConstListeners();
        // UIControls.initChangableElements();
        // UIControls.initChangableListeners();
    }

    static initChangableUIControls() {
        console.log('init');
        UIControls.initChangableElements();
        UIControls.initChangableListeners();
        UIControls.footerChange();
    }

    static initConstElements() {
        UIControls.body = document.getElementsByTagName('body')[0];
        UIControls.dataContainer = document.querySelector('.data__container');
        UIControls.dataFooter = UIControls.dataContainer.querySelector('.data__footer');
        UIControls.burgerMenu = document.querySelector('.burger-menu');
        UIControls.burgerMenuInput = UIControls.burgerMenu.querySelector('#burger-menu__input');
        UIControls.fadeScreen = document.querySelector('.fade');

        UIControls.csvUploadBtn = document.getElementById('csvUpload');
        UIControls.settingsForm = document.getElementById('settings-form');

        UIControls.calculationWindow = document.querySelector('.calculation-window');
        UIControls.resizeBarsEl = UIControls.calculationWindow.querySelectorAll('.resize-bar');
        UIControls.results = UIControls.calculationWindow.querySelector('.results');
        UIControls.parameters = UIControls.calculationWindow.querySelector('.parameters');

        UIControls.modalWindowVarChoose = document.querySelector('.modal-var-types');
        UIControls.varTypesBtns = [...UIControls.modalWindowVarChoose.querySelectorAll('.modal-var-types__btn')];
        UIControls.varTypesForm = UIControls.modalWindowVarChoose.querySelector('#var-type-form');

        UIControls.modalSettings = document.querySelector('.modal-settings');
    }

    static initConstListeners() {
        UIControls.addBurgerListener();
        UIControls.addResizeBarsListeners();
        UIControls.addWindowResizeListeners();
        UIControls.addVarTypesBtnsListners();
        UIControls.addModalSettingsListener();
        UIControls.csvUploadListeners();
    }

    static initChangableElements() {
        UIControls.dataTable = UIControls.dataContainer.querySelector('.data__table_shown');
        UIControls.varIcons = [...document.querySelectorAll('.data__var-icon')];
        UIControls.dataSettingsBtn = document.getElementById('dataSettingsBtn');
    }

    static initChangableListeners() {
        UIControls.addVarIconsListeners();
        UIControls.addDataSettingsListener();
    }

    static addBurgerListener() {
        UIControls.burgerMenu.addEventListener('click', UIControls.fadeChange);
        UIControls.fadeScreen.addEventListener('click', UIControls.fadeChange);
        // UIControls.fadeScreen.addEventListener('click', UIControls.fadeScreenTriggerFadeOut);
    }

    // static fadeScreenTriggerFadeOut() {
    //     if (UIControls.fadeScreen.style.opacity != 0)
    //         fadeOut();
    // }

    static fadeChange() {
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

    static csvUploadListeners() {
        UIControls.csvUploadBtn.addEventListener('click', function () {
            this.value = null;
        });

        UIControls.csvUploadBtn.addEventListener('change', (event) => {
            DataControls.readSingleFile(event)
        });
    }

    static addResizeBarsListeners() {
        [...UIControls.resizeBarsEl].forEach(el => {
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
                resizeBarCheckBounds();
                UIControls.footerChange();

                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            }
        }

        window.addEventListener('resize', resizeBarCheckBounds);

        function resizeBarCheckBounds() {
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
    }

    static addWindowResizeListeners() {
        window.addEventListener('resize', UIControls.footerChange);
        window.addEventListener('DOMContentLoaded', UIControls.footerChange);
    }

    static footerChange() {
        const dataTable = UIControls.dataTable;
        const dataContainer = UIControls.dataContainer;
        const dataFooter = UIControls.dataFooter;

        UIControls.dataTable = UIControls.dataContainer.querySelector('.data__table_shown');

        dataFooter.style.width = dataContainer.offsetWidth > dataTable.offsetWidth ? '100%' : dataTable.offsetWidth + 'px';
        if (dataContainer.offsetHeight > dataTable.offsetHeight) {
            dataFooter.style.position = 'absolute';
        }
        else {
            dataFooter.style.position = 'sticky';
        }
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
        UIControls.dataSettingsBtn.addEventListener('click', (event) => {
            UIControls.openModal(event, UIControls.modalSettings);
        });
    }

    static addModalSettingsListener() {
        UIControls.modalSettings.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        UIControls.settingsForm.addEventListener('submit', (event) => {
            DataControls.submitSettings(event, new FormData(UIControls.settingsForm));
        });
    }
}


