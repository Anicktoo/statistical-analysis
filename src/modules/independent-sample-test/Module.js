import img from './img/moduleIndependent.png';
import AbstractModule from '@modules/AbstractModule';

export default class Module extends AbstractModule {

    static #name = 'Сравнение независимых выборок';
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