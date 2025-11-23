
<!-- Chat Widget Toggle Button -->
<button id="chat-toggle" class="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group">
    <i data-lucide="message-square" style="width: 24px; height: 24px;"></i>
    <span class="absolute right-full mr-3 bg-slate-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700">
        Pergunte ao Diego AI
    </span>
</button>

<!-- Chat Window -->
<div id="chat-window" class="hidden fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[600px] animate-fade-in-up">
    <!-- Header -->
    <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i data-lucide="bot" class="text-white" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
                <h3 class="font-bold text-white">Diego AI</h3>
                <p class="text-xs text-emerald-100">Assistente Virtual</p>
            </div>
        </div>
        <button class="chat-close text-white hover:bg-white/10 p-1 rounded">
            <i data-lucide="minimize-2" style="width: 20px; height: 20px;"></i>
        </button>
    </div>

    <!-- Messages Container -->
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950"></div>

    <!-- Input Area -->
    <div class="p-4 border-t border-slate-800 bg-slate-900">
        <div class="relative">
            <input
                type="text"
                id="chat-input"
                placeholder="Digite sua pergunta..."
                class="w-full bg-slate-900 text-white pl-4 pr-12 py-3 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-500"
            />
            <button
                id="chat-send"
                class="absolute right-2 top-2 p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <i data-lucide="send" style="width: 18px; height: 18px;"></i>
            </button>
        </div>
        <p class="text-[10px] text-slate-500 text-center mt-2">
            IA pode cometer erros. Verifique as informações importantes.
        </p>
    </div>
</div>