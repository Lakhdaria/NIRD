// ================================================
// NIRD - Simulateur d'Installation Linux
// State Machine & Animations
// ================================================

// ============================================
// ÉTAT DU SIMULATEUR
// ============================================

const SimulatorState = {
    currentStep: 1,
    selectedDistro: null,
    selectedPartition: null,
    userData: {
        username: '',
        password: '',
        hostname: ''
    }
};

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🐧 Simulateur Linux initialisé');
    
    initStep1(); // Choix distribution
    initStep2(); // Vérification config
    initStep3(); // Partitionnement
    initStep4(); // Utilisateur
    initBurgerMenu();
    initParticles();
});

// ============================================
// NAVIGATION ENTRE ÉTAPES
// ============================================

function goToStep(stepNumber) {
    // Masquer toutes les étapes
    document.querySelectorAll('.simulator-step').forEach(step => {
        step.classList.remove('active');
    });

    // Afficher la nouvelle étape
    const newStep = document.getElementById(`step${stepNumber}`);
    if (newStep) {
        newStep.classList.add('active');
    }

    // Mettre à jour la progression
    updateProgress(stepNumber);
    SimulatorState.currentStep = stepNumber;

    // Scroll en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Démarrer l'animation spécifique de l'étape
    if (stepNumber === 5) {
        startInstallation();
    } else if (stepNumber === 6) {
        startBoot();
    }
}

function updateProgress(stepNumber) {
    const progress = (stepNumber / 6) * 100;
    document.getElementById('globalProgress').style.width = `${progress}%`;

    // Mettre à jour les steps indicators
    document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
}

// ============================================
// ÉTAPE 1 : CHOIX DE LA DISTRIBUTION
// ============================================

function initStep1() {
    const distroCards = document.querySelectorAll('.distro-card');
    const continueBtn = document.getElementById('continueStep1');
    const distroNameSpan = document.getElementById('selectedDistroName');

    distroCards.forEach(card => {
        card.addEventListener('click', () => {
            // Désélectionner toutes les cartes
            distroCards.forEach(c => c.classList.remove('selected'));
            
            // Sélectionner cette carte
            card.classList.add('selected');
            
            // Sauvegarder le choix
            const distro = card.dataset.distro;
            SimulatorState.selectedDistro = distro;
            
            // Afficher le nom
            const distroNames = {
                'ubuntu': 'Ubuntu',
                'mint': 'Linux NIRD',
                'debian': 'Debian'
            };
            distroNameSpan.textContent = distroNames[distro];
            
            // Afficher le bouton continuer
            continueBtn.style.display = 'block';
            continueBtn.style.animation = 'fadeIn 0.5s ease-out';
        });
    });

    continueBtn.addEventListener('click', () => {
        goToStep(2);
    });
}

// ============================================
// ÉTAPE 2 : VÉRIFICATION CONFIG
// ============================================

function initStep2() {
    const startCheckBtn = document.getElementById('startCheck');
    const continueBtn = document.getElementById('continueStep2');

    startCheckBtn.addEventListener('click', () => {
        startCheckBtn.style.display = 'none';
        runConfigCheck();
    });

    continueBtn.addEventListener('click', () => {
        goToStep(3);
    });
}

function runConfigCheck() {
    const terminal = document.getElementById('terminalOutput');
    const continueBtn = document.getElementById('continueStep2');
    
    // Vider le terminal (garder seulement le prompt)
    const prompt = terminal.querySelector('.terminal-prompt');
    terminal.innerHTML = '';
    if (prompt) {
        terminal.appendChild(prompt);
    }
    
    const checks = [
        { text: 'Vérification du processeur...', delay: 500 },
        { text: '✓ CPU: Intel Core i5-7200U @ 2.5GHz - Compatible', delay: 1000, success: true },
        { text: 'Vérification de la mémoire RAM...', delay: 1500 },
        { text: '✓ RAM: 8 GB DDR4 - Largement suffisant', delay: 2000, success: true },
        { text: 'Vérification du disque dur...', delay: 2500 },
        { text: '✓ Disque: 256 GB SSD - Parfait pour Linux', delay: 3000, success: true },
        { text: 'Vérification de la carte graphique...', delay: 3500 },
        { text: '✓ GPU: Intel HD Graphics 620 - Compatible', delay: 4000, success: true },
        { text: '', delay: 4300 },
        { text: '🎉 Tous les composants sont compatibles avec Linux !', delay: 4500, success: true }
    ];

    checks.forEach((check, index) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            if (check.success) {
                line.classList.add('success');
            }
            
            typeWriter(line, check.text, () => {
                // Si c'est la dernière ligne, afficher le bouton
                if (index === checks.length - 1) {
                    setTimeout(() => {
                        continueBtn.style.display = 'block';
                        continueBtn.style.animation = 'fadeIn 0.5s ease-out';
                    }, 500);
                }
            });
            
            terminal.appendChild(line);
        }, check.delay);
    });
}

function typeWriter(element, text, callback) {
    // Si le texte est vide, juste appeler le callback
    if (!text || text.length === 0) {
        if (callback) callback();
        return;
    }
    
    let index = 0;
    const speed = 20; // ms par caractère

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }

    type();
}

// ============================================
// ÉTAPE 3 : PARTITIONNEMENT
// ============================================

function initStep3() {
    const optionCards = document.querySelectorAll('.option-card');
    const continueBtn = document.getElementById('continueStep3');
    const diskBar = document.getElementById('diskBar');

    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Désélectionner toutes les options
            optionCards.forEach(c => c.classList.remove('selected'));
            
            // Sélectionner cette option
            card.classList.add('selected');
            
            // Sauvegarder le choix
            const option = card.dataset.option;
            SimulatorState.selectedPartition = option;
            
            // Animer le disque
            animateDiskPartition(option);
            
            // Afficher le bouton continuer
            setTimeout(() => {
                continueBtn.style.display = 'block';
                continueBtn.style.animation = 'fadeIn 0.5s ease-out';
            }, 1000);
        });
    });

    continueBtn.addEventListener('click', () => {
        goToStep(4);
    });
}

function animateDiskPartition(option) {
    const diskBar = document.getElementById('diskBar');
    
    if (option === 'erase') {
        // Effacer Windows et tout donner à Linux
        diskBar.innerHTML = `
            <div class="disk-segment linux" style="width: 100%;">
                <span>Linux (100 GB)</span>
            </div>
        `;
    } else if (option === 'alongside') {
        // Partitionner : Windows + Linux
        diskBar.innerHTML = `
            <div class="disk-segment windows" style="width: 50%;">
                <span>Windows (50 GB)</span>
            </div>
            <div class="disk-segment linux" style="width: 50%;">
                <span>Linux (50 GB)</span>
            </div>
        `;
    }
}

// ============================================
// ÉTAPE 4 : CRÉATION UTILISATEUR
// ============================================

function initStep4() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const hostnameInput = document.getElementById('hostname');
    const continueBtn = document.getElementById('continueStep4');
    const avatar = document.getElementById('linuxAvatar');
    const avatarMood = document.getElementById('avatarMood');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    // Fonction de validation du formulaire - appelée à chaque modification
    function checkFormValidity() {
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';
        
        const isValid = username.length >= 1 && password.length >= 1;
        
        if (continueBtn) {
            continueBtn.disabled = !isValid;
        }
        
        if (avatar) {
            if (isValid) {
                avatar.classList.add('happy');
            } else {
                avatar.classList.remove('happy');
            }
        }
        
        // Mise à jour de l'humeur de l'avatar si l'élément existe
        if (avatarMood && isValid) {
            avatarMood.textContent = '😄';
        }
    }
    
    // Fonction pour mettre à jour l'indicateur de force du mot de passe
    function updatePasswordStrength(password) {
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Mettre à jour l'affichage
        strengthBar.className = 'strength-bar';
        
        if (password.length === 0) {
            strengthText.textContent = 'Force : -';
            if (avatarMood) avatarMood.textContent = '😊';
        } else if (strength <= 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Force : Faible';
            if (avatarMood) avatarMood.textContent = '😐';
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Force : Moyenne';
            if (avatarMood) avatarMood.textContent = '🙂';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Force : Forte';
            if (avatarMood) avatarMood.textContent = '😎';
        }
    }

    // Événement sur le champ username
    if (usernameInput) {
        usernameInput.addEventListener('input', (e) => {
            // Convertir en minuscules et retirer caractères non autorisés
            e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
            SimulatorState.userData.username = e.target.value;
            checkFormValidity();
        });
    }

    // Événement sur le champ password
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            SimulatorState.userData.password = password;
            
            // Mettre à jour l'indicateur de force
            updatePasswordStrength(password);
            
            // Vérifier la validité du formulaire
            checkFormValidity();
        });
    }

    // Événement sur le champ hostname
    if (hostnameInput) {
        hostnameInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
            SimulatorState.userData.hostname = e.target.value;
        });
    }

    // Bouton continuer
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            goToStep(5);
        });
    }
}

// ============================================
// ÉTAPE 5 : INSTALLATION
// ============================================

function startInstallation() {
    const installProgress = document.getElementById('installProgress');
    const installPercentage = document.getElementById('installPercentage');
    const installMessages = document.getElementById('installMessages');
    
    const messages = [
        'Préparation de l\'installation...',
        'Copie des fichiers système...',
        'Installation du noyau Linux...',
        'Configuration des paquets essentiels...',
        'Installation des pilotes...',
        'Configuration de l\'environnement de bureau...',
        'Optimisation pour votre matériel...',
        'Configuration du compte utilisateur...',
        'Finalisation de l\'installation...',
        'Presque terminé...'
    ];

    let progress = 0;
    let messageIndex = 0;
    const totalDuration = 6000; // 6 secondes
    const interval = 50; // Update tous les 50ms
    const increment = (100 / totalDuration) * interval;

    const progressInterval = setInterval(() => {
        progress += increment;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Aller au boot après 500ms
            setTimeout(() => {
                goToStep(6);
            }, 500);
        }

        installProgress.style.width = `${progress}%`;
        installPercentage.textContent = `${Math.floor(progress)}%`;

        // Changer le message à intervalles réguliers
        const newMessageIndex = Math.floor((progress / 100) * messages.length);
        if (newMessageIndex > messageIndex && newMessageIndex < messages.length) {
            messageIndex = newMessageIndex;
            const messageLine = document.createElement('div');
            messageLine.className = 'install-message';
            messageLine.textContent = messages[messageIndex];
            installMessages.appendChild(messageLine);
            
            // Garder seulement les 3 derniers messages
            const allMessages = installMessages.querySelectorAll('.install-message');
            if (allMessages.length > 3) {
                allMessages[0].remove();
            }
        }
    }, interval);
}

