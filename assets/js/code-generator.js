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

        this.isGenerating = true;
        this.showLoading();

        // Pequeno delay para mostrar o loading
        setTimeout(() => {
            this.displayFallbackCode();
            this.updateTimestamp();
            this.hideLoading();
            this.isGenerating = false;
        }, 500);
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
console.log('API Response Status:', response.status);
die;
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

        // Aplicar syntax highlighting diretamente
        const formattedCode = this.formatPHPCode(code);
        
        codeContent.innerHTML = `<pre class="text-slate-300">${formattedCode}</pre>`;
        codeContent.classList.remove('hidden');
    }

    formatPHPCode(code) {
        // Primeiro, escapar HTML manualmente
        const escaped = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Aplicar syntax highlighting
        return escaped
            // Strings primeiro (para não interferir com outros padrões)
            .replace(/(&quot;[^&quot;]*&quot;|'[^']*')/g, '<span class="text-green-400">$1</span>')
            // Comments
            .replace(/\/\/.*/g, '<span class="text-slate-600">$&</span>')
            // Keywords
            .replace(/\b(class|extends|const|public|function|return)\b/g, '<span class="text-purple-400">$1</span>')
            // Class names após class/extends
            .replace(/(<span class="text-purple-400">(?:class|extends)<\/span>)\s+(\w+)/g, '$1 <span class="text-yellow-300">$2</span>')
            // Function names
            .replace(/(<span class="text-purple-400">function<\/span>)\s+(\w+)/g, '$1 <span class="text-blue-400">$2</span>')
            // Constants
            .replace(/(<span class="text-purple-400">const<\/span>)\s+(\w+)/g, '$1 <span class="text-cyan-300">$2</span>')
            // Numbers
            .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
            // Variables
            .replace(/\$(\w+)/g, '<span class="text-pink-400">$$1</span>')
            // Arrays brackets
            .replace(/\[/g, '<span class="text-slate-400">[</span>')
            .replace(/\]/g, '<span class="text-slate-400">]</span>');
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