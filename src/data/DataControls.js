import Sheet from "@data/Sheet";
import Settings from '@data/Settings';
import UIControls from "@/UIControls";

export default class DataControls {
    static #sheets = [];
    static #currentSheet;
    // static #lastSheetIndex = -1;

    static readSingleFile(event) {
        const file = event.target.files[0];
        if (file) {
            DataControls.addSheet(file);
        } else {
            alert("Failed to load file");
        }
    }

    static submitSettings(event, formData) {
        event.preventDefault();
        const applyTo = formData.get('apply-to');
        const curSheet = DataControls.#currentSheet;

        if (applyTo === 'this') {
            curSheet.setSettings(formData);
        }
        else if (applyTo === 'all') {
            console.log('all', formData);
            Settings.setGlobalSettings(formData);
            DataControls.#sheets.forEach(sheet => sheet.setSettings(formData));
        }
        curSheet.applySettingsAndShow();
    }

    static createVarSettings(varId) {
        DataControls.#currentSheet.createVarSettings(varId);
    }

    static setVarSettings(event, formData, newOrder) {
        event.preventDefault();
        DataControls.#currentSheet.setVarSettings(formData, newOrder);
    }

    static addSheet(file) {
        const arrayLength = DataControls.#sheets.length;
        DataControls.#currentSheet?.hide();
        const name = file.name.split('.').slice(0, -1).join('');
        const newSheet = new Sheet(name, file, arrayLength)
        DataControls.#sheets.push(newSheet);
        DataControls.#currentSheet = newSheet;
    }

    static selectSheet(sheetId) {
        const sheet = DataControls.#sheets[sheetId];
        if (DataControls.#currentSheet == sheet)
            return;

        DataControls.#currentSheet?.hide();
        DataControls.#currentSheet = sheet;
        if (sheet.readyToShow()) {
            sheet.show();
        }
        else {
            sheet.applySettingsAndShow();
        }
    }
}

