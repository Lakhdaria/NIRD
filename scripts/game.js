import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ============================================
// NOTIFICATION MANAGER
// ============================================

class NotificationManager {
    constructor() {
        this.container = document.getElementById('notificationsContainer');
        this.notifications = [];
        this.notificationId = 0;
    }

    show({ type = 'info', message, detail = '', icon = '', duration = 3000 }) {
        const id = this.notificationId++;
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.dataset.id = id;
        
        const defaultIcons = {
            success: '✅',
            info: 'ℹ️',
            warning: '⚠️',
            celebration: '🎉'
        };
        
        const displayIcon = icon || defaultIcons[type] || '📢';
        
        notification.innerHTML = `
            <div class="notification__icon">${displayIcon}</div>
            <div class="notification__content">
                <p class="notification__message">${message}</p>
                ${detail ? `<p class="notification__detail">${detail}</p>` : ''}
            </div>
            ${duration > 0 ? `<div class="notification__progress" style="--duration: ${duration}ms"></div>` : ''}
        `;
        
        this.container.appendChild(notification);
        this.notifications.push({ id, element: notification });
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        if (duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }
        
        return id;
    }

    hide(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (!notif) return;
        
        notif.element.classList.remove('show');
        notif.element.classList.add('hide');
        
        setTimeout(() => {
            if (notif.element.parentNode) {
                notif.element.remove();
            }
            this.notifications = this.notifications.filter(n => n.id !== id);
        }, 400);
    }

    partInstalled(partName, healthGain) {
        const partLabels = {
            cpu: 'Processeur',
            ram: 'Mémoire RAM',
            gpu: 'Carte Graphique'
        };
        
        const icons = {
            cpu: '🔲',
            ram: '💾',
            gpu: '🎮'
        };
        
        this.show({
            type: 'success',
            message: `${partLabels[partName]} installé !`,
            detail: `Le PC a gagné +${healthGain}% de vie 💚`,
            icon: icons[partName],
            duration: 3000
        });
    }

    allPartsComplete() {
        this.show({
            type: 'celebration',
            message: '🎉 Bravo, vous avez réparé le PC !',
            detail: 'Installons Linux maintenant !',
            icon: '🎉',
            duration: 4000
        });
    }

    correctAnswer(healthGain) {
        this.show({
            type: 'success',
            message: 'Bonne réponse !',
            detail: `+${healthGain}% de santé`,
            icon: '✅',
            duration: 2000
        });
    }

    gameComplete() {
        this.show({
            type: 'celebration',
            message: '🎊 PC complètement réparé !',
            detail: 'Linux est installé et votre PC a une nouvelle vie !',
            icon: '🐧',
            duration: 5000
        });
    }

    clearAll() {
        this.notifications.forEach(n => this.hide(n.id));
    }
}

const NotificationMgr = new NotificationManager();

// ============================================
// CONFIGURATION DU JEU
// ============================================

const GAME_CONFIG = {
    health: {
        cpu: 16.67,
        ram: 16.67,
        gpu: 16.67,
        quizPerQuestion: 10
    }
};

// ============================================
// SYSTÈME DE FOCUS CAMÉRA
// ============================================

