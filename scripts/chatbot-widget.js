/**
 * ========================================
 * CHATBOT WIDGET - Script indépendant
 * Widget flottant pour intégration rapide
 * ========================================
 */

(function() {
    'use strict';

    // Réponses du bot (version simplifiée)
    const RESPONSES = {
        cpu: "Le **CPU** est le cerveau du PC ! ⚙️ Intel et AMD sont les leaders. Un bon CPU = multitâche fluide.",
        gpu: "Le **GPU** gère le rendu graphique 🎮 NVIDIA et AMD dominent le marché. Essentiel pour le gaming !",
        ram: "La **RAM** est la mémoire vive 🧬 8Go minimum, 16Go recommandé pour le gaming/dev.",
        linux: "**Linux** 🐧 est gratuit et parfait pour donner une seconde vie aux vieux PC !",
        ecologie: "🌱 Prolonge la vie de tes appareils, achète reconditionné, éteins au lieu de veille !",
        reconditionnement: "♻️ Le **reconditionné** coûte 30-50% moins cher et évite 200kg de CO2 !",
        default: "Je peux t'aider avec les composants PC (CPU, GPU, RAM...), Linux, ou le numérique responsable ! 🤖"
    };

    // Éléments DOM
    let toggle, window, close, form, input, messages;

    // Initialisation
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        toggle = document.getElementById('widgetToggle');
        window = document.getElementById('widgetWindow');
        close = document.getElementById('widgetClose');
        form = document.getElementById('widgetForm');
        input = document.getElementById('widgetInput');
        messages = document.getElementById('widgetMessages');

        if (!toggle || !window) return;

        // Events
        toggle.addEventListener('click', toggleWidget);
        close?.addEventListener('click', closeWidget);
        form?.addEventListener('submit', handleSubmit);

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.classList.contains('is-open')) {
                closeWidget();
            }
        });
    }

    function toggleWidget() {
        const isOpen = window.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        
        if (isOpen && input) {
            setTimeout(() => input.focus(), 300);
        }
    }

    function closeWidget() {
        window.classList.remove('is-open');
        toggle.classList.remove('is-open');
    }

    function handleSubmit(e) {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        // Réponse du bot après un délai
        setTimeout(() => {
            const response = getResponse(text);
            addMessage(response, 'bot');
        }, 600 + Math.random() * 400);
    }

    function addMessage(content, type) {
        const div = document.createElement('div');
        div.className = `chat-message chat-message--${type}`;
        
        const avatar = type === 'user' ? '👤' : '🤖';
        
        // Convertir markdown basique
        let html = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        div.innerHTML = `
            <div class="chat-message__avatar"><span>${avatar}</span></div>
            <div class="chat-message__content">
                <div class="chat-message__bubble">${html}</div>
            </div>
        `;

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function getResponse(text) {
        const lower = text.toLowerCase();
        
        for (const [key, response] of Object.entries(RESPONSES)) {
            if (key !== 'default' && lower.includes(key)) {
                return response;
            }
        }
        
        // Mots-clés alternatifs
        if (lower.includes('processeur')) return RESPONSES.cpu;
        if (lower.includes('graphique') || lower.includes('carte')) return RESPONSES.gpu;
        if (lower.includes('mémoire')) return RESPONSES.ram;
        if (lower.includes('ubuntu') || lower.includes('pingouin')) return RESPONSES.linux;
        if (lower.includes('vert') || lower.includes('environnement')) return RESPONSES.ecologie;
        if (lower.includes('occasion') || lower.includes('seconde')) return RESPONSES.reconditionnement;
        
        // Salutations
        if (/^(salut|bonjour|hello|hey|coucou)/i.test(lower)) {
            return "Salut ! 👋 Comment puis-je t'aider aujourd'hui ?";
        }
        
        return RESPONSES.default;
    }

})();
