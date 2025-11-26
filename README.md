<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🚀 Portfolio Diego Pereira - Drupal 11 + Google Gemini AI

Portfolio profissional integrado com Drupal 11 e Google Gemini AI para geração de código.

## 📊 PageSpeed Insights Score

### Desktop
- **Performance**: 100/100 ✅
- **Accessibility**: 96/100 ✅
- **Best Practices**: 96/100 ✅
- **SEO**: 100/100 ✅

### Mobile
- **Performance**: 95/100 ✅
- **Accessibility**: 96/100 ✅
- **Best Practices**: 100/100 ✅
- **SEO**: 100/100 ✅

## 🎯 Características

- ✅ **Drupal 11**: CMS robusto com PHP 8.3
- ✅ **Google Gemini AI**: Geração de código com IA
- ✅ **Tailwind CSS 3**: Design responsivo moderno
- ✅ **PWA**: Service Worker para cache offline
- ✅ **Imagens Modernas**: WebP e AVIF (40-60% menores)
- ✅ **Segurança**: OWASP Top 10 compliance
- ✅ **Performance**: Otimizações Apache (gzip, cache, minify)

## 🛠️ Stack Tecnológica

### Backend
- **PHP**: 8.3.27
- **Drupal**: 11.x
- **Apache**: 2.4 com mod_deflate, mod_expires, mod_headers
- **MySQL/MariaDB**: 10.x

### Frontend
- **Tailwind CSS**: 3.x (CDN com async loading)
- **Vanilla JavaScript**: ES6+
- **Service Worker**: PWA com cache strategies
- **Modern Images**: AVIF, WebP, PNG fallback

### Ferramentas de Desenvolvimento
- **DDEV**: Ambiente local Dockerizado
- **ImageMagick**: Conversão de imagens
- **PageSpeed Insights**: Monitoramento de performance
- **Chrome DevTools**: Debug e profiling

## 📁 Estrutura do Projeto

```
diegopereirace/
├── index.php                 # Entry point principal
├── .htaccess                 # Apache config (Drupal + otimizações)
├── .env                      # Variáveis de ambiente
├── manifest.json             # PWA manifest
├── robots.txt                # SEO crawler rules
├── sitemap.xml               # SEO sitemap
├── assets/
│   ├── imgs/                 # Imagens (PNG, WebP, AVIF)
│   └── js/
│       ├── main.js           # JavaScript principal
│       ├── sw.js             # Service Worker (v1.0.1)
│       ├── code-generator.js # Integração Gemini AI
│       └── tailwind-config.js# Tailwind customizado
├── includes/
│   ├── header.php            # Header com <picture> element
│   ├── hero.php              # Seção hero
│   ├── about.php             # Sobre mim
│   ├── skills.php            # Habilidades
│   ├── footer.php            # Footer
│   └── data.php              # Dados estruturados
├── convert-images.ps1        # Script conversão Windows
├── convert-images.sh         # Script conversão Linux/Mac
└── docs/
    ├── CONVERSAO-IMAGENS.md  # Guia de conversão de imagens
    ├── OTIMIZACAO-IMAGENS.md # Documentação técnica WebP/AVIF
    ├── PERFORMANCE-OPTIMIZATIONS.md
    ├── SECURITY-FIXES.md
    └── TESTE-PERFORMANCE.md
```

## 🚀 Instalação Local (DDEV)

### Pré-requisitos
- Docker Desktop
- DDEV 1.22+
- Git

### Passos

1. **Clone o repositório:**
```powershell
git clone https://github.com/diegopereira/diegopereirace.git
cd diegopereirace
```

2. **Configure o ambiente:**
```powershell
# Copie o arquivo de exemplo
Copy-Item .env.example .env

# Edite .env e adicione sua GEMINI_API_KEY
notepad .env
```

3. **Inicie o DDEV:**
```powershell
ddev start
ddev import-db --file=_arquivos/db/diegopereirace.sql
```

4. **Acesse o site:**
```
https://diegopereirace.ddev.site
```

## 🖼️ Otimização de Imagens (WebP/AVIF)

### Execução Rápida

**Windows PowerShell:**
```powershell
.\convert-images.ps1
```

**Linux/Mac:**
```bash
bash convert-images.sh
```

### Benefícios
- ✅ **40% menor** com WebP
- ✅ **60% menor** com AVIF
- ✅ Fallback automático para PNG
- ✅ Compatibilidade universal

📚 **Documentação completa**: [CONVERSAO-IMAGENS.md](CONVERSAO-IMAGENS.md)

## 🔒 Segurança Implementada

### Proteções Ativas
- ✅ **XSS Prevention**: `htmlspecialchars()` em todos os outputs
- ✅ **Path Traversal**: `realpath()` validation
- ✅ **SQL Injection**: Prepared statements (Drupal)
- ✅ **CSRF Protection**: Drupal form tokens
- ✅ **Headers Segurança**: CSP, X-Frame-Options, HSTS
- ✅ **Validação de API**: Regex para chaves Gemini
- ✅ **Rate Limiting**: Apache mod_evasive

