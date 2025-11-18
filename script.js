/********************************************
 * 1) TYPEWRITER DU PSEUDO
 ********************************************/
const words = ["PacPac", "Tours📍", "J'aime les jeux vidéos."];
const pseudoEl = document.getElementById("pseudo-typewriter");

let wordIndex = 0, charIndex = 0, forward = true;

function typeLoop() {
  const word = words[wordIndex];

  if (forward) {
    pseudoEl.textContent = word.slice(0, charIndex++);
    if (charIndex > word.length) {
      forward = false;
      return setTimeout(typeLoop, 1500);
    }
  } else {
    pseudoEl.textContent = word.slice(0, --charIndex);
    if (charIndex === 0) {
      forward = true;
      wordIndex = (wordIndex + 1) % words.length;
      return setTimeout(typeLoop, 500);
    }
  }
  setTimeout(typeLoop, 120);
}
typeLoop();


/********************************************
 * 2) EMAILJS CONFIG
 ********************************************/
(function () {
  emailjs.init("A0Iul7bdapYSlXP1n");
})();


/********************************************
 * 3) ANIMATION AVION
 ********************************************/
function triggerPlaneAnimation() {
  const plane = document.getElementById('paper-plane');
  if (!plane) return;

  plane.classList.remove('flying');
  setTimeout(() => plane.classList.add('flying'), 50);
  setTimeout(() => plane.classList.remove('flying'), 2200);
}


/********************************************
 * 4) POPUPS AVEC ANIMATIONS (NOUVELLES)
 ********************************************/
function openPopup(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;

  const content = overlay.querySelector('.popup-content');

  // Montrer la popup
  overlay.classList.remove('hidden');
  overlay.classList.add('active'); // ← indispensable pour afficher !

  content.classList.remove('closing');
}

function closePopup(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;

  const content = overlay.querySelector('.popup-content');

  // Lancer animation de fermeture
  content.classList.add('closing');
  overlay.classList.remove('active');
  overlay.classList.add('hidden');

  // Reset après animation
  setTimeout(() => {
    content.classList.remove('closing');
  }, 250);
}

// Fermeture en cliquant hors de la popup
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("popup-overlay")) {
    closePopup(e.target.id);
  }
});


// ---- ZOOM + DRAG SUR LES IMAGES DES SERVICES ----
document.querySelectorAll('.service-card img').forEach(img => {
  let isDragging = false;
  let startX, startY;
  let offsetX = 0, offsetY = 0;
  let scale = 1;
  const minZoom = 1;
  const maxZoom = 3;

  // ----- Drag -----
  img.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    img.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    img.style.cursor = 'grab';

    // rebond
    img.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    img.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;

    setTimeout(() => img.style.transition = 'transform 0.2s ease', 600);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;

    offsetX += dx;
    offsetY += dy;

    img.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
  });

  // ----- Wheel Zoom + blocage scroll -----
  img.addEventListener('wheel', (e) => {
    if (!isDragging) return; // zoom uniquement pendant le clic maintenu
    e.preventDefault();       // bloque scroll fond

    const rect = img.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomAmount = e.deltaY < 0 ? 0.1 : -0.1;
    let newScale = Math.min(maxZoom, Math.max(minZoom, scale + zoomAmount));
    if (newScale === scale) return;

    offsetX -= (mouseX - rect.width / 2) * (newScale - scale) / newScale;
    offsetY -= (mouseY - rect.height / 2) * (newScale - scale) / newScale;

    scale = newScale;
    img.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
  }, { passive: false }); // nécessaire pour preventDefault

  // ----- Touch support -----
  img.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  img.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    offsetX += dx;
    offsetY += dy;

    img.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
  });

  img.addEventListener('touchend', () => {
    isDragging = false;

    // rebond
    img.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    img.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;

    setTimeout(() => img.style.transition = 'transform 0.2s ease', 600);
  });
});

/********************************************
 * 5) ENVOI MAIL AVEC EMAILJS + LIMITE IP
 ********************************************/
