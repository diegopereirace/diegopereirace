# -*- coding: utf-8 -*-
"""
WSGI config for django_dsa project.
Configurado para KingHost.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_dsa.settings')

application = get_wsgi_application()
