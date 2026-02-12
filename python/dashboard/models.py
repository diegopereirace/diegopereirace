# -*- coding: utf-8 -*-
"""
Models para o Dashboard de Vendas.
Compatível com Python 3.9
"""
from django.db import models


class Venda(models.Model):
    """
    Model para armazenar dados de vendas.
    Equivalente à tabela 'tb_vendas' do Streamlit.
    """
    REGIOES = [
        ('Norte', 'Norte'),
        ('Nordeste', 'Nordeste'),
        ('Sul', 'Sul'),
        ('Sudeste', 'Sudeste'),
        ('Centro-Oeste', 'Centro-Oeste'),
    ]
    
    CATEGORIAS = [
        ('Eletrônicos', 'Eletrônicos'),
        ('Roupas', 'Roupas'),
        ('Alimentos', 'Alimentos'),
        ('Serviços', 'Serviços'),
    ]
    
    date = models.DateField(db_index=True, verbose_name='Data')
    regiao = models.CharField(max_length=20, choices=REGIOES, verbose_name='Região')
    categoria = models.CharField(max_length=50, choices=CATEGORIAS, verbose_name='Categoria')
    produto = models.CharField(max_length=100, verbose_name='Produto')
    faturamento = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Faturamento')
    quantidade = models.IntegerField(verbose_name='Quantidade')
    
    class Meta:
        ordering = ['-date']
        verbose_name = 'Venda'
        verbose_name_plural = 'Vendas'
    
    def __str__(self):
        return "Venda de {} - {}".format(self.produto, self.date)
