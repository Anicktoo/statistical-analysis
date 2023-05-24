import * as Papa from 'papaparse';
import Settings from './Settings';
import moduleIntegrator from '@/moduleIntegrator';
import Var from './Var';

export default class Sheet {
    _name;
    _id;
    _data;
    _dataVars = [];
    _notNullDataVars = [];
    _settings = {
        obj: {},
        props: {}
    };
    _tableElement;
    _footerElement;
    _file;
    _needToApplySettings = false;
    _openedVar;


    constructor(name, file, id) {
        this._id = id;
        this._name = name;
        this._settings.obj = new Settings();
        this._settings.props = this._settings.obj.getSettings();;
        this._createTableElement();
        this._createFooterElement();
        this.importFile(file);
    }

    importFile(file) {
        this._file = file;
        this._parseDataInFile(true);
    }

    setSettings(settingsFormData) {
        this._needToApplySettings = true;
        this._settings.obj.setSettings(settingsFormData);
        this._settings.props = this._settings.obj.getSettings();
    }

    applySettingsAndShow() {
        this._needToApplySettings = false;
        Var.clearUnited();
        this._parseDataInFile(false);
    }

    createVarSettings(varID) {
        const changedVar = this._dataVars[Number(varID.split('_')[2])]
        changedVar.createHTML();
        this._openedVar = changedVar;
    }

    setVarSettings(formData, order, twoTables) {
        this._openedVar.setSettings(formData, order, twoTables);
        moduleIntegrator.updateVarsOfSheet(this._id, false);
    }

    readyToShow() {
        return !this._needToApplySettings;
    }

    show() {
        this._settings.obj.createHTML();
        this._tableElement.classList.add('data__table_shown');
        this._footerElement.classList.add('footer__item_selected');
        uiControls.footerChange();
    }

    hide() {
        this._tableElement.classList.remove('data__table_shown');
        this._footerElement.classList.remove('footer__item_selected');
    }

    setId(id) {
        this._id = id;
        this._footerElement.setAttribute('id', id);
    }

    _createTableElement() {
        this._tableElement = uiControls.dataContainer.insertBefore(document.createElement('table'), uiControls.dataContainer.firstChild);
        this._tableElement.classList.add('data__table');
        this._tableElement.setAttribute('id', this._id);
        this._tableElement.innerHTML = `
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

    _createFooterElement() {
        this._footerElement = uiControls.footerList.appendChild(document.createElement('li'));
        this._footerElement.classList.add('footer__item', 'footer__item_selected', 'footer__item_new');
        this._footerElement.setAttribute('id', this._id);
        this._footerElement.innerHTML = `
        <div class="footer__item-content">
            <span class="footer__item-text">
                ${this._name}
            </span>
        </div>`;
    }

    _createHTML() {
        const createThead = () => {
            const createTh = (name, index) => {
                return `
                <th>
                    <div class="data__column-header">
                        ${this._dataVars[index].getTypeName() === Var.Empty.name ? `` : `
                        <div title="Сменить тип данных колонки" id=${this._dataVars[index].getID()} class="data__var-icon data__var-icon_new">
                            <img src="${this._dataVars[index].getImg()}" alt="${this._dataVars[index].getName()}">
                        </div>`}
                        <span class="data__var-name">${name}</span>
                    </div>
                </th>`;
            };

            const headersArray = this._data[0].map((el, index) => createTh(el, index));
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

            return this._data.slice(1).map(row =>
                createTr(row.map(val =>
                    `<td class='${typeof val == 'number' ? 'number' : ''}'>${val}</td>`
                ))).join('');

        };

        const createInnerHtml = (createHeader, createBody) => {
            const head = this._tableElement.querySelector('tr');
            const btn = head.querySelector('#dataSettingsBtn');
            const body = this._tableElement.querySelector('tbody');

            head.innerHTML = createHeader ? createThead() : '';
            head.insertBefore(btn, head.firstElementChild);

            body.innerHTML = createBody ? createTbody() : '';
        };


        switch (this._data.length) {
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

        uiControls.initNewSheetControls();
        this.show();
    }

    _parseDataInFile(isNewFile) {
        const del = this._settings.props.decimalDelimiter.selected;
        let regExpReadyDel = del;
        if (RegExp.specialSymbols.includes(del)) {
            regExpReadyDel = '\\' + del;
        }
        const regex = new RegExp(`^-?(?:\\d+(?:${regExpReadyDel}\\d+)?|\\d+(?:${regExpReadyDel}\\d+)?(?:e|E)(?:\\+|-)?\\d+)$`);

        Papa.parse(this._file, {
            encoding: this._settings.props.encoding.selected,
            delimiter: this._settings.props.colDelimiter.selected,
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
                const skip = this._settings.props.skip.value;
                if (skip != 0) {
                    results.data = results.data.slice(skip);
                }
                this._data = results.data;
                this._initVars();
                this._createHTML();
                if (isNewFile) {
                    moduleIntegrator.optionListAdd({
                        name: this._name,
                        id: this._id
                    });
                }
                if (this._id === 0 || !isNewFile) {
                    moduleIntegrator.updateVarsOfSheet(this._id, true);
                }
            }
        });
    }

    _initVars() {
        if (this._data.length === 0)
            return;

        let i = 0;
        const idName = () => 'var' + '_' + this._id + '_' + (i++);
        const dataVars = this._data[0].map((_, colIndex) => getColumnVar(this._data.map(row => row[colIndex])));
        this._dataVars = dataVars;
        this._notNullDataVars = [];
        dataVars.forEach(el => {
            if (el.getTypeName() !== Var.Empty.name) {
                this._notNullDataVars.push(el);
            }
        })

        function getColumnVar(column) {
            const columnData = column.slice(1);
            const uniqueValues = new Set(columnData);
            uniqueValues.delete('');
            const notANumber = columnData.find(val => typeof val !== 'number' && val !== '');

            const newVar = (type) => new Var(type, idName(), uniqueValues, column[0], (notANumber == undefined));

            if (uniqueValues.size === 0) {
                return newVar(Var.Empty);
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
        return this._name;
    }

    getID() {
        return this._id;
    }

    getVars() {
        return this._notNullDataVars;
    }

    getVarById(varId) {
        return this._dataVars[varId];
    }

    getDataByVarId(varId) {
        const data = this._data.map((arr) => arr[varId]).slice(1);
        const newData = trimDataEnd(data)
        return newData;

        function trimDataEnd(data) {
            let trimCount = 0;
            for (let i = data.length - 1; i >= 0; i--) {
                if (data[i] === '') {
                    trimCount--;
                }
                else {
                    break;
                }
            }
            if (trimCount) {
                return data.slice(0, trimCount)
            }
            return data;
        }
    }

    async getData() {
        const data = Object.deepCopy(this);

        data._file = await File.readUploadedFileAsText(this._file);

        return data;
    }
}