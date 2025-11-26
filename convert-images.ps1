# Script PowerShell para converter imagens para WebP e AVIF
# Uso: .\convert-images.ps1

Write-Host "🖼️  Convertendo imagens para formatos modernos..." -ForegroundColor Cyan
Write-Host ""

$imgDir = "assets\imgs"

# Verificar se a pasta existe
if (!(Test-Path $imgDir)) {
    Write-Host "❌ Diretório $imgDir não encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar se ImageMagick está instalado
try {
    $magickPath = Get-Command magick -ErrorAction Stop
    Write-Host "✅ ImageMagick encontrado: $($magickPath.Source)" -ForegroundColor Green
} catch {
    Write-Host "❌ ImageMagick não encontrado!" -ForegroundColor Red
    Write-Host "Instale com: choco install imagemagick" -ForegroundColor Yellow
    Write-Host "Ou baixe em: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternativa: Use o conversor online em https://squoosh.app/" -ForegroundColor Yellow
    exit 1
}

# Função para converter imagem
function Convert-Image {
    param([string]$inputPath)
    
    $basename = [System.IO.Path]::GetFileNameWithoutExtension($inputPath)
    $directory = [System.IO.Path]::GetDirectoryName($inputPath)
    
    Write-Host "Convertendo: $inputPath" -ForegroundColor White
    
    # Converter para WebP (qualidade 85)
    $webpPath = Join-Path $directory "$basename.webp"
    & magick $inputPath -quality 85 -define webp:method=6 $webpPath
    
    # Converter para AVIF (qualidade 75)
    $avifPath = Join-Path $directory "$basename.avif"
    try {
        & magick $inputPath -quality 75 -define avif:speed=6 $avifPath
    } catch {
        Write-Host "  ⚠️  AVIF não suportado nesta versão do ImageMagick" -ForegroundColor Yellow
    }
    
    # Mostrar tamanhos
    $sizeOriginal = (Get-Item $inputPath).Length / 1KB
    $sizeWebp = if (Test-Path $webpPath) { (Get-Item $webpPath).Length / 1KB } else { 0 }
    $sizeAvif = if (Test-Path $avifPath) { (Get-Item $avifPath).Length / 1KB } else { 0 }
    
    Write-Host "  Original: $([math]::Round($sizeOriginal, 2)) KB" -ForegroundColor Gray
    Write-Host "  WebP:     $([math]::Round($sizeWebp, 2)) KB" -ForegroundColor Green
    Write-Host "  AVIF:     $([math]::Round($sizeAvif, 2)) KB" -ForegroundColor Green
    
    if ($sizeWebp -gt 0) {
        $savings = [math]::Round((1 - $sizeWebp / $sizeOriginal) * 100, 1)
        Write-Host "  💾 Economia WebP: $savings%" -ForegroundColor Cyan
    }
    Write-Host ""
}

# Converter favicon.png
$faviconPath = Join-Path $imgDir "favicon.png"
if (Test-Path $faviconPath) {
    Convert-Image $faviconPath
} else {
    Write-Host "⚠️  favicon.png não encontrado em $imgDir" -ForegroundColor Yellow
}

# Converter outras imagens PNG e JPG
Get-ChildItem -Path $imgDir -Include *.png,*.jpg,*.jpeg -Recurse | Where-Object { $_.Name -ne "favicon.png" } | ForEach-Object {
    Convert-Image $_.FullName
}

Write-Host "✅ Conversão concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Tamanho total do diretório:" -ForegroundColor Cyan
$totalSize = (Get-ChildItem -Path $imgDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "$([math]::Round($totalSize, 2)) MB" -ForegroundColor White
