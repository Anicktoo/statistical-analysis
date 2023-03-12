import AbstractModule from '@modules/AbstractModule';

const MODULE_FOLDERS = ['paired-sample-test', 'independent-sample-test', 'correlation-test'];


export async function createModuleButtons() {

    const modules = [];
    for (const folder of MODULE_FOLDERS) {
        const { default: Module } = await import(`@modules/${folder}/Module.js`);
        if (AbstractModule.isPrototypeOf(Module))
            modules.push(Module);
        else
            throw new Error(`Class ${Module.name} doesn't extends ${AbstractModule.name} class`);
    }

    const moduleListElement = document.querySelector('.modules__list');

    for (const module of modules) {
        const moduleName = module.getName();
        const moduleImage = module.getImage();
        moduleListElement.innerHTML += `
        <li class="modules__item button">
            <div class="modules__icon">
                <img src="${moduleImage}" alt="${moduleName}">
            </div>
            <span class="modules__description">${moduleName}</span>
        </li>`;
    }
}