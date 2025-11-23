<?php
// Carregar variáveis de ambiente
$envFile = __DIR__ . '/.env.local';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

$apiKey = $_ENV['GEMINI_API_KEY'] ?? '';

// Configurações
$bioText = [
    'intro' => "Sou Diego Pereira, desenvolvedor cearense, especialista em PHP e Drupal, com 20 anos de estrada em tecnologia, sendo os últimos 15 dedicados à programação. Já encarei projeto grande, bug enjoado e prazo apertado — e sempre dei meu jeito de deixar o sistema rodando liso e massa, do jeito que o cliente precisa.",
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
- Database expertise: MySQL.
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
        'category' => 'Core Stack',
        'icon' => 'server',
        'techs' => ['PHP 8+', 'Drupal 11', 'MySQL/MariaDB', 'Composer']
    ],
    [
        'category' => 'Frontend & Interface',
        'icon' => 'layout',
        'techs' => ['HTML5 / CSS3', 'JavaScript (ES6+)', 'Tailwind CSS', 'Twig Engine']
    ],
    [
        'category' => 'Next Steps / Learning',
        'icon' => 'line-chart',
        'techs' => ['Python', 'Data Analysis', 'Artificial Intelligence', 'React']
    ],
    [
        'category' => 'Ferramentas & DevOps',
        'icon' => 'layers',
        'techs' => ['Git / GitHub', 'Docker', 'Linux Terminal', 'Agile Methodologies']
    ]
];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diego Pereira - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script type="importmap">
    {
        "imports": {
            "@google/genai": "https://esm.run/@google/generative-ai@0.21.0"
        }
    }
    </script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Fira Code', monospace; }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .hidden { display: none; }
    </style>
    <script>
        window.PHP_DATA = {
            API_KEY: <?php echo json_encode($apiKey); ?>,
            SYSTEM_INSTRUCTION: <?php echo json_encode($systemInstruction); ?>
        };
    </script>
</head>
<body class="bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
    
    <!-- Header -->
    <?php include 'includes/header.php'; ?>
    
    <main>
        <!-- Hero -->
        <?php include 'includes/hero.php'; ?>
        
        <!-- About -->
        <?php include 'includes/about.php'; ?>
        
        <!-- Skills -->
        <?php include 'includes/skills.php'; ?>
    </main>
    
    <!-- Footer -->
    <?php include 'includes/footer.php'; ?>
    
    <!-- Chat Widget -->
    <?php include 'includes/chat-widget.php'; ?>
    
    <script src="js/main.js"></script>
    <script src="js/chat.js" type="module"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>