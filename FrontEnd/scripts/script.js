/* Récupérer dynamiquement les données des travaux via l’API */
// Appelle les données avec l'API
let projects = [];
loadProjects();
hearClickFilters();


// Fonction pour charger les travauix via l'API
function loadProjects() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            projects = data;      
            createProjects();      
        })
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

// Fonction pour faire fonctionner les filtres 
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

// Fonction pour écouter et activer les filtres et leur aspect
function hearClickFilters() {
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