import Sheet from '@data/Sheet';
import Settings from '@data/Settings';

export default class DataControls {
    static #sheets = [];
    static #currentSheet;

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

    static setVarSettings(formData, newOrder, twoTables) {
        DataControls.#currentSheet.setVarSettings(formData, newOrder, twoTables);
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

    static getListOfSheets() {
        return this.#sheets.map((el, index) => {
            return {
                name: el.getName(),
                id: el.getID()
            };
        })
    }

    static getSheetById(id) {
        return this.#sheets[id];
    }

    static getVarsBySheetId(id) {
        if (DataControls.#sheets[id]) {
            return DataControls.#sheets[id].getVars();
        }
        return null;
    }

    static getVarBySheetIdAndVarId(sheetId, varId) {
        if (DataControls.#sheets[sheetId]) {
            return DataControls.#sheets[sheetId].getVarById(varId);
        }
        return null;
    }

    static getDataBySheetAndVarId(sheetId, varId) {
        return this.#sheets[sheetId].getDataByVarId(varId);
    }
}

