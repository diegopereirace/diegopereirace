// Main JavaScript file

// Registrar Service Worker para performance e cache
if ('serviceWorker' in navigator) {
    // Verificar se está em ambiente seguro (HTTPS, localhost, ou DDEV)
    const isSecureContext = location.protocol === 'https:' || 
                           location.hostname === 'localhost' || 
                           location.hostname === '127.0.0.1' ||
                           location.hostname.includes('.ddev.site') ||
                           location.hostname.includes('.local');
    
    if (isSecureContext) {
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
                    console.warn('⚠️ Service Worker não pôde ser registrado:', err.message);
                });
        });
    } else {
        console.info('ℹ️ Service Worker requer HTTPS em produção');
    }
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

// Desktop Projetos flyout — keyboard toggle (FR-004)
const desktopProjetosWrap = document.getElementById('nav-projetos-desktop-wrap');
const desktopProjetosBtn = document.getElementById('nav-projetos-desktop-trigger');

function setDesktopFlyoutOpen(open) {
    if (!desktopProjetosBtn || !desktopProjetosWrap) return;
    desktopProjetosBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    desktopProjetosWrap.classList.toggle('nav-flyout-force-open', open);
}

if (desktopProjetosBtn && desktopProjetosWrap) {
    desktopProjetosBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const open = desktopProjetosBtn.getAttribute('aria-expanded') !== 'true';
        setDesktopFlyoutOpen(open);
    });

    desktopProjetosBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const open = desktopProjetosBtn.getAttribute('aria-expanded') !== 'true';
            setDesktopFlyoutOpen(open);
        }
        if (e.key === 'Escape') {
            setDesktopFlyoutOpen(false);
            desktopProjetosBtn.focus();
        }
    });

    desktopProjetosWrap.addEventListener('focusin', () => {
        desktopProjetosBtn.setAttribute('aria-expanded', 'true');
    });

    desktopProjetosWrap.addEventListener('focusout', (e) => {
        if (!desktopProjetosWrap.contains(e.relatedTarget)) {
            setDesktopFlyoutOpen(false);
        }
    });

    desktopProjetosWrap.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setDesktopFlyoutOpen(false);
            desktopProjetosBtn.focus();
        }
    });
}

// Mobile Projetos accordion
const mobileProjetosBtn = document.getElementById('nav-projetos-mobile-trigger');
const mobileProjetosPanel = document.getElementById('nav-projetos-mobile-panel');

if (mobileProjetosBtn && mobileProjetosPanel) {
    mobileProjetosBtn.addEventListener('click', () => {
        const expanded = mobileProjetosBtn.getAttribute('aria-expanded') === 'true';
        mobileProjetosBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        mobileProjetosPanel.classList.toggle('hidden', expanded);
    });
}

// Reset submenu state on viewport cross (research R7)
function resetNavSubmenus() {
    setDesktopFlyoutOpen(false);
    if (mobileProjetosBtn) {
        mobileProjetosBtn.setAttribute('aria-expanded', 'false');
    }
    if (mobileProjetosPanel) {
        mobileProjetosPanel.classList.add('hidden');
    }
}

window.matchMedia('(min-width: 768px)').addEventListener('change', resetNavSubmenus);

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

