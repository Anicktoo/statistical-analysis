import '@styles/styles.scss';
import '@/utils/utils'
import { createModuleButtons } from './module-integration';
import DataControls from '@data/DataControls';
import UIControls from '@/UIControls';


UIControls.initConstUIControls();
createModuleButtons();
// DataControls.addSheet();
// UIControls.initChangableUIControls();