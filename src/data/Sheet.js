import * as Papa from 'papaparse';
import Settings from './Settings';
import UIControls from '@/UIControls';
import Var from './Var';

export default class Sheet {
    #name;
    #data;
    #settings = {
        obj: {},
        props: {}
    };
    #tableElement;
    #file;
    static #sheetCounter = 0;

    constructor(name, file) {
        this.#name = name;
        this.#settings.obj = new Settings();
        this.#settings.props = this.#settings.obj.getSettings();;
        this.#createTableElement();
        if (file) {
            this.importFile(file);
        }
        else {
            this.#createHTML();
        }
    }

    importFile(file) {
        this.#file = file;
        this.#parseDataInFile(file);
    }

    setSettings(settingsFormData) {
        this.#settings.obj.setSettings(settingsFormData);
    }

    applySettings() {
        this.#settings.obj.createHTML();
        this.#settings.props = this.#settings.obj.getSettings();
        if (this.#file) {
            this.#parseDataInFile();
        }
    }

    isEmpty() {
        return this.#data == undefined;
    }

    show() {
        this.#settings.obj.createHTML();
        this.#tableElement.classList.add('data__table_shown');
        UIControls.initChangableUIControls();
    }

    hide() {
        this.#tableElement.classList.remove('data__table_shown');
    }

    #createTableElement() {
        this.#tableElement = UIControls.dataContainer.insertBefore(document.createElement('table'), UIControls.dataContainer.firstChild);
        this.#tableElement.classList.add('data__table');
        this.#tableElement.setAttribute('id', Sheet.#sheetCounter++);
    }

    #createHTML() {
        let cols, rows;

        const createThead = (empty) => {
            const createTh = (name) => {
                let str =
                    `<th>
                    <div class="data__column-header">
                        <div title="Сменить тип данных колонки" class="data__var-icon nominal-img button"></div>
                        <span class="data__var-name">${name}</span>
                    </div>
                </th>`;
                return str;
            };

            let headersArray = [];
            if (empty) {
                for (let i = 0; i < cols; i++) {
                    headersArray.push(createTh('Столбец ' + (i + 1)));
                }
            }
            else {
                headersArray = this.#data[0].map(el => createTh(el));
            }

            let str = `
            <thead>
            <tr>
                <th title="Настройки импортированных данных" id="dataSettingsBtn" class="button">
                    <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
                        width="19px" height="19px">
                        <path
                            d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z" />
                    </svg>
                </th>
            ${headersArray.reduce((ths, element) => ths + element)}
            </tr>
            </thead>`;

            return str;
        };

        const createTbody = (empty) => {
            let curRow = 1;

            // const createTd = (val) => {
            //     return `<td>${val}</td>`;
            // };

            const createTr = (vals) => {
                let str = `
                <tr>
                    <td>${curRow++}</td>
                    ${vals.reduce((tds, element) => tds + element)}
                </tr>
                `;
                return str;
            }

            let innerString = [];

            if (empty) {
                for (let i = 0; i < rows - 1; i++) {
                    innerString.push([]);
                    for (let j = 1; j < cols + 1; j++) {
                        innerString[i].push('<td></td>');
                    }
                    innerString[i] = createTr(innerString[i]);
                }
                innerString = innerString.join('');
            }
            else {
                innerString = this.#data.slice(1).map(row => createTr(row.map(val => `<td>${val}</td>`))).join('');
            }


            let str = `
            <tbody>
                ${innerString}
            </tbody>`;

            return str;
        };

        if (this.isEmpty()) {
            cols = 9;
            rows = 51;
            this.#tableElement.innerHTML = createThead(true) + createTbody(true);
        }
        else {
            cols = this.#data[0].length;
            rows = this.#data.length;
            this.#tableElement.innerHTML = createThead(false) + createTbody(false);
        }

        this.show();
    }

    #parseDataInFile() {
        Papa.parse(this.#file, {
            encoding: this.#settings.props.encoding.selected,
            delimiter: this.#settings.props.colDelimiter.selected,
            transform: (val, col) => {
                const del = this.#settings.props.decimalDelimiter.selected;
                const valTrimmed = val.trim();
                if (del !== '.') {
                    return valTrimmed.replace(del, '.');
                }
                return valTrimmed;
            },
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                const firstRow = this.#settings.props.firstRow.value;
                console.log(firstRow);
                if (firstRow != 1) {
                    results.data = results.data.slice(firstRow - 1); //Error add?
                }
                this.#data = results.data;
                this.#createHTML();
            }
        });
    }
}