export default class AbstractModule {

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

    getName() {
        throw new Error('This method must be implemented');
    }

    getFormSheet() {
        throw new Error('This method must be implemented');
    }

    getSheetSelect() {
        throw new Error('This method must be implemented');
    }

    addListeners(element) {
        throw new Error('This method must be implemented');
    }

    displayVarsOfSheet(sheetId) {
        throw new Error('This method must be implemented');
    }

    updateSelectedVarsVisual(sheetId) {
        throw new Error('This method must be implemented');
    }

    clearSelectedVars() {
        throw new Error('This method must be implemented');
    }

    createHTML() {
        throw new Error('This method must be implemented');
    }

    setSettings() {
        throw new Error('This method must be implemented');
    }

    getN(alpha, power) {
        throw new Error('This method must be implemented');
    }

    setStatPower(alpha, sampleSize) {
        throw new Error('This method must be implemented');
    }

    updateResultsHtml(isMain) {
        throw new Error('This method must be implemented');
    }

    //ABSTRACT ONLY

    static addSheetOptions(listOfSheets, selects) {
        let str = '';
        for (let el of listOfSheets) {
            if (!selects[0].querySelector(`.select-option-${el.id}`)) {
                const option = `<option class='select-option-${el.id}' value="${el.id}">${el.name}</option>`
                str += option;
            }
        }

        for (let select of selects) {
            select.innerHTML += str;
        }
    }

    getZAlpha(altHypTest, alpha) {
        return altHypTest === 'both' ? Math.norminv(alpha / 2) : Math.norminv(alpha)
    }

    getZ(zAlpha, power) {
        return zAlpha + Math.norminv(100 - power);
    }
}

