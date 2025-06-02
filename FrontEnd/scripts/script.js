//Page des fonctions pour tout le site
let projects = [];
let categories = [];

// Fonction pour charger les travauix via l'API
export async function loadProjects() {
    try {
        const response = await fetch ('http://localhost:5678/api/works');
        const data = await response.json();
        projects = data;
        createProjects();     
    } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
    }
}

// Fonction pour générer les projects au DOM dans la div "gallery"
function createProjects() {
    for (let i = 0; i < projects.length; i++) {
        const article = projects[i];
        // Récupérer les éléments du DOM qui accceuillera les projects
        const sectionProjects = document.querySelector(".gallery");
        // Créer une balise pour un project 
        const projectsElement = document.createElement("article");
        projectsElement.dataset.category = projects[i].category.id;
        // Créer les balises
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = article.title;
        // Rattacher les balises dans la gallery du HTML
        sectionProjects.appendChild(projectsElement);
        projectsElement.appendChild(imageElement);
        projectsElement.appendChild(nomElement);
    }            
}

// Fonction pour activer les filtres et leur aspect
export function hearClickFilters() {
    const btnFilter = document.querySelectorAll(".filtre");

    btnFilter.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            filterCategory(id);
            // Gérer les styles des filtres
            btnFilter.forEach(b => b.classList.remove("bouton-actif"));
            btn.classList.add("bouton-actif");
        })
    })
}

// Fonction pour trier les projets en leur appliquant un display "none" s'ils ne sont pas de la catégorie en question
function filterCategory(categoryId) {
    const articles = document.querySelectorAll(".gallery article");
    articles.forEach(article => {
        const category = article.dataset.category;
        if (categoryId === "0" || category === categoryId) {
        article.style.display = "block";
        } else {
        article.style.display = "none";
        }
    })
}

// Fonction pour gérer le formulaire pour la connexion
export function login() {
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
    
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if (!response.ok) {
            throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }

        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';            
        }
    }
    catch(error) {
        console.error(error);
        errorMsg.textContent = error.message;
    }
})}

// Fonction pour se déconnecter :
export function logout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const adminModif = document.getElementById('adminModif');

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        logoutBtn.classList.add('hidden');
        adminModif.classList.add('hidden');
    })

    const isLogged = localStorage.getItem('token') !== null;
    if (isLogged) {
        logoutBtn.classList.remove('hidden');
        adminModif.classList.remove('hidden');
    } else {
        logoutBtn.classList.add('hidden');
        adminModif.classList.add('hidden');
    }
}


/* Ajouter la modale pour gérer les projets */
/* Créer une fenêtre modale qui s’ouvre lorsque l’on souhaite modifier la liste des projets. 
Les projets apparaissent comme indiqué dans le design de Juan. 
En cliquant sur l’icone de corbeille on peut supprimer un travail */

// Fonction pour créer et gérer la modale :
function createModalGP() {
    // Crée les éléments HTML dans la modale
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';

    const modal = document.createElement('div');
    modal.id = 'modal';

    const title = document.createElement('h3');
    title.innerHTML = 'Galerie photo';

    const gallery = document.createElement('div');
    gallery.classList.add('modalGallery');
    
    const closeButton = document.createElement('span');
    closeButton.classList.add('closeModal');
    closeButton.innerHTML = '&times;';

    // Créer le bouton "Ajouter une photo" 
    const addButton = document.createElement('button');
    addButton.classList.add('addBtn');
    addButton.id = 'addButton';
    addButton.innerHTML = 'Ajouter une photo';

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
        gallery.appendChild(projectDiv);

        // Supprimer un projet à partir de la modale
        trash.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5678/api/works/${project.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Supprime du DOM
            if (response.ok) {
                const projectsElement = document.getElementById("article");
                projectDiv.remove(); 
                projectsElement.remove();
            } else {
                alert("Échec de la suppression");
            }
        });
    });

    // Fermer la modale
    closeButton.addEventListener('click', () => {
        modalOverlay.remove();
    });
    modalOverlay.addEventListener('click', (event) => {
        if (event.target.id === 'modalOverlay') {
            modalOverlay.remove();
        }
    });

    // Lier les enfants au parent (éléments composant la modale "Galerie photo")
    modal.appendChild(closeButton);
    modal.appendChild(title);
    modal.appendChild(gallery);
    modal.appendChild(addButton);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
}