// ============================================
// ÉTAPE 6 : BOOT & DESKTOP INTERACTIF
// ============================================

let highestZIndex = 100;
const openWindows = new Set();

function startBoot() {
    const bootScreen = document.getElementById('bootScreen');
    const linuxDesktop = document.getElementById('linuxDesktop');

    // Animation de boot pendant 3 secondes
    setTimeout(() => {
        bootScreen.style.animation = 'fadeOut 1s ease-out forwards';
        
        setTimeout(() => {
            bootScreen.style.display = 'none';
            linuxDesktop.style.display = 'block';
            linuxDesktop.style.animation = 'fadeIn 1s ease-out';
            
            // Initialiser le bureau
            initDesktop();
        }, 1000);
    }, 3000);
}

function initDesktop() {
    // Mettre à jour l'heure
    updateDesktopTime();
    setInterval(updateDesktopTime, 60000);
    
    // Mettre à jour le nom d'utilisateur dans le gestionnaire de fichiers
    const filesUsername = document.getElementById('filesUsername');
    if (filesUsername && SimulatorState.userData.username) {
        filesUsername.textContent = SimulatorState.userData.username;
    }
    
    // Mettre à jour le nom de l'OS avec la distribution choisie
    const osName = document.getElementById('osName');
    if (osName && SimulatorState.selectedDistro) {
        const distroNames = {
            'ubuntu': 'Linux Ubuntu 24.04',
            'mint': 'Linux NIRD 21.3',
            'debian': 'Debian 12 Bookworm'
        };
        osName.textContent = distroNames[SimulatorState.selectedDistro] || 'Linux';
    }
    
    // Initialiser les icônes du bureau
    initDesktopIcons();
    
    // Initialiser les fenêtres
    initWindows();
    
    // Initialiser le Terminal
    initTerminal();
    
    // Initialiser l'explorateur de fichiers
    initFileExplorer();
    
    // Initialiser l'éditeur de texte
    initTextEditor();
    
    // Bouton "Explorer le bureau"
    const startExploringBtn = document.getElementById('startExploring');
    if (startExploringBtn) {
        startExploringBtn.addEventListener('click', () => {
            hideWelcomeMessage();
        });
    }
}

function hideWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.classList.add('hidden');
        setTimeout(() => {
            welcomeMessage.style.display = 'none';
        }, 500);
    }
}

// ============================================
// ICÔNES DU BUREAU
// ============================================

function initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    
    icons.forEach((icon, index) => {
        // Animation d'apparition décalée
        icon.style.animation = `fadeIn 0.5s ease-out ${0.5 + index * 0.1}s backwards`;
        
        // Clic pour ouvrir la fenêtre
        icon.addEventListener('click', () => {
            const windowName = icon.dataset.window;
            if (windowName) {
                hideWelcomeMessage();
                openWindow(windowName);
            }
        });
    });
}

// ============================================
// SYSTÈME DE FENÊTRES
// ============================================

function initWindows() {
    const windows = document.querySelectorAll('.os-window');
    
    windows.forEach(win => {
        // Bouton fermer
        const closeBtn = win.querySelector('.window-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const windowName = closeBtn.dataset.close;
                closeWindow(windowName);
            });
        }
        
        // Clic pour mettre au premier plan
        win.addEventListener('mousedown', () => {
            bringToFront(win);
        });
        
        // Drag & Drop
        initWindowDrag(win);
    });
}

function openWindow(windowName) {
    const win = document.getElementById(`window-${windowName}`);
    if (!win) return;
    
    // Position initiale (centrée avec offset aléatoire)
    const offsetX = Math.random() * 100 - 50;
    const offsetY = Math.random() * 50 - 25;
    win.style.left = `calc(50% - 250px + ${offsetX}px)`;
    win.style.top = `calc(30% + ${offsetY}px)`;
    
    // Afficher et animer
    win.classList.add('active');
    bringToFront(win);
    
    // Ajouter à la taskbar
    addToTaskbar(windowName);
    
    openWindows.add(windowName);
    
    // Actions spécifiques par fenêtre
    if (windowName === 'files') {
        refreshFileExplorer();
    }
    if (windowName === 'terminal') {
        const terminalInput = document.getElementById('terminalInput');
        if (terminalInput) {
            setTimeout(() => terminalInput.focus(), 100);
        }
    }
    if (windowName === 'editor') {
        const editorTextarea = document.getElementById('editorTextarea');
        if (editorTextarea) {
            setTimeout(() => editorTextarea.focus(), 100);
        }
    }
}

function closeWindow(windowName) {
    const win = document.getElementById(`window-${windowName}`);
    if (!win) return;
    
    // Cleanup spécial pour le jeu Mario
    if (windowName === 'mario') {
        closeMarioGame();
    }
    
    // Animation de fermeture
    win.classList.add('closing');
    
    setTimeout(() => {
        win.classList.remove('active', 'closing');
    }, 300);
    
    // Retirer de la taskbar
    removeFromTaskbar(windowName);
    
    openWindows.delete(windowName);
}

function bringToFront(win) {
    highestZIndex++;
    win.style.zIndex = highestZIndex;
    
    // Mettre à jour la taskbar
    const windowName = win.dataset.window;
    updateTaskbarActive(windowName);
}

function initWindowDrag(win) {
    const header = win.querySelector('.window-header');
    if (!header) return;
    
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('window-close')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = win.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        win.style.transition = 'none';
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        // Limites de l'écran
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 100));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 100));
        
        win.style.left = `${newLeft}px`;
        win.style.top = `${newTop}px`;
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            win.style.transition = '';
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

// ============================================
// TASKBAR
// ============================================

function addToTaskbar(windowName) {
    const taskbarApps = document.getElementById('taskbarApps');
    if (!taskbarApps) return;
    
    // Vérifier si déjà présent
    if (document.getElementById(`taskbar-${windowName}`)) return;
    
    const icons = {
        terminal: '💻',
        settings: '🛠️',
        browser: '🌐',
        files: '📁',
        editor: '📝',
        mario: '🍄'
    };
    
    const app = document.createElement('div');
    app.className = 'taskbar-app active';
    app.id = `taskbar-${windowName}`;
    app.innerHTML = icons[windowName] || '📄';
    app.dataset.window = windowName;
    
    app.addEventListener('click', () => {
        const win = document.getElementById(`window-${windowName}`);
        if (win) {
            if (win.classList.contains('active')) {
                bringToFront(win);
            } else {
                openWindow(windowName);
            }
        }
    });
    
    taskbarApps.appendChild(app);
}

function removeFromTaskbar(windowName) {
    const app = document.getElementById(`taskbar-${windowName}`);
    if (app) {
        app.remove();
    }
}

function updateTaskbarActive(activeWindow) {
    const apps = document.querySelectorAll('.taskbar-app');
    apps.forEach(app => {
        app.classList.toggle('active', app.dataset.window === activeWindow);
    });
}

// ============================================
// SYSTÈME DE FICHIERS VIRTUEL (VFS)
// Store centralisé avec EventEmitter
// ============================================

