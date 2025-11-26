#!/bin/bash
# Script para converter imagens PNG/JPG para WebP e AVIF
# Uso: bash convert-images.sh

echo "🖼️  Convertendo imagens para formatos modernos..."
echo ""

# Diretório de imagens
IMG_DIR="assets/imgs"

# Verificar se ImageMagick está instalado
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não encontrado!"
    echo "Instale com: sudo apt-get install imagemagick (Linux)"
    echo "            brew install imagemagick (macOS)"
    echo "            choco install imagemagick (Windows)"
    exit 1
fi

# Função para converter imagem
convert_image() {
    local input=$1
    local basename="${input%.*}"
    
    echo "Convertendo: $input"
    
    # Converter para WebP (qualidade 85, otimizado)
    if command -v magick &> /dev/null; then
        magick "$input" -quality 85 -define webp:method=6 "${basename}.webp"
        magick "$input" -quality 75 -define avif:speed=6 "${basename}.avif"
    else
        convert "$input" -quality 85 -define webp:method=6 "${basename}.webp"
        convert "$input" -quality 75 "${basename}.avif" 2>/dev/null || echo "⚠️  AVIF não suportado nesta versão"
    fi
    
    # Mostrar tamanhos
    local size_original=$(du -h "$input" | cut -f1)
    local size_webp=$(du -h "${basename}.webp" 2>/dev/null | cut -f1)
    local size_avif=$(du -h "${basename}.avif" 2>/dev/null | cut -f1)
    
    echo "  Original: $size_original"
    echo "  WebP:     $size_webp"
    echo "  AVIF:     $size_avif"
    echo ""
}

# Converter favicon.png
if [ -f "$IMG_DIR/favicon.png" ]; then
    convert_image "$IMG_DIR/favicon.png"
else
    echo "⚠️  favicon.png não encontrado em $IMG_DIR"
fi

# Converter outras imagens PNG e JPG (se houver)
find "$IMG_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read img; do
    if [[ ! "$img" == *"favicon.png" ]]; then
        convert_image "$img"
    fi
done

echo "✅ Conversão concluída!"
echo ""
echo "📊 Economia de espaço:"
du -sh "$IMG_DIR"
