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
                'mint': 'Linux Mint',
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

    // Validation en temps réel
    function checkFormValidity() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (username.length >= 3 && password.length >= 6) {
            continueBtn.disabled = false;
            avatar.classList.add('happy');
            avatarMood.textContent = '😄';
        } else {
            continueBtn.disabled = true;
            avatar.classList.remove('happy');
            avatarMood.textContent = '😊';
        }
    }

    usernameInput.addEventListener('input', (e) => {
        // Convertir en minuscules
        e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        SimulatorState.userData.username = e.target.value;
        checkFormValidity();
    });

    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        SimulatorState.userData.password = password;
        
        // Calculer la force du mot de passe
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Mettre à jour l'affichage
        strengthBar.className = 'strength-bar';
        if (strength <= 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Force : Faible';
            avatarMood.textContent = '😐';
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Force : Moyenne';
            avatarMood.textContent = '🙂';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Force : Forte';
            avatarMood.textContent = '😎';
        }

        checkFormValidity();
    });

    hostnameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        SimulatorState.userData.hostname = e.target.value;
    });

    continueBtn.addEventListener('click', () => {
        goToStep(5);
    });
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
// ÉTAPE 6 : BOOT & DESKTOP
// ============================================

function startBoot() {
    const bootScreen = document.getElementById('bootScreen');
    const linuxDesktop = document.getElementById('linuxDesktop');
    const desktopTime = document.getElementById('desktopTime');

    // Animation de boot pendant 3 secondes
    setTimeout(() => {
        bootScreen.style.animation = 'fadeOut 1s ease-out forwards';
        
        setTimeout(() => {
            bootScreen.style.display = 'none';
            linuxDesktop.style.display = 'block';
            linuxDesktop.style.animation = 'fadeIn 1s ease-out';
            
            // Afficher l'heure actuelle
            updateDesktopTime();
        }, 1000);
    }, 3000);
}

function updateDesktopTime() {
    const desktopTime = document.getElementById('desktopTime');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    desktopTime.textContent = `${hours}:${minutes}`;
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