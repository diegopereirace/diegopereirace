<?php

use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpFoundation\Request;

$autoloader = require_once 'autoload.php';
$kernel = DrupalKernel::createFromRequest(Request::createFromGlobals(), $autoloader, 'prod');
$kernel->boot();
$container = $kernel->getContainer();

echo "Rebuilding router...\n";
$container->get('router.builder')->rebuild();
echo "Router rebuilt successfully!\n";

echo "Clearing cache...\n";
$container->get('cache.bootstrap')->deleteAll();
$container->get('cache.config')->deleteAll();
$container->get('cache.data')->deleteAll();
echo "Cache cleared successfully!\n";
