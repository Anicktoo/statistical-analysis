export default class AbstractModule {

    static comElements = {
        parametersContainer: document.querySelector('.parameters__container'),
        resultsContainer: document.querySelector('.results__container'),
    }

    constructor() {
        if (AbstractModule === new.target)
            throw new Error("Can't create an instance of an abstract class");
    }

    static setModuleTypeId(id) {
        throw new Error('This method must be implemented');
    }

    static getModuleTypeId() {
        throw new Error('This method must be implemented');
    }

    static getName() {
        throw new Error('This method must be implemented');
    }

    static getImage() {
        throw new Error('This method must be implemented');
    }

    deleteSelf() {
        throw new Error('This method must be implemented');
    }

    getAllData() {
        throw new Error('This method must be implemented');
    }

    setName(name) {
        throw new Error('This method must be implemented');
    }

    setId(id) {
        throw new Error('This method must be implemented');
    }

    setLoadingData() {
        throw new Error('This method must be implemented');
    }

    getName() {
        throw new Error('This method must be implemented');
    }

    getElement() {
        throw new Error('This method must be implemented');
    }

    getResultElement() {
        throw new Error('This method must be implemented');
    }

    getFormSheets() {
        throw new Error('This method must be implemented');
    }

    getSheetSelects() {
        throw new Error('This method must be implemented');
    }

    setSheetOptions(listOfSheets) {
        throw new Error('This method must be implemented');

    }

    addSheetOptions(listOfSheets) {
        throw new Error('This method must be implemented');
    }

    addListeners(element) {
        throw new Error('This method must be implemented');
    }

    displayVarsOfSheet(sheetId, type) {
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

    changeVisibilityResultsHtml(hide) {
        throw new Error('This method must be implemented');
    }

}

