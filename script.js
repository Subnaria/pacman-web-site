const pseudo = "Pacman";
const el = document.getElementById("pseudo-typewriter");
let i = 0;
let forward = true;

function typeLoop() {
  if (forward) {
    el.textContent = pseudo.slice(0, i++);
    if (i > pseudo.length) {
      forward = false;
      setTimeout(typeLoop, 1000); // pause avant suppression
      return;
    }
  } else {
    el.textContent = pseudo.slice(0, --i);
    if (i === 0) {
      forward = true;
      setTimeout(typeLoop, 500); // pause avant réécriture
      return;
    }
  }
  setTimeout(typeLoop, 120);
}
typeLoop();
