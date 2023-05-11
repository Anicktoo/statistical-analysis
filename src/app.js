import '@styles/styles.scss';
import '@/utils/utils';
import '@/uiControls';
import moduleIntegrator from '@/moduleIntegrator';
import { binTest } from './tests';

uiControls.initConstuiControls();
moduleIntegrator.createModuleButtons();

console.log('Test');

binTest();
