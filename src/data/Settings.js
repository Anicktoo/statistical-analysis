import * as initSettings from './initial-settings.json';

export default class Settings {
    static #form = document.getElementById('settings-form');
    static #skipInput = Settings.#form.querySelector('#skip-options');
    static #encodingInput = Settings.#form.querySelector('#encoding-options');
    static #colDelimiterInput = Settings.#form.querySelector('#col-delimiter-options');
    static #decimalDelimiterInput = Settings.#form.querySelector('#decimal-delimiter-options');

    static #globalSettings = initSettings.default;
    #skip;
    #encoding;
    #colDelimiter;
    #decimalDelimiter;

    constructor() {
        this.init(Settings.#globalSettings);
    }

    init(settings) {
        this.#skip = Object.deepCopy(settings['skip']);
        this.#encoding = Object.deepCopy(settings['encoding']);
        this.#colDelimiter = Object.deepCopy(settings['col-delimiter']);
        this.#decimalDelimiter = Object.deepCopy(settings['decimal-delimiter']);
    }

    createHTML() {
        Settings.#skipInput.setAttribute('value', `${this.#skip.value}`);
        Settings.#skipInput.value = this.#skip.value;

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
        Settings.#globalSettings['skip'].value = formData.get('skip');
        Settings.#globalSettings['encoding'].selected = formData.get('encoding');
        Settings.#globalSettings['col-delimiter'].selected = formData.get('col-delimiter');
        Settings.#globalSettings['decimal-delimiter'].selected = formData.get('decimal-delimiter');
    }
}