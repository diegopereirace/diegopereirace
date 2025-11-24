
<section id="skills" class="py-20 bg-slate-900 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-emerald-400 font-bold tracking-wide uppercase mb-2">Tecnologias</h2>
            <h3 class="text-3xl font-bold text-white">Minha Caixa de Ferramentas</h3>
            <p class="mt-4 text-slate-400 max-w-2xl mx-auto">
                Do front-end ao back-end, estas são as principais ferramentas e tecnologias que me permitem construir soluções digitais robustas, escaláveis e eficientes.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <?php foreach ($skills as $index => $skill): ?>
                <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-colors duration-300 group">
                    <div class="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4 border border-slate-700 group-hover:border-emerald-500/30">
                        <i data-lucide="<?php echo $skill['icon']; ?>" class="text-emerald-400"></i>
                    </div>
                    <h4 class="text-xl font-bold text-white mb-4"><?php echo $skill['category']; ?></h4>
                    <ul class="space-y-2">
                        <?php foreach ($skill['techs'] as $tech): ?>
                            <li class="flex items-center text-slate-400 text-sm">
                                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                                <?php echo $tech; ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endforeach; ?>
        </div>
        
        <!-- Featured Tech Banner -->
        <div class="mt-16 bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div class="mb-6 md:mb-0">
                <h4 class="text-2xl font-bold text-white mb-2">Especialista Drupal</h4>
                <p class="text-slate-400">Desenvolvimento de módulos customizados, migrações complexas e otimização de performance.</p>
            </div>
            <div class="flex gap-4">
                <div class="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-emerald-400 font-mono font-bold">hook_form_alter()</div>
                <div class="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-blue-400 font-mono font-bold">drush cr</div>
            </div>
        </div>
    </div>
</section>