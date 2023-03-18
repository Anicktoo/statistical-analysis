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

// data footer resize

const dataContainer = document.querySelector('.data__container');
const dataFooter = dataContainer.querySelector('.data__footer');
const dataTable = dataContainer.querySelector('.data__table');

window.addEventListener('resize', footerPositionChange);
window.addEventListener('DOMContentLoaded', footerPositionChange);

function footerPositionChange() {
    if (dataContainer.offsetHeight > dataTable.offsetHeight) {
        dataFooter.style.position = 'absolute';
    }
    else {
        dataFooter.style.position = 'sticky';
    }
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
    const windowWidth = window.screen.width;

    if (resultsWidth >= bodyWidth) {
        calculationWindow.style.width = parametersWidth + bodyWidth + 'px';
    }
    else if (calculationWindowWidth < resizeBarWidth) {
        calculationWindow.style.width = resizeBarWidth + 'px';
    }
}


const varIcons = [...document.querySelectorAll('.data__var-icon')];
const modalWindowVarChoose = document.querySelector('.modal-var-types');
const varTypesBtns = [...modalWindowVarChoose.querySelectorAll('.modal-var-types__btn')];
let curVarIcon = undefined;

varIcons.forEach(el => {
    el.addEventListener('click', openModalChooseVarType);
});

varTypesBtns.forEach((el) => {
    el.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const imgElement = el.querySelector('.modal-var-types__img');
        const regex = /-img\b/;
        const oldClass = findClassWithRegex([...curVarIcon.classList], regex);
        const newClass = findClassWithRegex([...imgElement.classList], regex);
        console.log(oldClass, newClass);
        curVarIcon.classList.replace(oldClass, newClass);
    });
});

function openModalChooseVarType(event) {
    curVarIcon = event.target;
    event.preventDefault();
    event.stopPropagation();
    modalWindowVarChoose.style.left = curVarIcon.getBoundingClientRect().right + 'px';
    modalWindowVarChoose.style.top = curVarIcon.getBoundingClientRect().bottom + 'px';
    modalWindowVarChoose.style.display = 'block';

    window.addEventListener('click', () => {
        modalWindowVarChoose.style.display = 'none';
    }, { once: true });
}

function findClassWithRegex(classArray, regex) {
    console.log(classArray);
    return classArray.find(className => className.match(regex));
}