📚 **Análise completa**: [SECURITY-FIXES.md](SECURITY-FIXES.md)

## 📈 Performance Optimizations

### Apache (.htaccess)
- ✅ **Gzip Compression**: 70% redução de tamanho
- ✅ **Browser Caching**: 1 ano para assets estáticos
- ✅ **HTTP/2 Push**: Preload de recursos críticos
- ✅ **Security Headers**: CSP, HSTS, X-Content-Type-Options

### Service Worker
- ✅ **Cache Strategies**: Cache-First, Network-First, Stale-While-Revalidate
- ✅ **Precaching**: Assets críticos (CSS, JS, fontes)
- ✅ **Offline Support**: Fallback pages

### Imagens
- ✅ **Modern Formats**: AVIF → WebP → PNG
- ✅ **Lazy Loading**: `loading="lazy"` para below-fold
- ✅ **Responsive Images**: `<picture>` element

📚 **Métricas detalhadas**: [PERFORMANCE-OPTIMIZATIONS.md](PERFORMANCE-OPTIMIZATIONS.md)

## 🧪 Monitoramento de Performance

### Dashboard Local
Acesse: `http://localhost/performance-monitor.html`

**Métricas exibidas:**
- ⏱️ Page Load Time
- 🖥️ Service Worker Status
- 📦 Resources Cached
- 🚫 Total Blocking Time (TBT)
- 🖱️ First Input Delay (FID)

### PageSpeed Insights
Teste online: https://pagespeed.web.dev/

## 🔧 Comandos Úteis

### DDEV
```powershell
ddev start          # Iniciar ambiente
ddev stop           # Parar ambiente
ddev ssh            # Acessar container
ddev logs           # Ver logs
ddev describe       # Informações do projeto
```

### Drupal
```powershell
ddev drush cr       # Limpar cache
ddev drush cex      # Exportar configuração
ddev drush cim      # Importar configuração
ddev drush updb     # Atualizar banco de dados
```

### Conversão de Imagens
```powershell
# Converter todas as imagens
.\convert-images.ps1

# Verificar tamanhos
ls assets/imgs/ | Select-Object Name, Length

# Testar integridade
magick identify assets/imgs/favicon.webp
```

## 📚 Documentação Adicional

- 📖 [Conversão de Imagens](CONVERSAO-IMAGENS.md) - Guia completo WebP/AVIF
- 📖 [Otimizações de Performance](PERFORMANCE-OPTIMIZATIONS.md) - Análise técnica
- 📖 [Correções de Segurança](SECURITY-FIXES.md) - OWASP compliance
- 📖 [Testes de Performance](TESTE-PERFORMANCE.md) - Metodologia de testes

## 🌐 Deploy em Produção

### Checklist
1. ✅ Configurar `.env` com `GEMINI_API_KEY` real
2. ✅ Converter todas as imagens (WebP/AVIF)
3. ✅ Verificar `.htaccess` (tipos MIME, cache)
4. ✅ Testar Service Worker em HTTPS
5. ✅ Validar CSP headers
6. ✅ Executar PageSpeed Insights
7. ✅ Verificar logs de erro (500, 404)

### Upload de Arquivos
```powershell
# Via FTP/SFTP, incluir:
- Todos os arquivos .php
- .htaccess
- .env (com API key real)
- assets/ (incluindo .webp e .avif)
- includes/
- manifest.json, robots.txt, sitemap.xml
```

## 🐛 Troubleshooting

### Erro 500 no servidor
**Causa**: `.htaccess` incompatível
**Solução**: Verificar módulos Apache (`mod_rewrite`, `mod_deflate`, `mod_expires`)

### Service Worker não ativa
**Causa**: Domínio não-HTTPS ou sintaxe JS
**Solução**: Usar HTTPS em produção, verificar console (F12)

### Imagens não carregam
**Causa**: Tipos MIME não configurados
**Solução**: Adicionar em `.htaccess`:
```apache
AddType image/webp webp
AddType image/avif avif
```

### Performance baixa
**Causa**: Cache desabilitado ou imagens não otimizadas
**Solução**: 
1. Verificar headers de cache no DevTools
2. Converter imagens para WebP/AVIF
3. Ativar gzip/brotli

## 📞 Contato

- **Email**: contato@diegopereira.com
- **LinkedIn**: [linkedin.com/in/diegopereira](https://linkedin.com/in/diegopereira)
- **GitHub**: [github.com/diegopereira](https://github.com/diegopereira)

## 📄 Licença

Este projeto é privado e propriedade de Diego Pereira.

---

**Última atualização**: Janeiro 2025  
**Versão**: 2.0 (Otimizações WebP/AVIF implementadas)  
**Status**: ✅ Produção

