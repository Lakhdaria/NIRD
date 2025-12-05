/**
 * ========================================
 * CARTE DE COMPÉTENCES - SCRIPT
 * Gestion du questionnaire et génération de carte
 * ========================================
 */

// ============================================
// CONFIGURATION & DONNÉES
// ============================================

/**
 * Ordre des catégories du questionnaire
 */
const CATEGORIES = ['identity', 'technicite', 'ecologie', 'innovation', 'collaboration', 'creativite', 'impact'];

/**
 * Labels des statistiques
 */
const STAT_LABELS = {
    technicite: 'Technicité',
    ecologie: 'Écologie',
    innovation: 'Innovation',
    collaboration: 'Collaboration',
    creativite: 'Créativité',
    impact: 'Impact social'
};

/**
 * Profils d'avatar selon la stat dominante
 */
const AVATAR_PROFILES = {
    technicite: {
        title: 'Le Technicien',
        image: 'assets/images/technique.jpg',
        description: 'Tu comprends comment les choses fonctionnent et tu transformes vite une idée en solution concrète. Le code et les systèmes n\'ont pas de secret pour toi !'
    },
    ecologie: {
        title: 'L\'Éco-responsable',
        image: 'assets/images/ecolo.jpg',
        description: 'Tu penses réemploi, durabilité et sobriété. Tu cherches toujours la solution la plus respectueuse de l\'environnement.'
    },
    innovation: {
        title: 'L\'Innovateur',
        image: 'assets/images/innovatif.jpg',
        description: 'Tu adores tester des idées nouvelles, prototyper et apprendre en itérant. L\'échec est juste une étape vers le succès !'
    },
    collaboration: {
        title: 'Le Collaborateur',
        image: 'assets/images/social.jpg',
        description: 'Tu fédères, écoutes et embarques les autres. Le travail en équipe te motive et tu sais créer une vraie dynamique de groupe.'
    },
    creativite: {
        title: 'Le Créatif',
        image: 'assets/images/creatif.jpg',
        description: 'Tu imagines et racontes. Ton sens visuel et tes idées donnent un style unique aux projets.'
    },
    impact: {
        title: 'L\'Engagé',
        image: 'assets/images/social.jpg',
        description: 'Tu cherches l\'utilité sociale et les liens humains. Pour toi, le numérique est un outil au service de la communauté.'
    }
};

/**
 * Formulaires par catégorie
 */
