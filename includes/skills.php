
<section id="skills" class="py-20 bg-slate-900 border-t border-slate-800" aria-labelledby="skills-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 id="skills-heading" class="text-emerald-400 font-bold tracking-wide uppercase mb-2">Tecnologias</h2>
            <h3 class="text-3xl font-bold text-white">Tecnologias que impulsionam minha jornada</h3>
            <p class="mt-4 text-slate-400 max-w-2xl mx-auto">
                Fronteira atual: <span class="text-emerald-400 font-bold">IA</span>, <span class="text-emerald-400 font-bold">Python</span> e <span class="text-emerald-400 font-bold">React</span> — <span class="text-emerald-400 font-bold">LangGraph</span>, <span class="text-emerald-400 font-bold">FastAPI</span> e <span class="text-emerald-400 font-bold">Next.js</span>.
                Base de <span class="text-emerald-400 font-bold">14 anos</span> em <span class="text-emerald-400 font-bold">Drupal/PHP</span> para alta segurança, permissões e resiliência.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <?php foreach ($skills as $index => $skill): ?>
                <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-colors duration-300 group">
                    <div class="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4 border border-slate-700 group-hover:border-emerald-500/30">
                        <i data-lucide="<?php echo htmlspecialchars($skill['icon'], ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>" class="text-emerald-400" aria-hidden="true"></i>
                    </div>
                    <h4 class="text-xl font-bold text-white mb-4"><?php echo htmlspecialchars($skill['category'], ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?></h4>
                    <ul class="space-y-2">
                        <?php foreach ($skill['techs'] as $tech): ?>
                            <li class="flex items-center text-slate-400 text-sm">
                                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" aria-hidden="true"></span>
                                <?php echo htmlspecialchars($tech, ENT_QUOTES | ENT_HTML5, 'UTF-8'); ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endforeach; ?>
        </div>
        
        <!-- Featured Tech Banners -->
        <div class="mt-16 space-y-6">
            <div class="bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
                <div class="mb-6 md:mb-0">
                    <h4 class="text-2xl font-bold text-white mb-2">Drupal · Alta Segurança</h4>
                    <p class="text-slate-400">Arquitetura corporativa com permissões rigorosas, resiliência, módulos customizados e migrações complexas.</p>
                </div>
                <div class="flex flex-wrap gap-4">
                    <div class="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-emerald-400 font-mono font-bold">hook_form_alter()</div>
                    <div class="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-blue-400 font-mono font-bold">drush cr</div>
                </div>
            </div>
            <div class="bg-gradient-to-r from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
                <div class="mb-6 md:mb-0">
                    <h4 class="text-2xl font-bold text-white mb-2">IA aplicada &amp; APIs async</h4>
                    <p class="text-slate-400">Orquestração de LLMs com grafos de estado, structured outputs e APIs REST assíncronas.</p>
                </div>
                <div class="flex flex-wrap gap-4">
                    <div class="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-emerald-400 font-mono font-bold">LangGraph</div>
                    <div class="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-blue-400 font-mono font-bold">build_workflow()</div>
                    <div class="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-purple-400 font-mono font-bold">Structured Outputs</div>
                </div>
            </div>
        </div>
    </div>
</section>