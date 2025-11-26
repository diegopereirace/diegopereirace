// Main JavaScript file

// Registrar Service Worker para performance e cache (apenas em produção ou localhost)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname.includes('.ddev.site'))) {
    window.addEventListener('load', () => {
        const swPath = '/assets/js/sw.js';
        
        navigator.serviceWorker.register(swPath)
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration.scope);
                
                // Verificar atualizações
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 Nova versão disponível. Recarregue a página.');
                        }
                    });
                });
            })
            .catch(err => {
                // Não exibir erro se for apenas desenvolvimento sem HTTPS
                if (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname.includes('.ddev.site')) {
                    console.warn('⚠️ Service Worker não pôde ser registrado:', err.message);
                }
            });
    });
} else if ('serviceWorker' in navigator) {
    console.info('ℹ️ Service Worker requer HTTPS em produção');
}

// Otimização de scroll com throttle
let scrollTimeout;
const handleScroll = () => {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    if (window.scrollY > 20) {
        header.classList.add('bg-slate-900/90', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-800', 'py-3');
        header.classList.remove('bg-transparent', 'py-5');
    } else {
        header.classList.remove('bg-slate-900/90', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-800', 'py-3');
        header.classList.add('bg-transparent', 'py-5');
    }
};

window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(handleScroll);
}, { passive: true });

// Mobile menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    });
}

if (mobileLinks.length > 0) {
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize Lucide icons on load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

