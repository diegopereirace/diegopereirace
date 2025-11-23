/**
 * Code Generator usando Gemini AI
 */

class CodeGenerator {
    constructor() {
        this.apiKey = window.PHP_DATA?.API_KEY || '';
        this.isGenerating = false;
        this.currentCode = null;
        
        this.init();
    }

    init() {
        // Gerar código inicial ao carregar
        this.generateCode();
        
        // Botão refresh
        const refreshBtn = document.getElementById('refresh-code-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.generateCode());
        }
        
        // Auto-refresh a cada 30 segundos
        setInterval(() => {
            if (!this.isGenerating) {
                this.generateCode();
            }
        }, 30000);
    }

    async generateCode() {
        if (this.isGenerating) {
            console.warn('Geração em andamento');
            return;
        }

        // Usar sempre fallback com códigos estáticos
        this.displayFallbackCode();
    }

    getPrompt() {
        return `Generate a funny PHP class snippet representing a senior developer.

Rules:
- Create a class that extends a base class
- Use const experience = 20
- Use const specialty with array of skills including 'PHP'
- Use const currentFocus with array including 'Python', 'AI'
- Add one public function with a funny comment
- Use a character from movies, TV shows, or music bands
- NO <?php tags
- Return ONLY the class code

Example structure:
class CharacterName extends BaseClass {
    const experience = 20;
    const specialty = ['PHP', 'Skill'];
    const currentFocus = ['Python', 'AI'];
    
    public function doSomething($param) {
        // Funny comment
        return "Result";
    }
}`;
    }

    async callGeminiAPI(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Details:', errorData);
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            let code = data.candidates[0].content.parts[0].text.trim();
            
            // Remove markdown code blocks se existirem
            code = code.replace(/```php\n?/g, '').replace(/```\n?/g, '');
            
            return code;
        }

        throw new Error('Resposta inválida da API');
    }

    displayCode(code) {
        const codeContent = document.getElementById('code-content');
        if (!codeContent) return;

        // Parse e colorize o código
        const formattedCode = this.formatPHPCode(code);
        
        codeContent.innerHTML = `<pre class="text-slate-300">${formattedCode}</pre>`;
        codeContent.classList.remove('hidden');
    }

    formatPHPCode(code) {
        // Syntax highlighting simples
        return code
            // Keywords
            .replace(/\b(class|extends|const|public|function|return)\b/g, '<span class="text-purple-400">$1</span>')
            // Class names (palavras após class/extends)
            .replace(/(?:class|extends)\s+(\w+)/g, (match, className) => {
                return match.replace(className, `<span class="text-yellow-300">${className}</span>`);
            })
            // Function names
            .replace(/function\s+(\w+)/g, (match, funcName) => {
                return match.replace(funcName, `<span class="text-blue-400">${funcName}</span>`);
            })
            // Constants
            .replace(/const\s+(\w+)/g, (match, constName) => {
                return match.replace(constName, `<span class="text-cyan-300">${constName}</span>`);
            })
            // Numbers
            .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
            // Strings
            .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-green-400">$&</span>')
            // Comments
            .replace(/\/\/.*/g, '<span class="text-slate-600">$&</span>')
            // Variables
            .replace(/\$\w+/g, '<span class="text-pink-400">$&</span>')
            // Arrays
            .replace(/\[([^\]]+)\]/g, (match) => {
                return `<span class="text-slate-400">[</span>${match.slice(1, -1)}<span class="text-slate-400">]</span>`;
            });
    }

    displayFallbackCode() {
        const fallbackCodes = [
            `class DiegoPereira extends Developer {
    const experience = 20; // Years
    const specialty = ['PHP', 'Drupal', 'MySQL'];
    const currentFocus = ['Python', 'AI', 'Data Science'];
    
    public function solveProblem($bug) {
        // Resolver bronca sem enrolação
        return "Sistema rodando liso";
    }
}`,
            `class SeniorDev extends CodingNinja {
    const experience = 20; // Years
    const specialty = ['PHP', 'Architecture', 'Clean Code'];
    const currentFocus = ['AI', 'Machine Learning', 'Innovation'];
    
    public function buildSolution($requirements) {
        // From idea to production
        return "Scalable system delivered";
    }
}`
        ];

        const randomCode = fallbackCodes[Math.floor(Math.random() * fallbackCodes.length)];
        this.displayCode(randomCode);
    }

    showLoading() {
        const loading = document.getElementById('code-loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loading = document.getElementById('code-loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    updateTimestamp() {
        const timestamp = document.getElementById('code-timestamp');
        if (timestamp) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            timestamp.textContent = `Updated: ${timeStr}`;
        }
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CodeGenerator();
    });
} else {
    new CodeGenerator();
}