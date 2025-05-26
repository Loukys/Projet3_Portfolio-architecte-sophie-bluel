/* Intégrer la page de connexion pour le site */
// Gérer le formulaire

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            "email": "string", 
            "password": "string"
        }
    })
    .then(response => {
        if (!response.ok) {
            errorMsg.textContent = 'Problème serveur';
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Connexion réussie !');
            // Redirection vers la page protégée
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = 'Erreur dans l’identifiant ou le mot de passe';
        }
    })
    /*.catch(error => {
        console.error(error);
        errorMsg.textContent = 'Erreur lors de la connexion. Réessayez.';
    });*/
});

