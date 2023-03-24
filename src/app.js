import '@styles/styles.scss';
import { createModuleButtons } from './module-integration';
import { addEmptySheet } from '@data/data-manipulation';
import { updateDynamicUI } from '@/ui-controls';

createModuleButtons();
addEmptySheet();
updateDynamicUI();