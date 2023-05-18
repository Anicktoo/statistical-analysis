import Sheet from '@data/Sheet';
import Settings from '@data/Settings';


const dataControls = {
    _sheets: [],
    _currentSheet: undefined,

    readSingleFile(event) {
        const file = event.target.files[0];
        if (file) {
            dataControls.addSheet(file);
        } else {
            alert("Failed to load file");
        }
    },

    submitSettings(event, formData) {
        event.preventDefault();
        const applyTo = formData.get('apply-to');
        const curSheet = dataControls._currentSheet;

        if (applyTo === 'this') {
            curSheet.setSettings(formData);
        }
        else if (applyTo === 'all') {
            Settings.setGlobalSettings(formData);
            dataControls._sheets.forEach(sheet => sheet.setSettings(formData));
        }
        curSheet.applySettingsAndShow();
    },

    createVarSettings(varId) {
        dataControls._currentSheet.createVarSettings(varId);
    },

    setVarSettings(formData, newOrder, twoTables) {
        dataControls._currentSheet.setVarSettings(formData, newOrder, twoTables);
    },

    addSheet(file) {
        const arrayLength = dataControls._sheets.length;
        dataControls._currentSheet?.hide();
        const name = file.name.split('.').slice(0, -1).join('');
        const newSheet = new Sheet(name, file, arrayLength)
        dataControls._sheets.push(newSheet);
        dataControls._currentSheet = newSheet;
    },

    selectSheet(sheetId) {
        const sheet = dataControls._sheets[sheetId];
        if (dataControls._currentSheet == sheet)
            return;

        dataControls._currentSheet?.hide();
        dataControls._currentSheet = sheet;
        if (sheet.readyToShow()) {
            sheet.show();
        }
        else {
            sheet.applySettingsAndShow();
        }
    },

    getListOfSheets() {
        return this._sheets.map((el, index) => {
            return {
                name: el.getName(),
                id: el.getID()
            };
        })
    },

    getSheetById(id) {
        return this._sheets[id];
    },

    getVarsBySheetId(id) {
        if (dataControls._sheets[id]) {
            return dataControls._sheets[id].getVars();
        }
        return null;
    },

    getVarBySheetIdAndVarId(sheetId, varId) {
        if (dataControls._sheets[sheetId]) {
            return dataControls._sheets[sheetId].getVarById(varId);
        }
        return null;
    },

    getDataBySheetAndVarId(sheetId, varId) {
        if (dataControls._sheets[sheetId]) {
            return dataControls._sheets[sheetId].getDataByVarId(varId);
        }
        return null;
    }
};

export default dataControls;

