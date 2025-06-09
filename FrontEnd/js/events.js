/* Ecouteurs d'événements du site (click, submit) */

import { filterCategory, switchBtnStyle, tokenLog } from './utils.js'
import { createModalGP, createModalAP } from './modals.js'
import { deleteProject, sendNewProject } from './api.js'
import { createProjects, initMainPage } from './dom.js'


// Fonction pour activer les filtres et leur aspect :
export function clickFilters() {
    const btnFilter = document.querySelectorAll(".filtre");

    btnFilter.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            filterCategory(id);
            switchBtnStyle(btnFilter, btn);
        })
    })
}

// Fonction pour gérer le clic sur le bouton "modifier" :
export function clickModif() {
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'adminModif') {
            createModalGP();
        }
    })
}

// Fonction pour se déconnecter (retire le token du local storage) :
export function logout() {
    const btnLogout = document.getElementById('btnLogout');
    
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem('token');
        tokenLog();
        window.location.href = 'index.html';
    })
}

// Fonction pour revenir à la modale précédente en appuyant sur la flêche :
export function returnToPreviousModal(backButton) {
    backButton.addEventListener('click', () => {
        document.getElementById('modalOverlay')?.remove();
        createModalGP();
    })
}

// Fermer la modale avec X ou en cliquant sur l'Overlay :
export function closeModal(closeButton, modalOverlay) {
    closeButton.addEventListener('click', () => {
        document.getElementById('modalOverlay')?.remove();
    });
    modalOverlay.addEventListener('click', (event) => {
        if (event.target.id === 'modalOverlay') {
            document.getElementById('modalOverlay')?.remove();
        }
    });
}

// Fonction pour supprimer un projet en cliquant sur le logo de la poubelle :
export async function clickTrash(trash, project, projectDiv) {
    trash.addEventListener('click', async () => {
        const response = await deleteProject(project);
        
        if (response.ok) {
            projectDiv.remove();
            initMainPage();
        } else {
            alert("Échec de la suppression");
        }
    });
}

// Fonction pour gérer le clic sur le bouton "Ajouter une photo" :
export function clickAddP() {
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'addButton') {
            document.getElementById('modalOverlay')?.remove();
            createModalAP();
        }
    })
}

// Fonction pour choisir une photo à "+ Ajouter photo"
export function chooseImg() {
    let projectImg = document.getElementById('chosenImg');
    let inputFile = document.getElementById('input-file');
    let logoImg = document.getElementById('logoImg');

    inputFile.addEventListener('change', () => {
        projectImg.src = URL.createObjectURL(inputFile.files[0]);
        projectImg.style.display = 'block';
        logoImg.style.display = 'none';
        btnAddImg.style.display = 'none';
        infoImg.style.display = 'none';
    })
}

// Fonction pour paramétrer et écouter le bouton "Valider" :
export function setupValidateBtn() {
    document.addEventListener('change', () => {
        const validateBtn = document.getElementById('validateBtn');
        const imageInput = document.getElementById('input-file');
        const titleInput = document.getElementById('title');
        const categoryInput = document.getElementById('category');

        const image = imageInput.files[0];
        const title = titleInput.value.trim();
        const category = categoryInput.value;

        if (image && title && category) {
            validateBtn.style.backgroundColor = '#1D6154';
            validateBtn.disabled = false;
        } else {
            validateBtn.style.backgroundColor = '#A7A7A7';
            validateBtn.disabled = true;
        }
    })   
}  

// Fonction pour ajouter un nouveau project au click sur le bouton " Valider" :
export async function validAddP() {
    const form = document.getElementById('formAddP')
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const imageInput = document.getElementById('input-file');
        const image = imageInput.files[0];
        const titleInput  = document.getElementById('title');
        const title = titleInput.value;
        const categoryInput  = document.getElementById('category');
        const category = categoryInput.value;       

        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('image', image);
        formData.append('title', title);
        formData.append('category', category);

        try {
            const response = await sendNewProject(token, formData)

            if (response.ok) {
                initMainPage();
                form.reset();
                document.getElementById('chosenImg').style.display = 'none';
                document.getElementById('logoImg').style.display = 'block';
                document.getElementById('btnAddImg').style.display = 'flex';
                document.getElementById('infoImg').style.display = 'block';
            } else {
                alert("Erreur lors de l'envoi du projet.");
            }
        }
        catch (error) {
            console.error(error);
            errorMsg.textContent = error.message;
        }
    })
}

