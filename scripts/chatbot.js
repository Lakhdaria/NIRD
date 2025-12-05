/**
 * ========================================
 * PC BUILDER BOT - CHATBOT ASSISTANT
 * Assistant IA pour identifier les composants PC
 * ========================================
 */

// ============================================
// CONFIGURATION & BASE DE DONNÉES
// ============================================

/**
 * Réponses du bot par mot-clé
 * Structure extensible pour ajouter facilement de nouveaux sujets
 */
const BOT_RESPONSES = {
    // Composants Hardware
    cpu: {
        keywords: ['cpu', 'processeur', 'intel', 'amd', 'ryzen', 'core'],
        responses: [
            "Le **CPU (Central Processing Unit)** est le cerveau de l'ordinateur ! 🧠\n\nIl exécute toutes les instructions des programmes. Les grandes marques sont **Intel** (Core i3/i5/i7/i9) et **AMD** (Ryzen 3/5/7/9).\n\n💡 **Conseil éco** : Un CPU récent consomme souvent moins qu'un ancien pour les mêmes performances !",
            "Le processeur, c'est le chef d'orchestre de ton PC ! ⚙️\n\nPlus il a de cœurs et de threads, plus il peut faire de choses en parallèle. Pour du gaming, privilégie la fréquence. Pour du montage vidéo, privilégie les cœurs.\n\n♻️ Un CPU bien refroidi dure plus longtemps !"
        ]
    },
    
    gpu: {
        keywords: ['gpu', 'carte graphique', 'nvidia', 'rtx', 'radeon', 'geforce', 'graphique'],
        responses: [
            "Le **GPU (Graphics Processing Unit)** gère tout ce qui est visuel ! 🎮\n\n**NVIDIA** (GeForce RTX) et **AMD** (Radeon RX) sont les leaders. Le GPU est essentiel pour le gaming, le rendu 3D et même l'IA.\n\n💡 **Astuce** : Une carte graphique reconditionnée peut offrir d'excellentes performances à prix réduit !",
            "La carte graphique, c'est l'artiste du PC ! 🖼️\n\nElle calcule des millions de pixels par seconde. Plus sa VRAM est élevée, mieux elle gère les hautes résolutions.\n\n🌱 **Éco-tip** : Limite le framerate à 60fps pour économiser de l'énergie si tu n'as pas besoin de plus !"
        ]
    },
    
    ram: {
        keywords: ['ram', 'mémoire', 'ddr4', 'ddr5', 'mémoire vive'],
        responses: [
            "La **RAM (Random Access Memory)** est la mémoire à court terme du PC ! 🧬\n\n- **8 Go** : Bureautique basique\n- **16 Go** : Gaming, développement\n- **32 Go+** : Montage vidéo pro, virtualisation\n\n♻️ La RAM est l'un des composants les plus faciles à upgrader pour prolonger la vie d'un PC !",
            "La mémoire vive permet au PC de jongler entre plusieurs tâches ! 💨\n\nLa DDR5 est plus rapide que la DDR4, mais la DDR4 reste excellente et souvent moins chère.\n\n💡 Ajouter de la RAM à un vieux PC peut lui donner une seconde jeunesse !"
        ]
    },
    
    psu: {
        keywords: ['psu', 'alimentation', 'watt', 'power supply', 'alim'],
        responses: [
            "Le **PSU (Power Supply Unit)** alimente tous les composants ! 🔌\n\nChoisis une alimentation certifiée **80+ Bronze/Gold/Platinum** pour une meilleure efficacité énergétique.\n\n⚡ Une bonne alimentation protège tes composants et réduit ta facture d'électricité !",
            "L'alimentation, c'est le cœur énergétique du PC ! ⚡\n\n- Gaming basique : 550-650W\n- Config haut de gamme : 750-850W\n- Multi-GPU : 1000W+\n\n🌱 Une alim de qualité = moins de gaspillage et plus de durabilité !"
        ]
    },
    
    rom: {
        keywords: ['rom', 'stockage', 'ssd', 'hdd', 'nvme', 'disque dur'],
        responses: [
            "Le stockage garde tes données de façon permanente ! 💾\n\n- **SSD NVMe** : Ultra-rapide (lecture 7000 Mo/s)\n- **SSD SATA** : Rapide et abordable\n- **HDD** : Grande capacité, moins cher\n\n♻️ Un vieux PC avec un SSD démarre en 15 secondes au lieu de 2 minutes !",
            "SSD vs HDD : le combat du siècle ! 🥊\n\nLe **SSD** n'a pas de pièces mobiles = plus rapide, plus silencieux, plus fiable. Le **HDD** reste utile pour stocker beaucoup de données à moindre coût.\n\n💡 Combo idéal : SSD pour le système + HDD pour le stockage !"
        ]
    },
    
    // Systèmes & Logiciels
    linux: {
        keywords: ['linux', 'ubuntu', 'debian', 'mint', 'fedora', 'pingouin'],
        responses: [
            "**Linux**, c'est la liberté ! 🐧\n\nSystème d'exploitation gratuit, open source et léger. Parfait pour donner une seconde vie aux vieux PC !\n\n🌟 Distributions recommandées :\n- **Linux Mint** : Idéal pour débuter\n- **Ubuntu** : Populaire et bien documenté\n- **Lubuntu** : Ultra-léger pour vieux PC",
            "Linux, le pingouin qui fait tourner internet ! 🐧\n\n90% des serveurs web tournent sous Linux. C'est gratuit, sécurisé, et tu ne seras plus espionné par ton OS.\n\n♻️ Installer Linux sur un PC de 10 ans = lui donner 5 ans de plus !"
        ]
    },
    
    // Écologie & Reconditionnement
    reconditionnement: {
        keywords: ['reconditionné', 'reconditionnement', 'occasion', 'seconde main', 'réemploi'],
        responses: [
            "Le **reconditionnement**, c'est l'avenir ! ♻️\n\nUn PC reconditionné :\n- Coûte 30-50% moins cher\n- Évite 200kg de CO2\n- Fonctionne comme un neuf\n\n🌱 Acheter reconditionné = geste écologique ET économique !",
            "Donner une seconde vie aux PC, c'est essentiel ! 🌍\n\nLe reconditionnement comprend :\n1. Diagnostic complet\n2. Remplacement des pièces défaillantes\n3. Nettoyage professionnel\n4. Installation d'un OS frais\n\n💡 Un PC reconditionné avec SSD et Linux = machine performante !"
        ]
    },
    
    ecologie: {
        keywords: ['écologie', 'écolo', 'environnement', 'durable', 'vert', 'impact', 'carbone'],
        responses: [
            "Le numérique responsable, ça compte ! 🌱\n\n**5 gestes simples :**\n1. Garder son PC plus longtemps\n2. Acheter reconditionné\n3. Éteindre au lieu de veille\n4. Nettoyer ses mails\n5. Désactiver le streaming HD inutile\n\n🌍 Le numérique = 4% des émissions mondiales de CO2 !",
            "Chaque geste compte pour la planète ! 🌍\n\n**Savais-tu que :**\n- Fabriquer un smartphone = 70kg de CO2\n- Un email avec pièce jointe = 19g de CO2\n- Le streaming = 300 millions de tonnes de CO2/an\n\n💡 Prolonger la vie de tes appareils est le meilleur geste éco !"
        ]
    },
    
    // Réponses par défaut
    default: {
        keywords: [],
        responses: [
            "Hmm, je ne suis pas sûr de comprendre ta question ! 🤔\n\nJe peux t'aider avec :\n- Les composants PC (CPU, GPU, RAM...)\n- Linux et les systèmes\n- Le reconditionnement\n- Les conseils éco-responsables\n\n📷 Tu peux aussi m'envoyer une **photo de composant** pour que je l'identifie !",
            "Je n'ai pas trouvé d'info précise sur ça ! 🔍\n\nEssaie de me demander des infos sur :\n- Un composant spécifique (GPU, CPU, RAM...)\n- Linux\n- Le reconditionnement\n- L'écologie numérique\n\n💡 Clique sur les boutons rapides pour des sujets populaires !"
        ]
    },
    
    // Salutations
    salutation: {
        keywords: ['bonjour', 'salut', 'hello', 'hey', 'coucou', 'yo', 'bonsoir'],
        responses: [
            "Salut ! 👋 Content de te voir !\n\nJe suis **PC Builder Bot**, ton assistant pour tout ce qui touche au matériel informatique et au numérique responsable.\n\nPose-moi une question ou envoie une photo de composant !",
            "Hey ! 🤖 Bienvenue !\n\nJe peux t'aider à identifier des composants, comprendre le hardware, ou découvrir des conseils éco-responsables.\n\nQu'est-ce qui t'intéresse ?"
        ]
    },
    
    // Aide
    aide: {
        keywords: ['aide', 'help', 'comment', 'quoi', 'fonctionner'],
        responses: [
            "Voici ce que je peux faire ! 📋\n\n**🔍 Identifier un composant**\nEnvoie une photo avec le bouton 📷\n\n**💬 Répondre à tes questions**\nTape un mot-clé comme CPU, RAM, Linux...\n\n**🌱 Conseils éco**\nDemande-moi des tips pour un numérique durable !\n\n**⚡ Boutons rapides**\nClique sur les sujets en bas du chat pour aller plus vite !"
        ]
    }
};

