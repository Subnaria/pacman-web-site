const words = ["Pacman", "Tours📍", "J'aime les jeux vidéos."];
const el = document.getElementById("pseudo-typewriter");
let currentWordIndex = 0;
let i = 0;
let forward = true;

function typeLoop() {
  const currentWord = words[currentWordIndex];
  
  if (forward) {
    el.textContent = currentWord.slice(0, i++);
    if (i > currentWord.length) {
      forward = false;
      setTimeout(typeLoop, 1500); // pause avant suppression
      return;
    }
  } else {
    el.textContent = currentWord.slice(0, --i);
    if (i === 0) {
      forward = true;
      currentWordIndex = (currentWordIndex + 1) % words.length; // passer au mot suivant
      setTimeout(typeLoop, 500); // pause avant réécriture
      return;
    }
  }
  setTimeout(typeLoop, 120);
}
typeLoop();

// Initialisation d'EmailJS
(function(){
  emailjs.init("A0Iul7bdapYSlXP1n"); // Remplacez par votre clé publique EmailJS
})();

// Fonction pour déclencher l'animation de l'avion
function triggerPlaneAnimation() {
  const plane = document.getElementById('paper-plane');
  if (plane) {
    // Retirer la classe si elle existe déjà
    plane.classList.remove('flying');
    
    // Déclencher l'animation après un petit délai
    setTimeout(() => {
      plane.classList.add('flying');
    }, 100);
    
    // Retirer la classe après l'animation pour pouvoir la relancer
    setTimeout(() => {
      plane.classList.remove('flying');
    }, 2200);
  }
}

// Fonction pour envoyer l'email

