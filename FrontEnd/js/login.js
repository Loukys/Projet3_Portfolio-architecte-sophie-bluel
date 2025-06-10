/* Gestion du formulaire de connexion */

import { sendLoginData } from './api.js'

// Fonction pour gérer le formulaire pour la connexion
function login() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
    
        try {
            const response = await sendLoginData(email, password);
        
            if (!response.ok) {
                errorMsg.classList.remove('hidden');
                throw new Error("Erreur dans l'identifiant ou le mot de passe");
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';            
            }
        }
        catch (error) {
            console.error(error);
            errorMsg.textContent = error.message;
        }
    })
}


login();