const FORMS = {
    identity: `
        <h3>👤 Identité</h3>
        <div class="form-group">
            <label for="firstName">Prénom *</label>
            <input type="text" id="firstName" name="firstName" placeholder="Votre prénom" autocomplete="given-name" required>
        </div>
        <div class="form-group">
            <label for="lastName">Nom *</label>
            <input type="text" id="lastName" name="lastName" placeholder="Votre nom" autocomplete="family-name" required>
        </div>
    `,
    
    technicite: `
        <h3>⚙️ Technicité</h3>
        <div class="form-group">
            <label for="q1">Quelle est ton aisance générale en informatique ?</label>
            <select id="q1" name="q1">
                <option value="0">Très faible</option>
                <option value="10">Moyenne</option>
                <option value="20">Bonne</option>
                <option value="30">Très bonne</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q2">Quelle utilisation fais-tu de Linux ?</label>
            <select id="q2" name="q2">
                <option value="0">Jamais utilisé</option>
                <option value="10">Utilisation basique</option>
                <option value="20">Utilisation régulière</option>
                <option value="30">Utilisation avancée</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q3">Quelle est la meilleure pratique d'installation ?</label>
            <select id="q3" name="q3">
                <option value="0">Installer sans vérifier l'image ISO</option>
                <option value="10">Installer depuis une clé inconnue</option>
                <option value="20">Vérifier le SHA256 avant installation</option>
                <option value="30">Vérifier SHA256, tester la clé et partitionner</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q4">Comment sécuriser un compte Linux ?</label>
            <select id="q4" name="q4">
                <option value="0">Mot de passe "1234"</option>
                <option value="10">Mot de passe long mais réutilisé</option>
                <option value="20">Mot de passe unique + sudo limité</option>
                <option value="30">Mot de passe unique + 2FA + pare-feu</option>
            </select>
        </div>
    `,
    
    ecologie: `
        <h3>🌱 Écologie</h3>
        <div class="form-group">
            <label for="q5">Quelles sont tes pratiques écoresponsables ?</label>
            <select id="q5" name="q5">
                <option value="0">Aucune</option>
                <option value="10">Quelques actions simples</option>
                <option value="20">Plusieurs habitudes régulières</option>
                <option value="30">Très engagé</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q6">Ton investissement dans un projet environnemental ?</label>
            <select id="q6" name="q6">
                <option value="0">Jamais</option>
                <option value="10">Occasionnel</option>
                <option value="20">Plusieurs fois</option>
                <option value="30">J'en ai organisé</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q7">Comment réutiliser au mieux un vieux PC ?</label>
            <select id="q7" name="q7">
                <option value="0">Le jeter</option>
                <option value="10">Le laisser au placard</option>
                <option value="20">Donner à une association</option>
                <option value="30">Réinstaller Linux léger et donner</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q8">Quelle action réduit le mieux l'empreinte carbone ?</label>
            <select id="q8" name="q8">
                <option value="0">Installer un antivirus gratuit</option>
                <option value="10">Baisser la luminosité</option>
                <option value="20">Réduire les mails et nettoyer le cloud</option>
                <option value="30">Acheter moins et prolonger la durée de vie</option>
            </select>
        </div>
    `,
    
    innovation: `
        <h3>💡 Innovation</h3>
        <div class="form-group">
            <label for="q9">À quelle fréquence proposes-tu des idées en équipe ?</label>
            <select id="q9" name="q9">
                <option value="0">Rarement</option>
                <option value="10">Parfois</option>
                <option value="20">Souvent</option>
                <option value="30">Très régulièrement</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q10">As-tu déjà mené un projet personnel innovant ?</label>
            <select id="q10" name="q10">
                <option value="0">Non</option>
                <option value="10">Oui mais très léger</option>
                <option value="20">Plusieurs projets basiques</option>
                <option value="30">Projet structuré avec prototype</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q11">Qu'est-ce qu'un prototype ?</label>
            <select id="q11" name="q11">
                <option value="0">Un produit final</option>
                <option value="10">Un dessin</option>
                <option value="20">Modèle fonctionnel simplifié</option>
                <option value="30">Modèle testable pour valider une idée</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q12">Meilleur outil pour tester une idée rapidement ?</label>
            <select id="q12" name="q12">
                <option value="0">Business plan de 30 pages</option>
                <option value="10">Document texte</option>
                <option value="20">Prototype ou maquette</option>
                <option value="30">Prototype + tests utilisateurs</option>
            </select>
        </div>
    `,
    
    collaboration: `
        <h3>🤝 Collaboration</h3>
        <div class="form-group">
            <label for="q13">Ton confort en équipe ?</label>
            <select id="q13" name="q13">
                <option value="0">Je préfère être seul</option>
                <option value="10">Je m'adapte</option>
                <option value="20">À l'aise</option>
                <option value="30">Je peux encadrer</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q14">Ton rôle habituel ?</label>
            <select id="q14" name="q14">
                <option value="0">Observateur</option>
                <option value="10">Participant</option>
                <option value="20">Communicateur</option>
                <option value="30">Coordinateur</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q15">Ton attitude en cas de conflit ?</label>
            <select id="q15" name="q15">
                <option value="0">Ignorer</option>
                <option value="10">Imposer son opinion</option>
                <option value="20">Chercher un compromis</option>
                <option value="30">Analyser puis proposer une solution</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q16">Ton comportement coopératif ?</label>
            <select id="q16" name="q16">
                <option value="0">Parler plus fort</option>
                <option value="10">Laisser décider sans participer</option>
                <option value="20">Encourager les autres</option>
                <option value="30">Répartir les rôles et aider</option>
            </select>
        </div>
    `,
    
    creativite: `
        <h3>🎨 Créativité</h3>
        <div class="form-group">
            <label for="q17">Tes activités créatives ?</label>
            <select id="q17" name="q17">
                <option value="0">Jamais</option>
                <option value="10">Occasionnellement</option>
                <option value="20">Régulièrement</option>
                <option value="30">Souvent</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q18">Ton imagination ?</label>
            <select id="q18" name="q18">
                <option value="0">Faible</option>
                <option value="10">Moyenne</option>
                <option value="20">Bonne</option>
                <option value="30">Très bonne</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q19">Outil pour brainstormer ?</label>
            <select id="q19" name="q19">
                <option value="0">Ne rien écrire</option>
                <option value="10">Long texte</option>
                <option value="20">Mindmap</option>
                <option value="30">Mindmap + tri + vote</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q20">Qu'est-ce qu'un moodboard ?</label>
            <select id="q20" name="q20">
                <option value="0">Liste de tâches</option>
                <option value="10">Photos au hasard</option>
                <option value="20">Collage d'inspirations</option>
                <option value="30">Collage pour définir un style</option>
            </select>
        </div>
    `,
    
    impact: `
        <h3>❤️ Impact social</h3>
        <div class="form-group">
            <label for="q21">Ton engagement social ?</label>
            <select id="q21" name="q21">
                <option value="0">Aucun</option>
                <option value="10">Ponctuel</option>
                <option value="20">Régulier</option>
                <option value="30">Très engagé</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q22">Projet pour la collectivité ?</label>
            <select id="q22" name="q22">
                <option value="0">Non</option>
                <option value="10">Une fois</option>
                <option value="20">Plusieurs fois</option>
                <option value="30">Organisé / encadré</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q23">Meilleure action sociale ?</label>
            <select id="q23" name="q23">
                <option value="0">Poster sur Instagram</option>
                <option value="10">Don symbolique</option>
                <option value="20">Atelier local</option>
                <option value="30">Association régulière</option>
            </select>
        </div>
        <div class="form-group">
            <label for="q24">Façon d'aider une personne ?</label>
            <select id="q24" name="q24">
                <option value="0">Ignorer</option>
                <option value="10">Dire « ça va passer »</option>
                <option value="20">L'écouter</option>
                <option value="30">Orienter et accompagner</option>
            </select>
        </div>
    `
};

