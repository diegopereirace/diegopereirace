# -*- coding: utf-8 -*-
"""
Django settings for django_dsa project.
Configurado para hospedagem KingHost com Python 3.9
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# =============================================================================
# CONFIGURAÇÃO KINGHOST - IMPORTANTE!
# =============================================================================
# Caminho absoluto no servidor KingHost (descomente em produção)
# KINGHOST_BASE = '/home/diegopereirace/apps_wsgi/python/python'

# SECURITY WARNING: keep the secret key used in production secret!
# Em produção, gere uma nova chave com: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY = 'django-insecure-MUDE-ESTA-CHAVE-EM-PRODUCAO-gere-uma-nova'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Em produção na KingHost, adicione seu domínio aqui
ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1', 'diegopereirace.com.br', 'www.diegopereirace.com.br']

# =============================================================================
# CONFIGURAÇÃO DE URL PREFIX - KINGHOST
# =============================================================================
# A aplicação roda sob /python na KingHost
FORCE_SCRIPT_NAME = '/python'

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'dashboard',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'django_dsa.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'dashboard', 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_dsa.wsgi.application'

# =============================================================================
# DATABASE - SQLite para simplicidade
# =============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# =============================================================================
# INTERNACIONALIZAÇÃO
# =============================================================================
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# =============================================================================
# STATIC FILES - CONFIGURAÇÃO KINGHOST
# =============================================================================
# URL para arquivos estáticos (com prefixo /python)
STATIC_URL = '/python/static/'

# Diretório onde collectstatic colocará os arquivos
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Diretórios adicionais de arquivos estáticos
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'dashboard', 'static'),
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# =============================================================================
# CONFIGURAÇÕES DE SEGURANÇA PARA PRODUÇÃO
# =============================================================================
# Descomente em produção:
# SECURE_BROWSER_XSS_FILTER = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
# X_FRAME_OPTIONS = 'DENY'
# CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SECURE = True
