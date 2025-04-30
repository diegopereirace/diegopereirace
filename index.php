<?php
// index.php

$page_title = "Perfil Profissional | Desenvolvedor Sênior PHP/Drupal";
$page_desc = "Landing page do desenvolvedor sênior especialista em PHP e Drupal.";

// Defina seu e-mail principal para uso
$profile_email = "diegopereirace@gmail.com";
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= $page_title ?></title>
    <meta name="description" content="<?= $page_desc ?>">

    <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

  <!-- Custom CSS -->
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background: linear-gradient(120deg, #f3f3fa 0%, #d2e7fa 100%);
      min-height: 100vh;
    }
    .hero-section {
      padding-top: 80px;
      padding-bottom: 60px;
      text-align: center;
      background: linear-gradient(120deg, #e3f2fd 0%, #f6f8fc 100%);
    }
    .hero-section h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #034078;
      letter-spacing: -1px;
      margin-bottom: 0.7em;
      opacity: 0;
      transform: translateY(40px);
      animation: fadeUp 1s forwards;
    }
    .hero-section p {
      color: #244677;
      font-size: 1.2rem;
      margin-bottom: 2.5em;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeUp 1.3s 0.3s forwards;
    }
    .hero-section .profile-email {
      font-size: 1.08rem;
      margin-bottom: 2.1em;
      display: inline-block;
      opacity: 0;
      animation: fadeUp 1.4s 0.5s forwards;
      transition: color 0.2s;
      color: #0366d6;
      text-decoration: none;
      font-weight: 500;
    }
    .hero-section .profile-email:hover {
      color: #d43f6d;
      text-decoration: underline;
    }
    .hero-section .email-icon {
      line-height: 1;
      vertical-align: middle;
      margin-right: 7px;
      color: #d43f6d;
    }
    @keyframes fadeUp {
      to {
        opacity: 1;
        transform: none;
      }
    }
    .expertise-section {
      background: #fff;
      border-radius: 30px 30px 0 0;
      margin-top: -50px;
      padding: 40px 0 20px 0;
      box-shadow: 0 4px 40px #03407811;
    }
    .expertise-icon {
      width: 90px;
      height: 90px;
      margin-bottom: 24px;
      transition: transform 0.25s;
      /* Imagem SVG */
    }
    .expertise-card:hover .expertise-icon {
      transform: scale(1.08) rotate(-3deg);
    }
    .expertise-title {
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 10px;
      color: #0366d6;
    }
    .expertise-desc {
      color: #244677;
      font-size: 1rem;
      min-height: 64px;
    }
    .contact-btn {
      font-size: 1.12rem;
      font-weight: 600;
      letter-spacing: 1px;
      padding: 12px 30px;
      transition: background 0.3s, transform 0.2s;
      background: #0366d6;
      color: #fff;
      border-radius: 25px;
      border: none;
      box-shadow: 0 4px 16px #03407826;
    }
    .contact-btn:hover {
      background: #034078;
      color: #fff;
      transform: translateY(-2px) scale(1.03);
    }
    .footer {
      text-align: center;
      padding: 20px 0 6px 0;
      color: #999;
      font-size: 0.97rem;
      background: #f8fafc;
    }
    /* Animar cards de expertise com jQuery */
    .expertise-card {
      opacity: 0;
      transform: translateY(40px);
      transition: transform 0.3s, opacity 0.3s;
    }
    .expertise-card.visible {
      opacity: 1;
      transform: none;
    }
  </style>
</head>
<body>

  <!-- Hero Section -->
  <div class="container-fluid hero-section">
    <div class="container">
      <img src="https://undraw.co/api/illustrations/website?color=034078" class="mb-4" alt="Expertise" width="160" height="160">
      <h1>Desenvolvedor Sênior PHP / Drupal</h1>
      <p class="lead">
        Pós-graduado em Análise, Projeto e Gerência de Sistemas. <br>
        Especialista em PHP, Drupal e arquitetura limpa. <br>
        Entusiasta de tecnologia e aprendizado contínuo.
      </p>
      <!-- Email Link -->
      <a href="mailto:<?= $profile_email ?>" class="profile-email">
        <svg class="email-icon" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884l7.197 4.797a1 1 0 0 0 1.11 0l7.197-4.797A2 2 0 0 0 18 4H2a2 2 0 0 0 .003 1.884z" />
          <path d="M18 8.118L10.803 12.915a3 3 0 0 1-3.606 0L2 8.118V16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z" />
        </svg>
        <?= $profile_email ?>
      </a>
      <br>
      <a href="#contact" class="contact-btn mt-3">Vamos conversar</a>
    </div>
  </div>

  <!-- Expertise Section -->
  <div class="container expertise-section shadow">
    <div class="row justify-content-center text-center">
      <div class="col-12 mb-4">
        <h2 class="expertise-title" style="font-size:2rem;">Expertise</h2>
      </div>
      <div class="col-md-4 mb-4 expertise-card">
        <img class="expertise-icon" src="https://undraw.co/api/illustrations/code_typing?color=0366d6" alt="PHP/Drupal">
        <div class="expertise-title">PHP &amp; Drupal</div>
        <div class="expertise-desc">
          Soluções robustas usando <b>PHP</b> moderno, APIs, automações e sistemas customizados Drupal para grandes projetos e portais corporativos.
        </div>
      </div>
      <div class="col-md-4 mb-4 expertise-card">
        <img class="expertise-icon" src="https://undraw.co/api/illustrations/responsive?color=0294a5" alt="Arquitetura">
        <div class="expertise-title">Arquitetura Limpa</div>
        <div class="expertise-desc">
          Princípios de <b>arquitetura limpa</b>, separação de camadas, testes e padrões de projeto para um código sustentável e escalável.
        </div>
      </div>
      <div class="col-md-4 mb-4 expertise-card">
        <img class="expertise-icon" src="https://undraw.co/api/illustrations/online_learning?color=d43f6d" alt="Aprendizado">
        <div class="expertise-title">Aprendizado Contínuo</div>
        <div class="expertise-desc">
          Curioso, sempre praticando <b>aprimoramento</b> e inovação com as melhores tecnologias do mercado.
        </div>
      </div>
    </div>
  </