// ============================================
// ÉTAT DE L'APPLICATION
// ============================================

const AppState = {
    currentStep: 0,              // Étape actuelle (0 = identité)
    scores: {                    // Scores par catégorie
        technicite: 0,
        ecologie: 0,
        innovation: 0,
        collaboration: 0,
        creativite: 0,
        impact: 0
    },
    playerName: 'Prénom Nom',    // Nom du joueur
    isComplete: false            // Questionnaire terminé ?
};

// ============================================
// ÉLÉMENTS DOM
// ============================================

const DOM = {
    // Form & Assistant
    assistantPanel: null,
    assistantForm: null,
    assistantTitle: null,
    assistantHint: null,
    btnNext: null,
    btnReset: null,
    
    // Avatar
    avatarPanel: null,
    avatarImage: null,
    avatarTitle: null,
    avatarDescription: null,
    btnRestart: null,
    btnShare: null,
    
    // Card
    playerName: null,
    playerBadge: null,
    rating: null,
    statsGrid: null,
    
    // Progress
    progressFill: null,
    progressSteps: null,
    
    // Navigation
    burgerBtn: null,
    navMenu: null,
    
    // Particles
    particlesCanvas: null
};

// ============================================
// INITIALISATION
// ============================================

/**
 * Initialise l'application au chargement
 */
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer les éléments DOM
    initDOMReferences();
    
    // Initialiser les modules
    initNavigation();
    initParticles();
    initEventListeners();
    
    // Afficher le premier formulaire
    resetApp();
    
    console.log('🎴 Carte de compétences initialisée');
});

/**
 * Récupère les références DOM
 */
