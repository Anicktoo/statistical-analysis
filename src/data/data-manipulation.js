import Sheet from "./Sheet";

const container = document.querySelector('.data__container');
const csvUploadBtn = document.getElementById('csvUpload');

const sheets = [];
let shownSheet = 0;
let lastSheet = -1;

csvUploadBtn.addEventListener('change', readSingleFile);

function readSingleFile(e) {
    const file = e.target.files[0];
    if (file) {
        const r = new FileReader();
        r.onload = function (e) {
            const sheet = sheets[shownSheet];
            const data = e.target.result;
            if (sheet.isEmpty()) {
                sheets[shownSheet].importData(data);
            }
            else {
                addDataSheet(data);
            }
        }
        r.readAsArrayBuffer(file);
    } else {
        alert("Failed to load file");
    }
}

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