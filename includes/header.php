
<header id="main-header" class="fixed w-full z-40 transition-all duration-300 bg-transparent py-5" role="banner">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
                <a href="index.php" class="flex items-center gap-2" aria-label="Ir para a página inicial">
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
                </a>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center space-x-8" aria-label="Navegação principal">
                <?php foreach ($navLinks as $link): ?>
                    <?php if (isset($link['children'])): ?>
                        <?php
                            $parentActive = !empty($link['active']);
                            $parentName = $link['name'] ?? 'Projetos';
                        ?>
                        <div id="nav-projetos-desktop-wrap" class="relative group nav-flyout-wrap">
                            <button type="button"
                                    id="nav-projetos-desktop-trigger"
                                    class="<?php echo $parentActive
                                        ? 'text-emerald-400 border-b-2 border-emerald-400 font-medium transition-colors text-sm uppercase tracking-wide pb-0.5'
                                        : 'text-slate-300 hover:text-emerald-400 font-medium transition-colors text-sm uppercase tracking-wide'; ?>"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    aria-controls="nav-projetos-desktop-panel">
                                <?php echo htmlspecialchars($parentName, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                            </button>
                            <ul id="nav-projetos-desktop-panel"
                                class="absolute left-0 top-full pt-2 min-w-[16rem] z-50 space-y-1 hidden group-hover:block group-focus-within:block nav-flyout-panel [.nav-flyout-force-open_&]:block"
                                role="list">
                                <?php foreach ($link['children'] as $child): ?>
                                    <?php
                                        $childHref = $child['href'] ?? '#';
                                        $childName = $child['name'] ?? '';
                                        $childExternal = !empty($child['external']);
                                        $childActive = !empty($child['active']);
                                        $childBadge = $child['badge'] ?? '';
                                        $childLabel = $childExternal
                                            ? $childName . ' (abre em nova aba)'
                                            : $childName;
                                    ?>
                                    <li>
                                        <a href="<?php echo htmlspecialchars($childHref, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>"
                                           class="block px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 shadow-xl hover:bg-slate-800 hover:text-emerald-400 transition-colors <?php echo $childActive ? 'text-emerald-400 border-emerald-400/50' : 'text-slate-300'; ?>"
                                           <?php if ($childExternal): ?>target="_blank" rel="noopener noreferrer"<?php endif; ?>
                                           aria-label="<?php echo htmlspecialchars($childLabel, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>">
                                            <span class="flex items-center gap-2 text-sm font-medium">
                                                <?php echo htmlspecialchars($childName, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                                                <?php if ($childExternal): ?>
                                                    <i data-lucide="external-link" class="w-3 h-3 shrink-0" aria-hidden="true"></i>
                                                <?php endif; ?>
                                            </span>
                                            <?php if ($childBadge !== ''): ?>
                                                <span class="text-slate-500 text-xs"><?php echo htmlspecialchars($childBadge, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?></span>
                                            <?php endif; ?>
                                        </a>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php else: ?>
                        <?php
                            $href = $link['href'] ?? '#';
                            $name = $link['name'] ?? '';
                            $isExternal = !empty($link['external']) || str_starts_with($href, 'http://') || str_starts_with($href, 'https://');
                            $isPrimary = !empty($link['primary']);
                        ?>
                        <a href="<?php echo htmlspecialchars($href, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>"
                           class="<?php echo $isPrimary
                               ? 'text-emerald-400 hover:text-emerald-300 font-bold transition-colors text-sm uppercase tracking-wide'
                               : 'text-slate-300 hover:text-emerald-400 font-medium transition-colors text-sm uppercase tracking-wide'; ?>"<?php if ($isExternal): ?> target="_blank" rel="noopener noreferrer"<?php endif; ?>>
                            <?php echo htmlspecialchars($name, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                        </a>
                    <?php endif; ?>
                <?php endforeach; ?>
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
                <?php if (isset($link['children'])): ?>
                    <?php
                        $parentActive = !empty($link['active']);
                        $parentName = $link['name'] ?? 'Projetos';
                    ?>
                    <div class="rounded-lg border border-slate-800 overflow-hidden">
                        <button type="button"
                                id="nav-projetos-mobile-trigger"
                                class="w-full text-left px-4 py-3 transition-colors <?php echo $parentActive
                                    ? 'text-emerald-400 bg-slate-800 font-medium'
                                    : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800'; ?>"
                                aria-expanded="false"
                                aria-haspopup="true"
                                aria-controls="nav-projetos-mobile-panel">
                            <?php echo htmlspecialchars($parentName, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                        </button>
                        <div id="nav-projetos-mobile-panel" class="hidden border-t border-slate-800 pl-4">
                            <?php foreach ($link['children'] as $child): ?>
                                <?php
                                    $childHref = $child['href'] ?? '#';
                                    $childName = $child['name'] ?? '';
                                    $childExternal = !empty($child['external']);
                                    $childActive = !empty($child['active']);
                                    $childBadge = $child['badge'] ?? '';
                                    $childLabel = $childExternal
                                        ? $childName . ' (abre em nova aba)'
                                        : $childName;
                                ?>
                                <a href="<?php echo htmlspecialchars($childHref, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>"
                                   class="block pl-8 pr-4 py-3 rounded-lg transition-colors mobile-link <?php echo $childActive
                                       ? 'text-emerald-400 bg-slate-800'
                                       : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800'; ?>"<?php if ($childExternal): ?> target="_blank" rel="noopener noreferrer"<?php endif; ?>
                                   aria-label="<?php echo htmlspecialchars($childLabel, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>">
                                    <span class="flex items-center gap-2">
                                        <?php echo htmlspecialchars($childName, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                                        <?php if ($childExternal): ?>
                                            <i data-lucide="external-link" class="w-3 h-3 shrink-0" aria-hidden="true"></i>
                                        <?php endif; ?>
                                    </span>
                                    <?php if ($childBadge !== ''): ?>
                                        <span class="text-slate-500 text-xs"><?php echo htmlspecialchars($childBadge, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?></span>
                                    <?php endif; ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php else: ?>
                    <?php
                        $href = $link['href'] ?? '#';
                        $name = $link['name'] ?? '';
                        $isExternal = !empty($link['external']) || str_starts_with($href, 'http://') || str_starts_with($href, 'https://');
                        $isPrimary = !empty($link['primary']);
                    ?>
                    <a href="<?php echo htmlspecialchars($href, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>"
                       class="block px-4 py-3 rounded-lg transition-colors mobile-link <?php echo $isPrimary
                           ? 'bg-emerald-500 text-white font-bold hover:bg-emerald-600'
                           : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800'; ?>"<?php if ($isExternal): ?> target="_blank" rel="noopener noreferrer"<?php endif; ?>>
                        <?php echo htmlspecialchars($name, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                    </a>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
    </nav>
</header>
