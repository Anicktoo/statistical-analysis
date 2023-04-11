import img from './img/moduleCorrelation.png';
import AbstractModule from '@modules/AbstractModule';

export default class Module extends AbstractModule {

    static #name = 'Проверка корреляции';
    static #image = img;

    #alpha;

    // constructor() {
    //     // const module = await import(condition ? './module1.js' : './module2.js');
    // }

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