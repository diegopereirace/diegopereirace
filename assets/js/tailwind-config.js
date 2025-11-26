/* Tailwind CSS Configuration */

// Suprimir avisos do console sobre uso do CDN em produção
(function() {
  const originalWarn = console.warn;
  console.warn = function(...args) {
    // Filtrar apenas avisos do Tailwind CDN
    if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) {
      return; // Não exibir aviso
    }
    originalWarn.apply(console, args);
  };
})();

tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        slate: {
          950: '#0f172a',
        }
      }
    }
  }
}
