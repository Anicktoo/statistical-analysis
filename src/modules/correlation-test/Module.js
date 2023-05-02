import img from './img/moduleCorrelation.png';
import AbstractModule from '@modules/AbstractModule';

export default class Module extends AbstractModule {

    static #name = 'Проверка корреляции';
    static #image = img;
    static #moduleTypeId = null;

    // constructor(id, reference = null) {
    //     super();
    //     this.#id = id;

    //     if (reference) {
    //         this.#makeCopy(reference);
    //     }
    // }

    static setModuleTypeId(id) {
        Module.#moduleTypeId = id;
    }

    static getModuleTypeId() {
        return Module.#moduleTypeId;
    }

    static getName() {
        return this.#name;
    }

    static getImage() {
        return this.#image;
    }

    setSettings() {
    }

    getN() {
    }

    setStatPower() {
    }
}