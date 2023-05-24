import Sheet from '@data/Sheet';
import Settings from '@data/Settings';

const dataControls = {
    _sheets: [],
    _currentSheet: undefined,

    async readSingleFile(file) {
        if (file) {
            await dataControls.addSheet(file);
        } else {
            uiControls.showError(uiControls.burgerMenu, 'Ошибка при загрузке файла');
        }
    },

    async submitSettings(event, formData) {
        event.preventDefault();
        const applyTo = formData.get('apply-to');
        const curSheet = dataControls._currentSheet;

        if (applyTo === 'this') {
            await curSheet.setSettings(formData);
        }
        else if (applyTo === 'all') {
            Settings.setGlobalSettings(formData);
            for (let sheet of this._sheets) {
                await sheet.setSettings(formData)
            }
        }
        // curSheet.show();
    },

    createVarSettings(varId) {
        dataControls._currentSheet.createVarSettings(varId);
    },

    setVarSettings(formData, newOrder, twoTables) {
        dataControls._currentSheet.setVarSettings(formData, newOrder, twoTables);
    },

    async addSheet(file) {
        const arrayLength = dataControls._sheets.length;
        dataControls._currentSheet?.hide();
        const name = file.name.split('.').slice(0, -1).join('');
        const newSheet = new Sheet(name, arrayLength)
        await newSheet.importFile(file);
        dataControls._sheets.push(newSheet);
        dataControls._currentSheet = newSheet;

        newSheet.show();
    },

    async selectSheet(sheetId) {
        const sheet = dataControls._sheets[sheetId];
        if (dataControls._currentSheet == sheet)
            return;

        dataControls._currentSheet?.hide();
        dataControls._currentSheet = sheet;

        sheet.show();
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
    },

    async getData() {
        const data = [];
        for (let el of this._sheets) {
            const sheetData = await el.getData();
            data.push(sheetData);
        }
        return data;
    },

    async loadData(data) {
        return new Promise((resolve, reject) => {
            data.forEach(el => {
                const blob = new Blob([el._file], { type: 'text/csv' });
                const file = new File([blob], el._name + '.csv', { type: 'text/csv' });
                dataControls.readSingleFile(file);
            });
        });
    },

    switchUnitedVar(id, checked) {
        const ids = id.split('_');
        this.getVarBySheetIdAndVarId(ids[1], ids[2]).switchUnitedVar(checked);
    }
};

export default dataControls;