const VirtualFileSystem = {
    // === SYSTÈME D'ÉVÉNEMENTS ===
    _listeners: {},
    
    on(event, callback) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    },
    
    off(event, callback) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    },
    
    emit(event, data) {
        if (!this._listeners[event]) return;
        this._listeners[event].forEach(callback => callback(data));
    },

    // Chemin de l'explorateur (indépendant du terminal)
    explorerPath: '/home/utilisateur',

    // Arborescence complète
    root: {
        type: 'dir',
        name: '/',
        children: {
            'home': {
                type: 'dir',
                name: 'home',
                children: {
                    'utilisateur': {
                        type: 'dir',
                        name: 'utilisateur',
                        children: {
                            'Documents': {
                                type: 'dir',
                                name: 'Documents',
                                children: {
                                    'notes.txt': {
                                        type: 'file',
                                        name: 'notes.txt',
                                        content: 'Bienvenue sur Linux !\nCe fichier est un exemple.\n\nVous pouvez le modifier avec:\n  edit notes.txt'
                                    },
                                    'projet.txt': {
                                        type: 'file',
                                        name: 'projet.txt',
                                        content: '=== Mon Projet ===\n\nDescription: Apprendre Linux\nStatut: En cours\nPriorité: Haute'
                                    }
                                }
                            },
                            'Images': {
                                type: 'dir',
                                name: 'Images',
                                children: {}
                            },
                            'Bureau': {
                                type: 'dir',
                                name: 'Bureau',
                                children: {}
                            },
                            'Téléchargements': {
                                type: 'dir',
                                name: 'Téléchargements',
                                children: {}
                            },
                            'Musique': {
                                type: 'dir',
                                name: 'Musique',
                                children: {}
                            },
                            'Vidéos': {
                                type: 'dir',
                                name: 'Vidéos',
                                children: {}
                            },
                            'Jeux': {
                                type: 'dir',
                                name: 'Jeux',
                                children: {
                                    'mario.game': {
                                        type: 'file',
                                        name: 'mario.game',
                                        content: 'GAME:MARIO\nVERSION:1.0\nTYPE:PLATFORMER'
                                    },
                                    'README.txt': {
                                        type: 'file',
                                        name: 'README.txt',
                                        content: '🎮 DOSSIER JEUX\n\nCliquez sur mario.game pour jouer !\n\nOu tapez "mario" dans le terminal.'
                                    }
                                }
                            },
                            'README.txt': {
                                type: 'file',
                                name: 'README.txt',
                                content: '╔══════════════════════════════════════╗\n║     BIENVENUE SUR LINUX !            ║\n╚══════════════════════════════════════╝\n\nVous êtes dans votre dossier personnel.\n\nCommandes utiles :\n  • ls        → voir les fichiers\n  • cd        → changer de dossier\n  • edit      → éditer un fichier\n  • help      → aide complète\n\nBonne exploration ! 🐧'
                            }
                        }
                    }
                }
            },
            'etc': {
                type: 'dir',
                name: 'etc',
                children: {
                    'hostname': {
                        type: 'file',
                        name: 'hostname',
                        content: 'linux-sim'
                    },
                    'os-release': {
                        type: 'file',
                        name: 'os-release',
                        content: 'NAME="Linux Simulator"\nVERSION="2.0"\nID=linux-sim'
                    }
                }
            },
            'var': {
                type: 'dir',
                name: 'var',
                children: {
                    'log': {
                        type: 'dir',
                        name: 'log',
                        children: {
                            'system.log': {
                                type: 'file',
                                name: 'system.log',
                                content: '[OK] Système démarré\n[OK] Réseau connecté'
                            }
                        }
                    }
                }
            },
            'usr': {
                type: 'dir',
                name: 'usr',
                children: {
                    'bin': {
                        type: 'dir',
                        name: 'bin',
                        children: {}
                    },
                    'share': {
                        type: 'dir',
                        name: 'share',
                        children: {}
                    }
                }
            },
            'tmp': {
                type: 'dir',
                name: 'tmp',
                children: {}
            }
        }
    },

    // Chemin courant
    currentPath: '/home/utilisateur',

    // Obtenir le nœud à un chemin donné
    getNode(path) {
        if (path === '/') return this.root;
        
        const parts = path.split('/').filter(p => p !== '');
        let current = this.root;
        
        for (const part of parts) {
            if (!current.children || !current.children[part]) {
                return null;
            }
            current = current.children[part];
        }
        
        return current;
    },

    // Obtenir le nœud parent
    getParentNode(path) {
        const parentPath = this.getParentPath(path);
        return this.getNode(parentPath);
    },

    // Obtenir le chemin parent
    getParentPath(path) {
        if (path === '/') return '/';
        const parts = path.split('/').filter(p => p !== '');
        parts.pop();
        return '/' + parts.join('/');
    },

    // Résoudre un chemin (relatif ou absolu)
    resolvePath(inputPath) {
        // Chemin absolu
        if (inputPath.startsWith('/')) {
            return this.normalizePath(inputPath);
        }
        
        // Chemin relatif
        let path = this.currentPath;
        const parts = inputPath.split('/');
        
        for (const part of parts) {
            if (part === '' || part === '.') continue;
            if (part === '..') {
                path = this.getParentPath(path);
            } else {
                path = path === '/' ? `/${part}` : `${path}/${part}`;
            }
        }
        
        return this.normalizePath(path);
    },

    // Normaliser un chemin
    normalizePath(path) {
        const parts = path.split('/').filter(p => p !== '' && p !== '.');
        const result = [];
        
        for (const part of parts) {
            if (part === '..') {
                result.pop();
            } else {
                result.push(part);
            }
        }
        
        return '/' + result.join('/');
    },

    // Obtenir le chemin affiché (avec ~ pour home)
    getDisplayPath(path = null) {
        const targetPath = path || this.currentPath;
        const homePath = '/home/utilisateur';
        if (targetPath === homePath) {
            return '~';
        }
        if (targetPath.startsWith(homePath + '/')) {
            return '~' + targetPath.substring(homePath.length);
        }
        return targetPath;
    },

    // Créer un dossier
    mkdir(name) {
        const currentNode = this.getNode(this.currentPath);
        if (!currentNode || currentNode.type !== 'dir') {
            return { success: false, message: 'Chemin invalide' };
        }
        
        if (currentNode.children[name]) {
            return { success: false, message: `mkdir: impossible de créer le répertoire '${name}': Le fichier existe` };
        }
        
        currentNode.children[name] = {
            type: 'dir',
            name: name,
            children: {}
        };
        
        // Émettre l'événement de changement
        this.emit('change', { type: 'create', path: this.currentPath, name, itemType: 'dir' });
        
        return { success: true, message: '' };
    },

    // Créer un fichier
    touch(name, content = '') {
        const currentNode = this.getNode(this.currentPath);
        if (!currentNode || currentNode.type !== 'dir') {
            return { success: false, message: 'Chemin invalide' };
        }
        
        if (currentNode.children[name] && currentNode.children[name].type === 'dir') {
            return { success: false, message: `touch: '${name}' est un répertoire` };
        }
        
        const isNew = !currentNode.children[name];
        
        currentNode.children[name] = {
            type: 'file',
            name: name,
            content: content
        };
        
        // Émettre l'événement
        this.emit('change', { type: isNew ? 'create' : 'update', path: this.currentPath, name, itemType: 'file' });
        
        return { success: true, message: '' };
    },

    // Supprimer un fichier
    rm(name) {
        const currentNode = this.getNode(this.currentPath);
        if (!currentNode || !currentNode.children[name]) {
            return { success: false, message: `rm: impossible de supprimer '${name}': Aucun fichier ou dossier de ce type` };
        }
        
        if (currentNode.children[name].type === 'dir') {
            return { success: false, message: `rm: impossible de supprimer '${name}': est un dossier (utilisez rmdir)` };
        }
        
        delete currentNode.children[name];
        
        // Émettre l'événement
        this.emit('change', { type: 'delete', path: this.currentPath, name, itemType: 'file' });
        
        return { success: true, message: '' };
    },

    // Supprimer un dossier vide
    rmdir(name) {
        const currentNode = this.getNode(this.currentPath);
        if (!currentNode || !currentNode.children[name]) {
            return { success: false, message: `rmdir: impossible de supprimer '${name}': Aucun fichier ou dossier de ce type` };
        }
        
        const target = currentNode.children[name];
        if (target.type !== 'dir') {
            return { success: false, message: `rmdir: impossible de supprimer '${name}': N'est pas un dossier` };
        }
        
        if (Object.keys(target.children).length > 0) {
            return { success: false, message: `rmdir: impossible de supprimer '${name}': Le dossier n'est pas vide` };
        }
        
        delete currentNode.children[name];
        
        // Émettre l'événement
        this.emit('change', { type: 'delete', path: this.currentPath, name, itemType: 'dir' });
        
        return { success: true, message: '' };
    },

    // Changer de dossier
    cd(path) {
        if (!path || path === '~') {
            this.currentPath = '/home/utilisateur';
            return { success: true, message: '' };
        }
        
        const resolvedPath = this.resolvePath(path);
        const node = this.getNode(resolvedPath);
        
        if (!node) {
            return { success: false, message: `cd: ${path}: Aucun fichier ou dossier de ce type` };
        }
        
        if (node.type !== 'dir') {
            return { success: false, message: `cd: ${path}: N'est pas un dossier` };
        }
        
        this.currentPath = resolvedPath;
        return { success: true, message: '' };
    },

    // Lister le contenu
    ls(path = null) {
        const targetPath = path ? this.resolvePath(path) : this.currentPath;
        const node = this.getNode(targetPath);
        
        if (!node) {
            return { success: false, message: `ls: impossible d'accéder à '${path}': Aucun fichier ou dossier de ce type` };
        }
        
        if (node.type !== 'dir') {
            return { success: true, items: [{ name: node.name, type: 'file' }] };
        }
        
        const items = Object.values(node.children).map(child => ({
            name: child.name,
            type: child.type
        })).sort((a, b) => {
            // Dossiers en premier
            if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
        
        return { success: true, items };
    },

    // Lire un fichier
    cat(name) {
        const path = this.resolvePath(name);
        const node = this.getNode(path);
        
        if (!node) {
            return { success: false, message: `cat: ${name}: Aucun fichier ou dossier de ce type` };
        }
        
        if (node.type === 'dir') {
            return { success: false, message: `cat: ${name}: est un dossier` };
        }
        
        return { success: true, content: node.content };
    },

    // Écrire dans un fichier (pour echo >)
    writeFile(name, content) {
        const currentNode = this.getNode(this.currentPath);
        if (!currentNode) return { success: false, message: 'Chemin invalide' };
        
        const isNew = !currentNode.children[name];
        
        currentNode.children[name] = {
            type: 'file',
            name: name,
            content: content
        };
        
        // Émettre l'événement
        this.emit('change', { type: isNew ? 'create' : 'update', path: this.currentPath, name, itemType: 'file' });
        
        return { success: true, message: '' };
    },

    // Mettre à jour le contenu d'un fichier existant (pour l'éditeur)
    updateFileContent(filePath, content) {
        const node = this.getNode(filePath);
        if (!node) {
            return { success: false, message: 'Fichier introuvable' };
        }
        if (node.type === 'dir') {
            return { success: false, message: 'Impossible de modifier un dossier' };
        }
        
        node.content = content;
        
        // Émettre l'événement
        const parentPath = this.getParentPath(filePath);
        this.emit('change', { type: 'update', path: parentPath, name: node.name, itemType: 'file' });
        
        return { success: true, message: '' };
    },

    // Générer l'arborescence (tree)
    tree(path = null, prefix = '', isLast = true) {
        const targetPath = path || this.currentPath;
        const node = this.getNode(targetPath);
        
        if (!node || node.type !== 'dir') {
            return { success: false, message: 'Pas un dossier' };
        }
        
        let output = [];
        const children = Object.values(node.children).sort((a, b) => {
            if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
        
        children.forEach((child, index) => {
            const isLastChild = index === children.length - 1;
            const connector = isLastChild ? '└── ' : '├── ';
            const childPrefix = isLastChild ? '    ' : '│   ';
            
            if (child.type === 'dir') {
                output.push(`${prefix}${connector}<span class="tree-dir">${child.name}/</span>`);
                // Récursion pour les sous-dossiers
                const subPath = targetPath === '/' ? `/${child.name}` : `${targetPath}/${child.name}`;
                const subTree = this.treeRecursive(subPath, prefix + childPrefix);
                output = output.concat(subTree);
            } else {
                output.push(`${prefix}${connector}<span class="tree-file">${child.name}</span>`);
            }
        });
        
        return { success: true, output };
    },

    treeRecursive(path, prefix) {
        const node = this.getNode(path);
        if (!node || node.type !== 'dir') return [];
        
        let output = [];
        const children = Object.values(node.children).sort((a, b) => {
            if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
        
        children.forEach((child, index) => {
            const isLastChild = index === children.length - 1;
            const connector = isLastChild ? '└── ' : '├── ';
            const childPrefix = isLastChild ? '    ' : '│   ';
            
            if (child.type === 'dir') {
                output.push(`${prefix}${connector}<span class="tree-dir">${child.name}/</span>`);
                const subPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
                const subTree = this.treeRecursive(subPath, prefix + childPrefix);
                output = output.concat(subTree);
            } else {
                output.push(`${prefix}${connector}<span class="tree-file">${child.name}</span>`);
            }
        });
        
        return output;
    },

    // Auto-complétion
    getCompletions(partial) {
        const currentNode = this.getNode(this.currentPath);
        if (!currentNode || currentNode.type !== 'dir') return [];
        
        const matches = Object.keys(currentNode.children).filter(name => 
            name.toLowerCase().startsWith(partial.toLowerCase())
        );
        
        return matches;
    }
};

// ============================================
// TERMINAL - COMMANDES
// ============================================

const TerminalCommands = {
    // Liste des commandes disponibles
    commands: ['ls', 'cd', 'pwd', 'mkdir', 'touch', 'rm', 'rmdir', 'cat', 'edit', 'clear', 'echo', 'help', 'tree', 'whoami', 'date', 'uname', 'mario'],

    // Historique des commandes
    history: [],
    historyIndex: -1,

    // Exécuter une commande
    execute(input) {
        const trimmed = input.trim();
        if (!trimmed) return null;

        // Ajouter à l'historique
        this.history.push(trimmed);
        this.historyIndex = this.history.length;

        // Parser la commande
        const parts = this.parseCommand(trimmed);
        const command = parts[0];
        const args = parts.slice(1);

        // Dispatcher
        switch (command) {
            case 'ls':
                return this.ls(args);
            case 'cd':
                return this.cd(args);
            case 'pwd':
                return this.pwd();
            case 'mkdir':
                return this.mkdir(args);
            case 'touch':
                return this.touch(args);
            case 'rm':
                return this.rm(args);
            case 'rmdir':
                return this.rmdir(args);
            case 'cat':
                return this.cat(args);
            case 'edit':
                return this.edit(args);
            case 'clear':
                return this.clear();
            case 'echo':
                return this.echo(args, trimmed);
            case 'help':
                return this.help();
            case 'tree':
                return this.tree();
            case 'whoami':
                return this.whoami();
            case 'date':
                return this.date();
            case 'uname':
                return this.uname(args);
            case 'mario':
                return this.mario();
            default:
                return {
                    type: 'error',
                    content: `${command}: commande introuvable\nTapez "help" pour voir les commandes disponibles.`
                };
        }
    },

    // Parser les arguments (gère les guillemets)
    parseCommand(input) {
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        const parts = [];
        let match;
        
        while ((match = regex.exec(input)) !== null) {
            parts.push(match[1] || match[2] || match[0]);
        }
        
        return parts;
    },

    // === COMMANDES ===

    ls(args) {
        const path = args[0] || null;
        const result = VirtualFileSystem.ls(path);
        
        if (!result.success) {
            return { type: 'error', content: result.message };
        }
        
        if (result.items.length === 0) {
            return { type: 'output', content: '' };
        }
        
        const formatted = result.items.map(item => {
            if (item.type === 'dir') {
                return `<span class="dir">${item.name}/</span>`;
            }
            return `<span class="file">${item.name}</span>`;
        }).join('  ');
        
        return { type: 'output', content: formatted, html: true };
    },

    cd(args) {
        const path = args[0] || '~';
        const result = VirtualFileSystem.cd(path);
        
        if (!result.success) {
            return { type: 'error', content: result.message };
        }
        
        return { type: 'output', content: '' };
    },

    pwd() {
        return { type: 'output', content: VirtualFileSystem.currentPath };
    },

    mkdir(args) {
        if (!args[0]) {
            return { type: 'error', content: 'mkdir: opérande manquant' };
        }
        
        const result = VirtualFileSystem.mkdir(args[0]);
        if (!result.success) {
            return { type: 'error', content: result.message };
        }
        
        return { type: 'output', content: '' };
    },

    touch(args) {
        if (!args[0]) {
            return { type: 'error', content: 'touch: opérande manquant' };
        }
        
        const result = VirtualFileSystem.touch(args[0]);
        if (!result.success) {
            return { type: 'error', content: result.message };
        }
        
        return { type: 'output', content: '' };
    },

    rm(args) {
        if (!args[0]) {
            return { type: 'error', content: 'rm: opérande manquant' };
        }
        
        const result = VirtualFileSystem.rm(args[0]);
        if (!result.success) {
            return { type: 'error', content: result.message };
        }
        
        return { type: 'output', content: '' };
    },

    rmdir(args) {
        if (!args[0]) {
            return { type: 'error', content: 'rmdir: opérande manquant' };
        }
        
        const result = VirtualFileSystem.rmdir(args[0]);
        if (!result.success) {
            return { type: 'error', content: result.message };
        }
        
        return { type: 'output', content: '' };
    },

    cat(args) {
        if (!args[0]) {
            return { type: 'error', content: 'cat: opérande manquant' };
        }
        
        const result = VirtualFileSystem.cat(args[0]);
        if (!result.success) {
            return { type: 'error', content: result.message };
        }
        
        return { type: 'output', content: result.content };
    },

    // Ouvrir l'éditeur de texte
    edit(args) {
        if (!args[0]) {
            return { type: 'error', content: 'edit: opérande manquant\nUsage: edit <fichier>' };
        }
        
        const fileName = args[0];
        const filePath = VirtualFileSystem.resolvePath(fileName);
        const node = VirtualFileSystem.getNode(filePath);
        
        // Si c'est un dossier
        if (node && node.type === 'dir') {
            return { type: 'error', content: `edit: impossible d'éditer '${fileName}': est un dossier` };
        }
        
        // Ouvrir l'éditeur (fichier existant ou nouveau)
        openTextEditor(filePath, fileName, node ? node.content : null);
        
        return { 
            type: 'output', 
            content: node 
                ? `<span class="info">📝 Ouverture de "${fileName}" dans l'éditeur...</span>` 
                : `<span class="info">📝 Création de "${fileName}" dans l'éditeur...</span>`,
            html: true 
        };
    },

    clear() {
        return { type: 'clear' };
    },

    echo(args, fullCommand) {
        // Gérer la redirection >
        const redirectIndex = fullCommand.indexOf('>');
        if (redirectIndex !== -1) {
            const textPart = fullCommand.substring(5, redirectIndex).trim();
            const filePart = fullCommand.substring(redirectIndex + 1).trim();
            
            // Enlever les guillemets
            let text = textPart;
            if ((text.startsWith('"') && text.endsWith('"')) || 
                (text.startsWith("'") && text.endsWith("'"))) {
                text = text.slice(1, -1);
            }
            
            if (filePart) {
                VirtualFileSystem.writeFile(filePart, text);
                return { type: 'output', content: '' };
            }
        }
        
        // Echo normal
        let text = args.join(' ');
        if ((text.startsWith('"') && text.endsWith('"')) || 
            (text.startsWith("'") && text.endsWith("'"))) {
            text = text.slice(1, -1);
        }
        
        return { type: 'output', content: text };
    },

    help() {
        const helpText = `<span class="help-header">═══════════════════════ COMMANDES DISPONIBLES ═══════════════════════</span>

<span class="help-category">📂 NAVIGATION</span>
<span class="help-cmd">  ls</span>                    Liste le contenu du dossier courant
<span class="help-cmd">  ls &lt;dir&gt;</span>              Liste le contenu d'un dossier spécifique
<span class="help-cmd">  cd &lt;dir&gt;</span>              Change de dossier
<span class="help-cmd">  cd ..</span>                 Remonte d'un niveau
<span class="help-cmd">  cd ~</span>                  Retour au dossier personnel
<span class="help-cmd">  pwd</span>                   Affiche le chemin actuel
<span class="help-cmd">  tree</span>                  Affiche l'arborescence complète

<span class="help-category">📄 GESTION DES FICHIERS</span>
<span class="help-cmd">  touch &lt;nom&gt;</span>           Crée un fichier vide
<span class="help-cmd">  mkdir &lt;nom&gt;</span>           Crée un dossier
<span class="help-cmd">  rm &lt;nom&gt;</span>              Supprime un fichier
<span class="help-cmd">  rmdir &lt;nom&gt;</span>           Supprime un dossier vide

<span class="help-category">📝 LECTURE & ÉDITION</span>
<span class="help-cmd">  cat &lt;nom&gt;</span>             Affiche le contenu d'un fichier
<span class="help-cmd">  edit &lt;nom&gt;</span>            Ouvre l'éditeur de texte intégré
<span class="help-cmd">  echo "texte"</span>          Affiche du texte
<span class="help-cmd">  echo "txt" &gt; f</span>        Écrit dans un fichier

<span class="help-category">🔧 UTILITAIRES</span>
<span class="help-cmd">  clear</span>                 Nettoie l'écran du terminal
<span class="help-cmd">  whoami</span>                Affiche le nom d'utilisateur
<span class="help-cmd">  date</span>                  Affiche la date et l'heure
<span class="help-cmd">  uname -a</span>              Affiche les infos système
<span class="help-cmd">  help</span>                  Affiche cette aide détaillée

<span class="help-category">🎮 JEUX</span>
<span class="help-cmd">  mario</span>                 Lance le jeu Super Linux Bros !

<span class="help-header">═══════════════════════════════════════════════════════════════════════</span>
<span class="help-tip">💡 Astuce : Utilisez ↑↓ pour l'historique et Tab pour l'auto-complétion</span>`;
        return { type: 'output', content: helpText, html: true };
    },

    tree() {
        const currentDir = VirtualFileSystem.getNode(VirtualFileSystem.currentPath);
        const result = VirtualFileSystem.tree();
        
        if (!result.success) {
            return { type: 'error', content: result.message };
        }
        
        const header = `<span class="tree-dir">${VirtualFileSystem.getDisplayPath()}</span>`;
        const content = [header, ...result.output].join('\n');
        
        return { type: 'output', content, html: true };
    },

    whoami() {
        return { type: 'output', content: 'utilisateur' };
    },

    date() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return { type: 'output', content: now.toLocaleDateString('fr-FR', options) };
    },

    uname(args) {
        if (args.includes('-a') || args.includes('--all')) {
            return { type: 'output', content: 'Linux linux-sim 6.5.0-generic x86_64 GNU/Linux' };
        }
        return { type: 'output', content: 'Linux' };
    },

    // Commande mario - Lance le jeu
    mario() {
        // Ouvrir la fenêtre du jeu
        setTimeout(() => {
            openMarioGame();
        }, 100);
        
        return { 
            type: 'output', 
            content: `<span style="color: #ffc107;">🍄 Lancement du jeu Super Linux Bros...</span>
<span style="color: #94a3b8;">Utilisez les flèches ← → pour se déplacer, ESPACE pour sauter.</span>`,
            html: true
        };
    },

    // Historique
    getPreviousCommand() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.history[this.historyIndex];
        }
        return this.history[0] || '';
    },

    getNextCommand() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            return this.history[this.historyIndex];
        }
        this.historyIndex = this.history.length;
        return '';
    }
};

