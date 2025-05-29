// /* Récupérer dynamiquement les données des travaux via l’API */
// // Appelle les données avec l'API
// let projects = [];

// fetch('http://localhost:5678/api/works')
//     .then(response => response.json())
//     .then(data => {
//         projects = data;
//         loadProjects(projects);
// })

// // Fonction pour générer les projects sur le HTML dans la div "gallery"
// function loadProjects(projects) {
//     for (let i = 0; i < projects.length; i++) {
//         const article = projects[i];
//         // Récupérer les éléments du DOM qui accceuillera les projects
//         const sectionProjects = document.querySelector(".gallery");
//         // Créer une balise pour un project 
//         const projectsElement = document.createElement("article");
//         projectsElement.dataset.id = projects[i].id;
//         // Créer les balises
//         const imageElement = document.createElement("img");
//         imageElement.src = article.imageUrl;
//         const nomElement = document.createElement("figcaption");
//         nomElement.innerText = article.title;
//         // Rattacher les balises dans la gallery du HTML
//         sectionProjects.appendChild(projectsElement);
//         projectsElement.appendChild(imageElement);
//         projectsElement.appendChild(nomElement);
//     }            
// }


// /* Ajouter le tri des projets par catégorie dans la galerie */
// // Fonctionnement du bouton "Tous" 
// const btnTous = document.getElementById("btnTous")

// btnTous.addEventListener("click", () => {
//     const projectsFilterAll = projects.filter(project => project);
//     document.querySelector(".gallery").innerHTML = "";
//     loadProjects(projectsFilterAll)
// })

// // Fonctionnement du bouton "Objets" 
// const btnObjets = document.getElementById("btnObjets")
// console.log(btnObjets.dataset.categorieId)
// btnObjets.addEventListener("click", () => {
//     const projectsFilterObjets = projects.filter(project => project.category.id === 1);
//     document.querySelector(".gallery").innerHTML = "";
//     loadProjects(projectsFilterObjets);
// })

// // Fonctionnement du bouton "Appartements" 
// const btnAppart = document.getElementById("btnAppart")

// btnAppart.addEventListener("click", () => {
//     const projectsFilterAppart = projects.filter(project => project.category.id === 2);
//     document.querySelector(".gallery").innerHTML = "";
//     loadProjects(projectsFilterAppart);
// })

// // Fonctionnement du bouton "Appartements" 
// const btnHR = document.getElementById("btnHR")

// btnHR.addEventListener("click", () => {
//     const projectsFilterHR = projects.filter(project => project.category.id === 3);
//     document.querySelector(".gallery").innerHTML = "";
//     loadProjects(projectsFilterHR);
// })

// //Gérer l'aspect des boutons de filtre 
// const btnFiltre = document.querySelectorAll(".filtre");

// btnFiltre.forEach(bouton => {
//   bouton.addEventListener("click", () => {
//     // Enlève la classe active à tous les boutons
//     btnFiltre.forEach(b => b.classList.remove("bouton-actif"));
//     // Ajoute la classe active au bouton cliqué
//     bouton.classList.add("bouton-actif");
//   })
// })

// function login() {
//     document.getElementById('loginForm').addEventListener('submit', (event) => {
//         event.preventDefault();
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         const errorMsg = document.getElementById('errorMsg');
//         const token = localStorage.getItem('token');
//         const adminModif = document.getElementById('adminModif');

//         fetch('http://localhost:5678/api/users/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email: email,
//                 password: password
//             })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 errorMsg.textContent = 'Problème serveur';
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.token) {
//                 localStorage.setItem('token', data.token);
//                 window.location.href = 'index.html';
//                 adminModif.classList.remove("hidden");
//             } else {
//                 errorMsg.textContent = 'Erreur dans l’identifiant ou le mot de passe';
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             errorMsg.textContent = 'Erreur lors de la connexion. Réessayez.';
//         })
//     })
// }
