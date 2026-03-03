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
const videoOverlay = document.getElementById("videoOverlay");
const loveVideo = document.getElementById("loveVideo");

function showVideo() {
  if (!videoOverlay || !loveVideo) return;

  // prepara do começo
  try {
    loveVideo.currentTime = 0;
  } catch (_) {}

  videoOverlay.classList.add("show");
  videoOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-lock");

  // tenta dar play (senha OK conta como gesto do usuário)
  const p = loveVideo.play();
  if (p && typeof p.catch === "function") {
    p.catch(() => {
      // se o autoplay falhar (comum no mobile), o usuário dá play pelo controle
    });
  }
}

function hideVideo(onDone) {
  if (!videoOverlay) return onDone && onDone();

  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    onDone && onDone();
  };

  videoOverlay.classList.remove("show");
  videoOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-lock");

  // espera a transição terminar pra ficar suave
  const handler = (e) => {
    if (e.target !== videoOverlay || e.propertyName !== "opacity") return;
    videoOverlay.removeEventListener("transitionend", handler);
    done();
  };
  videoOverlay.addEventListener("transitionend", handler);

  // fallback (caso transitionend não dispare)
  setTimeout(() => {
    videoOverlay.removeEventListener("transitionend", handler);
    done();
  }, 900);
}

function openEnvelope() {
  // Som do envelope abrindo
  if (openSound) {
    openSound.currentTime = 0;
    openSound.play().catch(() => {});
  }

  // Abre envelope e ativa o modo "enhanced"
  shell.classList.add("open");
  shell.classList.add("enhanced");
  document.body.classList.add("focus-mode");

  // scroll sempre do topo
  const paper = document.querySelector("#letter .paper");
  if (paper) paper.scrollTop = 0;
}

// WhatsApp alvo
const phone = "5591984536649";

// mensagem automática
const message = "Oi.";

// codifica a mensagem para URL
const encodedMessage = encodeURIComponent(message);

// link com mensagem preenchida
waBtn.href = `https://wa.me/${phone}?text=${encodedMessage}`;

function setMessage(type, text) {
  msg.className = "msg " + (type || "");
  msg.innerHTML = "";

  if (!text) return;

  const icon = document.createElement("span");
  icon.className = "icon";
  icon.setAttribute("aria-hidden", "true");

  if (type === "good") icon.innerHTML = "✓";
  else if (type === "bad") icon.innerHTML = "!";
  else icon.innerHTML = "•";

  const span = document.createElement("span");
  span.textContent = text;

  msg.append(icon, span);
}

function showPasswordField() {
  slot.innerHTML = `
    <div class="pass-wrap">
      <label for="passInput">Digite a senha correta</label>
      <div class="pass">
        <input id="passInput" type="password" inputmode="numeric" autocomplete="one-time-code"
          placeholder="••••••" aria-label="Digite a senha correta" />
        <button class="btn btn-round" id="checkBtn" type="button" style="width:132px;height:46px;">OK</button>
      </div>
      <p class="hint"><i>A senha para abrir a carta é a senha do celular da Iza</i></p>
    </div>
  `;

  const passInput = document.getElementById("passInput");
  const checkBtn = document.getElementById("checkBtn");

  passInput.focus();

  function check() {
    const value = passInput.value.trim();

    if (value === PASSWORD) {
      setMessage("good", "Senha correta!");

      // 1) Mostra o vídeo com fade suave
      setTimeout(() => {
        showVideo();

        // 2) Quando o vídeo acabar, ele some suave e o envelope aparece
        if (loveVideo) {
          const onEnded = () => {
            loveVideo.removeEventListener("ended", onEnded);

            // para o vídeo pra não ficar consumindo recursos
            try { loveVideo.pause(); } catch (_) {}

            hideVideo(() => {
              openEnvelope();
            });
          };

          // garante que não duplica listener
          loveVideo.removeEventListener("ended", onEnded);
          loveVideo.addEventListener("ended", onEnded, { once: true });
        }
      }, 250);

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
          { transform: "translateX(0)" },
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