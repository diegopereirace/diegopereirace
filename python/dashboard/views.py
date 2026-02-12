# -*- coding: utf-8 -*-
"""
Views do Dashboard de Vendas.
Compatível com Python 3.9 - SEM usar sintaxe de tipos com pipe (|)
Adaptado do Streamlit para Django/KingHost
"""
import csv
import json
from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Optional, Any, Union

import numpy as np
import pandas as pd
import plotly.express as px
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.db.models import Sum, Count, Min, Max, Avg, Q
from django.views.decorators.http import require_http_methods
from fpdf import FPDF
from fpdf.enums import XPos, YPos

from .models import Venda


# =============================================================================
# FUNÇÕES DE PROCESSAMENTO DE DADOS
# =============================================================================

def obter_dados_filtrados(request):
    # type: (HttpRequest) -> Any
    """
    Filtra dados de vendas baseado nos parâmetros GET.
    Retorna um QuerySet de Venda.
    """
    queryset = Venda.objects.all()
    
    # Filtro de data
    data_inicio = request.GET.get('data_inicio')
    data_fim = request.GET.get('data_fim')
    
    if data_inicio:
        queryset = queryset.filter(date__gte=data_inicio)
    if data_fim:
        queryset = queryset.filter(date__lte=data_fim)
    
    # Filtros de múltipla escolha
    regioes = request.GET.getlist('regioes')
    categorias = request.GET.getlist('categorias')
    produtos = request.GET.getlist('produtos')
    
    if regioes:
        queryset = queryset.filter(regiao__in=regioes)
    if categorias:
        queryset = queryset.filter(categoria__in=categorias)
    if produtos:
        queryset = queryset.filter(produto__in=produtos)
    
    return queryset


def calcular_kpis(queryset):
    # type: (Any) -> Dict[str, Any]
    """
    Calcula os KPIs principais do dashboard.
    Retorna um dicionário com os valores.
    """
    agg = queryset.aggregate(
        total_faturamento=Sum('faturamento'),
        total_quantidade=Sum('quantidade'),
        total_transacoes=Count('id'),
        avg_faturamento=Avg('faturamento')
    )
    
    total_faturamento = float(agg['total_faturamento'] or 0)
    total_quantidade = int(agg['total_quantidade'] or 0)
    total_transacoes = int(agg['total_transacoes'] or 0)
    
    avg_ticket = total_faturamento / total_quantidade if total_quantidade > 0 else 0
    
    # Simulação de variação vs meta (como no Streamlit original)
    np.random.seed(42)
    delta_rev = np.random.uniform(-5, 15)
    
    return {
        'total_faturamento': total_faturamento,
        'total_quantidade': total_quantidade,
        'avg_ticket': avg_ticket,
        'total_transacoes': total_transacoes,
        'delta_rev': delta_rev
    }


def converter_para_dataframe(queryset):
    # type: (Any) -> pd.DataFrame
    """
    Converte um QuerySet do Django em um DataFrame do Pandas.
    """
    dados = queryset.values('date', 'regiao', 'categoria', 'produto', 'faturamento', 'quantidade')
    df = pd.DataFrame(list(dados))
    
    if not df.empty:
        df['date'] = pd.to_datetime(df['date'])
        df['faturamento'] = df['faturamento'].astype(float)
    
    return df


# =============================================================================
# FUNÇÕES DE GERAÇÃO DE GRÁFICOS (PLOTLY)
# =============================================================================

def gerar_grafico_evolucao_receita(df):
    # type: (pd.DataFrame) -> Optional[str]
    """Gera gráfico de evolução diária da receita"""
    if df.empty:
        return None
    
    daily_rev = df.groupby('date')[['faturamento']].sum().reset_index()
    fig = px.line(
        daily_rev, x='date', y='faturamento',
        template='plotly_dark', height=400,
        title='Evolução da Receita Diária',
        labels={'date': 'Data', 'faturamento': 'Faturamento (R$)'}
    )
    fig.update_traces(fill='tozeroy', line=dict(color='#00CC96', width=3))
    fig.update_layout(margin=dict(l=20, r=20, t=40, b=20))
    return fig.to_html(full_html=False, include_plotlyjs=False, div_id='graph_evolucao')


def gerar_grafico_mix_categorias(df):
    # type: (pd.DataFrame) -> Optional[str]
    """Gera gráfico de mix de categorias"""
    if df.empty:
        return None
    
    cat_rev = df.groupby('categoria')[['faturamento']].sum().reset_index()
    fig = px.pie(
        cat_rev, values='faturamento', names='categoria',
        hole=0.4, template='plotly_dark', height=400,
        title='Mix de Categorias'
    )
    fig.update_layout(margin=dict(l=20, r=20, t=40, b=20))
    return fig.to_html(full_html=False, include_plotlyjs=False, div_id='graph_mix')


