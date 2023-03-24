import data from '@data/data-manipulation';

export function updateDynamicUI() {
    varIconsListeners();
    dataSettingsListener();
    footerChange();
}

// fade screen appear

const burgerMenu = document.querySelector('.burger-menu');
const burgerMenuInput = burgerMenu.querySelector('#burger-menu__input');
const fadeScreen = document.querySelector('.fade');


burgerMenu.addEventListener('click', fadeCheckChange);
fadeScreen.addEventListener('click', fadeScreenTriggerFadeOut);

function fadeScreenTriggerFadeOut() {
    if (fadeScreen.style.opacity != 0)
        fadeOut();
}

function fadeCheckChange() {
    if (burgerMenuInput.checked)
        fadeOut();
    else
        fadeIn();
}

function fadeIn() {
    fadeScreen.style['z-index'] = '1';
    burgerMenuInput.checked = true;
    fadeScreen.style.opacity = '1';
}

function fadeOut() {
    fadeScreen.style['z-index'] = '-1';
    burgerMenuInput.checked = false;
    fadeScreen.style.opacity = '0';
}

// resize bars

const calculationWindow = document.querySelector('.calculation-window');
const resizeBars = calculationWindow.querySelectorAll('.resize-bar');
const results = calculationWindow.querySelector('.results');
const parameters = calculationWindow.querySelector('.parameters');
const body = document.getElementsByTagName('body')[0];

[...resizeBars].forEach(el => {
    el.addEventListener('mousedown', mousedown);
});

function mousedown(e) {

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    const startX = e.clientX;
    const startWidth = calculationWindow.offsetWidth;


    function mousemove(event) {
        event.preventDefault();
        calculationWindow.style.width = (startWidth - (event.clientX - startX)) + 'px';
    }

    function mouseup() {
        resizeBarCheckBounds();

        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
}

window.addEventListener('resize', resizeBarCheckBounds);

function resizeBarCheckBounds() {
    const calculationWindowWidth = calculationWindow.offsetWidth;
    const resizeBarWidth = resizeBars[0].offsetWidth;
    const resultsWidth = resizeBarWidth + results.offsetWidth;
    const parametersWidth = resizeBarWidth + parameters.offsetWidth;
    const bodyWidth = body.clientWidth;

    if (resultsWidth >= bodyWidth) {
        calculationWindow.style.width = parametersWidth + bodyWidth + 'px';
    }
    else if (calculationWindowWidth < resizeBarWidth) {
        calculationWindow.style.width = resizeBarWidth + 'px';
    }
}

// data footer resize

window.addEventListener('resize', footerChange);
window.addEventListener('DOMContentLoaded', footerChange);

export function footerChange() {
    console.log("change");
    const dataContainer = document.querySelector('.data__container');
    const dataFooter = dataContainer.querySelector('.data__footer');
    const dataTable = dataContainer.querySelector('.data__table_shown');
    dataFooter.style.width = Math.max(dataContainer.offsetWidth, dataTable?.offsetWidth) + 'px';
    if (dataContainer.offsetHeight > dataTable?.offsetHeight) {
        dataFooter.style.position = 'absolute';
    }
    else {
        dataFooter.style.position = 'sticky';
    }
}

// choose Var Type Modal Window

let varIcons;
const modalWindowVarChoose = document.querySelector('.modal-var-types');
const varTypesBtns = [...modalWindowVarChoose.querySelectorAll('.modal-var-types__btn')];
const varTypesFormData = new FormData(modalWindowVarChoose.querySelector('#var-type-form'));
let curIcon = undefined;

function varIconsListeners() {
    varIcons = [...document.querySelectorAll('.data__var-icon')];
    varIcons.forEach(el => {
        el.addEventListener('click', (event) => {
            openModal(event, modalWindowVarChoose);
        });
    });
}


varTypesBtns.forEach((el) => {
    el.addEventListener('click', chooseNewVarType);
});

function chooseNewVarType(event) {
    event.preventDefault();
    event.stopPropagation();
    varTypesFormData.get("var-type");
    const imgElement = event.currentTarget.querySelector('.modal-var-types__img');
    const regex = /-img\b/;
    const oldClass = findClassWithRegex([...curIcon.classList], regex);
    const newClass = findClassWithRegex([...imgElement.classList], regex);
    curIcon.classList.replace(oldClass, newClass);
    makeElementDispalyNone(modalWindowVarChoose);
}

function openModal(event, modalWindow) {
    curIcon = event.target;
    event.preventDefault();
    event.stopPropagation();
    modalWindow.style.left = curIcon.getBoundingClientRect().right + 'px';
    modalWindow.style.top = curIcon.getBoundingClientRect().bottom + 'px';
    modalWindow.style.display = 'block';
    window.addEventListener('click', () => makeElementDispalyNone(modalWindow), { once: true });
}

function makeElementDispalyNone(el) {
    el.style.display = 'none';
}

function findClassWithRegex(classArray, regex) {
    return classArray.find(className => className.match(regex));
}

//settings modal window 

const modalSettings = document.querySelector('.modal-settings');
let dataSettingsBtn;

function dataSettingsListener() {
    dataSettingsBtn = document.getElementById('dataSettingsBtn');

    dataSettingsBtn.addEventListener('click', (event) => {
        openModal(event, modalSettings);
    });
}

modalSettings.addEventListener('click', (event) => {
    event.stopPropagation();
});

