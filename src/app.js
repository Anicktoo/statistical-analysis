import '@styles/styles.scss';
import '@/utils/utils';
import '@/uiControls';
import moduleIntegrator from '@/moduleIntegrator';
import dataControls from '@data/dataControls';

(async function start() {
    uiControls.initConstuiControls();
    await moduleIntegrator.createModuleButtons();

    if (window.fileToLoad) {
        loadProject(window.fileToLoad);
    }
})();

export async function saveProject() {
    try {
        document.body.classList.add('laoding');
        const dataControlsData = await dataControls.getData();
        const moduleIntegratorData = moduleIntegrator.getData();
        const data = {
            dataControlsData,
            moduleIntegratorData
        };
        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        const fileName = moduleIntegrator.getGlobalName();
        link.download = `${fileName ? fileName : 'results'}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }
    catch (err) {
        uiControls.showError(uiControls.burgerMenu, 'Ошибка при сохранении');
        console.error(err);
    }
    finally {
        document.body.classList.remove('loading');
    }
}

export async function loadProject(file) {
    try {
        document.body.classList.add('loading');
        const json = await File.readUploadedFileAsText(file);
        const data = JSON.parse(json);
        await dataControls.loadData(data.dataControlsData);
        moduleIntegrator.loadData(data.moduleIntegratorData);
    }
    catch (err) {
        uiControls.showError(uiControls.burgerMenu, 'Ошибка при загрузке файла');
        console.error(err);
    }
    finally {
        document.body.classList.remove('loading');
    }
}