const CameraFocusSystem = {
    // Points de focus pour chaque composant (coordonnées relatives au modèle)
    // Ces valeurs seront ajustées après analyse du modèle
    focusPoints: {
        cpu: {
            position: new THREE.Vector3(0, 0.35, 0.1),  // Zone CPU (carte mère, centre-haut)
            distance: 1.2,
            duration: 1200
        },
        ram: {
            position: new THREE.Vector3(0.15, 0.4, 0.05),  // Zone RAM (slots à droite du CPU)
            distance: 1.3,
            duration: 1200
        },
        gpu: {
            position: new THREE.Vector3(0, 0.15, 0.15),  // Zone GPU (slots PCIe, bas)
            distance: 1.5,
            duration: 1200
        },
        overview: {
            position: new THREE.Vector3(0, 0.25, 0),  // Vue générale
            distance: 2.5,
            duration: 1500
        }
    },
    
    // État de l'animation
    isAnimating: false,
    animationProgress: 0,
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    startDistance: 0,
    endDistance: 0,
    animationDuration: 1000,
    animationStartTime: 0,
    
    // Callback après animation
    onComplete: null,
    
    // Référence aux contrôles
    controls: null,
    camera: null,
    
    // Initialiser avec les contrôles
    init(controls, camera) {
        this.controls = controls;
        this.camera = camera;
    },
    
    // Analyser le modèle pour trouver les points de focus
    analyzeModel(model) {
        console.log("🔍 Analyse du modèle 3D...");
        const foundParts = {};
        
        model.traverse((child) => {
            const name = child.name.toLowerCase();
            console.log(`  📦 Nœud: "${child.name}" (type: ${child.type})`);
            
            // Recherche par nom
            if (name.includes('cpu') || name.includes('processor')) {
                foundParts.cpu = child;
            } else if (name.includes('ram') || name.includes('memory') || name.includes('dimm')) {
                foundParts.ram = child;
            } else if (name.includes('gpu') || name.includes('graphic') || name.includes('video') || name.includes('pcie')) {
                foundParts.gpu = child;
            }
        });
        
        // Mettre à jour les points de focus si on a trouvé des parties
        for (const [part, mesh] of Object.entries(foundParts)) {
            if (mesh) {
                const box = new THREE.Box3().setFromObject(mesh);
                const center = box.getCenter(new THREE.Vector3());
                this.focusPoints[part].position.copy(center);
                console.log(`  ✅ ${part.toUpperCase()} trouvé à:`, center);
            }
        }
        
        // Calculer le centre global pour l'overview
        const globalBox = new THREE.Box3().setFromObject(model);
        const globalCenter = globalBox.getCenter(new THREE.Vector3());
        this.focusPoints.overview.position.copy(globalCenter);
        
        console.log("✅ Analyse terminée. Points de focus:", this.focusPoints);
        return foundParts;
    },
    
    // Focus sur une partie
    focusOnPart(partName, callback = null) {
        if (!this.controls || !this.camera) {
            console.warn("CameraFocusSystem non initialisé");
            return;
        }
        
        const focusPoint = this.focusPoints[partName];
        if (!focusPoint) {
            console.warn(`Point de focus inconnu: ${partName}`);
            return;
        }
        
        // Stocker l'état initial
        this.startTarget.copy(this.controls.target);
        this.endTarget.copy(focusPoint.position);
        
        // Calculer la distance actuelle
        this.startDistance = this.camera.position.distanceTo(this.controls.target);
        this.endDistance = focusPoint.distance;
        
        // Configurer l'animation
        this.animationDuration = focusPoint.duration;
        this.animationStartTime = performance.now();
        this.isAnimating = true;
        this.onComplete = callback;
        
        // Désactiver l'auto-rotate pendant l'animation
        this.controls.autoRotate = false;
        
        console.log(`🎥 Focus sur ${partName}...`);
    },
    
    // Fonction d'easing (ease-in-out)
    easeInOutCubic(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
    
    // Mettre à jour l'animation (appelé dans la boucle render)
    update() {
        if (!this.isAnimating) return;
        
        const elapsed = performance.now() - this.animationStartTime;
        const rawProgress = Math.min(elapsed / this.animationDuration, 1);
        const progress = this.easeInOutCubic(rawProgress);
        
        // Interpoler le target
        this.controls.target.lerpVectors(this.startTarget, this.endTarget, progress);
        
        // Interpoler la distance (en conservant la direction)
        const direction = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
        const currentDistance = THREE.MathUtils.lerp(this.startDistance, this.endDistance, progress);
        this.camera.position.copy(this.controls.target).add(direction.multiplyScalar(currentDistance));
        
        // Fin de l'animation
        if (rawProgress >= 1) {
            this.isAnimating = false;
            
            // Callback
            if (this.onComplete) {
                this.onComplete();
                this.onComplete = null;
            }
            
            console.log("✅ Animation de focus terminée");
        }
    },
    
    // Retour à la vue générale
    returnToOverview(delay = 2000) {
        setTimeout(() => {
            this.focusOnPart('overview', () => {
                // Réactiver l'auto-rotate après retour
                this.controls.autoRotate = true;
            });
        }, delay);
    }
};

// Informations pédagogiques sur les composants
const COMPONENTS_INFO = {
    cpu: {
        name: "Processeur (CPU)",
        role: "Le cerveau de l'ordinateur qui effectue tous les calculs",
        durability: "Un CPU peut durer 10-15 ans facilement. Le changer prolonge la vie de votre PC sans avoir à tout racheter.",
        ecology: "Réutiliser un CPU évite l'extraction de métaux rares et réduit les déchets électroniques."
    },
    ram: {
        name: "Mémoire RAM",
        role: "Stocke temporairement les données utilisées par vos programmes en cours",
        durability: "Ajouter de la RAM peut transformer un PC lent en machine rapide. C'est l'upgrade le plus efficace !",
        ecology: "Recycler la RAM réduit la demande en silicium et en énergie de production."
    },
    gpu: {
        name: "Carte Graphique (GPU)",
        role: "Gère l'affichage et accélère les calculs graphiques",
        durability: "Même une vieille carte graphique peut être utile pour du multimédia ou un second écran.",
        ecology: "Les GPU nécessitent beaucoup de ressources à produire. Les réutiliser a un impact écologique majeur."
    }
};

// Questions du QCM Linux
const QUIZ_QUESTIONS = [
    {
        question: "Quel est le principal avantage de Linux pour un vieux PC ?",
        options: [
            "Il est plus lourd que Windows",
            "Il nécessite beaucoup de RAM",
            "Il est léger et performant sur du matériel ancien",
            "Il coûte très cher"
        ],
        correct: 2,
        explanation: "Linux propose des distributions légères comme Xubuntu ou Lubuntu, parfaites pour redonner vie à d'anciens ordinateurs !"
    },
    {
        question: "Quelle distribution Linux est recommandée pour les débutants ?",
        options: [
            "Arch Linux",
            "Ubuntu ou Linux Mint",
            "Gentoo",
            "Linux From Scratch"
        ],
        correct: 1,
        explanation: "Ubuntu et Linux Mint sont conçues pour être accessibles aux débutants avec une interface intuitive et une grande communauté d'entraide."
    },
    {
        question: "Linux est-il gratuit ?",
        options: [
            "Non, il faut payer une licence",
            "Oui, Linux est libre et gratuit",
            "Oui mais uniquement pour les étudiants",
            "Non, il faut s'abonner"
        ],
        correct: 1,
        explanation: "Linux est un logiciel libre : gratuit, modifiable et partageable. C'est l'un de ses grands avantages !"
    },
    {
        question: "Combien de RAM minimum faut-il pour faire tourner une distribution Linux légère ?",
        options: [
            "16 GB minimum",
            "8 GB minimum",
            "2 GB peuvent suffire",
            "32 GB minimum"
        ],
        correct: 2,
        explanation: "Des distributions comme Lubuntu ou Puppy Linux peuvent fonctionner avec seulement 1-2 GB de RAM, idéal pour recycler de vieux PC !"
    },
    {
        question: "Pourquoi installer Linux sur un ancien PC est écologique ?",
        options: [
            "Ça consomme plus d'électricité",
            "Ça évite d'acheter un PC neuf et réduit les déchets électroniques",
            "Ça pollue plus",
            "Ça ne change rien"
        ],
        correct: 1,
        explanation: "En prolongeant la vie d'un ordinateur, on évite la production d'un nouveau PC (extraction de ressources, fabrication, transport) et on réduit les déchets électroniques !"
    }
];

// ============================================
// ÉTAT DU JEU
// ============================================

const gameState = {
    health: 0,
    partsInstalled: {
        cpu: false,
        ram: false,
        gpu: false
    },
    quizAnswers: 0,
    quizTotal: QUIZ_QUESTIONS.length,
    quizReady: false
};

// ============================================
// ÉLÉMENTS DOM
// ============================================

const canvas = document.getElementById("gameCanvas");
const healthBarFill = document.getElementById("healthBarFill");
const healthPercentage = document.getElementById("healthPercentage");
const healthStatus = document.getElementById("healthStatus");
const heartIcon = document.getElementById("heartIcon");
const cpuCard = document.getElementById("cpuCard");
const ramCard = document.getElementById("ramCard");
const gpuCard = document.getElementById("gpuCard");
const quizModal = document.getElementById("quizModal");
const quizContainer = document.getElementById("quizContainer");
const quizResults = document.getElementById("quizResults");
const quizCta = document.getElementById("quizCta");
const startQuizBtn = document.getElementById("startQuizBtn");
const infoPanel = document.getElementById("infoPanel");
const infoPanelContent = document.getElementById("infoPanelContent");
const infoPanelClose = document.getElementById("infoPanelClose");

// ============================================
// CONFIGURATION THREE.JS
// ============================================

let scene, camera, renderer, controls;
let pcModel;
let isDragging = false;
let draggedPart = null;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

function initThreeJS() {
    // Scène
    scene = new THREE.Scene();
    scene.background = null; // Transparent pour voir le fond CSS

    // Caméra
    const rect = canvas.getBoundingClientRect();
    camera = new THREE.PerspectiveCamera(
        50,
        rect.width / rect.height,
        0.1,
        100
    );
    camera.position.set(2, 1.5, 2);

    // Renderer OPTIMISÉ
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(rect.width, rect.height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = false;

    // ÉCLAIRAGE
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1b1f3a, 0.7);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(3, 5, 2);
    scene.add(keyLight);
    
    // Lumière de rim pour mieux voir les détails
    const rimLight = new THREE.DirectionalLight(0x79c0ff, 0.3);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enablePan = false;
    controls.minDistance = 1.0;
    controls.maxDistance = 4;
    controls.maxPolarAngle = Math.PI / 1.6;
    
    // Initialiser le système de focus avec les contrôles
    CameraFocusSystem.init(controls, camera);

    // Charger les modèles
    loadModels();

    // Gestion du resize
    window.addEventListener("resize", handleResize);

    // Animation loop
    animate();
}

// Libère le modèle et le renderer pour économiser mémoire/GPU
function disposeThree() {
    if (pcModel) {
        scene.remove(pcModel);
        pcModel.traverse((child) => {
            if (child.isMesh) {
                child.geometry?.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((m) => m?.dispose?.());
                    } else {
                        child.material.dispose?.();
                    }
                }
            }
        });
        pcModel = null;
    }
    renderer?.dispose();
}

