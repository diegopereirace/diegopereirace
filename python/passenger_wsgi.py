# -*- coding: utf-8 -*-
"""
Arquivo WSGI para deploy na KingHost.
Este arquivo é usado pelo servidor Apache/mod_wsgi da hospedagem.

Estrutura esperada na KingHost:
/home/diegopereirace/apps_wsgi/python/python/
├── passenger_wsgi.py (este arquivo)
├── django_dsa/
│   └── wsgi.py
└── diegopython/ (ambiente virtual)
"""
import os
import sys

# Adiciona o diretório da aplicação ao path
# IMPORTANTE: Ajuste este caminho para o seu servidor KingHost
INTERP = "/home/diegopereirace/apps_wsgi/python/python/diegopython/bin/python"
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Caminho da aplicação
BASE_DIR = '/home/diegopereirace/apps_wsgi/python/python'
sys.path.insert(0, BASE_DIR)

# Configuração do Django
os.environ['DJANGO_SETTINGS_MODULE'] = 'django_dsa.settings'

# Importa e configura a aplicação WSGI
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
