import '@styles/styles.scss';
import '@/utils/utils';
import '@/uiControls';
import moduleIntegrator from '@/moduleIntegrator';
import dataControls from '@data/dataControls';

uiControls.initConstuiControls();
moduleIntegrator.createModuleButtons();

export async function saveProject() {
    try {
        const dataControlsData = await dataControls.getData();
        const moduleIntegratorData = moduleIntegrator.getData();
        const data = {
            dataControlsData,
            moduleIntegratorData
        };
        const json = JSON.stringify(data);
        console.log(json);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `Hey.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }
    catch (err) {
        uiControls.showError(uiControls.burgerMenu, 'Ошибка при сохранении');
        console.error(err);
    }
}

export async function loadProject(event) {
    try {
        const file = event.target.files[0];
        if (!file) {
            throw new Error('Ошибка при загрузке файла');
        }
        const json = await File.readUploadedFileAsText(file);
        const data = JSON.parse(json);
        await dataControls.loadData(data.dataControlsData);
        // await moduleIntegrator.loadData(data.moduleIntegratorData);
    }
    catch (err) {
        uiControls.showError(uiControls.burgerMenu, 'Ошибка при загрузке файла');
        console.error(err);
    }
}