/**
 * Base de données des composants pour la détection photo
 */
const COMPONENT_DATABASE = [
    {
        name: "Carte Graphique (GPU)",
        emoji: "🎮",
        colors: { r: 40, g: 40, b: 45 },
        keywords: ['gpu', 'graphique'],
        description: "Composant dédié au rendu graphique. Essentiel pour le gaming et le travail 3D.",
        confidence: 85
    },
    {
        name: "Processeur (CPU)",
        emoji: "⚙️",
        colors: { r: 180, g: 160, b: 100 },
        keywords: ['cpu', 'processeur'],
        description: "Le cerveau de l'ordinateur. Exécute toutes les instructions des programmes.",
        confidence: 82
    },
    {
        name: "Mémoire RAM",
        emoji: "🧬",
        colors: { r: 50, g: 130, b: 200 },
        keywords: ['ram', 'mémoire'],
        description: "Mémoire vive pour le stockage temporaire. Plus = plus de multitâche.",
        confidence: 80
    },
    {
        name: "Alimentation (PSU)",
        emoji: "🔌",
        colors: { r: 30, g: 30, b: 35 },
        keywords: ['psu', 'alimentation'],
        description: "Fournit l'énergie à tous les composants. Choisir une certification 80+ !",
        confidence: 78
    },
    {
        name: "Disque SSD/HDD",
        emoji: "💾",
        colors: { r: 70, g: 70, b: 80 },
        keywords: ['ssd', 'hdd', 'stockage'],
        description: "Stockage permanent des données. SSD = rapide, HDD = grande capacité.",
        confidence: 75
    },
    {
        name: "Carte Mère",
        emoji: "🖥️",
        colors: { r: 60, g: 100, b: 60 },
        keywords: ['carte mère', 'motherboard'],
        description: "Le squelette du PC. Connecte tous les composants entre eux.",
        confidence: 77
    },
    {
        name: "Ventirad / Watercooling",
        emoji: "❄️",
        colors: { r: 150, g: 150, b: 160 },
        keywords: ['cooler', 'ventilateur', 'watercooling'],
        description: "Refroidissement du CPU. Essentiel pour les performances et la longévité.",
        confidence: 73
    }
];