// ============================================
// CHARGEMENT DES MODÈLES 3D
// ============================================

function loadModels() {
    const loader = new GLTFLoader();

    // Fonction helper pour optimiser les modèles
    function optimizeModel(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                if (child.material) {
                    child.material.needsUpdate = false;
                }
            }
        });
    }

    // Charger le modèle PC
    loader.load(
        "assets/models/dream_computer_setup.glb",
        (gltf) => {
            pcModel = gltf.scene;
            pcModel.scale.set(0.090, 0.090, 0.090);
            pcModel.position.set(0, 0, 0);
            
            // Optimiser le modèle
            optimizeModel(pcModel);

            scene.add(pcModel);

            // Analyser le modèle pour trouver les points de focus
            CameraFocusSystem.analyzeModel(pcModel);

            // Centrer la caméra sur le modèle
            const box = new THREE.Box3().setFromObject(pcModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            controls.target.copy(center);
            
            // Ajuster les points de focus selon la taille du modèle
            const modelHeight = size.y;
            CameraFocusSystem.focusPoints.cpu.position.set(center.x, center.y + modelHeight * 0.15, center.z + 0.1);
            CameraFocusSystem.focusPoints.ram.position.set(center.x + 0.1, center.y + modelHeight * 0.2, center.z + 0.05);
            CameraFocusSystem.focusPoints.gpu.position.set(center.x, center.y - modelHeight * 0.1, center.z + 0.15);
            CameraFocusSystem.focusPoints.overview.position.copy(center);
            
            console.log("✅ Modèle PC chargé et analysé");
            console.log("📐 Taille du modèle:", size);
        },
        (progress) => {
            const percent = (progress.loaded / progress.total * 100).toFixed(0);
            console.log(`⏳ Chargement: ${percent}%`);
        },
        (err) => console.error("❌ Erreur chargement modèle:", err)
    );
}

