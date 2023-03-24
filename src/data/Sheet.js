import * as initSettings from './initial-settings.json';
import Settings from './Settings';
import Var from './Var';

export default class Sheet {

    static #globalSettings = new Settings(initSettings);
    #name;
    #data;
    #settings;
    #tableElement;

    constructor(name, data) {
        this.#name = name;
        this.#settings = Sheet.#globalSettings;
        console.log(this.#settings);

        if (data) {
            this.importData(data);
            this.#createHTML();
        }
        else {
            this.#createEmptyHtml();
        }
    }

    #createHTML() {

    }

    #createEmptyHtml() {

    }

    isEmpty() {
        return this.#data === undefined;
    }

    importData(fileContent) {
        let content;
        const encoding = this.#settings.getSettings().encoding.selected;
        if (encoding !== 'utf-8') {
            content = Sheet.#convertArrayBuffer(fileContent, encoding);
            console.log(content);
            const lines = content.split(/(\r\n|\r|\n)/); //HERE!!! TRY CSV PARESERS 
            const dataMatrix = [];
            for (let line of lines) {
                if (line.length !== 0) {
                    dataMatrix.push(line.split(","));
                }
            }
            this.#data = transpose(dataMatrix);
            console.log(dataMatrix);
            console.log(this.#data);
        }

        function transpose(matrix) {
            return matrix[0].map((col, i) => matrix.map(row => row[i]));
        }
    }

    setSettings(settingsFormData) {
        this.#settings.setSettings(settingsFormData);
    }

    show() {
        this.#settings.createHTML();
    }

    hide() {

    }

    static #convertArrayBuffer(array, encoding) {
        const decoder = new TextDecoder(encoding);
        const encoder = new TextEncoder();
        const bytes = decoder.decode(array);
        const utf8Bytes = encoder.encode(bytes);
        const utf8Str = new TextDecoder('utf-8').decode(utf8Bytes);
        return utf8Str;
    }
}