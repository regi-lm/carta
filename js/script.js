// ===== Fundo de corações caindo =====
(function heartRain() {
  const root = document.getElementById("heartRain");
  const COUNT = 28;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < COUNT; i++) {
    const h = document.createElement("div");
    h.className = "heart";

    const left = rand(0, 100);
    const size = rand(10, 26);
    const dur = rand(6, 14);
    const delay = rand(0, 8);
    const opacity = rand(0.25, 0.75);

    h.style.left = left + "vw";
    h.style.width = size + "px";
    h.style.height = size + "px";
    h.style.animationDuration = dur + "s";
    h.style.animationDelay = -delay + "s";
    h.style.opacity = opacity;

    const tint = rand(0.35, 0.75);
    h.style.background = `rgba(255, 77, 166, ${tint})`;

    root.appendChild(h);
  }
})();

// ===== Lógica da carta =====
const PASSWORD = "120223";

const slot = document.getElementById("slot");
const openBtn = document.getElementById("openBtn");
const msg = document.getElementById("msg");

const shell = document.getElementById("shell"); // .envelope-shell
const waBtn = document.getElementById("waBtn");
const openSound = document.getElementById("openSound");

// Overlay/Vídeo
const videoOverlay = document.getElementById("videoOverlay");
const loveVideo = document.getElementById("loveVideo");

// WhatsApp alvo + mensagem automática
const phone = "5591984536649";
const message = "Oi.";
waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

// ===== Helpers =====
function setMessage(type, text) {
  msg.className = "msg " + (type || "");
  msg.innerHTML = "";
  if (!text) return;

  const icon = document.createElement("span");
  icon.className = "icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = type === "good" ? "✓" : type === "bad" ? "!" : "•";

  const span = document.createElement("span");
  span.textContent = text;

  msg.append(icon, span);
}

/* =========================
   ✅ Lock real do body (fixo)
   ========================= */
let savedScrollY = 0;

function lockBody() {
  savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.style.setProperty("--lock-top", `-${savedScrollY}px`);
  document.body.classList.add("body-locked");
}

function unlockBody() {
  document.body.classList.remove("body-locked");
  document.body.style.removeProperty("--lock-top");
  window.scrollTo(0, savedScrollY);
}

/* =========================
   ✅ Scroll “em qualquer lugar” controla a carta
   (mouse wheel + touch arrastar)
   ========================= */
let anywhereScrollEnabled = false;
let touchStartY = null;

function isInteractiveTarget(el) {
  if (!el) return false;
  return !!el.closest("a, button, input, textarea, select, video, label");
}

function enableAnywhereScroll() {
  if (anywhereScrollEnabled) return;
  anywhereScrollEnabled = true;

  // Mouse wheel: rola a carta mesmo fora dela
  document.addEventListener(
    "wheel",
    (e) => {
      if (!document.body.classList.contains("scroll-unlocked")) return;
      const letter = document.getElementById("letter");
      if (!letter) return;

      // se estiver interagindo com botões/vídeo, deixa normal
      if (isInteractiveTarget(e.target)) return;

      // Se o mouse estiver em cima da carta, deixa o scroll normal dela
      // Se estiver fora, empurra o scroll da carta
      if (!letter.contains(e.target)) {
        e.preventDefault();
        letter.scrollTop += e.deltaY;
      }
    },
    { passive: false }
  );

  // Touch: arrastar em qualquer área empurra o scroll da carta
  document.addEventListener(
    "touchstart",
    (e) => {
      if (!document.body.classList.contains("scroll-unlocked")) return;
      if (isInteractiveTarget(e.target)) return;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!document.body.classList.contains("scroll-unlocked")) return;
      const letter = document.getElementById("letter");
      if (!letter) return;

      if (touchStartY == null) return;
      if (isInteractiveTarget(e.target)) return;

      const y = e.touches[0].clientY;
      const dy = touchStartY - y;
      touchStartY = y;

      // se arrastou fora da carta, empurra o scroll dela
      if (!letter.contains(e.target)) {
        e.preventDefault();
        letter.scrollTop += dy;
      }
    },
    { passive: false }
  );

  document.addEventListener(
    "touchend",
    () => {
      touchStartY = null;
    },
    { passive: true }
  );
}

/**
 * ✅ Durante o vídeo:
 * - body fixo (sem scroll)
 * - overlay aparece
 */
function openVideoModal() {
  lockBody();
  document.body.classList.add("focus-mode");

  if (videoOverlay) {
    videoOverlay.classList.add("show");
    videoOverlay.classList.remove("fade-out");
    videoOverlay.setAttribute("aria-hidden", "false");
  }

  if (loveVideo) {
    try { loveVideo.currentTime = 0; } catch {}
    loveVideo.play().catch(() => {});
  }
}

/**
 * ✅ Quando o vídeo termina:
 * - overlay some suave
 * - abre envelope
 * - libera scroll em qualquer lugar da tela
 */
function closeVideoModalThenOpenEnvelope() {
  if (videoOverlay) {
    videoOverlay.classList.add("fade-out");
    videoOverlay.classList.remove("show");
    videoOverlay.setAttribute("aria-hidden", "true");
  }

  if (loveVideo) loveVideo.pause();

  setTimeout(() => {
    // abre envelope
    shell.classList.add("open");

    // destrava body
    unlockBody();

    // ✅ Agora libera scroll em qualquer lugar
    document.body.classList.add("scroll-unlocked");

    // carta começa do topo
    const letter = document.getElementById("letter");
    if (letter) letter.scrollTop = 0;

    // som começa EXATAMENTE ao abrir o envelope
    if (openSound) {
      openSound.currentTime = 0;
      openSound.play().catch(() => {});
    }

    // habilita scroll “em qualquer lugar” para controlar a carta
    enableAnywhereScroll();
  }, 450);
}

// ===== Campo de senha =====
function showPasswordField() {
  slot.innerHTML = `
    <div class="pass-wrap">
      <label for="passInput">Digite a senha correta</label>
      <div class="pass">
        <input id="passInput" type="password" inputmode="numeric" autocomplete="one-time-code"
          placeholder="• • • • • •" aria-label="Digite a senha correta" />
        <button class="btn btn-round" id="checkBtn" type="button" style="width:132px;height:46px;">OK</button>
      </div>
      <p class="hint"><i>a senha para abrir a carta é a senha do celular da Iza</i></p>
    </div>
  `;

  const passInput = document.getElementById("passInput");
  const checkBtn = document.getElementById("checkBtn");

  passInput.focus();

  function check() {
    const value = passInput.value.trim();

    if (value === PASSWORD) {
      setMessage("good", "Senha correta!");

      setTimeout(() => {
        openVideoModal();
      }, 350);

      passInput.disabled = true;
      checkBtn.disabled = true;
      checkBtn.style.opacity = 0.7;
      passInput.style.opacity = 0.9;
    } else {
      setMessage("bad", "Senha incorreta, apenas a Iza sabe qual é a senha correta!");

      passInput.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 320, easing: "ease-out" }
      );

      passInput.focus();
      passInput.select();
    }
  }

  checkBtn.addEventListener("click", check);
  passInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") check();
  });
}

// ===== Clique inicial =====
openBtn.addEventListener("click", () => {
  setMessage("", "");
  showPasswordField();
});

// Quando o vídeo terminar: fecha modal e abre envelope
if (loveVideo) {
  loveVideo.addEventListener("ended", () => {
    closeVideoModalThenOpenEnvelope();
  });
}