// ============================================
// DRAG & DROP
// ============================================

function setupDragAndDrop() {
    // Empêcher le comportement par défaut
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        handleDrop(e);
    });

    // Setup pour les cartes de pièces (CPU, RAM, GPU)
    [cpuCard, ramCard, gpuCard].forEach(card => {
        card.addEventListener('dragstart', (e) => {
            const partType = e.target.dataset.part;
            e.dataTransfer.setData('text/plain', partType);
            e.target.style.opacity = '0.5';
        });

        card.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });
    });
}

function handleDrop(event) {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouse.set(x, y);
    raycaster.setFromCamera(mouse, camera);

    const partType = event.dataTransfer.getData('text/plain');
    
    if (!partType || gameState.partsInstalled[partType]) {
        return;
    }

    // Vérifier l'intersection avec le PC
    if (pcModel) {
        const intersects = raycaster.intersectObject(pcModel, true);
        
        if (intersects.length > 0) {
            installPart(partType, intersects[0].point);
        }
    }
}

function installPart(partType, position) {
    if (gameState.partsInstalled[partType]) return;

    let card, healthGain;

    if (partType === 'cpu') {
        card = cpuCard;
        healthGain = GAME_CONFIG.health.cpu;
    } else if (partType === 'ram') {
        card = ramCard;
        healthGain = GAME_CONFIG.health.ram;
    } else if (partType === 'gpu') {
        card = gpuCard;
        healthGain = GAME_CONFIG.health.gpu;
    }

    if (!card) return;

    // Marquer comme installé
    gameState.partsInstalled[partType] = true;
    card.classList.add('installed');
    card.draggable = false;
    card.querySelector('.part-status').textContent = '✓ Installé';

    // Augmenter la santé
    updateHealth(Math.round(healthGain * 100) / 100);

    // Afficher la notification
    NotificationMgr.partInstalled(partType, Math.round(healthGain));

    // Feedback sonore
    playInstallSound();
    
    // 🎥 FOCUS CAMÉRA sur la zone du composant
    CameraFocusSystem.focusOnPart(partType, () => {
        // Après le focus, retourner à la vue générale
        CameraFocusSystem.returnToOverview(1500);
    });

    // Vérifier si TOUTES les pièces sont installées
    const allInstalled = gameState.partsInstalled.cpu && 
                         gameState.partsInstalled.ram && 
                         gameState.partsInstalled.gpu;
    
    if (allInstalled) {
        setTimeout(() => {
            NotificationMgr.allPartsComplete();
            gameState.quizReady = true;
            if (quizCta) {
                quizCta.classList.remove('is-hidden');
                quizCta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 2500); // Un peu plus de temps pour l'animation de focus
    }
}

function animateScale(object, targetScale, duration) {
    const startScale = { ...object.scale };
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutElastic(progress);

        object.scale.set(
            startScale.x + (targetScale.x - startScale.x) * eased,
            startScale.y + (targetScale.y - startScale.y) * eased,
            startScale.z + (targetScale.z - startScale.z) * eased
        );

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    update();
}

function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function playInstallSound() {
    // Créer un son simple avec Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// ============================================
// SYSTÈME DE FICHES D'INFORMATIONS
// ============================================

function showComponentInfo(componentType) {
    const info = COMPONENTS_INFO[componentType];
    if (!info) return;

    // Générer le contenu de la fiche
    infoPanelContent.innerHTML = `
        <div class="info-header">
            <div class="info-icon">${componentType === 'cpu' ? '🔲' : componentType === 'ram' ? '💾' : '🎮'}</div>
            <h3 class="info-title">${info.name}</h3>
        </div>
        <div class="info-section">
            <h4 class="info-section-title">Rôle</h4>
            <p>${info.role}</p>
        </div>
        <div class="info-section">
            <h4 class="info-section-title">Longévité</h4>
            <p>${info.durability}</p>
        </div>
        <div class="info-section">
            <h4 class="info-section-title">Écologie</h4>
            <p>${info.ecology}</p>
        </div>
    `;

    // Afficher le panneau
    infoPanel.classList.add('active');
}

function hideComponentInfo() {
    infoPanel.classList.remove('active');
}

// Setup des événements pour les boutons d'info
function setupInfoButtons() {
    // Ajouter les événements sur les icônes d'info
    document.querySelectorAll('.part-info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêcher le drag
            const partType = btn.dataset.part;
            showComponentInfo(partType);
        });
    });

    // Fermer le panneau
    if (infoPanelClose) {
        infoPanelClose.addEventListener('click', hideComponentInfo);
    }

    // Fermer en cliquant en dehors
    if (infoPanel) {
        infoPanel.addEventListener('click', (e) => {
            if (e.target === infoPanel) {
                hideComponentInfo();
            }
        });
    }
}