function initDOMReferences() {
    DOM.assistantPanel = document.getElementById('assistantPanel');
    DOM.assistantForm = document.getElementById('assistantForm');
    DOM.assistantTitle = document.getElementById('assistantTitle');
    DOM.assistantHint = document.getElementById('assistantHint');
    DOM.btnNext = document.getElementById('btnNext');
    DOM.btnReset = document.getElementById('btnReset');
    
    DOM.avatarPanel = document.getElementById('avatarPanel');
    DOM.avatarImage = document.getElementById('avatarImage');
    DOM.avatarTitle = document.getElementById('avatarTitle');
    DOM.avatarDescription = document.getElementById('avatarDescription');
    DOM.btnRestart = document.getElementById('btnRestart');
    DOM.btnShare = document.getElementById('btnShare');
    
    DOM.playerName = document.getElementById('playerName');
    DOM.playerBadge = document.getElementById('playerBadge');
    DOM.rating = document.getElementById('rating');
    DOM.statsGrid = document.getElementById('statsGrid');
    
    DOM.progressFill = document.getElementById('progressFill');
    DOM.progressSteps = document.getElementById('progressSteps');
    
    DOM.burgerBtn = document.getElementById('burgerBtn');
    DOM.navMenu = document.getElementById('navMenu');
    DOM.particlesCanvas = document.getElementById('particlesCanvas');
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
    
    // Fermer le menu au clic sur un lien
    DOM.navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            DOM.navMenu.classList.remove('open');
            DOM.burgerBtn.classList.remove('is-open');
            DOM.burgerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * Initialise les écouteurs d'événements
 */
function initEventListeners() {
    // Bouton Suivant
    DOM.btnNext?.addEventListener('click', handleNext);
    
    // Bouton Réinitialiser
    DOM.btnReset?.addEventListener('click', resetApp);
    
    // Bouton Recommencer (sur l'écran avatar)
    DOM.btnRestart?.addEventListener('click', resetApp);
    
    // Bouton Partager
    DOM.btnShare?.addEventListener('click', handleShare);
    
    // Clic sur les stats pour naviguer
    DOM.statsGrid?.addEventListener('click', (e) => {
        const statItem = e.target.closest('.stat-item');
        if (statItem && !AppState.isComplete) {
            const key = statItem.dataset.key;
            const stepIndex = CATEGORIES.indexOf(key);
            if (stepIndex > 0 && stepIndex <= AppState.currentStep) {
                goToStep(stepIndex);
            }
        }
    });
}

// ============================================
// GESTION DES ÉTAPES
// ============================================

/**
 * Passe à l'étape suivante
 */
function handleNext() {
    const currentCategory = CATEGORIES[AppState.currentStep];
    
    // Valider et sauvegarder les données
    if (!validateAndSaveStep(currentCategory)) {
        return;
    }
    
    // Marquer l'étape comme complétée
    markStepCompleted(AppState.currentStep);
    
    // Passer à l'étape suivante
    if (AppState.currentStep < CATEGORIES.length - 1) {
        AppState.currentStep++;
        goToStep(AppState.currentStep);
    } else {
        // Toutes les étapes sont terminées
        finishQuestionnaire();
    }
}

/**
 * Va à une étape spécifique
 */
function goToStep(stepIndex) {
    AppState.currentStep = stepIndex;
    const category = CATEGORIES[stepIndex];
    
    // Mettre à jour le formulaire
    showForm(category);
    
    // Mettre à jour la progression
    updateProgress();
    
    // Mettre à jour le titre de l'assistant
    updateAssistantTitle(category);
    
    // Marquer le stat item comme actif
    updateActiveStatItem(category);
}

/**
 * Affiche le formulaire d'une catégorie
 */
function showForm(category) {
    if (!DOM.assistantForm || !FORMS[category]) return;
    
    DOM.assistantForm.innerHTML = FORMS[category];
    
    // Animation d'entrée
    DOM.assistantForm.style.animation = 'none';
    DOM.assistantForm.offsetHeight; // Force reflow
    DOM.assistantForm.style.animation = 'slideInRight 0.3s ease-out';
}

/**
 * Met à jour le titre de l'assistant
 */
function updateAssistantTitle(category) {
    if (!DOM.assistantTitle || !DOM.assistantHint) return;
    
    if (category === 'identity') {
        DOM.assistantTitle.textContent = 'Complète tes infos';
        DOM.assistantHint.textContent = 'Entre ton prénom et ton nom pour personnaliser ta carte.';
    } else {
        const label = STAT_LABELS[category] || 'Questions';
        DOM.assistantTitle.textContent = `Questions ${label}`;
        DOM.assistantHint.textContent = 'Réponds aux questions pour calculer ton score dans cette catégorie.';
    }
}

/**
 * Valide et sauvegarde les données de l'étape actuelle
 */
function validateAndSaveStep(category) {
    if (category === 'identity') {
        return saveIdentity();
    } else {
        return saveCategoryScore(category);
    }
}

/**
 * Sauvegarde l'identité
 */
function saveIdentity() {
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    
    if (!firstName || !lastName) {
        alert('Merci de remplir ton prénom et ton nom.');
        return false;
    }
    
    AppState.playerName = `${firstName} ${lastName}`;
    
    // Mettre à jour l'affichage
    if (DOM.playerName) {
        DOM.playerName.textContent = AppState.playerName;
    }
    
    return true;
}

/**
 * Sauvegarde le score d'une catégorie
 */
function saveCategoryScore(category) {
    const form = DOM.assistantForm;
    if (!form) return false;
    
    // Récupérer tous les selects
    const selects = form.querySelectorAll('select');
    let totalScore = 0;
    
    selects.forEach(select => {
        totalScore += parseInt(select.value, 10) || 0;
    });
    
    // Normaliser sur 100 (4 questions × 30 points max = 120)
    const normalizedScore = Math.round((totalScore / 120) * 100);
    AppState.scores[category] = normalizedScore;
    
    // Mettre à jour l'affichage
    updateStatDisplay(category, normalizedScore);
    updateGlobalRating();
    
    return true;
}

// ============================================
// MISE À JOUR DE L'INTERFACE
// ============================================

/**
 * Met à jour la barre de progression
 */
function updateProgress() {
    const progress = (AppState.currentStep / (CATEGORIES.length - 1)) * 100;
    
    if (DOM.progressFill) {
        DOM.progressFill.style.width = `${progress}%`;
    }
    
    // Mettre à jour les étapes
    if (DOM.progressSteps) {
        const steps = DOM.progressSteps.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            step.classList.remove('is-active');
            if (index < AppState.currentStep) {
                step.classList.add('is-completed');
            }
            if (index === AppState.currentStep) {
                step.classList.add('is-active');
            }
        });
    }
}

