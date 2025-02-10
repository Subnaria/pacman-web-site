// Fonction pour afficher les sections
function showSection(id) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === id) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Initialiser la première section visible
document.addEventListener("DOMContentLoaded", function() {
    showSection('accueil');
});

// Fonction pour afficher le texte avec animation de typewriter (écriture automatique)
document.addEventListener("DOMContentLoaded", function() {
    const typingText = document.querySelector('.typing-text');
    const textContent = typingText.innerHTML;
    typingText.innerHTML = '';
    let i = 0;

    function typeWriter() {
        if (i < textContent.length) {
            typingText.innerHTML += textContent.charAt(i);
            i++;
            setTimeout(typeWriter, 200); // Ajuste la vitesse de frappe ici (200ms par caractère)
        }
    }

    typeWriter();
});

// Gérer le clic pour les néon boxes, n'afficher que du texte sur mobile
document.addEventListener('DOMContentLoaded', function() {
    const neonBoxes = document.querySelectorAll('.neon-box');
    
    neonBoxes.forEach(box => {
        box.addEventListener('click', function() {
            // Action à effectuer lors du clic sur une néon box, comme un redirection ou un affichage
            window.location.href = box.querySelector('.discord-banner a').href; // Par exemple, redirige vers le lien du discord
        });
    });
});
