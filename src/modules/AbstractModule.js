export default class AbstractModule {

    #form;

    constructor() {
        if (AbstractModule === new.target)
            throw new Error("Can't create an instance of an abstract class");
    }

    static getName() {
        throw new Error('This method must be implemented');
    }

    static getImage() {
        throw new Error('This method must be implemented');
    }

    static createHTML() {
        throw new Error('This method must be implemented');
    }

    setSettings() {
        throw new Error('This method must be implemented');
    }

    getN() {
        throw new Error('This method must be implemented');
    }

    setStatPower() {
        throw new Error('This method must be implemented');
    }

    static addSheetOptions(listOfSheets, select) {
        const options = [];
        for (let el of listOfSheets) {
            const option = document.createElement('option');
            option.setAttribute('value', el.id);
            option.textContent = el.name;
            options.push(option);
        }
        select.append(...options);
    }
}

