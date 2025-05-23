/* Récupérer dynamiquement les données des travaux via l’API */
async function loadProjects() {
    let projects = window.localStorage.getItem("projects");

    if (projects === null) {
        // Récupérer les projects depuis l'API
        const reponse = await fetch ('http://localhost:5678/api/works');
        projects = await reponse.json();
        // Transformer les projects en JSON
        const projectsValue = JSON.stringify(projects);
        // Stockage des informations dans le localStorage
        window.localStorage.setItem("projects", projectsValue);
    } else {
        projects = JSON.parse(projects)
    }
    generateProjects(projects);
}


// Fonction pour générer les projects
function generateProjects(projects) {
    for (let i = 0; i < projects.length; i++) {
        const article = projects[i];
        // Récupérer les éléments du DOM qui accceuillera les projects
        const sectionProjects = document.querySelector(".gallery");
        // Créer une balise pour un project 
        const projectsElement = document.createElement("article");
        projectsElement.dataset.id = projects[i].id;
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

// Générer les projects sur le HTML
loadProjects()
