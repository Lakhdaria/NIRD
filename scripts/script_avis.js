const feedback = document.getElementById("feedback");
const bar = document.getElementById("decay-bar");
const timerText = document.getElementById("timer-text");
const statusEl = document.getElementById("status");
const sendBtn = document.getElementById("send-btn");
const wrapper = document.getElementById("text-wrapper");
const overlay = document.getElementById("success-overlay");
const homeBtn = document.getElementById("home-btn");

// Durée d'attente aléatoire AVANT de pouvoir écrire un mot
const MIN_TIME = 500;  // 1 seconde
const MAX_TIME = 2000;  // 6 secondes

// Fenêtre de temps POUR ÉCRIRE le mot (elle aussi aléatoire)
const MIN_WORD_WINDOW = 500;  // 1.5 s
const MAX_WORD_WINDOW = 2000;  // 5 s

let lockEndTime = 0;          // moment où le timer d'attente se termine
let currentDuration = 0;      // durée de la phase d'attente
let intervalId = null;
let canTypeWord = false;      // est-ce qu'on a le droit d'écrire un mot ?
let unlockTime = 0;           // moment où on a le droit de commencer le mot
let currentWordWindow = 0;    // durée de la fenêtre de saisie du mot
let lastCommittedLength = 0;  // longueur du texte après le dernier mot validé
let gameFinished = false;     // quand l'avis est envoyé, on bloque tout

// Audio
let audioCtx = null;
function beep(freq, duration = 0.12, volume = 0.14) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = "square";
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);
    } catch (e) {
        // si l'audio est bloqué, on ignore
    }
}

function randomDuration() {
    return MIN_TIME + Math.random() * (MAX_TIME - MIN_TIME);
}

function randomWordWindow() {
    return MIN_WORD_WINDOW + Math.random() * (MAX_WORD_WINDOW - MIN_WORD_WINDOW);
}

// Lance un nouveau timer d'attente avant le prochain mot
function startNewTimer() {
    if (gameFinished) return;

    currentDuration = randomDuration();
    lockEndTime = Date.now() + currentDuration;
    canTypeWord = false;
    currentWordWindow = 0;

    // Texte court + rouge
    statusEl.textContent = "⏳ Attends... (" + (currentDuration / 1000).toFixed(1) + "s)";
    statusEl.classList.remove("success");
    statusEl.classList.add("error");

    timerText.textContent = (currentDuration / 1000).toFixed(1) + "s";
    updateBar(1);
    beep(500);
}

// Met à jour la barre selon un ratio 0–1
function updateBar(ratio) {
    const percent = Math.max(Math.min(ratio, 1), 0) * 100;
    bar.style.width = percent + "%";

    if (ratio > 0.6) {
        bar.style.background = "linear-gradient(90deg, #A634ED, #1264B5)";
    } else if (ratio > 0.3) {
        bar.style.background = "linear-gradient(90deg, #ffb347, #ff9966)";
    } else if (ratio > 0.0) {
        bar.style.background = "linear-gradient(90deg, #ff4b5c, #ff1e3c)";
    } else {
        bar.style.background = "linear-gradient(90deg, #550016, #3a000e)";
    }
}

// Wipe total du texte
function wipe(reason) {
    if (gameFinished) return;

    feedback.value = "";
    lastCommittedLength = 0;
    canTypeWord = false;

    statusEl.textContent = "❌ " + reason;
    statusEl.classList.remove("success");
    statusEl.classList.add("error");

    wrapper.classList.remove("shake");
    void wrapper.offsetWidth; // reset anim
    wrapper.classList.add("shake");

    // son de défaite quand le texte est effacé
    beep(180, 0.3, 0.24);

    startNewTimer();
}

// Boucle principale
function startLoop() {
    if (intervalId) return;

    intervalId = setInterval(() => {
        if (gameFinished) {
            clearInterval(intervalId);
            intervalId = null;
            return;
        }

        const now = Date.now();

        if (!canTypeWord) {
            // Phase d'attente
            const remaining = Math.max(lockEndTime - now, 0);
            const ratio = remaining / currentDuration;
            updateBar(ratio);
            timerText.textContent = (remaining / 1000).toFixed(1) + "s";

            if (remaining <= 0) {
                // On peut commencer à écrire UN mot
                canTypeWord = true;
                unlockTime = Date.now();
                currentWordWindow = randomWordWindow();

                statusEl.textContent =
                    "✏️ Tape UN mot (tu as " +
                    (currentWordWindow / 1000).toFixed(1) + "s)";
                statusEl.classList.remove("error");
                statusEl.classList.add("success");

                beep(750, 0.1, 0.16);
                updateBar(1);
                timerText.textContent = (currentWordWindow / 1000).toFixed(1) + "s";
            }
        } else {
            // Phase de saisie du mot
            const elapsedSinceUnlock = now - unlockTime;
            const remainingWord = Math.max(currentWordWindow - elapsedSinceUnlock, 0);
            const ratio = remainingWord / currentWordWindow;
            updateBar(ratio);
            timerText.textContent = (remainingWord / 1000).toFixed(1) + "s";

            if (remainingWord <= 0) {
                wipe("Trop lent ! Tu n’as pas terminé ton mot à temps.");
            }
        }
    }, 40);
}

