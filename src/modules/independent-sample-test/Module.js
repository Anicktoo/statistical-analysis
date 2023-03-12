import img from './img/moduleIndependent.png';
import AbstractModule from '@modules/AbstractModule';

export default class Module extends AbstractModule {

    static _name = 'Сравнение независимых выборок';
    static _image = img;

    // constructor() {
    //     // const module = await import(condition ? './module1.js' : './module2.js');
    // }

    static getName() {
        return this._name;
    }

    static getImage() {
        return this._image;
    }
}