def gerar_grafico_performance_regional(df):
    # type: (pd.DataFrame) -> Optional[str]
    """Gera gráfico de performance regional"""
    if df.empty:
        return None
    
    reg_rev = df.groupby('regiao')[['faturamento']].sum().reset_index()
    fig = px.bar(
        reg_rev, x='regiao', y='faturamento',
        color='regiao', template='plotly_dark',
        text_auto='.2s', height=400,
        title='Performance Regional',
        labels={'regiao': 'Região', 'faturamento': 'Faturamento (R$)'}
    )
    fig.update_layout(margin=dict(l=20, r=20, t=40, b=20), showlegend=False)
    return fig.to_html(full_html=False, include_plotlyjs=False, div_id='graph_regional')


def gerar_grafico_dia_semana(df):
    # type: (pd.DataFrame) -> Optional[str]
    """Gera gráfico de análise por dia da semana"""
    if df.empty:
        return None
    
    dias_pt_map = {
        0: "Seg", 1: "Ter", 2: "Qua",
        3: "Qui", 4: "Sex", 5: "Sáb", 6: "Dom"
    }
    
    df_copy = df.copy()
    df_copy['weekday'] = df_copy['date'].dt.dayofweek
    df_copy['dia_semana'] = df_copy['weekday'].map(dias_pt_map)
    
    dias_ordem = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    wd_rev = df_copy.groupby('dia_semana')[['faturamento']].mean().reindex(dias_ordem).reset_index()
    
    fig = px.bar(
        wd_rev, x='dia_semana', y='faturamento',
        template='plotly_dark', height=400,
        title='Receita Média por Dia da Semana',
        labels={'dia_semana': 'Dia', 'faturamento': 'Faturamento Médio (R$)'}
    )
    fig.update_layout(margin=dict(l=20, r=20, t=40, b=20))
    return fig.to_html(full_html=False, include_plotlyjs=False, div_id='graph_diasemana')


def gerar_grafico_dispersao(df):
    # type: (pd.DataFrame) -> Optional[str]
    """Gera gráfico de dispersão"""
    if df.empty:
        return None
    
    fig = px.scatter(
        df, x='quantidade', y='faturamento',
        color='categoria', size='faturamento',
        hover_data=['produto'], template='plotly_dark',
        height=450, title='Dispersão: Quantidade x Faturamento x Produto',
        labels={'quantidade': 'Quantidade', 'faturamento': 'Faturamento (R$)'}
    )
    fig.update_layout(margin=dict(l=20, r=20, t=40, b=20))
    return fig.to_html(full_html=False, include_plotlyjs=False, div_id='graph_dispersao')


# =============================================================================
# GERAÇÃO DE RELATÓRIO PDF
# =============================================================================