async function sendMail() {
  const btn = document.querySelector('.submit-btn');
  const originalText = btn.textContent;

  // Vérifier si CAPTCHA validé
  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    return alert("❌ Veuillez confirmer que vous êtes un humain !");
  }

  // Récupérer IP
  let ip = "";
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    ip = (await res.json()).ip;
  } catch (e) {
    alert("Impossible de récupérer votre IP.");
    return;
  }

  // Limite d'envoi
  const key = 'mailCount_' + ip;
  const count = parseInt(localStorage.getItem(key) || "0");
  if (count >= 3) return alert("❌ Vous avez atteint la limite de 3 messages.");

  // Animation avion
  triggerPlaneAnimation();

  btn.disabled = true;
  btn.textContent = "Envoi en cours...";

  emailjs.send("service_4cr16m3", "template_3zgcmq4", {
    nom: nom.value,
    prenom: prenom.value,
    email: email.value,
    objet: objet.value,
    message: message.value,
    ip: ip,
    'g-recaptcha-response': recaptchaResponse // on envoie aussi la réponse au serveur si besoin
  }).then(() => {
    localStorage.setItem(key, count + 1);
    alert("✅ Message envoyé !");
    document.getElementById("contact-form").reset();
    grecaptcha.reset(); // reset CAPTCHA pour le prochain envoi
  }).catch(err => {
    alert("❌ Erreur : " + err);
  }).finally(() => {
    btn.disabled = false;
    btn.textContent = originalText;
  });
}

/********************************************
 * 6) SYSTEME D'ONGLETS : PROCEDURE
 ********************************************/
function switchTab(tabName) {
  document.querySelectorAll('.procedure-mode')
    .forEach(el => el.classList.remove('active'));

  document.querySelectorAll('.tab-btn')
    .forEach(el => el.classList.remove('active'));

  document.getElementById(tabName + '-content')?.classList.add('active');
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
}


/********************************************
 * 7) ANIMATIONS SCROLL + INTRO
 ********************************************/
document.addEventListener('DOMContentLoaded', () => {

  /* Fade-in en cascade (avis) */
  const testimonialItems = document.querySelectorAll('.testimonial-item');
  testimonialItems.forEach(item => {
    const elements = item.querySelectorAll('.testimonial-content > *, .testimonial-author > *');
    elements.forEach((el, i) => {
      el.classList.add('fadein-section');
      setTimeout(() => el.classList.add('visible'), 400 + i * 250);
    });
  });

  /* Apparition des sections principales */
  const sections = [
    document.querySelector('.profile-header'),
    ...document.querySelectorAll('section'),
    document.querySelector('footer')
  ];
  sections.forEach((el, i) => {
    if (!el) return;
    el.classList.add('fadein-section');

    setTimeout(() => {
      el.classList.add('visible');

      if (el.id === 'about') {
        const title = el.querySelector('h1');
        const paragraphs = el.querySelectorAll('p');

        if (title) {
          title.classList.add('fadein-section');
          setTimeout(() => title.classList.add('visible'), 200);
        }

        paragraphs.forEach((p, idx) => {
          p.classList.add('fadein-section');
          setTimeout(() => p.classList.add('visible'), 600 + idx * 350);
        });
      }
    }, 800 + i * 900);
  });

  /* Scroll reveal */
  const scrollElements = [];
  [
    '.profile-header > *',
    'section#about > *',
    'section#portfolio > *',
    'section#services > *',
    'section#procedure > *',
    'section#avis > *',
    'section#contact > *',
    'footer > *'
  ].forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('scroll-appear');
      scrollElements.push(el);
    });
  });

  function revealOnScroll() {
    scrollElements.forEach(el => {
      const pos = el.getBoundingClientRect();
      if (pos.top < window.innerHeight && pos.bottom > 0) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('resize', revealOnScroll);
  setTimeout(revealOnScroll, 1200);

  /* Tabs */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  /********************************************
   * 8) MODALE AVIS CLIENTS
   ********************************************/
  const modal = document.getElementById('testimonial-modal');
  const modalClose = document.getElementById('testimonial-modal-close');

  const clientData = [
    {
      pic: 'Assets/img/logo/baudo-pdp.jpg',
      name: 'Baudo',
      profession: 'Youtubeur / Game designer',
      review: '« Il m’a créé un site complet ultra clean sans même que je sois au courant mdr ! C’est très quali et ça marche nickel, je recommande le bro ! »'
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

  document.querySelectorAll('.testimonial-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      const data = clientData[idx];

      document.getElementById('modal-client-pic').src = data.pic;
      document.getElementById('modal-client-name').textContent = data.name;
      document.getElementById('modal-client-profession').textContent = data.profession;
      document.getElementById('modal-client-review').textContent = data.review;

      modal.classList.add('show'); // fade-in
    });
  });

  modalClose.addEventListener('click', () => modal.classList.remove('show'));

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

});