// ============================================
// ÉTAT DE L'APPLICATION
// ============================================

const ChatState = {
    messages: [],           // Historique des messages
    isTyping: false,        // Le bot est en train d'écrire ?
    cameraStream: null,     // Stream de la caméra
    facingMode: 'environment' // Caméra avant/arrière
};

// ============================================
// ÉLÉMENTS DOM
// ============================================

const DOM = {
    chatMessages: null,
    chatForm: null,
    userInput: null,
    sendBtn: null,
    photoUpload: null,
    cameraBtn: null,
    typingIndicator: null,
    quickActions: null,
    cameraModal: null,
    cameraVideo: null,
    cameraCanvas: null,
    captureBtn: null,
    switchCamera: null,
    cameraClose: null,
    cameraBackdrop: null,
    burgerBtn: null,
    navMenu: null,
    particlesCanvas: null
};

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initDOMReferences();
    initEventListeners();
    initNavigation();
    initParticles();
    
    console.log('🤖 PC Builder Bot initialisé !');
});

/**
 * Récupère les références DOM
 */
function initDOMReferences() {
    DOM.chatMessages = document.getElementById('chatMessages');
    DOM.chatForm = document.getElementById('chatForm');
    DOM.userInput = document.getElementById('userInput');
    DOM.sendBtn = document.getElementById('sendBtn');
    DOM.photoUpload = document.getElementById('photoUpload');
    DOM.cameraBtn = document.getElementById('cameraBtn');
    DOM.typingIndicator = document.getElementById('typingIndicator');
    DOM.quickActions = document.getElementById('quickActions');
    DOM.cameraModal = document.getElementById('cameraModal');
    DOM.cameraVideo = document.getElementById('cameraVideo');
    DOM.cameraCanvas = document.getElementById('cameraCanvas');
    DOM.captureBtn = document.getElementById('captureBtn');
    DOM.switchCamera = document.getElementById('switchCamera');
    DOM.cameraClose = document.getElementById('cameraClose');
    DOM.cameraBackdrop = document.getElementById('cameraBackdrop');
    DOM.burgerBtn = document.getElementById('burgerBtn');
    DOM.navMenu = document.getElementById('navMenu');
    DOM.particlesCanvas = document.getElementById('particlesCanvas');
}

