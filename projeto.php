<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://unpkg.com https://www.google-analytics.com https://region1.google-analytics.com https://region1.analytics.google.com;");

require __DIR__ . '/includes/site-config.php';

$navLinks = getNavLinks('projeto');

$pageTitle = 'Projeto · Hub Jurídico com IA · DiegoPereira{dev}';
$metaDescription = 'Case study: hub de oportunidades jurídicas com IA. Desde o início do ano, FastAPI, Next.js, LangGraph, PostgreSQL e triagem guiada — em desenvolvimento.';
$metaKeywords = 'FastAPI, LangGraph, Next.js, IA jurídica, triagem, Python, React, full-stack';
$canonicalUrl = 'https://diegopereirace.com.br/projeto.php';
$ogTitle = 'Projeto · Hub Jurídico com IA';
$ogDescription = $metaDescription;
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
    <link rel="icon" type="image/avif" href="/assets/imgs/favicon.avif"/>
    <link rel="icon" type="image/png" href="/assets/imgs/favicon.png"/>
    <link rel="apple-touch-icon" href="/assets/imgs/favicon.png"/>
    <link rel="manifest" href="/manifest.json"/>
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="DiegoPereira{dev}" />
    <meta property="og:title" content="<?php echo htmlspecialchars($ogTitle, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($ogDescription, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta property="og:url" content="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta property="og:image" content="https://diegopereirace.com.br/assets/imgs/logo-header.avif" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($ogTitle, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($ogDescription, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" />
    <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="assets/js/tailwind-config.js"></script>
    <script src="https://unpkg.com/lucide@latest" defer></script>
    <style>
        body { font-family: 'Outfit', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        .sr-only:focus { position: fixed; width: auto; height: auto; padding: 1rem 1.5rem; margin: 1rem; overflow: visible; clip: auto; white-space: normal; z-index: 9999; background: #10b981; color: white; border-radius: 0.5rem; font-weight: 600; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(16, 185, 129, 0.2); }
        .delay-100 { animation-delay: 0.1s; }
        .hidden { display: none; }
    </style>
</head>
<body class="bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
    <a href="#main-content" class="sr-only">Pular para o conteúdo principal</a>

    <?php include 'includes/header.php'; ?>

    <main id="main-content" role="main" class="pt-20">
        <?php include 'includes/project-case.php'; ?>
    </main>

    <?php include 'includes/footer.php'; ?>

    <script src="assets/js/main.js" defer></script>
    <script>
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            window.addEventListener('load', function() {
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        }
    </script>
</body>
</html>
