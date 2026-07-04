<?php
declare(strict_types=1);

function loadEnvFile(string $envPath): array {
    $env = [];
    $realPath = realpath($envPath);
    $baseDir = realpath(__DIR__ . '/..');

    if ($realPath === false || $baseDir === false || strpos($realPath, $baseDir) !== 0) {
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
        if (empty($line) || $line[0] === '#') {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        if (!preg_match('/^[A-Z_][A-Z0-9_]*$/', $key)) {
            continue;
        }

        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        $env[$key] = $value;
    }

    return $env;
}

$envVars = loadEnvFile(__DIR__ . '/../.env.local');
$apiKey = $envVars['GEMINI_API_KEY'] ?? '';

if (!empty($apiKey) && !preg_match('/^[A-Za-z0-9_-]{20,}$/', $apiKey)) {
    error_log('API key com formato inválido detectada');
    $apiKey = '';
}

$bioText = [
    'intro' => "Sou Diego Pereira, cearense especialista em PHP e mestre em Drupal, a plataforma que aproveita toda a robustez do PHP para entregar sites escaláveis, seguros e sob medida. Há 20 anos respiro tecnologia e, há 15, foco em deixar sistemas web rodando lisos, massa e sem gambiarra.",
    'details' => "Tenho pós-graduação em Análise, Projeto e Gerência de Sistemas e sou cabôco que gosta de fazer as coisas direito, com arquitetura limpa e sem gambiarra. Aqui a pegada é resolver bronca sem enrolação. Desde o início do ano atuo em um projeto com IA aplicada — hub jurídico com FastAPI, Next.js e LangGraph — adquirindo conhecimento na prática, todo dia. Quanto mais a gente aprende, mais ligeiro fica pra desenrolar qualquer desafio."
];

$systemInstruction = "You are an AI assistant for Diego Pereira's professional portfolio website. 
Diego is a Senior Web Developer from Ceará, Brazil.

Key Personality Traits to Emulate (in Portuguese):
- Professional but approachable and slightly colloquial (Cearense dialect hints like \"massa\", \"liso\", \"desenrolar\").
- Confident, solution-oriented (\"resolver bronca sem enrolação\").
- Experienced (20 years in tech, 14 years in PHP/Drupal development).

Key Facts about Diego:
- Specialist in PHP and Drupal (14 years, including Drupal 11).
- Database expertise: MySQL/PostgreSQL.
- Education: Post-grad in Analysis, Design, and System Management.
- Since the beginning of the year, working on a legal hub project with applied AI (in active development), learning hands-on every day.
- Current stack: Python (FastAPI), React (Next.js), LangGraph, PostgreSQL, OpenAI API.
- Competencies: applied AI architecture, async REST APIs, SaaS billing (Asaas), WhatsApp integrations, match engines, automated testing.
- Philosophy: Clean architecture, no \"gambiarras\" (hacks), reliable systems.
- Do NOT mention client company names or internal product codenames.

Your Goal:
- Answer questions about Diego's skills, experience, and work ethic.
- If asked about hiring, encourage them to contact him.
- Keep answers concise and helpful.
- Speak primarily in Portuguese (PT-BR).";

$skills = [
    [
        'category' => 'Base sólida (14 anos)',
        'icon' => 'server',
        'techs' => ['PHP', 'Drupal', 'Symfony', 'Laravel', 'PostgreSQL', 'MySQL/MariaDB', 'Composer']
    ],
    [
        'category' => 'Stack atual — produção',
        'icon' => 'cpu',
        'techs' => ['Python', 'FastAPI', 'Next.js', 'React', 'TypeScript', 'LangGraph', 'OpenAI API', 'Tailwind CSS']
    ],
    [
        'category' => 'Integrações & DevOps',
        'icon' => 'layers',
        'techs' => ['Docker', 'Git / GitHub', 'Railway', 'WhatsApp (Evolution API)', 'Webhooks (Asaas)', 'DDEV', 'Azure Cloud']
    ],
    [
        'category' => 'Em expansão',
        'icon' => 'line-chart',
        'techs' => ['Análise de Dados', 'Embeddings & RAG', 'Playwright E2E', 'SQLModel', 'Pydantic']
    ]
];

function getNavLinks(string $page = 'home'): array {
    $homePrefix = $page === 'home' ? '' : 'index.php';
    $isProjeto = $page === 'projeto';

    return [
        ['name' => 'Home', 'href' => $homePrefix . '#home'],
        ['name' => 'Sobre', 'href' => $homePrefix . '#about'],
        [
            'name' => 'Projetos',
            'active' => $isProjeto,
            'children' => [
                [
                    'name' => 'Hub jurídico com IA',
                    'href' => 'projeto.php',
                    'badge' => 'Em andamento',
                    'kind' => 'real-em-andamento',
                    'active' => $isProjeto,
                ],
                [
                    'name' => 'Python para Análise de Dados',
                    'href' => 'https://huggingface.co/spaces/diegopereirace/portfolio-py',
                    'badge' => 'Portfólio',
                    'kind' => 'portfolio',
                    'external' => true,
                ],
            ],
        ],
        ['name' => 'Skills', 'href' => $homePrefix . '#skills'],
        ['name' => 'CONTRATE-ME', 'href' => $homePrefix . '#contact', 'primary' => true],
    ];
}
