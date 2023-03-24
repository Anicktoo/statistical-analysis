import Sheet from "./Sheet";
import Settings from './Settings';

const container = document.querySelector('.data__container');
const csvUploadBtn = document.getElementById('csvUpload');
const settingsForm = document.getElementById('settings-form');
// const applyBtn = settingsForm.querySelector('#settings-apply-btn');

const sheets = [];
let shownSheet = 0;
let lastSheet = -1;

csvUploadBtn.addEventListener('change', readSingleFile);

function readSingleFile(event) {
    const file = event.target.files[0];
    if (file) {
        const sheet = sheets[shownSheet];
        if (sheet.isEmpty()) {
            sheets[shownSheet].importFile(file);
        }
        else {
            addDataSheet(file);
        }
    } else {
        alert("Failed to load file");
    }
}

settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(settingsForm);

    const applyTo = formData.get('apply-to');

    if (applyTo === 'this') {
        sheets[shownSheet].setSettings(formData);
    }
    else if (applyTo === 'all') {
        Settings.setGlobalSettings(formData);
        sheets.forEach(sheet => sheet.setSettings(formData));
    }
});

export function addEmptySheet() {
    addSheet();
}

function addDataSheet(data) {
    addSheet(data);
}

function addSheet(data) {
    lastSheet++;
    sheets.push(new Sheet('Лист' + lastSheet, data));
    showSheet(lastSheet);
}

export function showSheet(number) {
    sheets[shownSheet].hide();
    sheets[number].show();
    shownSheet = number;
}