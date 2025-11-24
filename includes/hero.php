<section id="home" class="relative pt-20 lg:pt-32 pb-16 overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div class="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-8">
        <div class="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0 lg:pl-0">
            <div class="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <span class="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                Disponível para projetos
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Desenvolvedor <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Full Stack</span>
                <br />
                Especialista PHP
            </h1>
            <p class="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Quase 20 anos vivendo e respirando tecnologia. Da base sólida em 
                <span class="text-slate-200 font-semibold"> PHP</span>, 
                <span class="text-slate-200 font-semibold"> MySQL/PostgreSQL</span> e
                <span class="text-slate-200 font-semibold"> Drupal</span> 
                à expansão para Python, IA e Data Science.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a href="#contact" class="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1">
                    Vamos conversar?
                </a>
                <a href="#about" class="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all duration-300">
                    Minha experiência
                </a>
            </div>
            
            <div class="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-500">
                <div class="flex items-center gap-2">
                    <i data-lucide="terminal" style="width: 20px; height: 20px;"></i>
                    <span class="font-mono text-sm">Backend Expert</span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="database" style="width: 20px; height: 20px;"></i>
                    <span class="font-mono text-sm">DB Architect</span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="server" style="width: 20px; height: 20px;"></i>
                    <span class="font-mono text-sm">DevOps aware</span>
                </div>
            </div>
        </div>

        <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div class="relative w-full max-w-lg">
                <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-2xl transform rotate-3 blur opacity-30"></div>
                
                <!-- Code Terminal Card -->
                <div class="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <!-- Terminal Header -->
                    <div class="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                        <div class="flex gap-2">
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div class="flex items-center gap-2 ml-4">
                            <i data-lucide="laptop" class="text-slate-400" style="width: 16px; height: 16px;"></i>
                            <span class="text-sm text-slate-400 font-mono">DiegoPereira.php</span>
                        </div>
                        <button id="refresh-code-btn" class="p-1 hover:bg-slate-700 rounded transition-colors" title="Gerar novo código">
                            <i data-lucide="refresh-cw" class="text-slate-400" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                    
                    <!-- Code Content -->
                    <div id="code-display" class="p-4 font-mono text-xs leading-relaxed min-h-[400px] max-h-[500px] overflow-x-auto overflow-y-auto relative">
                        <!-- Loading State -->
                        <div id="code-loading" class="absolute inset-0 flex items-center justify-center bg-slate-900">
                            <div class="text-center">
                                <div class="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p class="text-slate-400">Gerando código...</p>
                            </div>
                        </div>
                        
                        <!-- Code will be inserted here by JavaScript -->
                        <div id="code-content" class="hidden"></div>
                    </div>
                    
                    <!-- Footer with AI badge -->
                    <div class="bg-slate-800 px-4 py-2 border-t border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span class="text-xs text-slate-400">Powered by Gemini AI</span>
                        </div>
                        <span class="text-xs text-slate-500 font-mono" id="code-timestamp"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>