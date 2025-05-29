//Page des fonctions pour tout le site
let projects = [];

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

// Fonction pour générer les projects sur le HTML dans la div "gallery"
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

// Fonction pour ouvrir la modale :
