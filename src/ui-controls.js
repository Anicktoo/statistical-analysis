// fade screen appear

const burgerMenu = document.querySelector('.burger-menu');
const burgerMenuInput = burgerMenu.querySelector('#burger-menu__input');
const fadeScreen = document.querySelector('.fade');

burgerMenu.addEventListener('click', fadeCheck);
fadeScreen.addEventListener('click', fadeScreenTriggerFadeOut);

function fadeScreenTriggerFadeOut() {
    if (fadeScreen.style.opacity != 0)
        fadeOut();
}

function fadeCheck() {
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