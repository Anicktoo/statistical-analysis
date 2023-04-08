import img from './img/modulePair.png';
import AbstractModule from '@modules/AbstractModule';

export default class Module extends AbstractModule {

    static #name = 'Сравнение парных выборок';
    static #image = img;

    #alpha;

    // constructor() {

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

    getStatPower() {
    }
}