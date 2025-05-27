/* Intégrer la page de connexion pour le site */
// Gérer le formulaire
login()

function login() {
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        const adminModif = document.getElementById('adminModif');
    
    try{
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
            throw new Error("Identifiants invalides ou problème serveur");
        }

        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            adminModif.classList.remove("hidden");
            window.location.href = 'index.html';            
        } 
    }
    catch(error) {
        console.error(error);
        errorMsg.textContent = error.message;
    }
})}



/*
function login() {
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        const token = localStorage.getItem('token');
        const adminModif = document.getElementById('adminModif');

        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                errorMsg.textContent = 'Problème serveur';
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
                adminModif.classList.remove("hidden");
            } else {
                errorMsg.textContent = 'Erreur dans l’identifiant ou le mot de passe';
            }
        })
        .catch(error => {
            console.error(error);
            errorMsg.textContent = 'Erreur lors de la connexion. Réessayez.';
        })
    })
}
*/