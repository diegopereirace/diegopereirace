class CodeGenerator {
    constructor() {
        this.apiKey = window.PHP_DATA?.API_KEY || '';
        this.isGenerating = false;
        this.currentCode = null;
        this.modelCandidates = [
            'models/gemini-2.5-flash',
            'models/gemini-1.5-pro',
            'models/gemini-1.5-flash'
        ];
        this.currentModelIndex = 0;
        
        this.init();
    }

    init() {
        // Gerar código inicial ao carregar
        this.generateCode();
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
            const endpoint = this.getCurrentModelEndpoint();
            const code = await this.callGeminiAPI(prompt, endpoint);

            this.currentCode = code;
            this.displayCode(code);
            this.updateTimestamp();
        } catch (error) {
            console.error('Erro ao gerar código:', error);
            this.handleModelFailure(error);
            this.displayErrorMessage();
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
    }

    getPrompt() {
        return `Gere um snippet curto de classe PHP representando um desenvolvedor sênior.

IMPORTANTE:
- TODO o código deve estar em PORTUGUÊS (comentários, nomes de variáveis, strings, etc.)
- Máximo de 15 linhas de código
- Use um personagem de filmes, séries ou bandas de rock famosas
- SEM tags <?php
- Retorne APENAS o código da classe
- CÓDIGO DEVE SER SINTATICAMENTE CORRETO

Regras obrigatórias:
- class [NomePersonagem] extends [ClasseBase]
- const experiencia = 20
- const especialidade = ['PHP', 'Habilidade']
- const focoAtual = ['Python', 'IA']
- public function fazerAlgo($parametro) - SEMPRE use $ antes de parâmetros (ex: $bug, $problema, $desafio)
- Nomes de variáveis SEMPRE começam com $ (cifrão)
- Comentários em português, engraçados e relacionados ao personagem
- return com frase em português

ATENÇÃO: Variáveis PHP SEMPRE começam com $ (dólar). Exemplos corretos:
- $bug, $problema, $desafio, $codigo, $projeto
- NUNCA use #desafio ou desafio sem $

Exemplo da estrutura CORRETA:
class DocBrown extends DesenvolvedorVeterano {
    const experiencia = 20;
    const especialidade = ['PHP', 'Viagem no Tempo'];
    const focoAtual = ['Python', 'IA'];
    
    public function resolverProblema($bug) {
        // Onde estamos indo, não precisamos de bugs
        return "1.21 gigawatts de código limpo!";
    }
}`;
    }

    getCurrentModelEndpoint() {
        return this.modelCandidates[this.currentModelIndex] || this.modelCandidates[0];
    }

    handleModelFailure(error) {
        if (this.shouldRotateModel(error) && this.currentModelIndex < this.modelCandidates.length - 1) {
            this.currentModelIndex += 1;
            console.warn(`Modelo indisponível. Próxima tentativa usará ${this.getCurrentModelEndpoint()}`);
        }
    }

    shouldRotateModel(error) {
        const message = error?.message || '';
        return /not found|unsupported|404/i.test(message);
    }

    async callGeminiAPI(prompt, endpoint = this.getCurrentModelEndpoint()) {
        const url = `https://generativelanguage.googleapis.com/v1beta/${endpoint}:generateContent?key=${this.apiKey}`;

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

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`Detalhes do erro da API (${endpoint}):`, errorData);
                throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                let code = data.candidates[0].content.parts[0].text.trim();
                
                // Remove markdown code blocks se existirem
                code = code.replace(/```php\n?/g, '').replace(/```\n?/g, '');
                
                // CORREÇÃO: Sanitizar código para remover erros de sintaxe PHP
                code = this.sanitizePHPCode(code);

                if (!this.isCodeValid(code)) {
                    throw new Error('Código inválido detectado após sanitização');
                }

                if (!code.trim()) {
                    throw new Error('Código vazio retornado pela IA');
                }
                
                return code;
            }

            throw new Error('Resposta inválida da API');
        } catch (error) {
            console.error(`Erro na chamada da API (${endpoint}):`, error);
            throw error;
        }
    }

    sanitizePHPCode(code) {
        const letterClass = 'A-Za-z_\\x80-\\uFFFF';
        const wordClass = `${letterClass}0-9`;

        const removeInvalidBetweenDollarAndName = new RegExp(`\\$[^${letterClass}]+([${letterClass}][${wordClass}]*)`, 'g');
        const removeSpacesAfterDollar = new RegExp(`\\$\\s+([${letterClass}][${wordClass}]*)`, 'g');

        const normalize = (match, name) => `$${name}`;

        code = code.replace(removeInvalidBetweenDollarAndName, normalize);
        code = code.replace(removeSpacesAfterDollar, normalize);

        return code;
    }

    isCodeValid(code) {
        const invalidSpecialCharPattern = /\$[\s#@!&*%]/;
        const startsWithNumberPattern = /\$\d/;
        return !invalidSpecialCharPattern.test(code) && !startsWithNumberPattern.test(code);
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
            .replace(/\$(\w+)/g, '##VAR_START##$$$1##VAR_END##')
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
            .replace(/##BRACKET_CLOSE##/g, '<span class="text-slate-400">]</span>');
        
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
            `// Ops! A IA tirou um cafezinho
class Desenvolvedor extends Humano {
    const status = "Aguardando IA...";
    
    public function tentarNovamente() {
        // Click no refresh acima
        return "Vamos tentar de novo!";
    }
}`,
            `// Houston, temos um problema!

class Astronauta extends Desenvolvedor {
    const problema = "Conexão perdida";
    
    public function reconectar() {
        // Tente novamente em alguns segundos
        return "Missão não cumprida... ainda";
    }
}`,
            `// A Matrix desconectou!

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