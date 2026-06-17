/* =====================================================
   Referencias a elementos
===================================================== */
const cover = document.getElementById('cover');
const profilePage = document.getElementById('profilePage');
const book = document.getElementById('book');

const btnOpen = document.getElementById('btnOpen');
const btnExplore = document.getElementById('btnExplore');
const btnContactQuick = document.getElementById('btnContactQuick');
const btnToCover = document.getElementById('btnToCover');
const btnToProfile = document.getElementById('btnToProfile');

const spreads = Array.from(document.querySelectorAll('.spread'));
const dots = Array.from(document.querySelectorAll('.dot'));
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

const TOTAL_SPREADS = spreads.length;
const LAST_SPREAD = TOTAL_SPREADS - 1;
let currentSpread = 0;

/* =====================================================
   Animación de apertura
   1) la portada sale hacia la derecha
   2) la página de perfil entra desde la izquierda
===================================================== */
btnOpen.addEventListener('click', () => {
  cover.classList.add('is-hidden');
  profilePage.classList.add('is-visible');
});

// volver de perfil a portada (animación inversa)
btnToCover.addEventListener('click', () => {
  profilePage.classList.remove('is-visible');
  cover.classList.remove('is-hidden');
});

/* =====================================================
   Perfil -> Libro (las páginas entran desde la derecha)
===================================================== */
function openBook(startAt = 0) {
  profilePage.classList.add('is-hidden');
  book.classList.add('is-visible');
  if (startAt !== currentSpread) goToSpread(startAt);
}

btnExplore.addEventListener('click', () => openBook(0));

// "contáctame" en el perfil lleva directo a la última doble página
btnContactQuick.addEventListener('click', () => openBook(LAST_SPREAD));

// volver del libro al perfil (botón "atrás" en la esquina)
btnToProfile.addEventListener('click', () => {
  book.classList.remove('is-visible');
  profilePage.classList.remove('is-hidden');
});

/* =====================================================
   Navegación entre las 3 dobles páginas (flip 3D)
===================================================== */
const FLIP_MS = 700; // debe coincidir con --speed en cafeteria.css

function goToSpread(index, direction) {
  if (index < 0 || index > LAST_SPREAD || index === currentSpread) return;

  // si no se especifica dirección, se infiere por el índice (para los puntos)
  if (!direction) direction = index > currentSpread ? 'next' : 'prev';

  const current = spreads[currentSpread];
  const next = spreads[index];

  // la nueva doble página queda lista y visible de inmediato, debajo de la actual
  next.style.zIndex = 1;
  next.classList.add('active');

  // la doble página actual queda encima y gira sobre el lomo, como una hoja real
  current.classList.remove('active');
  current.style.zIndex = 3;
  current.classList.add(direction === 'next' ? 'leaving-next' : 'leaving-prev');

  setTimeout(() => {
    current.classList.remove('leaving-next', 'leaving-prev');
    current.style.zIndex = '';
    next.style.zIndex = '';
  }, FLIP_MS);

  currentSpread = index;
  updateDots();
  updateArrows();
}

function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSpread));
}

function updateArrows() {
  btnPrev.disabled = currentSpread === 0;
  btnNext.disabled = currentSpread === LAST_SPREAD;
}

btnNext.addEventListener('click', () => goToSpread(currentSpread + 1, 'next'));
btnPrev.addEventListener('click', () => goToSpread(currentSpread - 1, 'prev'));

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const targetIndex = Number(dot.dataset.index);
    goToSpread(targetIndex);
  });
});

// función de índice inverso: útil para saber cuántas dobles páginas
// faltan desde el final (por ejemplo, para deshabilitar botones o saltos)
function reverseIndex(index) {
  return LAST_SPREAD - index;
}

/* flechas del teclado, solo mientras el libro está visible */
document.addEventListener('keydown', (e) => {
  if (!book.classList.contains('is-visible')) return;
  if (e.key === 'ArrowRight') goToSpread(currentSpread + 1, 'next');
  if (e.key === 'ArrowLeft') goToSpread(currentSpread - 1, 'prev');
});

updateArrows();

/* =====================================================
   Formulario de contacto (front-end únicamente)
   Para recibir los mensajes de verdad, conecta este
   formulario a un servicio como Formspree o tu propio backend.
===================================================== */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formFeedback.textContent = '¡Mensaje enviado! Te responderé pronto.';
  contactForm.reset();
  setTimeout(() => { formFeedback.textContent = ''; }, 4000);
});
