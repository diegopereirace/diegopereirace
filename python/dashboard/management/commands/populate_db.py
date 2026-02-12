# -*- coding: utf-8 -*-
"""
Management command para popular o banco de dados com dados fictícios.
Compatível com Python 3.9
"""
import numpy as np
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from dashboard.models import Venda


class Command(BaseCommand):
    help = 'Popula o banco de dados com 180 dias de dados ficticios de vendas'

    def handle(self, *args, **options):
        # Se já tem dados, não popula novamente
        if Venda.objects.exists():
            self.stdout.write(self.style.WARNING('Base de dados ja possui dados. Abortando.'))
            return

        self.stdout.write('Gerando 180 dias de dados ficticios...')

        np.random.seed(42)
        start_date = date(2026, 1, 1)
        datas = [start_date + timedelta(days=i) for i in range(180)]

        regioes = ["Norte", "Nordeste", "Sul", "Sudeste", "Centro-Oeste"]
        categorias = ["Eletrônicos", "Roupas", "Alimentos", "Serviços"]
        
        dict_produtos = {
            "Eletrônicos": {"Smartphone": 1200, "Laptop": 3500, "Tablet": 800},
            "Roupas": {"Camiseta": 50, "Terno": 150, "Casaco": 300},
            "Alimentos": {"Congelados": 40, "Bebidas": 15, "Limpeza": 25},
            "Serviços": {"Consultoria": 1000, "Instalação": 400, "Suporte": 200}
        }

        vendas_list = []

        for d in datas:
            vendas_diarias = np.random.randint(5, 15)

            for _ in range(vendas_diarias):
                r = np.random.choice(regioes)
                c = np.random.choice(categorias)
                p = np.random.choice(list(dict_produtos[c].keys()))

                preco_base = dict_produtos[c][p]
                quantidade = np.random.randint(1, 25)
                base_faturamento = preco_base * quantidade

                noise = np.random.uniform(-0.20, 0.20)
                faturamento = base_faturamento * (1 + noise)
                faturamento = max(0, faturamento)

                vendas_list.append(
                    Venda(
                        date=d,
                        regiao=r,
                        categoria=c,
                        produto=p,
                        faturamento=round(faturamento, 2),
                        quantidade=quantidade
                    )
                )

        Venda.objects.bulk_create(vendas_list, batch_size=1000)
        self.stdout.write(
            self.style.SUCCESS('Sucesso! {} registros de vendas criados!'.format(len(vendas_list)))
        )