// Bloquer la saisie si ce n'est pas le bon moment
feedback.addEventListener("beforeinput", (e) => {
    if (gameFinished) return;

    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    if (!canTypeWord) {
        e.preventDefault();
        wipe("Trop rapide ! Tu as essayé d’écrire avant le signal.");
    }
});

// Quand le texte change réellement
feedback.addEventListener("input", () => {
    if (gameFinished) return;

    if (!canTypeWord) {
        wipe("Tu as tapé au mauvais moment.");
        return;
    }

    const now = Date.now();
    if (now - unlockTime > currentWordWindow) {
        wipe("Trop lent ! Tu n’as pas fini ton mot à temps.");
        return;
    }

    const text = feedback.value;
    const lastChar = text[text.length - 1] || "";
    const isDelimiter = /\s|[.,!?;:]/.test(lastChar);

    if (isDelimiter) {
        const segment = text.slice(lastCommittedLength, text.length - 1);
        if (segment.trim().length > 0) {
            // Mot validé
            canTypeWord = false;
            lastCommittedLength = text.length;

            statusEl.textContent =
                "✅ Mot validé ! Attends le prochain timer.";
            statusEl.classList.remove("error");
            statusEl.classList.add("success");

            beep(320, 0.1, 0.16);
            startNewTimer();
        }
    }
});

// Fonction d'envoi (clic ou Entrée)
function handleSend() {
    if (gameFinished) return;

    const value = feedback.value.trim();
    if (!value) {
        statusEl.textContent = "❌ Tu dois écrire quelque chose avant d’envoyer.";
        statusEl.classList.remove("success");
        statusEl.classList.add("error");
        return;
    }

    statusEl.textContent = "📨 Avis envoyé !";
    statusEl.classList.remove("error");
    statusEl.classList.add("success");
    beep(250, 0.14, 0.18);

    // On termine le "jeu"
    gameFinished = true;
    canTypeWord = false;
    feedback.disabled = true;
    sendBtn.disabled = true;

    // Afficher le gros message
    overlay.classList.add("is-visible");
}

// Bouton Envoyer
sendBtn.addEventListener("click", () => {
    handleSend();
});

// Bouton retour accueil
if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = homeBtn.href || "index.html";
    });
}

// Entrée = envoyer l'avis
feedback.addEventListener("keydown", (e) => {
    if (gameFinished) return;

    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // empêche le retour à la ligne
        // Message d'instruction + reset du texte
        feedback.value = "";
        lastCommittedLength = 0;
        canTypeWord = false;

        statusEl.textContent = "Appuie sur le bouton Envoyer pour soumettre le message.";
        statusEl.classList.remove("success");
        statusEl.classList.add("error");

        wrapper.classList.remove("shake");
        void wrapper.offsetWidth;
        wrapper.classList.add("shake");

        // son de défaite lors de l'effacement via Entrée
        beep(180, 0.3, 0.24);

        // On remet un petit délai avant de relancer un slot de saisie
        currentDuration = 2500;
        lockEndTime = Date.now() + currentDuration;
        timerText.textContent = (currentDuration / 1000).toFixed(1) + "s";
        updateBar(1);
    }
});

// Initialisation
startNewTimer();
startLoop();

// Particules de fond
(function () {
    const canvas = document.getElementById("particlesCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpi = window.devicePixelRatio || 1;
    let width = 0, height = 0, particles = [];

    function resize() {
        width = canvas.width = innerWidth * dpi;
        height = canvas.height = innerHeight * dpi;
        canvas.style.width = innerWidth + "px";
        canvas.style.height = innerHeight + "px";
        init();
    }

    function init(count = 90) {
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35 * dpi,
            vy: (Math.random() - 0.5) * 0.35 * dpi,
            r: (Math.random() * 1.4 + 0.4) * dpi,
            a: Math.random() * 0.45 + 0.2,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
            g.addColorStop(0, `rgba(94,234,212,${p.a})`);
            g.addColorStop(1, "rgba(94,234,212,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // traits
        // moins de connexions : on limite le nombre de liens par particule
        const maxLinks = 2;
        const linkCounts = new Array(particles.length).fill(0);
        const maxDist = 140 * dpi;

        for (let i = 0; i < particles.length; i++) {
            if (linkCounts[i] >= maxLinks) continue;
            for (let j = i + 1; j < particles.length; j++) {
                if (linkCounts[j] >= maxLinks) continue;

                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.35;
                    ctx.strokeStyle = `rgba(165,180,252,${alpha})`;
                    ctx.lineWidth = 1 * dpi;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    linkCounts[i]++;
                    linkCounts[j]++;

                    if (linkCounts[i] >= maxLinks) break;
                }
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
})();

const burgerBtn = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");

if (burgerBtn && navMenu) {
    burgerBtn.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        burgerBtn.classList.toggle("is-open");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            burgerBtn.classList.remove("is-open");
        });
    });
}

const headerEl = document.querySelector(".header");
const updateHeaderState = () => {
    if (!headerEl) return;
    headerEl.classList.toggle("is-scrolled", window.scrollY > 50);
};

window.addEventListener("scroll", updateHeaderState);
updateHeaderState();
