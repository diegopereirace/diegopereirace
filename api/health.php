<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require __DIR__ . '/../includes/site-config.php';

echo json_encode([
    'gemini_configured' => $apiKey !== '',
    'proxy_ready' => is_readable(__DIR__ . '/generate-code.php'),
]);
