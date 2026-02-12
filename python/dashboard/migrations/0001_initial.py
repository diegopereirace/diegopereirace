# -*- coding: utf-8 -*-
# Generated migration for Venda model
# Compatível com Python 3.9

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Venda',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(db_index=True, verbose_name='Data')),
                ('regiao', models.CharField(choices=[('Norte', 'Norte'), ('Nordeste', 'Nordeste'), ('Sul', 'Sul'), ('Sudeste', 'Sudeste'), ('Centro-Oeste', 'Centro-Oeste')], max_length=20, verbose_name='Região')),
                ('categoria', models.CharField(choices=[('Eletrônicos', 'Eletrônicos'), ('Roupas', 'Roupas'), ('Alimentos', 'Alimentos'), ('Serviços', 'Serviços')], max_length=50, verbose_name='Categoria')),
                ('produto', models.CharField(max_length=100, verbose_name='Produto')),
                ('faturamento', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Faturamento')),
                ('quantidade', models.IntegerField(verbose_name='Quantidade')),
            ],
            options={
                'verbose_name': 'Venda',
                'verbose_name_plural': 'Vendas',
                'ordering': ['-date'],
            },
        ),
    ]