// Fonction pour gérer le clic sur le bouton "modifier"
export function clickModif() {
    document.getElementById('adminModif').addEventListener('click', () => {
        createModalGP();
    });
}



/* Créer le formulaire pour l’ajout de projet :
Une fois que la modale est fonctionnelle et que l’on peut supprimer des projets, 
il faudra faire le formulaire permettant d’ajouter une image. 
Il y aura pour cela : 
1 champ image pour uploader une image
1 champ pour nommer le projet 
1 champ select pour choisir une categorie parmis les catégories disponibles */


// Fonction pour créer la modale "Ajout photo" :

async function createModalAP() {
    // Crée les éléments HTML dans la modale "Ajout photo"
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';

    const modal = document.createElement('div');
    modal.id = 'modal';

    const title = document.createElement('h3');
    title.innerHTML = 'Ajout photo';

    const blockAddImg = document.createElement('form');
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

    const blockForm = document.createElement('form');
    blockForm.classList.add('form');
    blockForm.id = 'formAddP';

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

    // Créer les options de l'onglet déroulant
    const defaultOption = document.createElement('option');
    defaultOption.textContent = '';
    selectCategory.appendChild(defaultOption);

    // Appeler les catégories avec l'API    
    const response = await fetch ('http://localhost:5678/api/categories');
    const data = await response.json();
    categories = data;

    // Transcrire chaque catégorie puis lier au parent
    categories.forEach(categorie => {
        const option = document.createElement('option');
        option.value = categorie.value;
        option.textContent = categorie.name;
        selectCategory.appendChild(option);
    });

    // Bouton "Valider"
    const validateBtn = document.createElement('button');
    validateBtn.type = 'submit';
    validateBtn.classList.add('addBtn');
    validateBtn.id = 'validateBtn';    
    validateBtn.innerHTML = 'Valider';
    validateBtn.style.backgroundColor = '#A7A7A7'

    // Bouton fermer la modale
    const closeButton = document.createElement('span');
    closeButton.classList.add('closeModal');
    closeButton.innerHTML = '&times;';
    
    // Fermer la modale
    closeButton.addEventListener('click', () => {
        modalOverlay.remove();
    });
    modalOverlay.addEventListener('click', (event) => {
        if (event.target.id === 'modalOverlay') {
            modalOverlay.remove();
        }
    });

    // Bouton revenir à la modale précédente 
    const backButton = document.createElement('span');
    backButton.classList.add('backModal');
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

    // Revenir à la modale précédente
    backButton.addEventListener('click', () => {
        document.getElementById('modalOverlay').remove();
        createModalGP()
    })

    // Lier les enfants aux parents (éléments composant la modale "Ajout photo")
    blockAddImg.appendChild(logoImg);
    blockAddImg.appendChild(chosenImg);
    blockAddImg.appendChild(btnAddImg);
    blockAddImg.appendChild(inputImg);
    blockAddImg.appendChild(infoImg);

    blockForm.appendChild(labelTitle);
    blockForm.appendChild(inputTitle);
    blockForm.appendChild(labelCategory);
    blockForm.appendChild(selectCategory);
    blockForm.appendChild(validateBtn);
    
    modal.appendChild(closeButton);
    modal.appendChild(backButton);
    modal.appendChild(title);
    modal.appendChild(blockAddImg);
    modal.appendChild(blockForm);
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    chooseImg();
    validAddP();
}


// Fonction pour gérer le clic sur le bouton "Ajouter une photo"
export function clickAddP() {
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'addButton') {
            document.getElementById('modalOverlay')?.remove();
            createModalAP();
        }
    })
}

// Fonction pour choisir une photo à "+ Ajouter photo"
function chooseImg() {
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

// Fonction pour Valider l'ajout de photo
async function validAddP() {
    const image = document.getElementById('input-file').files[0];
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const token = localStorage.getItem('token');
    const validateBtn = document.getElementById('validateBtn');

    /*
    if (image.files.length > 0 && title.value.trim() !== '' && category.value !== '') {
        validateBtn.style.backgroundColor = '#1D6154';
    } 
    */

    document.getElementById('blockAddImg').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: {
                    image: image,
                    title: title,
                    category: category
                }
            });

            if (response.ok) {
                alert("Projet ajouté avec succès !");
                document.getElementById('modalOverlay')?.remove();
                loadProjects();
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