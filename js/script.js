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

const shell = document.getElementById("shell"); // envelope-shell
const waBtn = document.getElementById("waBtn");
const openSound = document.getElementById("openSound");

// ✅ Overlay e vídeo
const videoOverlay = document.getElementById("videoOverlay");
const loveVideo = document.getElementById("loveVideo");

// WhatsApp com mensagem
const phone = "5591984536649";
const message = "Oi ❤️ Acabei de abrir a carta... e precisava falar com você 🥰";
waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

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

function openVideoModal() {
  // trava scroll do fundo já aqui
  document.body.classList.add("focus-mode");

  // mostra overlay
  videoOverlay.classList.add("show");
  videoOverlay.setAttribute("aria-hidden", "false");

  // reinicia vídeo
  try {
    loveVideo.currentTime = 0;
  } catch {}
  // tenta autoplay; se o navegador bloquear, o usuário clica play
  loveVideo.play().catch(() => {});
}

function closeVideoModalAndOpenEnvelope() {
  // fade out suave do overlay
  videoOverlay.classList.add("fade-out");
  videoOverlay.classList.remove("show");
  videoOverlay.setAttribute("aria-hidden", "true");

  // garante vídeo parado
  loveVideo.pause();

  // depois que o fade acabar, abre o envelope + toca som
  setTimeout(() => {
    // abre envelope
    shell.classList.add("open");
    shell.classList.add("enhanced");

    // carta começa do topo
    const letter = document.getElementById("letter");
    if (letter) letter.scrollTop = 0;

    // som inicia EXATAMENTE ao abrir
    if (openSound) {
      openSound.currentTime = 0;
      openSound.play().catch(() => {});
    }

    // limpa classe de fade para permitir reabrir se precisar
    videoOverlay.classList.remove("fade-out");
  }, 450);
}

function showPasswordField() {
  slot.innerHTML = `
    <div class="pass-wrap">
      <label for="passInput">Digite a senha correta</label>
      <div class="pass">
        <input id="passInput" type="password" inputmode="numeric" autocomplete="one-time-code"
          placeholder="• • • • • •" aria-label="Digite a senha correta" />
        <button class="btn btn-round" id="checkBtn" type="button" style="width:132px;height:46px;">OK</button>
      </div>
      <p class="hint"><i>A senha para abrir a carta é a senha celular da Iza</i></p>
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
        // abre o modal de vídeo (antes do envelope)
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

openBtn.addEventListener("click", () => {
  setMessage("", "");
  showPasswordField();
});

// ✅ Quando o vídeo terminar, fecha overlay e abre envelope
loveVideo.addEventListener("ended", () => {
  closeVideoModalAndOpenEnvelope();
});