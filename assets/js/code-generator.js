class CodeGenerator {
    constructor() {
        this.apiKey = window.PHP_DATA?.API_KEY || '';
        this.isGenerating = false;
        this.currentCode = null;
        
        this.init();
    }

    init() {
        // Verificar API Key
        if (!this.apiKey) {
            console.error('❌ API Key do Gemini não encontrada!');
            console.log('Verifique se o arquivo .env.local contém GEMINI_API_KEY');
            this.displayErrorMessage();
            return;
        }
        
        console.log('✅ API Key carregada:', this.apiKey.substring(0, 10) + '...');
        
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

        this.isGenerating = true;
        this.showLoading();

        try {
            const prompt = this.getPrompt();
            const code = await this.callGeminiAPI(prompt);
            
            if (code) {
                this.currentCode = code;
                this.displayCode(code);
                this.updateTimestamp();
            }
        } catch (error) {
            console.error('Erro ao gerar código:', error);
            this.displayErrorMessage();
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
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
        console.log('Chamando API Gemini...');
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        
        try {
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

            console.log('Status da resposta:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Detalhes do erro da API:', errorData);
                throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            console.log('Código gerado com sucesso!');
            
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                let code = data.candidates[0].content.parts[0].text.trim();
                
                // Remove markdown code blocks se existirem
                code = code.replace(/```php\n?/g, '').replace(/```\n?/g, '');
                
                return code;
            }

            throw new Error('Resposta inválida da API');
        } catch (error) {
            console.error('Erro na chamada da API:', error);
            throw error;
        }
    }

    displayCode(code) {
        const codeContent = document.getElementById('code-content');
        if (!codeContent) return;

        // Aplicar syntax highlighting diretamente
        const formattedCode = this.formatPHPCode(code);
        
        codeContent.innerHTML = `<pre class="text-slate-300 whitespace-pre-wrap break-words">${formattedCode}</pre>`;
        codeContent.classList.remove('hidden');
    }

    formatPHPCode(code) {
        // Aplicar syntax highlighting ANTES de escapar
        let formatted = code
            // 1. Comentários primeiro (cinza)
            .replace(/(\/\/[^\n]*)/g, '##COMMENT_START##$1##COMMENT_END##')
            // 2. Strings (verde) - aspas simples e duplas
            .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '##STRING_START##$1##STRING_END##')
            // 3. Keywords (roxo)
            .replace(/\b(class|extends|const|public|function|return)\b/g, '##KEYWORD_START##$1##KEYWORD_END##')
            // 4. Números (laranja)
            .replace(/\b(\d+)\b/g, '##NUMBER_START##$1##NUMBER_END##')
            // 5. Variables (rosa)
            .replace(/\$(\w+)/g, '##VAR_START###DOLLAR##$1##VAR_END##')
            // 6. Brackets (cinza claro)
            .replace(/\[/g, '##BRACKET_OPEN##')
            .replace(/\]/g, '##BRACKET_CLOSE##');
        
        // Escapar HTML
        formatted = formatted
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Aplicar spans com cores
        formatted = formatted
            .replace(/##COMMENT_START##(.*?)##COMMENT_END##/g, '<span class="text-slate-600">$1</span>')
            .replace(/##STRING_START##(.*?)##STRING_END##/g, '<span class="text-green-400">$1</span>')
            .replace(/##KEYWORD_START##(.*?)##KEYWORD_END##/g, '<span class="text-purple-400">$1</span>')
            .replace(/##NUMBER_START##(.*?)##NUMBER_END##/g, '<span class="text-orange-400">$1</span>')
            .replace(/##VAR_START##(.*?)##VAR_END##/g, '<span class="text-pink-400">$1</span>')
            .replace(/##BRACKET_OPEN##/g, '<span class="text-slate-400">[</span>')
            .replace(/##BRACKET_CLOSE##/g, '<span class="text-slate-400">]</span>')
            .replace(/#DOLLAR#/g, '$');
        
        // Aplicar cores específicas para nomes após keywords
        formatted = formatted
            .replace(/(<span class="text-purple-400">class<\/span>)\s+(\w+)/g, '$1 <span class="text-yellow-300">$2</span>')
            .replace(/(<span class="text-purple-400">extends<\/span>)\s+(\w+)/g, '$1 <span class="text-yellow-300">$2</span>')
            .replace(/(<span class="text-purple-400">function<\/span>)\s+(\w+)/g, '$1 <span class="text-blue-400">$2</span>')
            .replace(/(<span class="text-purple-400">const<\/span>)\s+(\w+)/g, '$1 <span class="text-cyan-300">$2</span>');
        
        return formatted;
    }

    displayErrorMessage() {
        const codeContent = document.getElementById('code-content');
        if (!codeContent) return;

        const errorMessages = [
            `// Ops! A IA tirou um cafezinho ☕
// (Verifique sua API Key do Gemini)

class Desenvolvedor extends Humano {
    const status = "Aguardando IA...";
    
    public function tentarNovamente() {
        // Click no refresh acima 👆
        return "Vamos tentar de novo!";
    }
}`,
            `// Houston, temos um problema! 🚀
// (A API do Gemini não respondeu)

class Astronauta extends Desenvolvedor {
    const problema = "Conexão perdida";
    
    public function reconectar() {
        // Tente novamente em alguns segundos
        return "Missão não cumprida... ainda";
    }
}`,
            `// A Matrix desconectou! 🕶️
// (Erro ao acessar o Gemini)

class Neo extends Desenvolvedor {
    const erro = "Pílula vermelha ou azul?";
    
    public function recarregarMatrix() {
        // Siga o coelho branco (botão refresh)
        return "Não há código";
    }
}`
        ];

        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        
        // Aplicar syntax highlighting na mensagem de erro também
        const formattedError = this.formatPHPCode(randomError);
        
        codeContent.innerHTML = `<pre class="text-slate-300">${formattedError}</pre>`;
        codeContent.classList.remove('hidden');
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
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
            `class WalterWhite extends ChemistryTeacher {
    const experience = 20; // Years
    const specialty = ['PHP', 'Drupal', 'Clean Code'];
    const currentFocus = ['Python', 'AI', 'Breaking Bugs'];
    
    public function cookCleanCode($messyProject) {
        // Say my name: DiegoPereira
        return "99.1% pure code";
    }
}`,
            `class FreddyMercury extends LegendaryDeveloper {
    const experience = 20; // Years
    const specialty = ['PHP', 'MySQL', 'Rock Solid APIs'];
    const currentFocus = ['AI', 'Data Science', 'Python'];
    
    public function writeRhapsodyCode($requirements) {
        // Is this the real code?
        return "The show must go on!";
    }
}`,
            `class TonyStark extends GeniusDeveloper {
    const experience = 20; // Years
    const specialty = ['PHP', 'Backend', 'Innovation'];
    const currentFocus = ['AI', 'Machine Learning', 'Jarvis 2.0'];
    
    public function buildSolution($impossible) {
        // I am Iron Dev
        return "Perfection achieved";
    }
}`,
            `class SherlockHolmes extends MasterDebugger {
    const experience = 20; // Years
    const specialty = ['PHP', 'MySQL', 'Deduction'];
    const currentFocus = ['Python', 'AI', 'Pattern Analysis'];
    
    public function solveMysteryBug($strangeError) {
        // Elementary, my dear Watson
        return "Case solved, bug fixed";
    }
}`,
            `class ElvisPresley extends KingOfDevelopers {
    const experience = 20; // Years
    const specialty = ['PHP', 'Drupal', 'Rock n Code'];
    const currentFocus = ['Python', 'AI', 'Innovation'];
    
    public function deployWithStyle($project) {
        // Thank you, thank you very much
        return "Code has left the building";
    }
}`,
            `class MichaelScott extends RegionalManager {
    const experience = 20; // Years
    const specialty = ['PHP', 'MySQL', 'Clean Architecture'];
    const currentFocus = ['Python', 'AI', 'Blockchain'];
    
    public function manageProject($dundlerMifflin) {
        // That is what she coded
        return "Best code ever. Period.";
    }
}`,
            `class JimiHendrix extends GuitarHeroDev {
    const experience = 20; // Years
    const specialty = ['PHP', 'Backend', 'Purple APIs'];
    const currentFocus = ['Python', 'AI', 'Data Science'];
    
    public function playCodeSolo($complexity) {
        // Excuse me while I code the sky
        return "Legendary performance";
    }
}`,
            `class DarthVader extends SithLordDev {
    const experience = 20; // Years
    const specialty = ['PHP', 'Dark Patterns', 'The Force'];
    const currentFocus = ['Python', 'AI', 'Imperial Systems'];
    
    public function joinTheDarkSide($youngPadawan) {
        // I find your lack of tests disturbing
        return "The code is strong with this one";
    }
}`,
            `class IndianaJones extends AdventureDeveloper {
    const experience = 20; // Years
    const specialty = ['PHP', 'MySQL', 'Ancient Codes'];
    const currentFocus = ['Python', 'AI', 'Lost APIs'];
    
    public function findHolyGrail($legacyCode) {
        // It belongs in a museum (refactor)
        return "Fortune and glory, kid";
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