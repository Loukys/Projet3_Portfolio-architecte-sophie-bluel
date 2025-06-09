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
    const sectionProjects = document.querySelector(".gallery");
    sectionProjects.innerHTML = ''; 
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
            const errorMsg = document.getElementById('errorMsg');
            errorMsg.classList.remove('hidden');
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

// Fonction pour se déconnecter (retire le token du local storage) :
export function logout() {
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    })
}

// Fonction pour faire évoluer le site en fonction du token d'identification présent dans le local storage :
export function tokenLog() {
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');    
    const adminModif = document.getElementById('adminModif');
    const editBarHidden = document.getElementById('editBarHidden');
    const btnFilters = document.querySelectorAll('.filtre');
    const token = localStorage.getItem('token');
    if(token) {
        btnLogin.classList.add('hidden');
        btnLogout.classList.remove('hidden');        
        btnFilters.forEach(btn => btn.classList.add('hidden'));
        editBarHidden.classList.remove('hidden');
        adminModif.classList.remove('hidden');
    } else {        
        btnLogin.classList.remove('hidden');
        btnLogout.classList.add('hidden');
        btnFilters.forEach(btn => btn.classList.remove('hidden'));
        editBarHidden.classList.add('hidden');
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
                projectDiv.remove();
                projects = projects.filter(p => p.id !== project.id);
                createProjects();
            } else {
                alert("Échec de la suppression");
            }
        });
    });

    // Fermer la modale (faire une fonction car répétition)
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

    // Créer les options de l'onglet déroulant de "Catégorie"
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
        option.value = categorie.id;
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

    // Bouton X pour fermer la modale
    const closeButton = document.createElement('span');
    closeButton.classList.add('closeModal');
    closeButton.innerHTML = '&times;';
    
    // Fermer la modale avec X ou en cliquant sur l'Overlay (faire une fonction car répétition)
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

    divTitleCat.appendChild(labelTitle);
    divTitleCat.appendChild(inputTitle);
    divTitleCat.appendChild(labelCategory);
    divTitleCat.appendChild(selectCategory);
    divTitleCat.appendChild(validateBtn);

    formAddP.appendChild(blockAddImg);
    formAddP.appendChild(divTitleCat);
    
    modal.appendChild(closeButton);
    modal.appendChild(backButton);
    modal.appendChild(title);
    modal.appendChild(formAddP);
    
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
    
    /*
    if (image.files.length > 0 && title.value !== '' && category.value !== '') {
        validateBtn.style.backgroundColor = '#1D6154';
    } 
    */

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
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {                   
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });            
            if (response.ok) {
                await loadProjects(); 
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








/*
/mon-projet/
│
├── index.html
├── login.html
│
├── /assets/
│   ├── /css/
│   │   └── style.css
│   │
│   ├── /js/
│   │   ├── main.js        ← Point d’entrée (appel des fonctions globales)
│   │   ├── login.js       ← Gère la logique de connexion
│   │   ├── modals.js      ← Crée/modifie les modales (createModalGP, createModalAP)
│   │   ├── dom.js         ← Fonctions d’interaction avec le DOM (createProjects, hearClickFilters, etc.)
│   │   ├── api.js         ← Requêtes fetch vers l'API (loadProjects, login, post image, delete image)
│   │   └── utils.js       ← Fonctions utilitaires (ex. tokenLog, helpers, etc.)
│   │
│   └── /images/
│       └── ...            ← Images statiques, logos, icônes, etc.
│
├── /tests/
│   └── tests.js
│
└── README.md              ← Explication du projet, instructions d’utilisation



/assets/js/
├── main.js         → point d’entrée
├── api.js          → appels à l’API (fetch GET/POST/DELETE)
├── dom.js          → création / manipulation d’éléments HTML
├── modals.js       → affichage & logique des modales
├── login.js        → gestion du formulaire de connexion
├── utils.js        → fonctions utilitaires (auth, token, etc.)
└── events.js       → écouteurs d'événements (click, submit)

*/