// ============================================
// GESTION DE LA SANTÉ
// ============================================

function updateHealth(amount) {
    gameState.health = Math.min(gameState.health + amount, 100)
    const displayHealth = Math.round(gameState.health)
    
    // Animer la barre
    healthBarFill.style.width = `${displayHealth}%`
    healthPercentage.textContent = `${displayHealth}%`

    // Animer le c?ur
    if (displayHealth > 0) {
        heartIcon.classList.add('active')
    }

    // Mettre ? jour le status
    if (displayHealth === 0) {
        healthStatus.textContent = "Le PC attend d'être réparé..."
    } else if (displayHealth < 50) {
        healthStatus.textContent = "Le PC reprend vie ! Continuez..."
    } else if (displayHealth < 100) {
        healthStatus.textContent = "Excellent progrès ! Presque terminé..."
    } else {
        healthStatus.textContent = "PC complètement réparé et fonctionnel !"
        heartIcon.classList.remove('active')
    }
}

// ============================================
// SYSTÈME DE QCM
// ============================================

function showQuiz() {
    if (!gameState.quizReady) return;
    if (quizCta) quizCta.classList.add('is-hidden');
    // Masquer les instructions
    const instructions = document.getElementById('gameInstructions');
    if (instructions) {
        instructions.style.display = 'none';
    }

    // Afficher le modal
    quizModal.classList.add('active');
    controls.autoRotate = false;

    // Générer les questions
    renderQuizQuestions();
}