// ============================================
// TERMINAL - UI
// ============================================

function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutputDesktop');
    const terminalPrompt = document.getElementById('terminalPrompt');
    
    if (!terminalInput || !terminalOutput) return;

    // Mettre à jour le prompt avec le nom d'utilisateur
    function updatePrompt() {
        const username = SimulatorState.userData.username || 'utilisateur';
        const displayPath = VirtualFileSystem.getDisplayPath();
        terminalPrompt.textContent = `${username}@linux-sim:${displayPath}$`;
    }

    // Ajouter une ligne au terminal
    function addLine(prompt, command, output, isHtml = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (prompt) {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = prompt + ' ';
            line.appendChild(promptSpan);
        }
        
        if (command) {
            const cmdSpan = document.createElement('span');
            cmdSpan.className = 'command';
            cmdSpan.textContent = command;
            line.appendChild(cmdSpan);
        }
        
        terminalOutput.appendChild(line);
        
        if (output) {
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-line';
            
            if (isHtml) {
                outputLine.innerHTML = `<span class="output">${output}</span>`;
            } else {
                const outputSpan = document.createElement('span');
                outputSpan.className = 'output';
                outputSpan.textContent = output;
                outputLine.appendChild(outputSpan);
            }
            
            terminalOutput.appendChild(outputLine);
        }
        
        // Scroll en bas
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Exécuter une commande
    function executeCommand(input) {
        const username = SimulatorState.userData.username || 'utilisateur';
        const displayPath = VirtualFileSystem.getDisplayPath();
        const promptText = `${username}@linux-sim:${displayPath}$`;
        
        const result = TerminalCommands.execute(input);
        
        if (!result) {
            addLine(promptText, input, null);
            return;
        }
        
        if (result.type === 'clear') {
            // Garder seulement le message de bienvenue
            terminalOutput.innerHTML = `<div class="terminal-welcome">Terminal effacé. Tapez "help" pour l'aide.</div>`;
            return;
        }
        
        if (result.type === 'error') {
            addLine(promptText, input, null);
            const errorLine = document.createElement('div');
            errorLine.className = 'terminal-line';
            errorLine.innerHTML = `<span class="error">${result.content}</span>`;
            terminalOutput.appendChild(errorLine);
        } else {
            addLine(promptText, input, result.content, result.html);
        }
        
        // Mettre à jour le prompt (le chemin a peut-être changé)
        updatePrompt();
        
        // Scroll en bas (avec délai pour s'assurer que le DOM est mis à jour)
        setTimeout(() => {
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }, 10);
    }

    // Événements clavier
    terminalInput.addEventListener('keydown', (e) => {
        // Entrée : exécuter
        if (e.key === 'Enter') {
            const command = terminalInput.value;
            terminalInput.value = '';
            executeCommand(command);
        }
        
        // Flèche haut : historique précédent
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            terminalInput.value = TerminalCommands.getPreviousCommand();
            // Curseur à la fin
            setTimeout(() => {
                terminalInput.selectionStart = terminalInput.value.length;
            }, 0);
        }
        
        // Flèche bas : historique suivant
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            terminalInput.value = TerminalCommands.getNextCommand();
        }
        
        // Tab : auto-complétion
        else if (e.key === 'Tab') {
            e.preventDefault();
            const value = terminalInput.value;
            const parts = value.split(' ');
            const lastPart = parts[parts.length - 1];
            
            if (lastPart) {
                // Auto-complétion des commandes
                if (parts.length === 1) {
                    const matches = TerminalCommands.commands.filter(cmd => 
                        cmd.startsWith(lastPart.toLowerCase())
                    );
                    if (matches.length === 1) {
                        terminalInput.value = matches[0] + ' ';
                    }
                }
                // Auto-complétion des fichiers/dossiers
                else {
                    const completions = VirtualFileSystem.getCompletions(lastPart);
                    if (completions.length === 1) {
                        parts[parts.length - 1] = completions[0];
                        terminalInput.value = parts.join(' ');
                    }
                }
            }
        }
    });

    // Focus automatique quand la fenêtre est ouverte
    const terminalWindow = document.getElementById('window-terminal');
    if (terminalWindow) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (terminalWindow.classList.contains('active')) {
                        setTimeout(() => terminalInput.focus(), 100);
                        updatePrompt();
                    }
                }
            });
        });
        
        observer.observe(terminalWindow, { attributes: true });
    }

    // Clic sur le terminal = focus input
    const terminalContent = document.querySelector('.terminal-content');
    if (terminalContent) {
        terminalContent.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Initialiser le prompt
    updatePrompt();
}

