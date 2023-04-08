export default class AbstractModule {

    constructor() {
        throw new Error("Can't create an instance of an abstract class");
    }

    static getName() {
        throw new Error('This method must be implemented');
    }

    static getImage() {
        throw new Error('This method must be implemented');
    }

    setSettings() {
        throw new Error('This method must be implemented');
    }

    getN() {
        throw new Error('This method must be implemented');
    }

    getStatPower() {
        throw new Error('This method must be implemented');
    }
}

