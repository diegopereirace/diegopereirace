<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require __DIR__ . '/includes/site-config.php';

echo json_encode([
    'gemini_configured' => $apiKey !== '',
    'key_format' => $apiKey === '' ? 'missing' : (str_starts_with($apiKey, 'AQ.') ? 'auth' : 'standard'),
    'proxy_ready' => is_readable(__DIR__ . '/generate-code.php'),
    'api_folder' => is_dir(__DIR__ . '/api'),
]);
