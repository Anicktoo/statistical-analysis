export default class AbstractModule {

    _name;
    _image;


    constructor() {
        throw new Error("Can't create an instance of an abstract class");
    }

    getName() {
        throw new Error('This method must be implemented');
    }

    getImage() {
        throw new Error('This method must be implemented');
    }
}

