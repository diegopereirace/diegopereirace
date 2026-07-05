<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require __DIR__ . '/includes/site-config.php';

$allowedModels = [
    'models/gemini-2.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash',
];

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

$prompt = trim((string) ($payload['prompt'] ?? ''));
$model = (string) ($payload['model'] ?? 'models/gemini-2.5-flash');

if ($prompt === '' || strlen($prompt) > 8000) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid prompt']);
    exit;
}

if (!in_array($model, $allowedModels, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid model']);
    exit;
}

if ($apiKey === '') {
    http_response_code(503);
    echo json_encode(['error' => 'API key not configured']);
    exit;
}

$url = 'https://generativelanguage.googleapis.com/v1beta/' . $model . ':generateContent';

$requestBody = json_encode([
    'contents' => [[
        'parts' => [['text' => $prompt]],
    ]],
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\nx-goog-api-key: {$apiKey}\r\n",
        'content' => $requestBody,
        'timeout' => 30,
        'ignore_errors' => true,
    ],
]);

$response = @file_get_contents($url, false, $context);
$statusCode = 502;

if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
    $statusCode = (int) $matches[1];
}

if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Upstream request failed']);
    exit;
}

$data = json_decode($response, true);

if ($statusCode >= 400) {
    http_response_code($statusCode);
    echo json_encode([
        'error' => $data['error']['message'] ?? 'Upstream API error',
        'status' => $statusCode,
    ]);
    exit;
}

$text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

if ($text === '') {
    $blockReason = $data['candidates'][0]['finishReason'] ?? ($data['promptFeedback']['blockReason'] ?? 'unknown');
    http_response_code(502);
    echo json_encode(['error' => 'Empty response from API', 'reason' => $blockReason]);
    exit;
}

echo json_encode(['text' => $text]);
