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

// Função segura para carregar .env
function loadEnvFile(string $envPath): array {
    $env = [];
    
    // Validar path - prevenir path traversal
    $realPath = realpath($envPath);
    $baseDir = realpath(__DIR__);
    
    if ($realPath === false || strpos($realPath, $baseDir) !== 0) {
        error_log('Tentativa de acesso a arquivo .env fora do diretório permitido');
        return $env;
    }
    
    if (!file_exists($realPath) || !is_readable($realPath)) {
        return $env;
    }
    
    $lines = file($realPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    if ($lines === false) {
        return $env;
    }
    
    foreach ($lines as $line) {
        $line = trim($line);
        
        // Ignorar comentários e linhas vazias
        if (empty($line) || $line[0] === '#') {
            continue;
        }
        
        // Validar formato KEY=VALUE
        if (!str_contains($line, '=')) {
            continue;
        }
        
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        
        // Validar nome da variável (apenas letras, números e underscore)
        if (!preg_match('/^[A-Z_][A-Z0-9_]*$/', $key)) {
            continue;
        }
        
        // Remover aspas do valor se existirem
        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }
        
        $env[$key] = $value;
    }
    
    return $env;
}

// Carregar variáveis de ambiente de forma segura
$envVars = loadEnvFile(__DIR__ . '/.env.local');
$apiKey = $envVars['GEMINI_API_KEY'] ?? '';

// Validar API key (deve ter formato esperado)
if (!empty($apiKey) && !preg_match('/^[A-Za-z0-9_-]{20,}$/', $apiKey)) {
    error_log('API key com formato inválido detectada');
    $apiKey = '';
}

$bioText = [
    'intro' => "Sou Diego Pereira, cearense especialista em PHP e mestre em Drupal, a plataforma que aproveita toda a robustez do PHP para entregar sites escaláveis, seguros e sob medida. Há 20 anos respiro tecnologia e, há 15, foco em deixar sistemas web rodando lisos, massa e sem gambiarra.",
    'details' => "Tenho pós-graduação em Análise, Projeto e Gerência de Sistemas e sou cabôco que gosta de fazer as coisas direito, com arquitetura limpa e sem gambiarra. Aqui a pegada é resolver bronca sem enrolação. Tô sempre em aprendizado contínuo, especialmente em Python, para explorar o potencial de inteligência artificial e análise de dados, porque a tecnologia muda toda hora e eu não fico parado não. Quanto mais a gente aprende, mais ligeiro fica pra desenrolar qualquer desafio."
];

$systemInstruction = "You are an AI assistant for Diego Pereira's professional portfolio website. 
Diego is a Senior Web Developer from Ceará, Brazil.

Key Personality Traits to Emulate (in Portuguese):
- Professional but approachable and slightly colloquial (Cearense dialect hints like \"massa\", \"liso\", \"desenrolar\").
- Confident, solution-oriented (\"resolver bronca sem enrolação\").
- Experienced (20 years in tech, 15 in coding).

Key Facts about Diego:
- Specialist in PHP and Drupal (specifically Drupal 11).
- Database expertise: MySQL/Postgresql.
- Education: Post-grad in Analysis, Design, and System Management.
- Current Learning: Python for AI and Data Analysis.
- Philosophy: Clean architecture, no \"gambiarras\" (hacks), reliable systems.

Your Goal:
- Answer questions about Diego's skills, experience, and work ethic.
- If asked about hiring, encourage them to contact him.
- Keep answers concise and helpful.
- Speak primarily in Portuguese (PT-BR).";

$navLinks = [
    ['name' => 'Home', 'href' => '#home'],
    ['name' => 'Sobre', 'href' => '#about'],
    ['name' => 'Skills', 'href' => '#skills'],
    ['name' => 'Contato', 'href' => '#contact']
];

$skills = [
    [
        'category' => 'Base principal de tecnologias e frameworks.',
        'icon' => 'server',
        'techs' => ['PHP', 'Drupal', 'Symfony', 'Laravel', 'MySQL/MariaDB', 'PostgreSQL', 'Composer']
    ],
    [
        'category' => 'Frontend & Interface',
        'icon' => 'layout',
        'techs' => ['HTML5 / CSS3', 'JavaScript', 'JQuery', 'Twig', 'Bootstrap', 'CSS Grid & Flexbox']
    ],
    [
        'category' => 'Ferramentas & DevOps',
        'icon' => 'layers',
        'techs' => ['Git / GitHub', 'Docker', 'DDEV', 'Terminal Linux', 'Azure Cloud', 'SSH', 'Scrum', 'Metodologias Ágeis']
    ],
    [
        'category' => 'Estudos Atuais e Próximos Passos',
        'icon' => 'line-chart',
        'techs' => ['Python', 'Análise de Dados', 'Inteligência Artificial', 'React']
    ]
];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Desenvolvedor Sênior PHP e consultor Drupal. Especialista em back-end de alta performance, arquitetura limpa e soluções sob medida."/>
    <meta name="keywords" content="Desenvolvedor, Sênior, PHP, Drupal, Consultor, Back-end, Performance, Arquitetura Limpa, Soluções sob Medida"/>
    <meta name="author" content="Diego Pereira"/>
    <meta name="theme-color" content="#0f172a"/>
    <meta name="color-scheme" content="dark">
    <link rel="canonical" href="https://diegopereirace.com.br/"/>
    <link rel="shortlink" href="https://diegopereirace.com.br/"/>
    <link rel="icon" type="image/png" href="/assets/imgs/favicon.png"/>
    <link rel="apple-touch-icon" href="/assets/imgs/favicon.png"/>
    <link rel="manifest" href="/manifest.json"/>
    <title>DiegoPereira{dev}</title>
    
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