/**
 * Initialise les écouteurs d'événements
 */
function initEventListeners() {
    // Formulaire de chat
    DOM.chatForm?.addEventListener('submit', handleSubmit);
    
    // Boutons rapides
    DOM.quickActions?.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-action');
        if (btn) {
            const query = btn.dataset.query;
            handleUserMessage(query);
        }
    });
    
    // Photo upload
    DOM.photoUpload?.addEventListener('change', handlePhotoUpload);
    
    // Caméra
    DOM.cameraBtn?.addEventListener('click', openCamera);
    DOM.captureBtn?.addEventListener('click', capturePhoto);
    DOM.switchCamera?.addEventListener('click', switchCameraFacing);
    DOM.cameraClose?.addEventListener('click', closeCamera);
    DOM.cameraBackdrop?.addEventListener('click', closeCamera);
    
    // Fermer modal avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.cameraModal?.classList.contains('is-open')) {
            closeCamera();
        }
    });
}

/**
 * Initialise la navigation mobile
 */
function initNavigation() {
    if (!DOM.burgerBtn || !DOM.navMenu) return;
    
    DOM.burgerBtn.addEventListener('click', () => {
        const isOpen = DOM.navMenu.classList.toggle('open');
        DOM.burgerBtn.classList.toggle('is-open');
        DOM.burgerBtn.setAttribute('aria-expanded', isOpen);
    });
    
    DOM.navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            DOM.navMenu.classList.remove('open');
            DOM.burgerBtn.classList.remove('is-open');
            DOM.burgerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// ============================================
// GESTION DES MESSAGES
// ============================================

/**
 * Gère la soumission du formulaire
 */
function handleSubmit(e) {
    e.preventDefault();
    const text = DOM.userInput.value.trim();
    if (!text) return;
    
    handleUserMessage(text);
    DOM.userInput.value = '';
}

/**
 * Traite un message utilisateur
 */
function handleUserMessage(text) {
    // Ajouter le message utilisateur
    addMessage(text, 'user');
    
    // Afficher l'indicateur de frappe
    showTyping();
    
    // Simuler un délai de réponse (comme une vraie API)
    const delay = 800 + Math.random() * 700;
    
    setTimeout(() => {
        hideTyping();
        const response = generateResponse(text);
        addMessage(response, 'bot');
    }, delay);
}

/**
 * Ajoute un message au chat
 */
function addMessage(content, type = 'bot', extra = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message chat-message--${type}`;
    
    const avatar = type === 'user' ? '👤' : '🤖';
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    let bubbleContent = content;
    
    // Convertir le markdown simple en HTML
    bubbleContent = bubbleContent
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    
    // Ajouter du contenu extra (image, détection...)
    if (extra) {
        bubbleContent += extra;
    }
    
    messageDiv.innerHTML = `
        <div class="chat-message__avatar">
            <span>${avatar}</span>
        </div>
        <div class="chat-message__content">
            <div class="chat-message__bubble">
                ${bubbleContent}
            </div>
            <span class="chat-message__time">${time}</span>
        </div>
    `;
    
    DOM.chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Sauvegarder dans l'état
    ChatState.messages.push({ content, type, time });
}

/**
 * Génère une réponse basée sur le texte
 */
function generateResponse(text) {
    const lowerText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Chercher une correspondance dans les réponses
    for (const [key, data] of Object.entries(BOT_RESPONSES)) {
        if (key === 'default') continue;
        
        for (const keyword of data.keywords) {
            if (lowerText.includes(keyword)) {
                return getRandomResponse(data.responses);
            }
        }
    }
    
    // Réponse par défaut
    return getRandomResponse(BOT_RESPONSES.default.responses);
}

/**
 * Retourne une réponse aléatoire d'un tableau
 */
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Affiche l'indicateur de frappe
 */
function showTyping() {
    ChatState.isTyping = true;
    DOM.typingIndicator?.classList.remove('is-hidden');
    scrollToBottom();
}

/**
 * Cache l'indicateur de frappe
 */
function hideTyping() {
    ChatState.isTyping = false;
    DOM.typingIndicator?.classList.add('is-hidden');
}

/**
 * Scroll vers le bas du chat
 */
function scrollToBottom() {
    if (DOM.chatMessages) {
        DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
    }
}

// ============================================
// DÉTECTION PHOTO
// ============================================

/**
 * Gère l'upload d'une photo
 */
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        processImage(event.target.result);
    };
    reader.readAsDataURL(file);
    
    // Reset l'input pour permettre de réuploader la même image
    e.target.value = '';
}

/**
 * Traite une image pour la détection
 */
function processImage(imageData) {
    // Ajouter le message avec l'image
    const imageHtml = `<br><img src="${imageData}" alt="Photo uploadée" style="max-width: 250px;">`;
    addMessage("📷 Voici ma photo de composant :", 'user', imageHtml);
    
    // Afficher le typing
    showTyping();
    
    // Analyser l'image
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);
        
        setTimeout(() => {
            hideTyping();
            const result = analyzeImage(ctx);
            displayDetectionResult(result);
        }, 1500);
    };
    img.src = imageData;
}

/**
 * Analyse les couleurs dominantes d'une image
 */
function analyzeImage(ctx) {
    const imageData = ctx.getImageData(0, 0, 100, 100);
    const data = imageData.data;
    
    let r = 0, g = 0, b = 0, count = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 128) { // Pixel visible
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
    }
    
    const avgColors = {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)
    };
    
    // Trouver le composant le plus proche
    let bestMatch = COMPONENT_DATABASE[0];
    let bestScore = Infinity;
    
    for (const component of COMPONENT_DATABASE) {
        const diff = Math.abs(component.colors.r - avgColors.r) +
                     Math.abs(component.colors.g - avgColors.g) +
                     Math.abs(component.colors.b - avgColors.b);
        
        if (diff < bestScore) {
            bestScore = diff;
            bestMatch = component;
        }
    }
    
    // Calculer la confiance (inverse de la différence de couleur)
    const confidence = Math.max(50, Math.min(95, 100 - (bestScore / 5) + Math.random() * 15));
    
    return {
        ...bestMatch,
        confidence: Math.round(confidence)
    };
}

/**
 * Affiche le résultat de la détection
 */
function displayDetectionResult(result) {
    const detectionHtml = `
        <p>🔍 <strong>Analyse terminée !</strong></p>
        <div class="detection-result">
            <div class="detection-result__header">
                <span class="detection-result__icon">${result.emoji}</span>
                <span class="detection-result__name">${result.name}</span>
            </div>
            <p class="detection-result__confidence">🎯 Confiance : ${result.confidence}%</p>
            <p class="detection-result__desc">${result.description}</p>
        </div>
        <p><br>Tu veux en savoir plus sur ce composant ? Tape son nom !</p>
    `;
    
    addMessage(detectionHtml, 'bot');
}

// ============================================
// GESTION DE LA CAMÉRA
// ============================================

/**
 * Ouvre la modal caméra
 */
async function openCamera() {
    DOM.cameraModal?.classList.add('is-open');
    
    try {
        ChatState.cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: ChatState.facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        if (DOM.cameraVideo) {
            DOM.cameraVideo.srcObject = ChatState.cameraStream;
        }
    } catch (err) {
        console.error('Erreur caméra:', err);
        closeCamera();
        addMessage("❌ **Caméra non disponible**\n\nUtilise le bouton 📷 pour uploader une photo depuis ta galerie.", 'bot');
    }
}

/**
 * Ferme la modal caméra
 */
function closeCamera() {
    // Arrêter le stream
    if (ChatState.cameraStream) {
        ChatState.cameraStream.getTracks().forEach(track => track.stop());
        ChatState.cameraStream = null;
    }
    
    DOM.cameraModal?.classList.remove('is-open');
}

/**
 * Capture une photo depuis la caméra
 */
function capturePhoto() {
    if (!DOM.cameraVideo || !DOM.cameraCanvas) return;
    
    const ctx = DOM.cameraCanvas.getContext('2d');
    DOM.cameraCanvas.width = DOM.cameraVideo.videoWidth;
    DOM.cameraCanvas.height = DOM.cameraVideo.videoHeight;
    ctx.drawImage(DOM.cameraVideo, 0, 0);
    
    const imageData = DOM.cameraCanvas.toDataURL('image/jpeg', 0.8);
    closeCamera();
    processImage(imageData);
}

/**
 * Change de caméra (avant/arrière)
 */
function switchCameraFacing() {
    ChatState.facingMode = ChatState.facingMode === 'environment' ? 'user' : 'environment';
    
    // Fermer et réouvrir avec la nouvelle caméra
    if (ChatState.cameraStream) {
        ChatState.cameraStream.getTracks().forEach(track => track.stop());
    }
    openCamera();
}

// ============================================
// PARTICULES (Animation de fond)
// ============================================

function initParticles() {
    const canvas = DOM.particlesCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    };
    
    const createParticles = () => {
        const count = Math.min(60, Math.floor((width * height) / 30000));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5
        }));
    };
    
    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, 'rgba(165, 180, 252, 0.7)');
            gradient.addColorStop(1, 'rgba(165, 180, 252, 0)');
            
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Lignes entre particules proches
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < 100) {
                    const alpha = (1 - dist / 100) * 0.2;
                    ctx.strokeStyle = `rgba(94, 234, 212, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(draw);
    };
    
    window.addEventListener('resize', resize);
    resize();
    draw();
}

// ============================================
// API INTEGRATION (PRÉPARÉ POUR LE FUTUR)
// ============================================

/**
 * Point d'entrée pour connecter une vraie API IA
 * Décommentez et modifiez cette fonction pour utiliser une API externe
 */
/*
async function sendToAPI(message) {
    const API_URL = 'https://your-api-endpoint.com/chat';
    const API_KEY = 'your-api-key';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                message: message,
                context: ChatState.messages.slice(-5) // Envoyer les 5 derniers messages comme contexte
            })
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        return data.response;
        
    } catch (error) {
        console.error('Erreur API:', error);
        return "Désolé, je rencontre un problème technique. Réessaie dans quelques instants !";
    }
}
*/

// Pour activer l'API, remplacez dans handleUserMessage :
// const response = generateResponse(text);
// par :
// const response = await sendToAPI(text);
