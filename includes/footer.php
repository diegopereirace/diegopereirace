
<?php
// Ícone textual (não é possível enviar imagem real na mensagem automática do WhatsApp)
$whatsappMessage = urlencode("Olá!\nVim através do site diegopereirace.com.br, e estou interessado em conversar sobre o meu projeto!");
?>

<footer id="contact" class="bg-slate-950 py-12 border-t border-slate-900" role="contentinfo" aria-labelledby="footer-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-6 md:mb-0">
                <h2 id="footer-heading" class="text-2xl font-bold tracking-tighter text-white">
                    DIEGO PEREIRA <span class="text-emerald-400">{</span>dev<span class="text-emerald-400">}</span>
                </h2>
                <p class="text-slate-500 mt-2 max-w-md">
                    Desenvolvedor sênior focado em <span class="text-emerald-400 font-bold">resolver problemas reais</span> com <span class="text-emerald-400 font-bold">código limpo</span> e <span class="text-emerald-400 font-bold">eficiente</span>.
                </p>
            </div>

            <div class="flex space-x-6" aria-label="Links de redes sociais">
                <a href="https://linkedin.com/in/diegopereirace" class="text-slate-400 hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Diego Pereira">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="mailto:atendimento@diegopereirace.com.br" class="text-slate-400 hover:text-red-400 transition-colors" aria-label="Enviar e-mail para Diego Pereira">
                    <i data-lucide="mail" style="width: 24px; height: 24px;" aria-hidden="true"></i>
                </a>
                <a href="https://wa.me/558591966144?text=<?php echo $whatsappMessage; ?>" class="text-slate-400 hover:text-emerald-400 transition-colors" target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp com Diego Pereira">
                    <i data-lucide="message-circle" style="width: 24px; height: 24px;" aria-hidden="true"></i>
                </a>
            </div>
        </div>
        
        <div class="mt-8 border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
            <p>&copy; <?php echo date('Y'); ?> Diego Pereira. Todos os direitos reservados.</p>
            <p class="mt-2 md:mt-0">Feito com <span class="text-emerald-400 font-bold">PHP</span>, e muita tecnologia</p>
        </div>
    </div>
</footer>