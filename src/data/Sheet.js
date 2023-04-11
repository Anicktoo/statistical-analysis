import * as Papa from 'papaparse';
import Settings from './Settings';
import UIControls from '@/UIControls';
import { optionListAdd, displayVarsBySheetId } from '@/module-integration';
import Var from './Var';

export default class Sheet {
    #name;
    #id;
    #data;
    #dataVars = [];
    #settings = {
        obj: {},
        props: {}
    };
    #tableElement;
    #footerElement;
    #file;
    #needToApplySettings = false;
    #openedVar;


    constructor(name, file, id) {
        this.#id = id;
        this.#name = name;
        this.#settings.obj = new Settings();
        this.#settings.props = this.#settings.obj.getSettings();;
        this.#createTableElement();
        this.#createFooterElement();
        this.importFile(file);
    }

    importFile(file) {
        this.#file = file;
        this.#parseDataInFile(true);
    }

    setSettings(settingsFormData) {
        this.#needToApplySettings = true;
        this.#settings.obj.setSettings(settingsFormData);
        this.#settings.props = this.#settings.obj.getSettings();
    }

    applySettingsAndShow() {
        this.#needToApplySettings = false;
        this.#parseDataInFile(false);
    }

    createVarSettings(varID) {
        const changedVar = this.#dataVars[Number(varID.split('_')[1])]
        // if (this.#openedVar === changedVar) {
        //     console.log('Worked');
        //     return;
        // }
        changedVar.createHTML();
        this.#openedVar = changedVar;
    }

    setVarSettings(formData, order, twoTables) {
        this.#openedVar.setSettings(formData, order, twoTables);
        displayVarsBySheetId(this.#id);
    }

    readyToShow() {
        return !this.#needToApplySettings;
    }

    show() {
        this.#settings.obj.createHTML();
        this.#tableElement.classList.add('data__table_shown');
        this.#footerElement.classList.add('footer__item_selected');
        UIControls.footerChange();

    }

    hide() {
        this.#tableElement.classList.remove('data__table_shown');
        this.#footerElement.classList.remove('footer__item_selected');
    }

    setId(id) {
        this.#id = id;
        this.#footerElement.setAttribute('id', id);
    }

    #createTableElement() {
        this.#tableElement = UIControls.dataContainer.insertBefore(document.createElement('table'), UIControls.dataContainer.firstChild);
        this.#tableElement.classList.add('data__table');
        this.#tableElement.setAttribute('id', this.#id);
        this.#tableElement.innerHTML = `
        <thead>
            <tr>
                <th title="Настройки импортированных данных" id="dataSettingsBtn" class="dataSettingsBtn_new">
                    <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
                        width="19px" height="19px">
                        <path
                            d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z" />
                    </svg>
                </th>
            </tr>
        </thead>
        <tbody>
        </tbody>`;
    }

    #createFooterElement() {
        this.#footerElement = UIControls.footerList.appendChild(document.createElement('li'));
        this.#footerElement.classList.add('footer__item', 'footer__item_selected', 'footer__item_new');
        this.#footerElement.setAttribute('id', this.#id);
        this.#footerElement.innerHTML = `
        <div class="footer__item-content">
            <span class="footer__item-text">
                ${this.#name}
            </span>
        </div>`;
    }

    #createHTML() {
        const createThead = () => {
            const createTh = (name, index) => {
                return `<th>
                    <div class="data__column-header">
                        <div title="Сменить тип данных колонки" id=${this.#dataVars[index].getID()} class="data__var-icon data__var-icon_new">
                            <img src="${this.#dataVars[index].getImg()}" alt="${this.#dataVars[index].getName()}">
                        </div>
                        <span class="data__var-name">${name}</span>
                    </div>
                </th>`;
            };

            const headersArray = this.#data[0].map((el, index) => createTh(el, index));
            return headersArray.reduce((ths, element) => ths + element);

        };

        const createTbody = () => {
            let curRow = 1;

            const createTr = (vals) => {
                return `
                <tr>
                    <td>${curRow++}</td>
                    ${vals.reduce((tds, element) => tds + element)}
                </tr>`;
            };

            return this.#data.slice(1).map(row =>
                createTr(row.map(val =>
                    `<td class='${typeof val == 'number' ? 'number' : ''}'>${val}</td>`
                ))).join('');

        };

        const createInnerHtml = (createHeader, createBody) => {
            const head = this.#tableElement.querySelector('tr');
            const btn = head.querySelector('#dataSettingsBtn');
            const body = this.#tableElement.querySelector('tbody');

            head.innerHTML = createHeader ? createThead() : '';
            head.insertBefore(btn, head.firstElementChild);

            body.innerHTML = createBody ? createTbody() : '';
        };


        switch (this.#data.length) {
            case 0: {
                createInnerHtml(false, false);
                break;
            }
            case 1: {
                createInnerHtml(true, false);
                break
            }
            default: {
                createInnerHtml(true, true);
            }
        }

        UIControls.initChangableUIControls();
        this.show();
    }

    #parseDataInFile(isNewFile) {
        const del = this.#settings.props.decimalDelimiter.selected;
        let regExpReadyDel = del;
        if (RegExp.specialSymbols.includes(del)) {
            regExpReadyDel = '\\' + del;
        }
        const regex = new RegExp(`^-?(?:\\d+(?:${regExpReadyDel}\\d+)?|\\d+(?:${regExpReadyDel}\\d+)?(?:e|E)(?:\\+|-)?\\d+)$`);

        Papa.parse(this.#file, {
            encoding: this.#settings.props.encoding.selected,
            delimiter: this.#settings.props.colDelimiter.selected,
            transform: (val, col) => {
                let valTrimmed = val.trim();

                if (regex.test(valTrimmed)) {
                    return Number(valTrimmed.replace(del, '.'));
                }
                else {
                    return valTrimmed;
                }
            },
            skipEmptyLines: true,
            complete: (results) => {
                const skip = this.#settings.props.skip.value;
                if (skip != 0) {
                    results.data = results.data.slice(skip);
                }
                this.#data = results.data;
                this.#initVars();
                this.#createHTML();
                if (isNewFile) {
                    optionListAdd({
                        name: this.#name,
                        id: this.#id
                    });
                }
                if (this.#id === 0 || !isNewFile) {
                    displayVarsBySheetId(this.#id);
                }
            }
        });
    }

    #initVars() {
        if (this.#data.length === 0)
            return;

        let i = 0;
        const idName = () => 'var' + this.#id + '_' + (i++);
        const dataVars = this.#data[0].map((_, colIndex) => getColumnVar(this.#data.map(row => row[colIndex])));
        this.#dataVars = dataVars;

        console.log(this.#dataVars);

        function getColumnVar(column) {
            const columnData = column.slice(1);
            const uniqueValues = new Set(columnData);
            const notANumber = columnData.find(val => typeof val !== 'number');

            const newVar = (type) => new Var(type, idName(), uniqueValues, column[0], (notANumber == undefined));

            if (columnData.length === 0) {
                return newVar(Var.Nominal);
            }

            if (uniqueValues.size === 2) {
                return newVar(Var.Binary);
            }

            if (notANumber) {
                return newVar(Var.Nominal);
            }
            return newVar(Var.Continues);
        }
    }

    getName() {
        return this.#name;
    }

    getID() {
        return this.#id;
    }

    getVars() {
        return this.#dataVars;
    }
}