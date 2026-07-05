<?php
// Configurações de segurança do PHP
declare(strict_types=1);

// Prevenir informações sensíveis em erros
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);

// Headers de segurança
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com https://esm.run https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com https://unpkg.com https://www.google-analytics.com https://region1.google-analytics.com https://region1.analytics.google.com;");

require __DIR__ . '/includes/site-config.php';

$navLinks = getNavLinks('home');

$pageTitle = 'DiegoPereira{dev}';
$metaDescription = 'Desenvolvedor Sênior PHP/Drupal e full-stack Python+React. Aprendizado contínuo com IA aplicada: LangGraph, FastAPI e Next.js.';
$metaKeywords = 'Desenvolvedor Sênior, PHP, Drupal, Python, FastAPI, React, Next.js, LangGraph, IA, Full-stack';
$canonicalUrl = 'https://diegopereirace.com.br/';
$ogTitle = 'DiegoPereira{dev} · Full-stack PHP/Drupal + Python/React + IA';
$ogDescription = $metaDescription;
$includeGemini = true;
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo htmlspecialchars($metaDescription, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>"/>
    <meta name="keywords" content="<?php echo htmlspecialchars($metaKeywords, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>"/>
    <meta name="author" content="Diego Pereira"/>
    <meta name="theme-color" content="#0f172a"/>
    <meta name="color-scheme" content="dark">
    <link rel="canonical" href="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>"/>
    <link rel="shortlink" href="https://diegopereirace.com.br/"/>

    <!-- Ícones do site -->
    <link rel="icon" type="image/avif" href="/assets/imgs/favicon.avif"/>
    <link rel="icon" type="image/png" href="/assets/imgs/favicon.png"/>
    <link rel="apple-touch-icon" href="/assets/imgs/favicon.png"/>
    <link rel="manifest" href="/manifest.json"/>

    <!-- Open Graph para preview no WhatsApp e redes sociais -->
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DiegoPereira{dev}" />
    <meta property="og:title" content="<?php echo htmlspecialchars($ogTitle, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($ogDescription, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta property="og:url" content="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta property="og:image" content="https://diegopereirace.com.br/assets/imgs/logo-header.avif" />
    <meta property="og:image:type" content="image/avif" />

    <!-- Twitter Cards (compatibilidade extra) -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($ogTitle, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($ogDescription, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta name="twitter:image" content="https://diegopereirace.com.br/assets/imgs/logo-header.avif" />

    <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?></title>
    
    <!-- DNS Prefetch para domínios externos -->
    <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">
    <link rel="dns-prefetch" href="https://unpkg.com">
    <link rel="dns-prefetch" href="https://esm.run">
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    
    <!-- Preconnect para recursos críticos -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    
    <!-- Preload de recursos críticos -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>
    
    <!-- Scripts com estratégia de carregamento otimizada -->
    <!-- Suprimir aviso do Tailwind CDN antes do carregamento -->
    <script>
        (function () {
            var originalWarn = window.console && window.console.warn ? window.console.warn.bind(window.console) : null;
            if (!originalWarn) {
                return;
            }
            window.console.warn = function () {
                var first = arguments[0];
                if (typeof first === 'string' && first.indexOf('cdn.tailwindcss.com') !== -1) {
                    return;
                }
                originalWarn.apply(window.console, arguments);
            };
        })();
    </script>
    <!-- Tailwind CDN: Usado intencionalmente para prototipagem rápida -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="assets/js/tailwind-config.js"></script>
    <script src="https://unpkg.com/lucide@latest" defer></script>
    <script type="importmap">
    {
        "imports": {
            "@google/genai": "https://esm.run/@google/generative-ai@0.21.0"
        }
    }
    </script>
    <style>
        body { 
            font-family: 'Outfit', sans-serif; 
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Space Grotesk', sans-serif;
            letter-spacing: -0.02em;
        }
        .font-mono { 
            font-family: 'JetBrains Mono', monospace; 
        }
        
        /* Skip link para acessibilidade */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
        
        .sr-only:focus {
            position: fixed;
            width: auto;
            height: auto;
            padding: 1rem 1.5rem;
            margin: 1rem;
            overflow: visible;
            clip: auto;
            white-space: normal;
            z-index: 9999;
            background: #10b981;
            color: white;
            border-radius: 0.5rem;
            font-weight: 600;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        /* Animações modernas */
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
            opacity: 0;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .animate-slide-in-right {
            animation: slideInRight 0.7s ease-out forwards;
            opacity: 0;
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-gradient {
            background: linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #10b981);
            background-size: 300% 300%;
            animation: gradientShift 8s ease infinite;
        }
        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(16, 185, 129, 0.2);
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        
        .hidden { display: none; }
    </style>
    
    <!-- Google Analytics (carregado de forma assíncrona) -->
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-V8Q40NWWTR');
        
        // Carregar GA de forma não bloqueante
        window.addEventListener('load', function() {
            var script = document.createElement('script');
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-V8Q40NWWTR';
            script.async = true;
            document.head.appendChild(script);
        });
    </script>
    
    <script>
        // Dados PHP sanitizados para JavaScript
        window.PHP_DATA = {
            API_KEY: <?php echo json_encode($apiKey, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR); ?>,
            SYSTEM_INSTRUCTION: <?php echo json_encode($systemInstruction, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR); ?>
        };
        
        // Prevenir acesso direto via console
        Object.freeze(window.PHP_DATA);
    </script>
</head>
<body class="bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
    <!-- Skip to main content para acessibilidade -->
    <a href="#main-content" class="sr-only">Pular para o conteúdo principal</a>
    
    <?php include 'includes/header.php'; ?>
    
    <main id="main-content" role="main">
        <?php include 'includes/hero.php'; ?>
        <?php include 'includes/about.php'; ?>
        <?php include 'includes/skills.php'; ?>
    </main>
    
    <?php include 'includes/footer.php'; ?>
    
    <script src="assets/js/main.js" defer></script>
    <script src="assets/js/code-generator.js" defer></script>
    <script>
        // Executar após carregamento do Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            window.addEventListener('load', function() {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        }
    </script>
</body>
</html>