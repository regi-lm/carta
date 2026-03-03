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

/**
 * ✅ Durante o vídeo: SEM scroll em lugar nenhum.
 * A gente trava tudo com lock-scroll.
 */
function openVideoModal() {
  // trava tudo (sem scroll)
  document.body.classList.add("lock-scroll");

  // mantém foco visual (some painel/ações)
  document.body.classList.add("focus-mode");

  if (videoOverlay) {
    videoOverlay.classList.add("show");
    videoOverlay.classList.remove("fade-out");
    videoOverlay.setAttribute("aria-hidden", "false");
  }

  if (loveVideo) {
    try {
      loveVideo.currentTime = 0;
    } catch {}
    loveVideo.play().catch(() => {
      // autoplay pode ser bloqueado; usuário dá play manual
    });
  }
}

/**
 * ✅ Quando o vídeo termina:
 * - overlay some suave
 * - abre envelope
 * - só então liberamos o scroll (mas só na carta)
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

    // libera scroll (somente na carta, pois focus-mode trava o fundo)
    document.body.classList.remove("lock-scroll");

    // carta sempre começa do topo
    const letter = document.getElementById("letter");
    if (letter) letter.scrollTop = 0;

    // som começa EXATAMENTE ao abrir o envelope
    if (openSound) {
      openSound.currentTime = 0;
      openSound.play().catch(() => {});
    }
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

// ✅ Quando o vídeo terminar: fecha modal e abre envelope
if (loveVideo) {
  loveVideo.addEventListener("ended", () => {
    closeVideoModalThenOpenEnvelope();
  });
}