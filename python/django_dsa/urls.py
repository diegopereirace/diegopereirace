# -*- coding: utf-8 -*-
"""
URL Configuration for django_dsa project.
Configurado com prefixo /python para KingHost.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('dashboard.urls')),
]

# Apenas em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL.replace('/python', ''), document_root=settings.STATIC_ROOT)
