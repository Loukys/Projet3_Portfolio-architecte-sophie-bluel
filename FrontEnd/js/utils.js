/* Fonctions utilitaires et générales du site (auth, token, etc...) */

// Fonction pour trier les projets en leur appliquant un display "none" s'ils ne sont pas de la catégorie en question
export function filterCategory(categoryId) {
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

// Fonction pour gérer les styles des filtres
export function switchBtnStyle(btns, b) {
    btns.forEach(b => b.classList.remove("bouton-actif"));
    b.classList.add("bouton-actif");
}

// Fonction pour faire évoluer le site en fonction du token d'identification présent dans le local storage :
export function tokenLog() {
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');    
    const adminModif = document.getElementById('adminModif');
    const editBarHidden = document.getElementById('editBarHidden');
    const btnFilters = document.querySelectorAll('.filtre');

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    btnLogin?.classList.toggle('hidden', isLoggedIn);
    btnLogout?.classList.toggle('hidden', !isLoggedIn);
    editBarHidden?.classList.toggle('hidden', !isLoggedIn);
    adminModif?.classList.toggle('hidden', !isLoggedIn);
    btnFilters.forEach(btn => {
        btn.classList.toggle('hidden', isLoggedIn);
    });
}