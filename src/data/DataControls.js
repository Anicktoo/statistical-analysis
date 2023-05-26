import moduleIntegrator from '@/moduleIntegrator';
import Sheet from '@data/Sheet';
import Settings from '@data/Settings';
import Var from '@data/Var';

const dataControls = {
    _sheets: [],
    _currentSheet: undefined,

    async readSingleFile(file) {
        try {
            document.body.classList.add('loading');
            if (!file) {
                throw new Error('Ошибка при загрузке файла.');
            }
            if (file.name.split('.').pop() !== 'csv') {
                throw new Error('Неверный тип файла');
            }
            await dataControls.addSheet(file);
            document.body.classList.remove('loading');
        }
        catch (err) {
            uiControls.showError(uiControls.burgerMenu, 'Ошибка загрузки файла');
            console.error(err);
            document.body.classList.remove('loading');
        }
    },

    async submitSettings(event, formData) {
        event.preventDefault();
        const applyTo = formData.get('apply-to');
        const curSheet = dataControls._currentSheet;

        if (applyTo === 'this') {
            await curSheet.setSettings(formData);
            uiControls.initNewSheetControls();
            moduleIntegrator.updateVarsOfSheet(curSheet.getID(), false);
        }
        else if (applyTo === 'all') {
            Settings.setGlobalSettings(formData);
            for (let sheet of this._sheets) {
                await sheet.setSettings(formData);
                uiControls.initNewSheetControls();
                moduleIntegrator.updateVarsOfSheet(sheet.getID(), false);
            }
        }

    },

    createVarSettings(varId) {
        dataControls._currentSheet.createVarSettings(varId);
    },

    setVarSettings(formData, newOrder, twoTables) {
        dataControls._currentSheet.setVarSettings(formData, newOrder, twoTables);
        moduleIntegrator.updateVarsOfSheet(dataControls._currentSheet.getID(), false);
    },

    async addSheet(file) {
        const arrayLength = dataControls._sheets.length;
        dataControls._currentSheet?.hide();
        const name = file.name.split('.').slice(0, -1).join('');
        const newSheet = new Sheet(name, arrayLength)
        await newSheet.importFile(file);
        dataControls._sheets.push(newSheet);
        dataControls._currentSheet = newSheet;
        moduleIntegrator.optionListAdd({
            name: dataControls._currentSheet.getName(),
            id: dataControls._currentSheet.getID()
        });
        uiControls.initNewSheetControls();
        if (dataControls._sheets.length === 1) {
            moduleIntegrator.updateVarsOfSheet(0, true);
            uiControls.footerSetMaxWidth();
        }

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
        const data = {
            sheets: [],
            globalSettings: Settings.getGlobalSettings(),
            globalVarSettings: Var.getGlobalSettings()
        };
        for (let el of this._sheets) {
            const sheetData = await el.getData();
            data.sheets.push(sheetData);
        }
        return data;
    },

    async loadData(data) {

        Settings.setGlobalSettingsWithObject(data.globalSettings);

        if (data.sheets.length === 0)
            return;

        for (let i = 0; i < data.sheets.length; i++) {
            const el = data.sheets[i];
            const blob = new Blob([el._file], { type: 'text/csv' });
            const file = new File([blob], el._name + '.csv', { type: 'text/csv' });
            await dataControls.addSheet(file);
            this._sheets[i].setId(el._id);
            this._sheets[i].setName(el._name);
            await this._sheets[i].setSettingsWithObject(el._settings);
            this._sheets[i].setVarSettingsWithArray(el._dataVars);
            uiControls.initNewSheetControls();
            moduleIntegrator.updateVarsOfSheet(this._sheets[i].getID(), false);
        }
        const unitedVars = data.globalVarSettings.unitedRangsIds.map(el => {
            const ids = el.split('_');
            return this.getVarBySheetIdAndVarId(Number(ids[1]), Number(ids[2]));
        });
        Var.setGlobalSettingsWithObject(data.globalVarSettings, unitedVars);

        await this.selectSheet(this._sheets[0].getID());
    },

    switchUnitedVar(id, checked) {
        const ids = id.split('_');
        this.getVarBySheetIdAndVarId(ids[1], ids[2]).switchUnitedVar(checked);
    }
};

export default dataControls;

