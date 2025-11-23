
import { GoogleGenerativeAI } from "@google/genai";

// Access variables injected by PHP in header.php
const API_KEY = window.PHP_DATA?.API_KEY;
const SYSTEM_INSTRUCTION = window.PHP_DATA?.SYSTEM_INSTRUCTION || "You are a helpful assistant.";

// Initialize Gemini
let genAI = null;
let model = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION
    });
} else {
    console.error("API_KEY não encontrada no PHP_DATA.");
}

const toggleBtn = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeBtns = document.querySelectorAll('.chat-close');
const messagesContainer = document.getElementById('chat-messages');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');

// Initial History
let history = [
    { role: 'model', text: 'Olá! Sou o assistente virtual do Diego. Pergunte-me sobre a experiência dele com PHP, Drupal ou sua formação acadêmica!' }
];

let isLoading = false;

// Initialize
renderMessages();

// Event Listeners
if (toggleBtn && chatWindow) {
    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.add('hidden');
        chatWindow.classList.remove('hidden');
        scrollToBottom();
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            toggleBtn.classList.remove('hidden');
        });
    });

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

// Main Functions
async function handleSend() {
    const text = input.value.trim();
    if (!text || isLoading) return;
    
    if (!model) {
        addMessage('model', 'Erro: Chave de API não configurada.');
        return;
    }

    // Add User Message
    addMessage('user', text);
    input.value = '';
    isLoading = true;
    updateUIState();

    try {
        const chat = model.startChat({
            history: history.slice(0, -1).map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage(text);
        const reply = result.response.text() || "Desculpe, não entendi.";
        addMessage('model', reply);

    } catch (error) {
        console.error("Erro Gemini:", error);
        addMessage('model', "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
    } finally {
        isLoading = false;
        updateUIState();
    }
}

function addMessage(role, text) {
    history.push({ role, text });
    renderMessages();
}

function renderMessages() {
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';
    
    history.forEach(msg => {
        const wrapper = document.createElement('div');
        wrapper.className = `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const bubble = document.createElement('div');
        bubble.className = `max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
            msg.role === 'user'
              ? 'bg-emerald-600 text-white rounded-tr-none'
              : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
        }`;
        bubble.innerText = msg.text;
        
        wrapper.appendChild(bubble);
        messagesContainer.appendChild(wrapper);
    });

    if (isLoading) {
        const loadingWrapper = document.createElement('div');
        loadingWrapper.className = 'flex justify-start';
        loadingWrapper.innerHTML = `
            <div class="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
        `;
        messagesContainer.appendChild(loadingWrapper);
    }

    scrollToBottom();
}

function scrollToBottom() {
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function updateUIState() {
    if (sendBtn) {
        sendBtn.disabled = isLoading;
        if (isLoading) {
            sendBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            sendBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}
