export default class Settings {
    static _globalSettings = {
        skip: {
            value: "0"
        },
        encoding: {
            select: {
                "windows-1251": "Windows-1251",
                "utf-8": "UTF-8"
            },
            selected: "windows-1251"
        },
        colDelimiter: {
            select: {
                ",": "Запятая (,)",
                ".": "Точка (.)",
                ";": "Точка c запятой (;)"
            },
            selected: ","
        },
        decimalDelimiter: {
            select: {
                ",": "Запятая (,)",
                ".": "Точка (.)"
            },
            selected: "."
        }
    };
    _skip;
    _encoding;
    _colDelimiter;
    _decimalDelimiter;

    constructor() {
        this.init(Settings._globalSettings);
    }

    init(settings) {
        this._skip = Object.deepCopy(settings.skip);
        this._encoding = Object.deepCopy(settings.encoding);
        this._colDelimiter = Object.deepCopy(settings.colDelimiter);
        this._decimalDelimiter = Object.deepCopy(settings.decimalDelimiter);
    }

    createHTML() {
        uiControls.settingsSkipInput.setAttribute('value', `${this._skip.value}`);
        uiControls.settingsSkipInput.value = this._skip.value;

        createOptions(this._encoding, uiControls.settingsEncodingInput);
        createOptions(this._colDelimiter, uiControls.settingsColDelimiterInput);
        createOptions(this._decimalDelimiter, uiControls.settingsDecimalDelimiterInput);

        function createOptions(settingName, settingElement) {
            settingElement.innerHTML = '';
            for (let option of Object.entries(settingName.select)) {
                settingElement.innerHTML += `<option value="${option[0]}" ${settingName.selected === option[0] ? 'selected' : ''}>${option[1]}</option>`;
            }
        }
    }

    getSettings() {
        return {
            skip: this._skip,
            encoding: this._encoding,
            colDelimiter: this._colDelimiter,
            decimalDelimiter: this._decimalDelimiter,
        };
    }

    setSettings(formData) {
        this._skip.value = formData.get('skip');
        this._encoding.selected = formData.get('encoding');
        this._colDelimiter.selected = formData.get('col-delimiter');
        this._decimalDelimiter.selected = formData.get('decimal-delimiter');
    }
    setSettingsWithObject(settingsObject) {
        this._skip.value = settingsObject._skip.value;
        this._encoding.selected = settingsObject._encoding.selected;
        this._colDelimiter.selected = settingsObject._colDelimiter.selected;
        this._decimalDelimiter.selected = settingsObject._decimalDelimiter.selected;
    }

    static setGlobalSettings(formData) {
        Settings._globalSettings.skip.value = formData.get('skip');
        Settings._globalSettings.encoding.selected = formData.get('encoding');
        Settings._globalSettings.colDelimiter.selected = formData.get('col-delimiter');
        Settings._globalSettings.decimalDelimiter.selected = formData.get('decimal-delimiter');
    }

    static setGlobalSettingsWithObject(settingsObj) {
        Settings._globalSettings = settingsObj;
    }

    static getGlobalSettings() {
        return Settings._globalSettings;
    }
}