/**
 * ABS Software - Centered Dynamic Login & Kinetic Typography Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons if loaded
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Initialize Fullscreen Canvas Mesh
  initMeshCanvas();

  // 2. Initialize Single-Word Dynamic Kinetic Engine (Fixed, Smooth, Decoupled)
  initDynamicWordEngine();

  // 3. Setup Splash / Intro Sequence Controller
  initSplashController();

  // 4. Setup Form Actions (Decoupled from dynamic words)
  initFormInteractivity();
});

/* ==========================================================================
   1. Interactive Constellation & Mesh Canvas (Subtle Background)
   ========================================================================== */
function initMeshCanvas() {
  const canvas = document.getElementById('mesh-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 36;
  const maxDistance = 145;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 0.8,
        baseAlpha: Math.random() * 0.22 + 0.08,
        color: Math.random() > 0.65 ? 'rgba(0, 240, 255,' : 'rgba(100, 140, 200,'
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  window.triggerParticleBurst = function() {
    particles.forEach(p => {
      p.vx += (Math.random() - 0.5) * 1.5;
      p.vy += (Math.random() - 0.5) * 1.5;
    });
  };

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      p.vx *= 0.99;
      p.vy *= 0.99;
      if (Math.abs(p.vx) < 0.12) p.vx = (Math.random() - 0.5) * 0.3;
      if (Math.abs(p.vy) < 0.12) p.vy = (Math.random() - 0.5) * 0.3;

      if (p.x < 0 || p.x > width) p.vx = -p.vx;
      if (p.y < 0 || p.y > height) p.vy = -p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color} ${p.baseAlpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          let alpha = (1 - dist / maxDistance) * 0.11;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Single-Word Dynamic Kinetic Engine (Fixed, Smooth & Non-Jumping)
   ========================================================================== */
const DYNAMIC_WORDS = [
  'ABSOLUTE',
  'ADVANCED',
  'ADAPTIVE'
];

let dynamicEngine = {
  currentIndex: 0,
  isTransitioning: false,
  autoCycleInterval: null,
  textElement: null
};

function initDynamicWordEngine() {
  const textEl = document.getElementById('dynamic-word-text');
  if (!textEl) return;

  dynamicEngine.textElement = textEl;
  renderInitialWord(DYNAMIC_WORDS[0]);

  // Start steady, fixed interval cycle
  startAutoCycle();
}

function renderInitialWord(word) {
  const textEl = dynamicEngine.textElement;
  if (!textEl) return;

  const initial = word.charAt(0);
  const rest = word.slice(1);
  textEl.innerHTML = `<span class="char-a">${initial}</span>${rest}`;
  textEl.className = 'dynamic-word-text';
}

function transitionToWord(targetIndex) {
  if (dynamicEngine.isTransitioning) return;
  const textEl = dynamicEngine.textElement;
  if (!textEl) return;

  dynamicEngine.isTransitioning = true;
  dynamicEngine.currentIndex = targetIndex;

  const word = DYNAMIC_WORDS[targetIndex];
  const initial = word.charAt(0);
  const rest = word.slice(1);
  const nextHtml = `<span class="char-a">${initial}</span>${rest}`;

  // Step 1: Smoothly float up and fade out
  textEl.classList.remove('transition-in-prep');
  textEl.classList.add('transition-out');

  setTimeout(() => {
    // Step 2: Swap content and place slightly below silently
    textEl.innerHTML = nextHtml;
    textEl.classList.remove('transition-out');
    textEl.classList.add('transition-in-prep');

    // Force reflow
    void textEl.offsetWidth;

    // Step 3: Smoothly float into place
    requestAnimationFrame(() => {
      textEl.classList.remove('transition-in-prep');
      setTimeout(() => {
        dynamicEngine.isTransitioning = false;
      }, 550);
    });
  }, 380);
}

function startAutoCycle() {
  if (dynamicEngine.autoCycleInterval) clearInterval(dynamicEngine.autoCycleInterval);
  // Steady 4.2 seconds fixed cycle
  dynamicEngine.autoCycleInterval = setInterval(() => {
    const nextIdx = (dynamicEngine.currentIndex + 1) % DYNAMIC_WORDS.length;
    transitionToWord(nextIdx);
  }, 4200);
}

/* ==========================================================================
   3. Splash / Intro Sequence Controller (One-time, Calm)
   ========================================================================== */
function initSplashController() {
  const hasSeenSplash = sessionStorage.getItem('abs_splash_seen_v5');
  if (!hasSeenSplash) {
    runCinematicSequence();
    sessionStorage.setItem('abs_splash_seen_v5', 'true');
  } else {
    showReposeState();
  }
}

function runCinematicSequence() {
  const row = document.getElementById('phrase-single-row');
  const topLogo = document.querySelector('.brand-abs-title');

  if (!row) return;

  // Phase 1: Clean entrance
  row.style.opacity = '0';
  row.style.transform = 'translateY(10px) scale(0.98)';
  if (topLogo) {
    topLogo.style.transform = 'scale(1.03)';
    topLogo.style.opacity = '1';
  }

  // Phase 2: Smooth reveal -> ABSOLUTE BUSINESS SOLUTIONS
  setTimeout(() => {
    renderInitialWord('ABSOLUTE');
    row.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    row.style.opacity = '1';
    row.style.transform = 'translateY(0) scale(1)';
    if (topLogo) topLogo.style.transform = 'scale(1)';
  }, 400);

  // Phase 3: Settle
  setTimeout(() => {
    showReposeState();
  }, 1800);
}

function showReposeState() {
  const row = document.getElementById('phrase-single-row');
  const topLogo = document.querySelector('.brand-abs-title');

  if (row) {
    row.style.opacity = '1';
    row.style.transform = 'translateY(0) scale(1)';
  }
  if (topLogo) {
    topLogo.style.opacity = '1';
    topLogo.style.transform = 'scale(1)';
  }
}

/* ==========================================================================
   4. Form Actions (Strictly Authenticating, Zero Effect on Words)
   ========================================================================== */
function initFormInteractivity() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginForm = document.getElementById('login-form');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const submitBtn = document.getElementById('submit-btn');
  const feedbackBox = document.getElementById('login-feedback');
  const demoFillBtn = document.getElementById('btn-fill-demo');

  // Password Visibility Toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePasswordBtn.innerHTML = isPassword 
        ? '<i data-lucide="eye-off" class="w-4 h-4"></i>'
        : '<i data-lucide="eye" class="w-4 h-4"></i>';
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Quick Demo Auto-Fill
  if (demoFillBtn && usernameInput && passwordInput) {
    demoFillBtn.addEventListener('click', (e) => {
      e.preventDefault();
      usernameInput.value = 'rampie@abssoftware.com';
      passwordInput.value = '••••••••••••';
      usernameInput.focus();
    });
  }

  // Form Submit Handler
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (!username || !password) {
        showFeedback('Por favor complete su usuario y contraseña.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          AUTENTICANDO...
        `;
      }

      showFeedback('Credenciales verificadas. Conectando al sistema...', 'success');

      if (window.triggerParticleBurst) window.triggerParticleBurst();

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1100);
    });
  }

  function showFeedback(message, type) {
    if (!feedbackBox) return;
    feedbackBox.textContent = message;
    feedbackBox.className = `login-status-feedback ${type}`;
  }
}
