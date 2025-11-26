
<header id="main-header" class="fixed w-full z-40 transition-all duration-300 bg-transparent py-5" role="banner">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
                <div class="p-1.5 rounded-lg">
                    <picture>
                        <source srcset="assets/imgs/logo-header.avif" type="image/avif">
                        <source srcset="assets/imgs/logo-header.webp" type="image/webp">
                        <img src="assets/imgs/logo-header.png" alt="Logo Diego Pereira" draggable="false" width="40" height="40" loading="eager" class="w-10 h-10 object-contain select-none" />
                    </picture>
                </div>
                <span class="text-2xl font-bold tracking-tighter text-white">
                    DIEGO PEREIRA <span class="text-emerald-400">{</span>dev<span class="text-emerald-400">}</span>
                </span>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center space-x-8" aria-label="Navegação principal">
                <?php foreach ($navLinks as $link): ?>
                    <a href="<?php echo htmlspecialchars($link['href'], ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" 
                        class="text-slate-300 hover:text-emerald-400 font-medium transition-colors text-sm uppercase tracking-wide">
                        <?php echo htmlspecialchars($link['name'], ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                    </a>
                <?php endforeach; ?>
                <a href="#contact" 
                   class="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow hover:shadow-emerald-500/25">
                    Contrate-me
                </a>
            </nav>

            <!-- Mobile Menu Button -->
            <button id="mobile-menu-btn" class="md:hidden text-slate-300 hover:text-white" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="mobile-menu">
                <i data-lucide="menu" id="menu-icon" style="width: 28px; height: 28px;" aria-hidden="true"></i>
                <i data-lucide="x" id="close-icon" class="hidden" style="width: 28px; height: 28px;" aria-hidden="true"></i>
            </button>
        </div>
    </div>

    <!-- Mobile Navigation -->
    <nav id="mobile-menu" class="hidden md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 shadow-xl animate-fade-in-up" aria-label="Menu mobile">
        <div class="px-4 py-4 space-y-2">
            <?php foreach ($navLinks as $link): ?>
                <a href="<?php echo htmlspecialchars($link['href'], ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" 
                   class="block px-4 py-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors mobile-link">
                    <?php echo htmlspecialchars($link['name'], ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                </a>
            <?php endforeach; ?>
            <a href="#contact" 
               class="block px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all text-center mobile-link">
                Contrate-me
            </a>
        </div>
    </nav>
</header>