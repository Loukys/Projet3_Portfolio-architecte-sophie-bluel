/* Affichage et logique des modales */

import { clickTrash, closeModal, returnToPreviousModal, chooseImg, validAddP } from './events.js'
import { loadCategories, loadProjects } from './api.js'

// Fonction pour créer et gérer la modale "modification des projets" :
export async function createModalGP() {
    // Créer les éléments HTML de la modale
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';

    const modal = document.createElement('div');
    modal.id = 'modal';

    const title = document.createElement('h3');
    title.innerHTML = 'Galerie photo';

    const modalGallery = document.createElement('div');
    modalGallery.classList.add('modalGallery');
    
    const closeButton = document.createElement('span');
    closeButton.classList.add('closeModal');
    closeButton.innerHTML = '&times;';

    // Créer le bouton "Ajouter une photo" 
    const addButton = document.createElement('button');
    addButton.classList.add('addBtn');
    addButton.id = 'addButton';
    addButton.innerHTML = 'Ajouter une photo';

    // Appeler les projets avec l'API
    const projects = await loadProjects()

    // Ajouter les projets dans la modale
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('modalItem');

        const img = document.createElement('img');
        img.src = project.imageUrl;

        const trash = document.createElement('i');
        trash.classList.add('fa-solid', 'fa-trash-can');
        trash.dataset.id = project.id;
        
        // Lier les enfants au parent (éléments composant un projet)
        projectDiv.appendChild(img);
        projectDiv.appendChild(trash);
        modalGallery.appendChild(projectDiv);

        // Supprimer un projet en cliquant sur le logo de poubelle :
        clickTrash(trash, project, projectDiv);
    });

    
    // Lier les enfants au parent (éléments composant la modale "Galerie photo")
    modal.appendChild(closeButton);
    modal.appendChild(title);
    modal.appendChild(modalGallery);
    modal.appendChild(addButton);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Fermer la modale 
    closeModal(closeButton, modalOverlay);
}


// Fonction pour créer et gérer la modale "Ajout photo" :
export async function createModalAP() {
    // Crée les éléments HTML dans la modale "Ajout photo"
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';

    const modal = document.createElement('div');
    modal.id = 'modal';

    const title = document.createElement('h3');
    title.innerHTML = 'Ajout photo';

    const formAddP = document.createElement('form');
    formAddP.id = 'formAddP'

    const blockAddImg = document.createElement('div');
    blockAddImg.id = 'blockAddImg';

    const logoImg = document.createElement('p');
    logoImg.id = 'logoImg';
    logoImg.innerHTML = '<i class="fa-regular fa-image"></i>';

    const chosenImg = document.createElement('img');
    chosenImg.src = '';
    chosenImg.id = 'chosenImg';
    chosenImg.alt = 'Aperçu image';
    chosenImg.style.display = 'none'
    
    const btnAddImg = document.createElement('label');
    btnAddImg.htmlFor = 'input-file';
    btnAddImg.id = 'btnAddImg';
    btnAddImg.textContent = '+ Ajouter photo';

    const inputImg = document.createElement('input');     
    inputImg.type = 'file';
    inputImg.accept = 'image/jpeg, image/jpg, image/png';
    inputImg.id = 'input-file';
    inputImg.style.display = 'none'

    const infoImg = document.createElement('p');
    infoImg.id = 'infoImg';
    infoImg.innerHTML = 'jpg, png : 4mo max';

    const divTitleCat = document.createElement('div');
    divTitleCat.id = 'divTitleCat';

    const labelTitle = document.createElement('p');
    labelTitle.htmlFor = 'title';
    labelTitle.classList.add('title');
    labelTitle.innerHTML = 'Titre';

    const inputTitle = document.createElement('input');
    inputTitle.name = 'title';
    inputTitle.id = 'title';

    const labelCategory = document.createElement('p');
    labelCategory.htmlFor = 'category'
    labelCategory.classList.add('title')
    labelCategory.innerHTML = 'Catégorie';

    const selectCategory = document.createElement('select');
    selectCategory.name = 'category'
    selectCategory.id = 'category';

    // Appeler les catégories avec l'API
    const categories = await loadCategories()

    // Créer les options de l'onglet déroulant de "Catégorie"
    const defaultOption = document.createElement('option');
    defaultOption.textContent = '';
    selectCategory.appendChild(defaultOption);
  
    // Transcrire chaque catégorie puis lier au parent
    categories.forEach(categorie => {
        const option = document.createElement('option');

        option.value = categorie.id;
        option.textContent = categorie.name;
        selectCategory.appendChild(option);
    });

    // Div pour créer la barre de séparation
    const barStyle = document.createElement('div');
    barStyle.id = 'barStyle';

    // Bouton "Valider"
    const validateBtn = document.createElement('button');
    validateBtn.type = 'submit';
    validateBtn.classList.add('addBtn');
    validateBtn.id = 'validateBtn';
    validateBtn.innerHTML = 'Valider';
    validateBtn.style.backgroundColor = '#A7A7A7'
    validateBtn.disabled = true;

    // Bouton X pour fermer la modale
    const closeButton = document.createElement('span');
    closeButton.classList.add('closeModal');
    closeButton.innerHTML = '&times;'; 

    // Bouton revenir à la modale précédente 
    const backButton = document.createElement('span');
    backButton.classList.add('backModal');
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

    // Lier les enfants aux parents (éléments composant la modale "Ajout photo")
    blockAddImg.appendChild(logoImg);
    blockAddImg.appendChild(chosenImg);
    blockAddImg.appendChild(btnAddImg);
    blockAddImg.appendChild(inputImg);
    blockAddImg.appendChild(infoImg);

    divTitleCat.appendChild(labelTitle);
    divTitleCat.appendChild(inputTitle);
    divTitleCat.appendChild(labelCategory);
    divTitleCat.appendChild(selectCategory);
    divTitleCat.appendChild(barStyle);
    divTitleCat.appendChild(validateBtn);

    formAddP.appendChild(blockAddImg);
    formAddP.appendChild(divTitleCat);
    
    modal.appendChild(closeButton);
    modal.appendChild(backButton);
    modal.appendChild(title);
    modal.appendChild(formAddP);
    
    modalOverlay.appendChild(modal);
    
    document.body.appendChild(modalOverlay);
    
    // Séléctionner une image :
    chooseImg();

    // Appuyer sur le bouton valider pour envoyer le form :
    validAddP();

    // Fermer la modale 
    closeModal(closeButton, modalOverlay);

    // Revenir à la modale précédente
    returnToPreviousModal(backButton);
}