// ============================================
// THÈME (PARAMÈTRES)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const options = themeToggle.querySelectorAll('.theme-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                
                // Optionnel : appliquer le thème
                const theme = option.dataset.theme;
                if (theme === 'light') {
                    document.querySelector('.linux-desktop').style.background = 
                        'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)';
                } else {
                    document.querySelector('.linux-desktop').style.background = 
                        'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
                }
            });
        });
    }
});

// ============================================
// HORLOGE BUREAU
// ============================================

function updateDesktopTime() {
    const desktopTime = document.getElementById('desktopTime');
    if (!desktopTime) return;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    desktopTime.textContent = `${hours}:${minutes}`;
}

// ============================================
// EXPLORATEUR DE FICHIERS SYNCHRONISÉ
// ============================================

// État de l'éditeur
let currentEditorFile = null;

function initFileExplorer() {
    // Écouter les changements du VFS
    VirtualFileSystem.on('change', () => {
        refreshFileExplorer();
    });
    
    // Navigation sidebar
    const sidebarItems = document.querySelectorAll('.files-sidebar .sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const path = item.dataset.path;
            if (path) {
                VirtualFileSystem.explorerPath = path;
                refreshFileExplorer();
                updateSidebarActive(path);
            }
        });
    });
    
    // Bouton retour
    const backBtn = document.getElementById('filesBack');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const parentPath = VirtualFileSystem.getParentPath(VirtualFileSystem.explorerPath);
            VirtualFileSystem.explorerPath = parentPath;
            refreshFileExplorer();
        });
    }
    
    // Bouton home
    const homeBtn = document.getElementById('filesHome');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            VirtualFileSystem.explorerPath = '/home/utilisateur';
            refreshFileExplorer();
        });
    }
    
    // Premier rendu
    refreshFileExplorer();
}

function updateSidebarActive(path) {
    const sidebarItems = document.querySelectorAll('.files-sidebar .sidebar-item');
    sidebarItems.forEach(item => {
        item.classList.toggle('active', item.dataset.path === path);
    });
}

function refreshFileExplorer() {
    const filesGrid = document.getElementById('filesGrid');
    const pathBar = document.getElementById('filesPathBar');
    const backBtn = document.getElementById('filesBack');
    
    if (!filesGrid) return;
    
    const currentPath = VirtualFileSystem.explorerPath;
    const result = VirtualFileSystem.ls(currentPath);
    
    // Mettre à jour la barre de chemin
    if (pathBar) {
        const displayPath = VirtualFileSystem.getDisplayPath(currentPath);
        pathBar.innerHTML = `<span>📂</span> ${displayPath}`;
    }
    
    // Activer/désactiver le bouton retour
    if (backBtn) {
        backBtn.disabled = currentPath === '/';
    }
    
    // Mettre à jour la sidebar
    updateSidebarActive(currentPath);
    
    // Vider la grille
    filesGrid.innerHTML = '';
    
    if (!result.success || result.items.length === 0) {
        filesGrid.innerHTML = `
            <div class="files-empty">
                <div class="files-empty-icon">📂</div>
                <p>Ce dossier est vide</p>
            </div>
        `;
        return;
    }
    
    // Créer les éléments
    result.items.forEach(item => {
        const fileItem = document.createElement('div');
        fileItem.className = `file-item ${item.type === 'dir' ? 'folder' : 'file'}`;
        fileItem.dataset.name = item.name;
        fileItem.dataset.type = item.type;
        
        let icon = getFileIcon(item.name, item.type);
        
        fileItem.innerHTML = `
            <div class="file-icon">${icon}</div>
            <span>${item.name}</span>
        `;
        
        // Double-clic pour ouvrir
        fileItem.addEventListener('dblclick', () => {
            handleFileClick(item.name, item.type);
        });
        
        // Simple clic pour sélectionner (visuel)
        fileItem.addEventListener('click', () => {
            document.querySelectorAll('.file-item.selected').forEach(el => el.classList.remove('selected'));
            fileItem.classList.add('selected');
        });
        
        filesGrid.appendChild(fileItem);
    });
}

function getFileIcon(name, type) {
    if (type === 'dir') {
        const folderIcons = {
            'Documents': '📄',
            'Images': '🖼️',
            'Téléchargements': '⬇️',
            'Bureau': '🖥️',
            'Musique': '🎵',
            'Vidéos': '🎬',
            'Jeux': '🎮',
            'home': '🏠',
            'etc': '⚙️',
            'var': '📊',
            'usr': '📦',
            'tmp': '🗑️',
            'log': '📋',
            'bin': '⚡',
            'share': '🔗'
        };
        return folderIcons[name] || '📁';
    } else {
        const ext = name.split('.').pop().toLowerCase();
        const fileIcons = {
            'txt': '📝',
            'md': '📋',
            'log': '📊',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'mp3': '🎵',
            'wav': '🎵',
            'mp4': '🎬',
            'pdf': '📕',
            'doc': '📘',
            'html': '🌐',
            'css': '🎨',
            'js': '⚡',
            'game': '🍄'
        };
        return fileIcons[ext] || '📄';
    }
}

