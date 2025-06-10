//Page principale du site

import { initMainPage } from './dom.js';
import { clickFilters, logout, clickModif, setupValidateBtn, clickAddP } from './events.js';
import { tokenLog } from './utils.js';

try {
    document.addEventListener('DOMContentLoaded', () => {
        initMainPage();
        clickFilters();
        logout();
        clickModif();
        setupValidateBtn();
        clickAddP();
        tokenLog();
    });
}
catch(error) {
    console.error("Erreur lors du fonctionnement du site:", error);
}