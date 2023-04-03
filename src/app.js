import '@styles/styles.scss';
import '@/utils/utils'
import { createModuleButtons } from './module-integration';
import DataControls from '@data/DataControls';
import UIControls from '@/UIControls';
// import startTest from '@/tests';

// startTest();

UIControls.initConstUIControls();
createModuleButtons();