# -*- coding: utf-8 -*-
from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.dashboard_view, name='index'),
    path('api/dados/', views.dados_api, name='dados_api'),
    path('export/csv/', views.exportar_csv, name='export_csv'),
    path('export/pdf/', views.exportar_pdf, name='export_pdf'),
]
