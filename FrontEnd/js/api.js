/* Appels à l'API : requêtes fetch GET/POST/DELETE */

// Fonction pour appeler les travaux via l'API :
export async function loadProjects() {
    try {
        const response = await fetch ('http://localhost:5678/api/works');
        return await response.json();
    } 
    catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
    }
}

// Fonction pour envoyer les identifiants de connexion :
export async function sendLoginData(a , b) {
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email : a, 
                password : b 
            })
        })
        return response;
    }
    catch (error) {
        console.error("Erreur lors de l'appel via l'API :", error);
    }
}

// Fonction pour supprimer un projet via l'API :
export async function deleteProject(project) {
    try{
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5678/api/works/${project.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response;
    }
    catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
    }
}

// Fonction pour appeler les catégories via l'API :
export async function loadCategories() {
    try {
        const response = await fetch ('http://localhost:5678/api/categories');
        return await response.json();
    }     
    catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
    }
}

// Fonction pour envoyer un nouveau projet au serveur :
export async function sendNewProject(token, formData) {
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });     
        return response;
    }
    catch (error) {
        console.error("Erreur lors de l'envoie du projet au serveur :", error);
    }
}