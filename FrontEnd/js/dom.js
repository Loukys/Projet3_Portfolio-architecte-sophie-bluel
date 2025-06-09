/* Création et manipulation des éléments HTML dans le DOM */

import { loadProjects } from './api.js'

// Fonction pour appeler les projets via l'API puis les afficher dans la gallery sur la page principale :
export async function initMainPage() {
  const projects = await loadProjects();
  createProjects(projects);
}

// Fonction pour générer les éléments HTML dans la div "gallery" :
export function createProjects(projects) {   
  const sectionProjects = document.querySelector(".gallery");
  sectionProjects.innerHTML = ''; 

  for (let i = 0; i < projects.length; i++) {
    const article = projects[i];
    
    // Créer une balise pour un project 
    const projectsElement = document.createElement("article");
    projectsElement.dataset.category = projects[i].category.id;

    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;

    const nomElement = document.createElement("figcaption");
    nomElement.innerText = article.title;

    // Rattacher les balises dans la gallery de la page principale
    sectionProjects.appendChild(projectsElement);
    projectsElement.appendChild(imageElement);
    projectsElement.appendChild(nomElement);
  }            
}