function handleFileClick(name, type) {
    const currentPath = VirtualFileSystem.explorerPath;
    const fullPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
    
    if (type === 'dir') {
        // Ouvrir le dossier
        VirtualFileSystem.explorerPath = fullPath;
        refreshFileExplorer();
    } else {
        // Ouvrir le fichier
        const ext = name.split('.').pop().toLowerCase();
        
        if (ext === 'game') {
            // Fichier de jeu - lancer le jeu Mario
            if (name.toLowerCase().includes('mario')) {
                openMarioGame();
            } else {
                alert(`Jeu non reconnu: ${name}`);
            }
        } else if (['txt', 'md', 'log', 'html', 'css', 'js'].includes(ext) || !name.includes('.')) {
            // Fichier texte - ouvrir dans l'éditeur
            const node = VirtualFileSystem.getNode(fullPath);
            if (node) {
                openTextEditor(fullPath, name, node.content);
            }
        } else {
            // Fichier non-texte - afficher un message
            alert(`Aperçu non disponible pour ce type de fichier: ${name}`);
        }
    }
}

// ============================================
// ÉDITEUR DE TEXTE
// ============================================

function initTextEditor() {
    const textarea = document.getElementById('editorTextarea');
    const saveBtn = document.getElementById('editorSave');
    const cancelBtn = document.getElementById('editorCancel');
    const lineCount = document.getElementById('editorLineCount');
    const charCount = document.getElementById('editorCharCount');
    
    if (!textarea) return;
    
    // Compteurs
    textarea.addEventListener('input', () => {
        updateEditorCounts();
    });
    
    // Bouton enregistrer
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveCurrentFile();
        });
    }
    
    // Bouton annuler
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            closeWindow('editor');
            currentEditorFile = null;
        });
    }
    
    // Raccourci Ctrl+S
    textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveCurrentFile();
        }
    });
}

function updateEditorCounts() {
    const textarea = document.getElementById('editorTextarea');
    const lineCount = document.getElementById('editorLineCount');
    const charCount = document.getElementById('editorCharCount');
    
    if (textarea && lineCount && charCount) {
        const lines = textarea.value.split('\n').length;
        const chars = textarea.value.length;
        lineCount.textContent = `Lignes: ${lines}`;
        charCount.textContent = `Caractères: ${chars}`;
    }
}

function openTextEditor(filePath, fileName, content) {
    const textarea = document.getElementById('editorTextarea');
    const fileNameSpan = document.getElementById('editorFileName');
    
    if (!textarea) return;
    
    // Stocker le fichier actuel
    currentEditorFile = {
        path: filePath,
        name: fileName,
        isNew: content === null
    };
    
    // Mettre à jour l'interface
    if (fileNameSpan) {
        fileNameSpan.textContent = `📝 ${fileName}${content === null ? ' (nouveau)' : ''}`;
    }
    
    textarea.value = content || '';
    updateEditorCounts();
    
    // Ouvrir la fenêtre
    openWindow('editor');
    
    // Focus sur le textarea
    setTimeout(() => textarea.focus(), 100);
}

function saveCurrentFile() {
    if (!currentEditorFile) return;
    
    const textarea = document.getElementById('editorTextarea');
    const content = textarea.value;
    
    // Sauvegarder
    if (currentEditorFile.isNew) {
        // Nouveau fichier - créer dans le dossier parent du chemin complet
        const parentPath = VirtualFileSystem.getParentPath(currentEditorFile.path);
        const parentNode = VirtualFileSystem.getNode(parentPath);
        
        if (parentNode && parentNode.type === 'dir') {
            parentNode.children[currentEditorFile.name] = {
                type: 'file',
                name: currentEditorFile.name,
                content: content
            };
            // Émettre l'événement
            VirtualFileSystem.emit('change', { 
                type: 'create', 
                path: parentPath, 
                name: currentEditorFile.name, 
                itemType: 'file' 
            });
        }
    } else {
        // Fichier existant - update
        VirtualFileSystem.updateFileContent(currentEditorFile.path, content);
    }
    
    // Mettre à jour le titre
    const fileNameSpan = document.getElementById('editorFileName');
    if (fileNameSpan) {
        fileNameSpan.textContent = `📝 ${currentEditorFile.name} ✓`;
        
        // Revenir au titre normal après 2 secondes
        setTimeout(() => {
            fileNameSpan.textContent = `📝 ${currentEditorFile.name}`;
        }, 2000);
    }
    
    currentEditorFile.isNew = false;
    
    // Afficher dans le terminal
    addTerminalMessage(`<span class="success">✓ Fichier "${currentEditorFile.name}" enregistré.</span>`);
}