function renderQuizQuestions() {
    quizContainer.innerHTML = '';

    QUIZ_QUESTIONS.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <div class="question-number">Question ${index + 1}/${QUIZ_QUESTIONS.length}</div>
            <div class="question-text">${q.question}</div>
            <div class="quiz-options" data-question="${index}">
                ${q.options.map((option, optIndex) => `
                    <div class="quiz-option" data-option="${optIndex}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;

        quizContainer.appendChild(questionDiv);

        // Ajouter les event listeners
        const optionsContainer = questionDiv.querySelector('.quiz-options');
        optionsContainer.querySelectorAll('.quiz-option').forEach(optionEl => {
            optionEl.addEventListener('click', () => handleQuizAnswer(index, parseInt(optionEl.dataset.option), optionsContainer));
        });
    });
}

function handleQuizAnswer(questionIndex, selectedOption, optionsContainer) {
    const question = QUIZ_QUESTIONS[questionIndex];
    const isCorrect = selectedOption === question.correct;

    // Désactiver toutes les options
    const allOptions = optionsContainer.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
        opt.classList.add('disabled');
        const optIndex = parseInt(opt.dataset.option);
        
        if (optIndex === question.correct) {
            opt.classList.add('correct');
        } else if (optIndex === selectedOption && !isCorrect) {
            opt.classList.add('wrong');
        }
    });

    // Afficher l'explication
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `option-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackDiv.innerHTML = `
        <strong>${isCorrect ? '✓ Correct !' : '✗ Pas tout à fait...'}</strong><br>
        ${question.explanation}
    `;
    optionsContainer.appendChild(feedbackDiv);

    // Mettre à jour le score
    if (isCorrect) {
        gameState.quizAnswers++;
        updateHealth(GAME_CONFIG.health.quizPerQuestion);
        
        // Notification pour bonne réponse
        NotificationMgr.correctAnswer(GAME_CONFIG.health.quizPerQuestion);
    }

    // Vérifier si c'est la dernière question
    if (questionIndex === QUIZ_QUESTIONS.length - 1) {
        setTimeout(() => {
            showResults();
        }, 2000);
    }
}

function showResults() {
    quizContainer.style.display = 'none';
    quizResults.style.display = 'block';

    document.getElementById('finalScore').textContent = `${Math.round(gameState.health)}%`;
    document.getElementById('correctAnswers').textContent = `${gameState.quizAnswers}/${gameState.quizTotal}`;
    
    // Notification de succès final
    if (gameState.health >= 100) {
        setTimeout(() => {
            NotificationMgr.gameComplete();
        }, 500);
    }
}

// ============================================
// ANIMATION LOOP
// ============================================

let lastFrameTime = Date.now();
const targetFPS = 60; // 60 FPS pour animations fluides
const frameInterval = 1000 / targetFPS;

function animate() {
    requestAnimationFrame(animate);
    
    const now = Date.now();
    const elapsed = now - lastFrameTime;
    
    if (elapsed > frameInterval) {
        lastFrameTime = now - (elapsed % frameInterval);
        
        // Update du système de focus caméra (animations)
        CameraFocusSystem.update();
        
        // Update controls (avec damping)
        controls.update();
        
        // Render
        renderer.render(scene, camera);
    }
}

function handleResize() {
    const rect = canvas.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);
}

// ============================================
// PARTICULES (repris du script d'origine)
// ============================================

function initParticles() {
    const particlesCanvas = document.getElementById("particlesCanvas");
    if (!particlesCanvas) return;

    const ctx = particlesCanvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];

    const resetParticles = () => {
        const count = Math.min(100, Math.floor((width * height) / 20000));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5
        }));
    };

    const resizeParticles = () => {
        width = particlesCanvas.width = window.innerWidth;
        height = particlesCanvas.height = window.innerHeight;
        resetParticles();
    };

    const drawParticles = () => {
        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, 'rgba(165, 180, 252, 0.8)');
            gradient.addColorStop(1, 'rgba(165, 180, 252, 0)');

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const alpha = (1 - dist / 150) * 0.3;
                    ctx.strokeStyle = `rgba(94, 234, 212, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        drawParticles();
        requestAnimationFrame(animateParticles);
    };

    window.addEventListener("resize", resizeParticles);
    resizeParticles();
    animateParticles();
}

// ============================================
// MENU BURGER
// ============================================

function initBurgerMenu() {
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
}

// ============================================
// REVEAL ON SCROLL
// ============================================

function initRevealOnScroll() {
    const revealEls = document.querySelectorAll(".reveal");

    const handleReveal = () => {
        const threshold = window.innerHeight * 0.85;

        revealEls.forEach((el, index) => {
            const top = el.getBoundingClientRect().top;
            if (top < threshold && !el.classList.contains('visible')) {
                setTimeout(() => {
                    el.classList.add("visible");
                }, index * 100);
            }
        });
    };

    window.addEventListener("scroll", handleReveal);
    handleReveal();
}

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 Initialisation du jeu de réparation NIRD v2.2...");
    
    initThreeJS();
    setupDragAndDrop();
    setupInfoButtons(); // Nouveau : fiches d'info
    initParticles();
    initBurgerMenu();
    initRevealOnScroll();

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            showQuiz();
        });
    }

    console.log("✅ Jeu prêt (optimisé + GPU + fiches info) !");
});
