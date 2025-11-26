# 🚀 Guia Rápido - Testar Otimizações de Performance

## 1️⃣ Verificar se está funcionando

### Abra o console do navegador (F12)
Deve aparecer:
```
✅ Service Worker registrado: /assets/js/sw.js
```

### Vá em DevTools → Application → Service Workers
Status deve ser: **"activated and running"**

### Vá em DevTools → Network
- Recarregue a página
- Na segunda recarga, recursos devem vir do `(ServiceWorker)`

## 2️⃣ Monitorar Performance em Tempo Real

Acesse: `http://localhost/performance-monitor.html`

Você verá:
- ✅ Status do Service Worker
- ✅ Core Web Vitals (FCP, LCP, FID, CLS, TBT)
- ✅ Recursos em cache
- ✅ Tempo de carregamento

## 3️⃣ Testar no PageSpeed Insights

1. Coloque seu site em produção (HTTPS obrigatório para SW)
2. Acesse: https://pagespeed.web.dev/
3. Digite a URL do seu site
4. Aguarde análise

### Resultados Esperados:
- Performance: **98-100** (antes: 95)
- Best Practices: **100** (antes: 96)
- SEO: **100** (antes: 92)
- LCP: **< 1.0s** (antes: 1.3s)
- Speed Index: **< 1.2s** (antes: 1.5s)

## 4️⃣ Verificar Cache Headers

### No terminal (Linux/Mac):
```bash
curl -I https://seusite.com/assets/imgs/favicon.png
```

### Deve retornar:
```
Cache-Control: max-age=31536000, public, immutable
Content-Encoding: gzip
```

### No Windows PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost/assets/imgs/favicon.png" -Method Head | Select-Object -ExpandProperty Headers
```

## 5️⃣ Testar Compressão Gzip

### Online:
https://www.giftofspeed.com/gzip-test/

Deve retornar: **✅ GZIP Enabled**

## 6️⃣ Modo Offline (após primeira visita)

1. Abra DevTools → Network
2. Marque "Offline"
3. Recarregue a página
4. Deve carregar normalmente (do cache)!

## 🐛 Troubleshooting

### Service Worker não aparece?
- Certifique-se que está em **localhost** ou **HTTPS**
- Limpe cache: Ctrl+Shift+Delete
- Teste em aba anônima

### Headers de cache não funcionam?
```bash
# Verificar se mod_expires está ativo
ddev exec apachectl -M | grep expires

# Se não estiver, ative:
ddev exec a2enmod expires
ddev exec a2enmod headers
ddev restart
```

### Gzip não funciona?
```bash
# Verificar mod_deflate
ddev exec apachectl -M | grep deflate

# Se não estiver, ative:
ddev exec a2enmod deflate
ddev restart
```

## 📊 Ferramentas de Teste Recomendadas

1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **WebPageTest**: https://www.webpagetest.org/
3. **GTmetrix**: https://gtmetrix.com/
4. **Lighthouse CI** (local):
   ```bash
   npm install -g @lhci/cli
   lhci autorun --collect.url=http://localhost
   ```

## ✅ Checklist Final

- [ ] Service Worker ativo
- [ ] Cache headers funcionando
- [ ] Gzip habilitado
- [ ] Performance Monitor mostra métricas
- [ ] PageSpeed > 95
- [ ] LCP < 1.2s
- [ ] Teste offline funciona
- [ ] Recursos vindo do Service Worker

## 🎯 Meta Final

**Score no PageSpeed: 100/100/100/100** 🏆
