import img from './img/modulePair.png';
import AbstractModule from '@modules/AbstractModule';

export default class Module extends AbstractModule {

    static _name = 'Сравнение парных выборок';
    static _image = img;

    // constructor() {

    // }

    static getName() {
        return this._name;
    }

    static getImage() {
        return this._image;
    }
}