function addTerminalMessage(html) {
    const terminalOutput = document.getElementById('terminalOutputDesktop');
    if (!terminalOutput) return;
    
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = html;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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
// PARTICULES (repris du site)
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
// SUPER LINUX BROS - MOTEUR DE JEU
// ============================================

const MarioGame = {
    // Configuration
    canvas: null,
    ctx: null,
    
    // État du jeu
    isRunning: false,
    isPaused: false,
    gameOver: false,
    hasWon: false,
    startTime: 0,
    
    // Constantes physiques
    GRAVITY: 0.6,
    FRICTION: 0.85,
    JUMP_FORCE: -12,
    MOVE_SPEED: 0.8,
    MAX_SPEED: 5,
    
    // Dimensions
    TILE_SIZE: 32,
    CANVAS_WIDTH: 640,
    CANVAS_HEIGHT: 400,
    
    // Caméra (scrolling)
    camera: {
        x: 0,
        deadZone: 200
    },
    
    // Joueur
    player: {
        x: 50,
        y: 300,
        width: 24,
        height: 32,
        vx: 0,
        vy: 0,
        onGround: false,
        facingRight: true,
        animFrame: 0,
        animTimer: 0
    },
    
    // Contrôles
    keys: {
        left: false,
        right: false,
        jump: false
    },
    
    // Statistiques
    coins: 0,
    lives: 3,
    
    // Niveau (tilemap)
    // 0 = vide, 1 = sol, 2 = brique, 3 = bloc ?, 4 = tuyau, 5 = drapeau
    levelData: [
        // Largeur: ~60 tiles = 1920px
        "                                                            ",
        "                                                            ",
        "                                                            ",
        "                                                            ",
        "                                                            ",
        "                                                            ",
        "                    333                                     ",
        "                                     222                    ",
        "           33                                          5    ",
        "                       222                        22   F    ",
        "                                          22               P",
        "1111111111111     111111111111111    1111111111111111111111111"
    ],
    
    // Ennemis
    enemies: [],
    
    // Pièces collectables
    coinsList: [],
    
    // Initialisation
    init() {
        this.canvas = document.getElementById('marioCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;
        
        // Réinitialiser l'état
        this.reset();
        
        // Event listeners
        this.setupControls();
    },
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        this.hasWon = false;
        this.startTime = 0;
        this.coins = 0;
        
        // Reset joueur
        this.player.x = 50;
        this.player.y = 300;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.onGround = false;
        this.player.facingRight = true;
        
        // Reset caméra
        this.camera.x = 0;
        
        // Générer les pièces à partir du niveau (tiles '3')
        this.coinsList = [];
        for (let row = 0; row < this.levelData.length; row++) {
            for (let col = 0; col < this.levelData[row].length; col++) {
                if (this.levelData[row][col] === '3') {
                    this.coinsList.push({
                        x: col * this.TILE_SIZE + 8,
                        y: row * this.TILE_SIZE + 4,
                        collected: false,
                        animOffset: Math.random() * Math.PI * 2
                    });
                }
            }
        }
        
        // Reset enemies
        this.enemies = [
            { x: 400, y: 336, width: 28, height: 28, vx: -1, alive: true },
            { x: 900, y: 336, width: 28, height: 28, vx: -1, alive: true }
        ];
        
        // Update HUD
        this.updateHUD();
        
        // Dessiner l'état initial
        this.draw();
    },
    
    setupControls() {
        // Clavier
        const handleKeyDown = (e) => {
            if (!this.isRunning || this.isPaused) return;
            
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.keys.left = true;
                e.preventDefault();
            }
            if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.keys.right = true;
                e.preventDefault();
            }
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                if (this.player.onGround) {
                    this.keys.jump = true;
                    this.player.vy = this.JUMP_FORCE;
                    this.player.onGround = false;
                    this.playSound('jump');
                }
                e.preventDefault();
            }
        };
        
        const handleKeyUp = (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.keys.left = false;
            }
            if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.keys.right = false;
            }
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.keys.jump = false;
            }
        };
        
        // Stocker les références pour le cleanup
        this._keyDownHandler = handleKeyDown;
        this._keyUpHandler = handleKeyUp;
        
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    },
    
    removeControls() {
        if (this._keyDownHandler) {
            document.removeEventListener('keydown', this._keyDownHandler);
        }
        if (this._keyUpHandler) {
            document.removeEventListener('keyup', this._keyUpHandler);
        }
    },
    
    start() {
        if (this.isRunning) return;
        
        this.reset();
        this.isRunning = true;
        this.startTime = Date.now();
        
        // Cacher l'overlay
        const overlay = document.getElementById('marioOverlay');
        if (overlay) overlay.classList.add('hidden');
        
        // Afficher le HUD
        const hud = document.getElementById('marioHUD');
        if (hud) hud.classList.add('show');
        
        // Lancer la boucle de jeu
        this.gameLoop();
    },
    
    stop() {
        this.isRunning = false;
        this.removeControls();
        
        // Cacher le HUD
        const hud = document.getElementById('marioHUD');
        if (hud) hud.classList.remove('show');
    },
    
    pause() {
        this.isPaused = true;
    },
    
    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.gameLoop();
        }
    },
    
    // Boucle de jeu principale
    gameLoop() {
        if (!this.isRunning || this.isPaused || this.gameOver || this.hasWon) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    },
    
    // Mise à jour de la logique
    update() {
        const player = this.player;
        
        // Mouvement horizontal
        if (this.keys.left) {
            player.vx -= this.MOVE_SPEED;
            player.facingRight = false;
        }
        if (this.keys.right) {
            player.vx += this.MOVE_SPEED;
            player.facingRight = true;
        }
        
        // Limiter la vitesse
        player.vx = Math.max(-this.MAX_SPEED, Math.min(this.MAX_SPEED, player.vx));
        
        // Friction
        if (!this.keys.left && !this.keys.right) {
            player.vx *= this.FRICTION;
            if (Math.abs(player.vx) < 0.1) player.vx = 0;
        }
        
        // Gravité
        player.vy += this.GRAVITY;
        player.vy = Math.min(player.vy, 15); // Terminal velocity
        
        // Appliquer le mouvement
        player.x += player.vx;
        player.y += player.vy;
        
        // Collisions avec les tiles
        this.handleTileCollisions();
        
        // Collisions avec les pièces
        this.checkCoinCollisions();
        
        // Collisions avec les ennemis
        this.checkEnemyCollisions();
        
        // Mettre à jour les ennemis
        this.updateEnemies();
        
        // Vérifier la victoire (drapeau)
        this.checkWinCondition();
        
        // Vérifier la mort (chute)
        if (player.y > this.CANVAS_HEIGHT + 50) {
            this.die();
        }
        
        // Limiter à gauche
        if (player.x < 0) {
            player.x = 0;
            player.vx = 0;
        }
        
        // Mise à jour de la caméra (scrolling)
        this.updateCamera();
        
        // Animation du joueur
        if (Math.abs(player.vx) > 0.5) {
            player.animTimer++;
            if (player.animTimer > 8) {
                player.animTimer = 0;
                player.animFrame = (player.animFrame + 1) % 3;
            }
        } else {
            player.animFrame = 0;
        }
    },
    
    handleTileCollisions() {
        const player = this.player;
        const ts = this.TILE_SIZE;
        
        // Récupérer les tiles autour du joueur
        const startCol = Math.floor(player.x / ts);
        const endCol = Math.floor((player.x + player.width) / ts);
        const startRow = Math.floor(player.y / ts);
        const endRow = Math.floor((player.y + player.height) / ts);
        
        player.onGround = false;
        
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const tile = this.getTile(col, row);
                
                if (tile === '1' || tile === '2' || tile === '4' || tile === 'P') {
                    // Calculer l'overlap
                    const tileX = col * ts;
                    const tileY = row * ts;
                    
                    const overlapX = Math.min(player.x + player.width, tileX + ts) - Math.max(player.x, tileX);
                    const overlapY = Math.min(player.y + player.height, tileY + ts) - Math.max(player.y, tileY);
                    
                    if (overlapX > 0 && overlapY > 0) {
                        // Résoudre la collision
                        if (overlapX < overlapY) {
                            // Collision horizontale
                            if (player.x < tileX) {
                                player.x = tileX - player.width;
                            } else {
                                player.x = tileX + ts;
                            }
                            player.vx = 0;
                        } else {
                            // Collision verticale
                            if (player.y < tileY) {
                                // Collision par le haut (atterrissage)
                                player.y = tileY - player.height;
                                player.vy = 0;
                                player.onGround = true;
                            } else {
                                // Collision par le bas (tête)
                                player.y = tileY + ts;
                                player.vy = 0;
                            }
                        }
                    }
                }
            }
        }
    },
    
    getTile(col, row) {
        if (row < 0 || row >= this.levelData.length) return '0';
        if (col < 0 || col >= this.levelData[row].length) return '0';
        return this.levelData[row][col];
    },
    
    checkCoinCollisions() {
        const player = this.player;
        
        this.coinsList.forEach(coin => {
            if (coin.collected) return;
            
            const dx = (player.x + player.width / 2) - (coin.x + 8);
            const dy = (player.y + player.height / 2) - (coin.y + 8);
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 24) {
                coin.collected = true;
                this.coins++;
                this.updateHUD();
                this.playSound('coin');
            }
        });
    },
    
    checkEnemyCollisions() {
        const player = this.player;
        
        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            // AABB collision
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                
                // Vérifier si on saute sur l'ennemi
                if (player.vy > 0 && player.y + player.height < enemy.y + enemy.height / 2) {
                    enemy.alive = false;
                    player.vy = this.JUMP_FORCE * 0.6; // Petit rebond
                    this.playSound('stomp');
                } else {
                    // Touché par l'ennemi
                    this.die();
                }
            }
        });
    },
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;
            
            // Mouvement simple gauche/droite
            enemy.x += enemy.vx;
            
            // Collision avec les murs (simplifiée)
            const col = Math.floor(enemy.x / this.TILE_SIZE);
            const row = Math.floor((enemy.y + enemy.height) / this.TILE_SIZE);
            
            // Vérifier s'il y a un sol devant
            const nextCol = enemy.vx < 0 ? col - 1 : col + 1;
            const groundTile = this.getTile(nextCol, row);
            
            if (groundTile !== '1' && groundTile !== '2') {
                enemy.vx *= -1; // Demi-tour
            }
            
            // Limites
            if (enemy.x < 0 || enemy.x > this.levelData[0].length * this.TILE_SIZE - enemy.width) {
                enemy.vx *= -1;
            }
        });
    },
    
    checkWinCondition() {
        const player = this.player;
        
        // Chercher le drapeau dans le niveau
        for (let row = 0; row < this.levelData.length; row++) {
            for (let col = 0; col < this.levelData[row].length; col++) {
                if (this.levelData[row][col] === 'F' || this.levelData[row][col] === '5') {
                    const flagX = col * this.TILE_SIZE;
                    const flagY = row * this.TILE_SIZE;
                    
                    // Collision avec le drapeau
                    if (player.x + player.width > flagX && 
                        player.x < flagX + this.TILE_SIZE &&
                        player.y + player.height > flagY) {
                        this.win();
                        return;
                    }
                }
            }
        }
    },
    
    updateCamera() {
        const player = this.player;
        const targetX = player.x - this.CANVAS_WIDTH / 3;
        
        // Smooth follow
        this.camera.x += (targetX - this.camera.x) * 0.1;
        
        // Limites
        this.camera.x = Math.max(0, this.camera.x);
        const maxCameraX = this.levelData[0].length * this.TILE_SIZE - this.CANVAS_WIDTH;
        this.camera.x = Math.min(maxCameraX, this.camera.x);
    },
    
    die() {
        this.lives--;
        this.updateHUD();
        this.playSound('die');
        
        if (this.lives <= 0) {
            this.gameOver = true;
            this.showGameOver();
        } else {
            // Respawn
            this.player.x = 50;
            this.player.y = 300;
            this.player.vx = 0;
            this.player.vy = 0;
            this.camera.x = 0;
        }
    },
    
    win() {
        this.hasWon = true;
        this.isRunning = false;
        this.playSound('win');
        
        // Calculer le temps
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Afficher l'écran de victoire
        const winScreen = document.getElementById('marioWinScreen');
        const timeDisplay = document.getElementById('marioTime');
        
        if (timeDisplay) timeDisplay.textContent = `Temps: ${timeStr}`;
        if (winScreen) winScreen.classList.add('show');
        
        // Cacher le HUD
        const hud = document.getElementById('marioHUD');
        if (hud) hud.classList.remove('show');
    },
    
    showGameOver() {
        // Pour l'instant, juste relancer
        setTimeout(() => {
            this.lives = 3;
            this.reset();
            
            // Réafficher l'overlay de démarrage
            const overlay = document.getElementById('marioOverlay');
            if (overlay) overlay.classList.remove('hidden');
        }, 1500);
    },
    
    updateHUD() {
        const coinsDisplay = document.getElementById('marioCoins');
        const livesDisplay = document.getElementById('marioLives');
        
        if (coinsDisplay) coinsDisplay.textContent = this.coins;
        if (livesDisplay) livesDisplay.textContent = this.lives;
    },
    
    // Sons simples (Web Audio API)
    playSound(type) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            switch (type) {
                case 'jump':
                    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.1);
                    break;
                    
                case 'coin':
                    oscillator.frequency.setValueAtTime(988, audioCtx.currentTime);
                    oscillator.frequency.setValueAtTime(1319, audioCtx.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.2);
                    break;
                    
                case 'stomp':
                    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.15);
                    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.15);
                    break;
                    
                case 'die':
                    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.5);
                    break;
                    
                case 'win':
                    const notes = [523, 659, 784, 1047];
                    notes.forEach((freq, i) => {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
                        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.15);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.2);
                        osc.start(audioCtx.currentTime + i * 0.15);
                        osc.stop(audioCtx.currentTime + i * 0.15 + 0.2);
                    });
                    return;
            }
        } catch (e) {
            // Sons non supportés, ignorer
        }
    },
    
    // Rendu
    draw() {
        const ctx = this.ctx;
        const ts = this.TILE_SIZE;
        const camX = this.camera.x;
        
        // Fond - Ciel bleu
        ctx.fillStyle = '#5c94fc';
        ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        
        // Dessiner quelques nuages décoratifs
        ctx.fillStyle = '#ffffff';
        this.drawCloud(100 - camX * 0.3, 50);
        this.drawCloud(350 - camX * 0.3, 80);
        this.drawCloud(600 - camX * 0.3, 40);
        this.drawCloud(900 - camX * 0.3, 70);
        this.drawCloud(1200 - camX * 0.3, 55);
        
        // Dessiner les collines en arrière-plan
        ctx.fillStyle = '#00a800';
        this.drawHill(80 - camX * 0.5, this.CANVAS_HEIGHT - 64, 120, 50);
        this.drawHill(400 - camX * 0.5, this.CANVAS_HEIGHT - 64, 180, 70);
        this.drawHill(800 - camX * 0.5, this.CANVAS_HEIGHT - 64, 140, 55);
        this.drawHill(1100 - camX * 0.5, this.CANVAS_HEIGHT - 64, 160, 60);
        
        // Dessiner les tiles
        for (let row = 0; row < this.levelData.length; row++) {
            for (let col = 0; col < this.levelData[row].length; col++) {
                const tile = this.levelData[row][col];
                const x = col * ts - camX;
                const y = row * ts;
                
                // Ne dessiner que les tiles visibles
                if (x < -ts || x > this.CANVAS_WIDTH) continue;
                
                switch (tile) {
                    case '1': // Sol
                        this.drawGroundTile(x, y, ts);
                        break;
                    case '2': // Brique
                        this.drawBrickTile(x, y, ts);
                        break;
                    case '3': // Bloc ? (déjà géré par les pièces)
                        this.drawQuestionBlock(x, y, ts);
                        break;
                    case '4': // Tuyau
                        this.drawPipe(x, y, ts);
                        break;
                    case '5': // Base du drapeau
                    case 'F': // Drapeau
                        this.drawFlag(x, y, ts);
                        break;
                    case 'P': // Poteau du drapeau
                        this.drawFlagPole(x, y, ts);
                        break;
                }
            }
        }
        
        // Dessiner les pièces
        this.coinsList.forEach(coin => {
            if (coin.collected) return;
            const x = coin.x - camX;
            const y = coin.y + Math.sin(Date.now() / 200 + coin.animOffset) * 3;
            
            if (x < -20 || x > this.CANVAS_WIDTH + 20) return;
            
            this.drawCoin(x, y);
        });
        
        // Dessiner les ennemis
        this.enemies.forEach(enemy => {
            if (!enemy.alive) return;
            const x = enemy.x - camX;
            
            if (x < -50 || x > this.CANVAS_WIDTH + 50) return;
            
            this.drawEnemy(x, enemy.y, enemy);
        });
        
        // Dessiner le joueur
        this.drawPlayer();
    },
    
    drawCloud(x, y) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y - 5, 25, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y + 10, 22, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawHill(x, y, width, height) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + width / 2, y - height, x + width, y);
        ctx.fill();
    },
    
    drawGroundTile(x, y, size) {
        const ctx = this.ctx;
        
        // Sol marron
        ctx.fillStyle = '#c84c0c';
        ctx.fillRect(x, y, size, size);
        
        // Herbe verte sur le dessus
        ctx.fillStyle = '#00a800';
        ctx.fillRect(x, y, size, 8);
        
        // Détails
        ctx.fillStyle = '#9c4000';
        ctx.fillRect(x + 4, y + 12, 8, 8);
        ctx.fillRect(x + 20, y + 20, 8, 8);
    },
    
    drawBrickTile(x, y, size) {
        const ctx = this.ctx;
        
        // Fond brique
        ctx.fillStyle = '#c84c0c';
        ctx.fillRect(x, y, size, size);
        
        // Lignes de mortier
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y + size / 2 - 1, size, 2);
        ctx.fillRect(x + size / 2 - 1, y, 2, size / 2);
        ctx.fillRect(x + size / 4 - 1, y + size / 2, 2, size / 2);
        ctx.fillRect(x + size * 3 / 4 - 1, y + size / 2, 2, size / 2);
    },
    
    drawQuestionBlock(x, y, size) {
        const ctx = this.ctx;
        
        // Fond jaune
        ctx.fillStyle = '#ffa500';
        ctx.fillRect(x, y, size, size);
        
        // Bordure
        ctx.fillStyle = '#c87000';
        ctx.fillRect(x, y, size, 3);
        ctx.fillRect(x, y, 3, size);
        ctx.fillRect(x + size - 3, y, 3, size);
        ctx.fillRect(x, y + size - 3, size, 3);
        
        // Point d'interrogation
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', x + size / 2, y + size / 2 + 7);
    },
    
    drawPipe(x, y, size) {
        const ctx = this.ctx;
        
        // Corps du tuyau
        ctx.fillStyle = '#00a800';
        ctx.fillRect(x + 4, y, size - 8, size);
        
        // Rebord supérieur
        ctx.fillStyle = '#00c800';
        ctx.fillRect(x, y, size, 10);
        
        // Ombres
        ctx.fillStyle = '#006000';
        ctx.fillRect(x + size - 8, y + 10, 4, size - 10);
    },
    
    drawFlag(x, y, size) {
        const ctx = this.ctx;
        
        // Poteau
        ctx.fillStyle = '#00a800';
        ctx.fillRect(x + size / 2 - 3, y, 6, size * 3);
        
        // Drapeau triangulaire
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(x + size / 2 + 3, y + 10);
        ctx.lineTo(x + size / 2 + 30, y + 25);
        ctx.lineTo(x + size / 2 + 3, y + 40);
        ctx.fill();
        
        // Boule au sommet
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + 5, 6, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawFlagPole(x, y, size) {
        const ctx = this.ctx;
        // Continuation du poteau
        ctx.fillStyle = '#00a800';
        ctx.fillRect(x + size / 2 - 3, y, 6, size);
    },
    
    drawCoin(x, y) {
        const ctx = this.ctx;
        
        // Animation de rotation (simulée)
        const stretch = Math.abs(Math.sin(Date.now() / 150));
        const width = 8 + stretch * 8;
        
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.ellipse(x + 8, y + 8, width / 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Reflet
        ctx.fillStyle = '#fff8e0';
        ctx.beginPath();
        ctx.ellipse(x + 6, y + 6, width / 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawEnemy(x, y, enemy) {
        const ctx = this.ctx;
        const w = enemy.width;
        const h = enemy.height;
        
        // Corps (Goomba style)
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2 - 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pieds
        ctx.fillStyle = '#000000';
        const footOffset = Math.sin(Date.now() / 100) * 2;
        ctx.fillRect(x + 2, y + h - 8, 10, 8);
        ctx.fillRect(x + w - 12, y + h - 8, 10, 8);
        
        // Yeux
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + w / 3, y + h / 3, 5, 0, Math.PI * 2);
        ctx.arc(x + w * 2 / 3, y + h / 3, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilles
        ctx.fillStyle = '#000000';
        const pupilOffset = enemy.vx < 0 ? -2 : 2;
        ctx.beginPath();
        ctx.arc(x + w / 3 + pupilOffset, y + h / 3, 2, 0, Math.PI * 2);
        ctx.arc(x + w * 2 / 3 + pupilOffset, y + h / 3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Sourcils méchants
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w / 3 - 5, y + h / 4 - 2);
        ctx.lineTo(x + w / 3 + 5, y + h / 4 + 2);
        ctx.moveTo(x + w * 2 / 3 - 5, y + h / 4 + 2);
        ctx.lineTo(x + w * 2 / 3 + 5, y + h / 4 - 2);
        ctx.stroke();
    },
    
    drawPlayer() {
        const ctx = this.ctx;
        const p = this.player;
        const x = p.x - this.camera.x;
        const y = p.y;
        
        // Corps (rouge)
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x + 4, y + 10, 16, 14);
        
        // Salopette (bleue)
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(x + 4, y + 18, 16, 14);
        
        // Tête
        ctx.fillStyle = '#ffccaa';
        ctx.beginPath();
        ctx.arc(x + 12, y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Casquette
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x + 2, y + 2, 20, 6);
        if (p.facingRight) {
            ctx.fillRect(x + 16, y, 8, 8);
        } else {
            ctx.fillRect(x, y, 8, 8);
        }
        
        // Yeux
        ctx.fillStyle = '#000000';
        if (p.facingRight) {
            ctx.fillRect(x + 14, y + 6, 3, 3);
        } else {
            ctx.fillRect(x + 7, y + 6, 3, 3);
        }
        
        // Moustache
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 8, y + 12, 8, 2);
        
        // Jambes (animation)
        ctx.fillStyle = '#0000ff';
        if (!p.onGround) {
            // En l'air
            ctx.fillRect(x + 4, y + 28, 6, 6);
            ctx.fillRect(x + 14, y + 26, 6, 6);
        } else if (Math.abs(p.vx) > 0.5) {
            // En mouvement
            const legOffset = p.animFrame * 3;
            ctx.fillRect(x + 4, y + 28 + legOffset, 6, 6 - legOffset);
            ctx.fillRect(x + 14, y + 28 - legOffset, 6, 6 + legOffset);
        } else {
            // Immobile
            ctx.fillRect(x + 4, y + 28, 6, 6);
            ctx.fillRect(x + 14, y + 28, 6, 6);
        }
        
        // Chaussures
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 2, y + 32, 8, 4);
        ctx.fillRect(x + 14, y + 32, 8, 4);
    }
};

