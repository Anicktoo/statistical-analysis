export default class Settings {
    static #form = document.getElementById('settings-form');
    static #firstRowInput = Settings.#form.querySelector('#first-row-options');
    static #encodingInput = Settings.#form.querySelector('#encoding-options');
    static #colDelimiterInput = Settings.#form.querySelector('#col-delimiter-options');
    static #decimalDelimeterInput = Settings.#form.querySelector('#decimal-delimeter-options');

    #firstRow;
    #encoding;
    #colDelimeter;
    #decimalDelimeter;

    constructor(initailSettingsJson) {
        if (initailSettingsJson) {
            this.initWithJSON(initailSettingsJson);
        }
    }

    initWithJSON(json) {
        const settings = json.default;
        this.#firstRow = settings['firstRow'];
        this.#encoding = settings['encoding'];
        this.#colDelimeter = settings['col-delimeter'];
        this.#decimalDelimeter = settings['decimal-delimeter'];
    }

    createHTML() {
        Settings.#firstRowInput.setAttribute('min', `${this.#firstRow.min}`);
        Settings.#firstRowInput.setAttribute('max', `${this.#firstRow.max}`);
        Settings.#firstRowInput.setAttribute('value', `${this.#firstRow.value}`);

        createOptions(this.#encoding, Settings.#encodingInput);
        createOptions(this.#colDelimeter, Settings.#colDelimiterInput);
        createOptions(this.#decimalDelimeter, Settings.#decimalDelimeterInput);

        function createOptions(settingName, settingElement) {
            for (let option of Object.entries(settingName.select)) {
                settingElement.innerHTML += `<option value="${option[0]}" ${settingName.selected === option[0] ? 'selected' : ''}>${option[1]}</option>`;
            }
        }
    }

    getSettings() {
        return {
            firstRow: this.#firstRow,
            encoding: this.#encoding,
            colDelimeter: this.#colDelimeter,
            decimalDelimeter: this.#decimalDelimeter,
        };
    }

    setSettings(formData) {

    }
}