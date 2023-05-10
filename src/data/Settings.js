export default class Settings {
    static #globalSettings = {
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
    #skip;
    #encoding;
    #colDelimiter;
    #decimalDelimiter;

    constructor() {
        this.init(Settings.#globalSettings);
    }

    init(settings) {
        this.#skip = Object.deepCopy(settings.skip);
        this.#encoding = Object.deepCopy(settings.encoding);
        this.#colDelimiter = Object.deepCopy(settings.colDelimiter);
        this.#decimalDelimiter = Object.deepCopy(settings.decimalDelimiter);
    }

    createHTML() {
        uiControls.settingsSkipInput.setAttribute('value', `${this.#skip.value}`);
        uiControls.settingsSkipInput.value = this.#skip.value;

        createOptions(this.#encoding, uiControls.settingsEncodingInput);
        createOptions(this.#colDelimiter, uiControls.settingsColDelimiterInput);
        createOptions(this.#decimalDelimiter, uiControls.settingsDecimalDelimiterInput);

        function createOptions(settingName, settingElement) {
            settingElement.innerHTML = '';
            for (let option of Object.entries(settingName.select)) {
                settingElement.innerHTML += `<option value="${option[0]}" ${settingName.selected === option[0] ? 'selected' : ''}>${option[1]}</option>`;
            }
        }
    }

    getSettings() {
        return {
            skip: this.#skip,
            encoding: this.#encoding,
            colDelimiter: this.#colDelimiter,
            decimalDelimiter: this.#decimalDelimiter,
        };
    }

    setSettings(formData) {
        this.#skip.value = formData.get('skip');
        this.#encoding.selected = formData.get('encoding');
        this.#colDelimiter.selected = formData.get('col-delimiter');
        this.#decimalDelimiter.selected = formData.get('decimal-delimiter');
    }

    static setGlobalSettings(formData) {
        Settings.#globalSettings.skip.value = formData.get('skip');
        Settings.#globalSettings.encoding.selected = formData.get('encoding');
        Settings.#globalSettings.colDelimiter.selected = formData.get('col-delimiter');
        Settings.#globalSettings.decimalDelimiter.selected = formData.get('decimal-delimiter');
    }
}