async function sendMail() {
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;

  // Récupérer l'IP du visiteur
  let ip = '';
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    ip = data.ip;
  } catch (e) {
    alert("Impossible de récupérer votre IP, réessayez plus tard.");
    return;
  }

  // Vérifier le nombre d'envois pour cette IP
  let mailCount = 0;
  const mailLimitKey = 'mailCount_' + ip;
  if (localStorage.getItem(mailLimitKey)) {
    mailCount = parseInt(localStorage.getItem(mailLimitKey), 10) || 0;
  }
  if (mailCount >= 3) {
    alert("❌ Limite atteinte : vous ne pouvez envoyer que 3 messages.");
    return;
  }

  // Déclencher l'animation de l'avion immédiatement
  triggerPlaneAnimation();

  // Désactiver le bouton et changer le texte
  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours...";

  emailjs.send("service_4cr16m3","template_3zgcmq4",{
    nom: document.getElementById("nom").value,
    prenom: document.getElementById("prenom").value,
    email: document.getElementById("email").value,
    objet: document.getElementById("objet").value,
    message: document.getElementById("message").value,
    ip: ip
  }).then(function() {
    // Incrémenter le compteur d'envois
    localStorage.setItem(mailLimitKey, mailCount + 1);
    alert("✅ Message envoyé avec succès !");
    document.getElementById("contact-form").reset();
  }, function(error) {
    alert("❌ Erreur lors de l'envoi : " + error);
  }).finally(function() {
    // Réactiver le bouton
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

// Gestion des onglets de la section procédure
function switchTab(tabName) {
  // Masquer tous les contenus
  const allContents = document.querySelectorAll('.procedure-mode');
  allContents.forEach(content => content.classList.remove('active'));
  
  // Désactiver tous les boutons
  const allTabs = document.querySelectorAll('.tab-btn');
  allTabs.forEach(tab => tab.classList.remove('active'));
  
  // Afficher le contenu sélectionné
  const targetContent = document.getElementById(tabName + '-content');
  if (targetContent) {
    targetContent.classList.add('active');
  }
  
  // Activer le bouton sélectionné
  const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

// Gestion du formulaire de contact

document.addEventListener('DOMContentLoaded', function() {
  // Animation fade-in au scroll sur chaque élément du contenu des avis
  const avisElements = document.querySelectorAll('.testimonial-content > *, .testimonial-author > *');
  avisElements.forEach(el => {
    el.classList.add('scroll-appear');
  });
  // Animation en cascade sur chaque élément du contenu des avis
  const testimonialItems = document.querySelectorAll('.testimonial-item');
  testimonialItems.forEach(item => {
    const contentEls = item.querySelectorAll('.testimonial-content > *, .testimonial-author > *');
    contentEls.forEach((el, i) => {
      el.classList.add('fadein-section');
      setTimeout(() => {
        el.classList.add('visible');
      }, 400 + i * 250);
    });
  });
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      sendMail();
    });
  }

    // Animation d'intro fade-in sur les sections principales
    const mainSections = [
      document.querySelector('.profile-header'),
      ...document.querySelectorAll('section'),
      document.querySelector('footer')
    ];
    mainSections.forEach((el, idx) => {
      if (el) {
        el.classList.add('fadein-section');
        setTimeout(() => {
          el.classList.add('visible');
          // Animation cascade sur about
          if (el.id === 'about') {
            const aboutTitle = el.querySelector('h1');
            const aboutParagraphs = el.querySelectorAll('p');
            if (aboutTitle) {
              aboutTitle.classList.add('fadein-section');
              setTimeout(() => {
                aboutTitle.classList.add('visible');
              }, 200);
            }
            aboutParagraphs.forEach((p, i) => {
              p.classList.add('fadein-section');
              setTimeout(() => {
                p.classList.add('visible');
              }, 600 + i * 350);
            });
          }
        }, 800 + idx * 900); // décalage plus lent
      }
    });

    // Animation d'apparition au scroll pour les éléments internes
    const animatedSelectors = [
      '.profile-header > *',
      'section#about > *',
      'section#portfolio > *',
      'section#services > *',
      'section#procedure > *',
      'section#avis > *',
      'section#contact > *',
      'footer > *'
    ];
    const animatedElements = [];
    animatedSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('scroll-appear');
        animatedElements.push(el);
      });
    });

    function revealOnScroll() {
      animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          el.classList.add('visible');
        } else {
          el.classList.remove('visible');
        }
      });
    }
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('resize', revealOnScroll);
    setTimeout(revealOnScroll, 1200); // Pour le chargement initial, après l'intro

  // Gestion des clics sur les onglets
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Gestion de la modale d'avis client
  const testimonials = document.querySelectorAll('.testimonial-item');
  const modal = document.getElementById('testimonial-modal');
  const modalClose = document.getElementById('testimonial-modal-close');
  const modalPic = document.getElementById('modal-client-pic');
  const modalName = document.getElementById('modal-client-name');
  const modalProfession = document.getElementById('modal-client-profession');
  const modalReview = document.getElementById('modal-client-review');

  // Données clients (à compléter selon les avis)
  const clientData = [
    {
      pic: 'Assets/img/logo/baudo-pdp.jpg',
      name: 'Baudo',
      profession: 'Youtubeur / Game designer',
      review: '« Il m’a créé un site complet ultra clean sans même que je sois au courant mdr ! C’est très quali et ça marche nickel, je recommande le bro ! »'
    },
    {
      pic: 'Assets/img/logo/white-logo.jpg',
      name: '?',
      profession: '',
      review: 'Peut-être serez-vous le/la prochain(e) ?'
    },
    {
      pic: 'Assets/img/logo/white-logo.jpg',
      name: '?',
      profession: '',
      review: 'Peut-être serez-vous le/la prochain(e) ?'
    }
  ];

testimonials.forEach((item, idx) => {
  item.addEventListener('click', function () {
    const data = clientData[idx];
    modalPic.src = data.pic;
    modalName.textContent = data.name;
    modalProfession.textContent = data.profession;
    modalReview.textContent = data.review;

    modal.classList.add('show'); // ajoute la classe qui déclenche le fade-in
  });
});

// Fermer la modale via le bouton
modalClose.addEventListener('click', function () {
  modal.classList.remove('show'); // fade-out
});

// Fermer la modale en cliquant à l'extérieur
window.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.classList.remove('show'); // fade-out
  }
  });
});