// Fonction globale pour ouvrir le jeu Mario
function openMarioGame() {
    // Ouvrir la fenêtre
    openWindow('mario');
    
    // Initialiser le jeu après un court délai pour que la fenêtre soit prête
    setTimeout(() => {
        MarioGame.init();
        
        // Setup des boutons
        const startBtn = document.getElementById('marioStartBtn');
        const restartBtn = document.getElementById('marioRestartBtn');
        const closeBtn = document.getElementById('marioCloseBtn');
        
        if (startBtn) {
            startBtn.onclick = () => MarioGame.start();
        }
        
        if (restartBtn) {
            restartBtn.onclick = () => {
                const winScreen = document.getElementById('marioWinScreen');
                if (winScreen) winScreen.classList.remove('show');
                
                const overlay = document.getElementById('marioOverlay');
                if (overlay) overlay.classList.remove('hidden');
                
                MarioGame.reset();
            };
        }
        
        if (closeBtn) {
            closeBtn.onclick = () => {
                closeWindow('mario');
                MarioGame.stop();
            };
        }
        
        // Pause/Resume quand la fenêtre perd/regagne le focus
        const marioWindow = document.getElementById('window-mario');
        if (marioWindow) {
            // Observer quand la fenêtre perd le focus
            marioWindow.addEventListener('mouseenter', () => {
                if (MarioGame.isPaused && MarioGame.isRunning) {
                    MarioGame.resume();
                }
            });
            
            marioWindow.addEventListener('mouseleave', () => {
                if (MarioGame.isRunning && !MarioGame.isPaused && !MarioGame.hasWon && !MarioGame.gameOver) {
                    MarioGame.pause();
                }
            });
        }
        
        // Pause quand l'onglet perd le focus
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && MarioGame.isRunning) {
                MarioGame.pause();
            } else if (!document.hidden && MarioGame.isPaused) {
                MarioGame.resume();
            }
        });
    }, 100);
}

// Fonction pour fermer proprement le jeu Mario
function closeMarioGame() {
    MarioGame.stop();
    
    // Cacher les écrans
    const overlay = document.getElementById('marioOverlay');
    const winScreen = document.getElementById('marioWinScreen');
    const hud = document.getElementById('marioHUD');
    
    if (overlay) overlay.classList.remove('hidden');
    if (winScreen) winScreen.classList.remove('show');
    if (hud) hud.classList.remove('show');
}
