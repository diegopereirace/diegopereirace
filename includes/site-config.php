<?php
declare(strict_types=1);

function loadEnvFile(string $envPath): array {
    $env = [];
    if (!is_file($envPath) || !is_readable($envPath)) {
        return $env;
    }

    $realPath = realpath($envPath);
    $baseDir = realpath(__DIR__ . '/..');

    if ($realPath === false || $baseDir === false || strpos($realPath, $baseDir) !== 0) {
        error_log('Tentativa de acesso a arquivo .env fora do diretório permitido: ' . $envPath);
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

function loadGeminiApiKey(): string {
    $baseDir = __DIR__ . '/..';
    $merged = [];

    foreach (['.env', '.env.local'] as $envFile) {
        $merged = array_merge($merged, loadEnvFile($baseDir . '/' . $envFile));
    }

    $apiKey = $merged['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?: '';

    if ($apiKey !== '' && strlen($apiKey) < 20) {
        error_log('API key com formato inválido detectada');
        return '';
    }

    if ($apiKey === '') {
        error_log('GEMINI_API_KEY não encontrada em .env.local, .env ou variáveis de ambiente');
    }

    return $apiKey;
}

$envVars = loadEnvFile(__DIR__ . '/../.env.local');
$apiKey = loadGeminiApiKey();

$bioText = [
    'intro' => "Sou Diego Pereira, cearense Dev Sênior focado em Inteligência Artificial, Python e React. Arquiteto de sistemas com CMS Drupal para alta segurança — a base que aproveita toda a robustez do PHP pra entregar produtos corporativos escaláveis, com permissões rigorosas e sem gambiarra. Há 20 anos respiro tecnologia e, há 14, foquei em engenharia de software.",
    'details' => "Tenho pós-graduação em Análise, Projeto e Gerência de Sistemas e sou cabôco que gosta de fazer as coisas direito, com Clean Architecture e fundação à prova de falhas. Aqui a pegada é unir maturidade técnica a ferramentas orientadas a dados e IA. Atuo com Python, FastAPI, Next.js, LangGraph e LLMs — porque a fronteira da inovação precisa de quem já viu o mercado evoluir. Quanto mais a gente aprende, mais ligeiro fica pra desenrolar qualquer desafio."
];

$systemInstruction = "You are an AI assistant for Diego Pereira's professional portfolio website. 
Diego is a Senior Developer from Ceará, Brazil.

Key Personality Traits to Emulate (in Portuguese):
- Professional but approachable and slightly colloquial (Cearense dialect hints like \"massa\", \"liso\", \"desenrolar\").
- Confident, solution-oriented (\"fundação à prova de falhas\", \"sem gambiarra\").
- Experienced (20 years in tech, 14 years in software engineering).

Key Facts about Diego:
- Current focus: Artificial Intelligence (LLMs/integrations), Python, data analysis, and React.
- Systems architect with CMS Drupal for high security — permissions, resilience, Clean Architecture, PHP ecosystem.
- 14 years of software engineering; Drupal and PHP as the foundation for corporate products.
- Database expertise: MySQL/PostgreSQL.
- Education: Post-grad in Analysis, Design, and System Management.
- Stack: Python (FastAPI), React (Next.js), LangGraph, PostgreSQL, OpenAI API, applied AI.
- Philosophy: Innovation needs a failure-proof foundation; mature architecture behind data- and AI-oriented tools.
- Do NOT mention client company names, internal product codenames, or confidential project details.

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
        'category' => 'IA, Python & React',
        'icon' => 'cpu',
        'techs' => ['Python', 'FastAPI', 'Next.js', 'React', 'TypeScript', 'LangGraph', 'OpenAI API', 'Tailwind CSS']
    ],
    [
        'category' => 'Integrações & DevOps',
        'icon' => 'layers',
        'techs' => ['Docker', 'Git / GitHub', 'SSH', 'VPS', 'Railway', 'WhatsApp (Evolution API)', 'DDEV', 'Azure Cloud']
    ],
    [
        'category' => 'Dados & qualidade',
        'icon' => 'line-chart',
        'techs' => ['Análise de Dados', 'Embeddings & RAG', 'Playwright E2E', 'SQLModel', 'Pydantic']
    ]
];

function getNavLinks(string $page = 'home'): array {
    $homePrefix = $page === 'home' ? '' : 'index.php';

    return [
        ['name' => 'Home', 'href' => $homePrefix . '#home'],
        ['name' => 'Sobre', 'href' => $homePrefix . '#about'],
        ['name' => 'Skills', 'href' => $homePrefix . '#skills'],
        ['name' => 'Python para Análise de Dados', 'href' => 'https://huggingface.co/spaces/diegopereirace/portfolio-py'],
        ['name' => 'CONTRATE-ME', 'href' => $homePrefix . '#contact', 'primary' => true],
    ];
}
