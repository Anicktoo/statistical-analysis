import nominalImg from '@img/table/scaleNominal.png';
import continuesImg from '@img/table/scaleContinues.png';
import binaryImg from '@img/table/scaleBinary.png';
import rangImg from '@img/table/scaleRang.png';
import UIControls from '../UIControls';

export default class Var {
    static Binary = {
        name: 'binary',
        img: binaryImg,
    };
    static Nominal = {
        name: 'nominal',
        img: nominalImg,
    };
    static Continues = {
        name: 'continues',
        img: continuesImg,
    };
    static Rang = {
        name: 'rang',
        img: rangImg,
    };

    #typeName;
    #name;
    #id;
    #img;
    #levels = [];
    #onlyNumbers;

    constructor(type, id, set, name, onlyNumbers) {
        this.#typeName = type.name;
        this.#img = type.img;
        this.#id = id;
        this.#name = name;
        this.#onlyNumbers = onlyNumbers;
        this.#levels = [...set].sort();
    }

    setSettings(formData, order) {
        const varHeader = document.getElementById(this.#id);

        this.#name = formData.get('var-name');
        varHeader.nextElementSibling.textContent = this.#name;

        this.#typeName = formData.get('var-type');
        console.log(Object.entries(Var));

        this.#img = Object.entries(Var).find(item => item[1]['name'] === this.#typeName)[1]['img'];
        varHeader.querySelector('img').setAttribute('src', this.#img);
    }
    createHTML() {
        const modal = UIControls.modalVarType;
        const name = UIControls.modalVarType.querySelector('#modal-var-types__name');
        const continuesLabel = UIControls.modalVarType.querySelector('.modal-var-types__continues-container');
        const varChooseInputs = [...UIControls.modalVarType.querySelectorAll('.modal-var-types__item-input')];
        const body = modal.querySelector('.modal-var-types__rang-table-body');

        name.value = this.#name;
        name.setAttribute('value', this.#name);

        varChooseInputs.forEach(element => {
            element.checked = element.value === this.#typeName;
        });
        if (!this.#onlyNumbers) {
            continuesLabel.classList.add('radio-line_disabled');
            continuesLabel.firstElementChild.disabled = true;
        }
        else {
            continuesLabel.classList.remove('radio-line_disabled');
            continuesLabel.firstElementChild.disabled = false;
        }

        let i = 0;
        body.innerHTML = this.#levels.map((value) =>
            `<label class="var-table__item" data-order="${i++}">
                <input type="radio" name="data_value">
                <span>${value}</span>
            </label>`).join('');
    }

    getID() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getImg() {
        return this.#img;
    }
}