/**
 * Marque une étape comme complétée
 */
function markStepCompleted(stepIndex) {
    if (DOM.progressSteps) {
        const step = DOM.progressSteps.querySelector(`[data-step="${stepIndex}"]`);
        if (step) {
            step.classList.add('is-completed');
        }
    }
}

/**
 * Met à jour l'affichage d'une stat
 */
function updateStatDisplay(category, score) {
    const valueEl = document.getElementById(`stat${category.charAt(0).toUpperCase() + category.slice(1)}`);
    const fillEl = document.querySelector(`[data-stat="${category}"]`);
    const statItem = document.querySelector(`[data-key="${category}"]`);
    
    if (valueEl) {
        valueEl.textContent = score;
    }
    
    if (fillEl) {
        fillEl.style.width = `${score}%`;
    }
    
    if (statItem) {
        statItem.classList.add('is-completed');
    }
}

/**
 * Met à jour le stat item actif
 */
function updateActiveStatItem(category) {
    // Retirer tous les actifs
    document.querySelectorAll('.stat-item').forEach(item => {
        item.classList.remove('is-active');
    });
    
    // Marquer l'actif (sauf pour identity)
    if (category !== 'identity') {
        const activeItem = document.querySelector(`[data-key="${category}"]`);
        if (activeItem) {
            activeItem.classList.add('is-active');
        }
    }
}

/**
 * Met à jour le score global
 */
function updateGlobalRating() {
    const scores = Object.values(AppState.scores);
    const filledScores = scores.filter(s => s > 0);
    
    if (filledScores.length === 0) {
        if (DOM.rating) {
            DOM.rating.querySelector('.rating-value').textContent = '0';
        }
        return;
    }
    
    const average = Math.round(filledScores.reduce((a, b) => a + b, 0) / filledScores.length);
    
    if (DOM.rating) {
        DOM.rating.querySelector('.rating-value').textContent = average;
    }
}

// ============================================
// FINALISATION
// ============================================

/**
 * Termine le questionnaire et affiche le résultat
 */
function finishQuestionnaire() {
    AppState.isComplete = true;
    
    // Déterminer le profil dominant
    const topCategory = getTopCategory();
    const profile = AVATAR_PROFILES[topCategory] || AVATAR_PROFILES.technicite;
    
    // Mettre à jour le badge
    if (DOM.playerBadge) {
        DOM.playerBadge.classList.add('is-complete');
        DOM.playerBadge.querySelector('.badge-text').textContent = profile.title;
        DOM.playerBadge.querySelector('.badge-icon').textContent = '✨';
    }
    
    // Afficher l'avatar
    showAvatarPanel(profile);
    
    // Mettre à jour la progression
    updateProgress();
    markStepCompleted(CATEGORIES.length - 1);
    
    console.log('🎉 Questionnaire terminé !', AppState.scores);
}

