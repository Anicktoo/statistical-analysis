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

// resize bars

const calculationWindow = document.querySelector('.calculation-window');
const resizeBars = calculationWindow.querySelectorAll('.resize-bar');
const results = calculationWindow.querySelector('.results');
const parameters = calculationWindow.querySelector('.parameters');

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
        const calculationWindowWidth = calculationWindow.offsetWidth;
        const resizeBarWidth = resizeBars[0].offsetWidth;
        const resultsWidth = resizeBarWidth + results.offsetWidth;
        const parametersWidth = resizeBarWidth + parameters.offsetWidth;
        const windowWidth = window.screen.width;

        if (resultsWidth >= windowWidth) {
            calculationWindow.style.width = parametersWidth + windowWidth + 'px';
        }
        else if (calculationWindowWidth < resizeBarWidth) {
            calculationWindow.style.width = resizeBarWidth + 'px';
        }
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
    //.slice(0, -2)
}