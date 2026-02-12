# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import Venda


@admin.register(Venda)
class VendaAdmin(admin.ModelAdmin):
    list_display = ('date', 'regiao', 'categoria', 'produto', 'quantidade', 'faturamento')
    list_filter = ('date', 'regiao', 'categoria')
    search_fields = ('produto', 'regiao')
    date_hierarchy = 'date'
    ordering = ('-date',)