/**
 * Détermine la catégorie avec le score le plus élevé
 */
function getTopCategory() {
    let topKey = 'technicite';
    let topScore = 0;
    
    for (const [key, score] of Object.entries(AppState.scores)) {
        if (score > topScore) {
            topScore = score;
            topKey = key;
        }
    }
    
    return topKey;
}

/**
 * Affiche le panel avatar
 */
function showAvatarPanel(profile) {
    // Cacher l'assistant
    if (DOM.assistantPanel) {
        DOM.assistantPanel.classList.add('is-hidden');
    }
    
    // Afficher l'avatar
    if (DOM.avatarPanel) {
        DOM.avatarPanel.classList.remove('is-hidden');
    }
    
    if (DOM.avatarImage) {
        DOM.avatarImage.style.backgroundImage = `url('${profile.image}')`;
    }
    
    if (DOM.avatarTitle) {
        DOM.avatarTitle.textContent = profile.title;
    }
    
    if (DOM.avatarDescription) {
        DOM.avatarDescription.textContent = profile.description;
    }
}

/**
 * Partage le résultat
 */
function handleShare() {
    const topCategory = getTopCategory();
    const profile = AVATAR_PROFILES[topCategory];
    const score = DOM.rating?.querySelector('.rating-value')?.textContent || '0';
    
    const shareText = `🎴 J'ai créé ma carte de compétences NIRD !\n\n` +
        `Mon profil : ${profile.title}\n` +
        `Score global : ${score}/100\n\n` +
        `Crée la tienne sur NIRD ! #NIRD #NuitInfo2025`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Ma carte de compétences NIRD',
            text: shareText
        }).catch(console.error);
    } else {
        // Fallback : copier dans le presse-papiers
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Texte copié dans le presse-papiers !');
        }).catch(() => {
            alert(shareText);
        });
    }
}

// ============================================
// RESET
// ============================================

/**
 * Réinitialise l'application
 */
function resetApp() {
    // Reset state
    AppState.currentStep = 0;
    AppState.scores = {
        technicite: 0,
        ecologie: 0,
        innovation: 0,
        collaboration: 0,
        creativite: 0,
        impact: 0
    };
    AppState.playerName = 'Prénom Nom';
    AppState.isComplete = false;
    
    // Reset UI
    if (DOM.playerName) DOM.playerName.textContent = 'Prénom Nom';
    if (DOM.rating) DOM.rating.querySelector('.rating-value').textContent = '0';
    
    // Reset badge
    if (DOM.playerBadge) {
        DOM.playerBadge.classList.remove('is-complete');
        DOM.playerBadge.querySelector('.badge-text').textContent = 'En cours...';
        DOM.playerBadge.querySelector('.badge-icon').textContent = '🎯';
    }
    
    // Reset stats
    document.querySelectorAll('.stat-item__value').forEach(el => {
        el.textContent = '0';
    });
    document.querySelectorAll('.stat-item__fill').forEach(el => {
        el.style.width = '0%';
    });
    document.querySelectorAll('.stat-item').forEach(el => {
        el.classList.remove('is-active', 'is-completed');
    });
    
    // Reset progress
    if (DOM.progressFill) DOM.progressFill.style.width = '0%';
    if (DOM.progressSteps) {
        DOM.progressSteps.querySelectorAll('.progress-step').forEach((step, i) => {
            step.classList.remove('is-active', 'is-completed');
            if (i === 0) step.classList.add('is-active');
        });
    }
    
    // Afficher assistant, cacher avatar
    if (DOM.assistantPanel) DOM.assistantPanel.classList.remove('is-hidden');
    if (DOM.avatarPanel) DOM.avatarPanel.classList.add('is-hidden');
    
    // Afficher le premier formulaire
    goToStep(0);
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
        const count = Math.min(80, Math.floor((width * height) / 25000));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 0.5
        }));
    };
    
    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Dessiner les particules
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
        
        // Dessiner les lignes entre particules proches
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.25;
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