def gerar_pdf_relatorio(dados_lista, kpis):
    # type: (List[Dict], Dict[str, Any]) -> bytes
    """
    Gera relatório em PDF com os dados de vendas.
    """
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Título
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "Relatorio Executivo de Vendas", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(5)
    
    # Data de geração
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 8, "Gerado em: {}".format(datetime.now().strftime('%d/%m/%Y %H:%M')), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    # KPIs
    pdf.set_fill_color(240, 240, 240)
    pdf.rect(10, 35, 190, 25, 'F')
    pdf.set_y(40)
    
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(60, 8, "Receita Total", align="C", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(60, 8, "Quantidade", align="C", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(60, 8, "Ticket Medio", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(60, 8, "R$ {:,.2f}".format(kpis['total_faturamento']), align="C", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(60, 8, "{:,}".format(kpis['total_quantidade']), align="C", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(60, 8, "R$ {:,.2f}".format(kpis['avg_ticket']), align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.ln(15)
    
    # Tabela de Top 15 vendas
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Top 15 Vendas (por receita):", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    col_widths = [30, 30, 30, 40, 25, 30]
    headers = ["Data", "Regiao", "Categoria", "Produto", "Qtd", "Receita"]
    
    pdf.set_font("Helvetica", "B", 9)
    for i, h in enumerate(headers):
        pdf.cell(col_widths[i], 8, h, 1, align='C', new_x=XPos.RIGHT, new_y=YPos.TOP)
    
    pdf.ln()
    
    pdf.set_font("Helvetica", "", 9)
    top_vendas = sorted(dados_lista, key=lambda x: float(x['faturamento']), reverse=True)[:15]
    
    for row in top_vendas:
        data = [
            str(row['date']),
            row['regiao'],
            row['categoria'],
            row['produto'][:20],
            str(row['quantidade']),
            "R$ {:,.2f}".format(float(row['faturamento']))
        ]
        
        for i, d in enumerate(data):
            safe_txt = str(d).encode("latin-1", "replace").decode("latin-1")
            align = 'C' if i == 4 else 'L'
            pdf.cell(col_widths[i], 7, safe_txt, 1, align=align, new_x=XPos.RIGHT, new_y=YPos.TOP)
        
        pdf.ln()
    
    return bytes(pdf.output())


# =============================================================================
# VIEWS DJANGO
# =============================================================================

def dashboard_view(request):
    # type: (HttpRequest) -> HttpResponse
    """
    View principal do dashboard.
    Renderiza a página com filtros, KPIs e gráficos.
    """
    # Obtém dados filtrados
    if request.GET:
        queryset = obter_dados_filtrados(request)
    else:
        queryset = Venda.objects.all()
    
    # Se não há dados, tenta obter todos
    if not queryset.exists():
        queryset = Venda.objects.all()
    
    # Obter opções para filtros
    all_regioes = list(Venda.objects.values_list('regiao', flat=True).distinct().order_by('regiao'))
    all_categorias = list(Venda.objects.values_list('categoria', flat=True).distinct().order_by('categoria'))
    all_produtos = list(Venda.objects.values_list('produto', flat=True).distinct().order_by('produto'))
    
    # Datas min/max
    date_range = Venda.objects.aggregate(min_date=Min('date'), max_date=Max('date'))
    min_date = date_range['min_date'] or date(2026, 1, 1)
    max_date = date_range['max_date'] or date(2026, 6, 30)
    
    # Valores selecionados
    selected_regioes = request.GET.getlist('regioes') or all_regioes
    selected_categorias = request.GET.getlist('categorias') or all_categorias
    selected_produtos = request.GET.getlist('produtos') or all_produtos
    data_inicio = request.GET.get('data_inicio', str(min_date))
    data_fim = request.GET.get('data_fim', str(max_date))
    
    # Calcula KPIs
    kpis = calcular_kpis(queryset)
    
    # Converte para DataFrame para gráficos
    df = converter_para_dataframe(queryset)
    
    # Gera gráficos
    grafico_evolucao = gerar_grafico_evolucao_receita(df)
    grafico_mix = gerar_grafico_mix_categorias(df)
    grafico_regional = gerar_grafico_performance_regional(df)
    grafico_diasemana = gerar_grafico_dia_semana(df)
    grafico_dispersao = gerar_grafico_dispersao(df)
    
    context = {
        'kpis': kpis,
        'grafico_evolucao': grafico_evolucao,
        'grafico_mix': grafico_mix,
        'grafico_regional': grafico_regional,
        'grafico_diasemana': grafico_diasemana,
        'grafico_dispersao': grafico_dispersao,
        'total_registros': queryset.count(),
        # Filtros
        'all_regioes': all_regioes,
        'all_categorias': all_categorias,
        'all_produtos': all_produtos,
        'selected_regioes': selected_regioes,
        'selected_categorias': selected_categorias,
        'selected_produtos': selected_produtos,
        'data_inicio': data_inicio,
        'data_fim': data_fim,
        'min_date': str(min_date),
        'max_date': str(max_date),
    }
    
    return render(request, 'dashboard/index.html', context)


@require_http_methods(["GET"])
def dados_api(request):
    # type: (HttpRequest) -> JsonResponse
    """API para retornar dados da tabela em JSON."""
    queryset = obter_dados_filtrados(request)
    
    dados = []
    for venda in queryset[:100]:
        dados.append({
            'date': venda.date.isoformat(),
            'regiao': venda.regiao,
            'categoria': venda.categoria,
            'produto': venda.produto,
            'faturamento': float(venda.faturamento),
            'quantidade': venda.quantidade
        })
    
    return JsonResponse({
        'dados': dados,
        'total': queryset.count()
    })


def exportar_csv(request):
    # type: (HttpRequest) -> HttpResponse
    """Exporta dados filtrados em formato CSV."""
    queryset = obter_dados_filtrados(request)
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="dados_filtrados.csv"'
    response.write(u'\ufeff'.encode('utf8'))  # BOM para Excel
    
    writer = csv.writer(response)
    writer.writerow(['Data', 'Região', 'Categoria', 'Produto', 'Faturamento', 'Quantidade'])
    
    for venda in queryset:
        writer.writerow([
            venda.date,
            venda.regiao,
            venda.categoria,
            venda.produto,
            venda.faturamento,
            venda.quantidade
        ])
    
    return response


def exportar_pdf(request):
    # type: (HttpRequest) -> HttpResponse
    """Exporta dados em formato PDF."""
    queryset = obter_dados_filtrados(request)
    kpis = calcular_kpis(queryset)
    
    # Converte para lista de dicionários
    dados = list(queryset.values('date', 'regiao', 'categoria', 'produto', 'faturamento', 'quantidade'))
    
    pdf_bytes = gerar_pdf_relatorio(dados, kpis)
    
    response = HttpResponse(pdf_bytes, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="relatorio_vendas_{}.pdf"'.format(date.today())
    
    return response
