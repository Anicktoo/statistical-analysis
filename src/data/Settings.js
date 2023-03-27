import * as initSettings from './initial-settings.json';

export default class Settings {
    static #form = document.getElementById('settings-form');
    static #firstRowInput = Settings.#form.querySelector('#first-row-options');
    static #encodingInput = Settings.#form.querySelector('#encoding-options');
    static #colDelimiterInput = Settings.#form.querySelector('#col-delimiter-options');
    static #decimalDelimiterInput = Settings.#form.querySelector('#decimal-delimiter-options');

    static #globalSettings = initSettings.default;
    #firstRow;
    #encoding;
    #colDelimiter;
    #decimalDelimiter;

    constructor() {
        console.log("setGlobalSettings ", Settings.#globalSettings);
        this.init(Settings.#globalSettings);
    }

    init(settings) {
        this.#firstRow = Object.deepCopy(settings['first-row']);
        this.#encoding = Object.deepCopy(settings['encoding']);
        this.#colDelimiter = Object.deepCopy(settings['col-delimiter']);
        this.#decimalDelimiter = Object.deepCopy(settings['decimal-delimiter']);
    }

    createHTML() {
        Settings.#firstRowInput.setAttribute('value', `${this.#firstRow.value}`);

        createOptions(this.#encoding, Settings.#encodingInput);
        createOptions(this.#colDelimiter, Settings.#colDelimiterInput);
        createOptions(this.#decimalDelimiter, Settings.#decimalDelimiterInput);

        function createOptions(settingName, settingElement) {
            settingElement.innerHTML = '';
            for (let option of Object.entries(settingName.select)) {
                settingElement.innerHTML += `<option value="${option[0]}" ${settingName.selected === option[0] ? 'selected' : ''}>${option[1]}</option>`;
            }
        }
    }

    getSettings() {
        return {
            firstRow: this.#firstRow,
            encoding: this.#encoding,
            colDelimiter: this.#colDelimiter,
            decimalDelimiter: this.#decimalDelimiter,
        };
    }

    setSettings(formData) {
        this.#firstRow.value = formData.get('first-row');
        this.#encoding.selected = formData.get('encoding');
        this.#colDelimiter.selected = formData.get('col-delimiter');
        this.#decimalDelimiter.selected = formData.get('decimal-delimiter');
    }

    static setGlobalSettings(formData) {
        Settings.#globalSettings['first-row'].value = formData.get('first-row');
        Settings.#globalSettings['encoding'].selected = formData.get('encoding');
        Settings.#globalSettings['col-delimiter'].selected = formData.get('col-delimiter');
        Settings.#globalSettings['decimal-delimiter'].selected = formData.get('decimal-delimiter');
    }
}