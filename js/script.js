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

      setTimeout(() => {
        // Som do envelope abrindo
        if (openSound) {
          openSound.currentTime = 0;
          openSound.play().catch(() => {});
        }

        // Abre envelope e ativa o modo "enhanced" (aspect-ratio 4/6)
        shell.classList.add("open");
        shell.classList.add("enhanced");

        document.body.classList.add("focus-mode");

        // Carta sempre começa do topo
        const letter = document.getElementById("letter");
        if (letter) letter.scrollTop = 0;
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