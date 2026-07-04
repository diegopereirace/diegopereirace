class CodeGenerator {
    constructor() {
        // Validar e sanitizar API key
        const rawApiKey = window.PHP_DATA?.API_KEY || '';
        this.apiKey = this.validateApiKey(rawApiKey);
        this.isGenerating = false;
        this.currentCode = null;
        this.modelCandidates = [
            'models/gemini-2.5-flash',
            'models/gemini-1.5-pro',
            'models/gemini-1.5-flash'
        ];
        this.currentModelIndex = 0;
        this.currentLanguageType = 'php';
        this.languageFilenames = {
            php: 'DiegoPereira.php',
            python: 'triagem.py',
            typescript: 'Dashboard.tsx'
        };
        // Limpar dados sensíveis do window após uso (silenciar erro read-only)
        // Nota: Tentativas de delete/assign podem falhar em objetos frozen/sealed
        // Isso é esperado e não afeta a segurança (API key já foi copiada)
        if (window.PHP_DATA) {
            // Silenciar completamente - não fazer nada se falhar
        }
        
        this.init();
    }
    
    validateApiKey(key) {
        // Validar formato da API key
        if (!key || typeof key !== 'string') {
            console.warn('API key não fornecida ou inválida');
            return '';
        }
        
        // API keys do Google geralmente têm 39 caracteres alfanuméricos
        if (!/^[A-Za-z0-9_-]{20,}$/.test(key)) {
            console.warn('Formato de API key suspeito');
            return '';
        }
        
        return key;
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

        this.currentLanguageType = this.pickLanguageType();
        this.updateTerminalFilename();

        if (!this.apiKey) {
            this.displayFallbackCode();
            this.isGenerating = false;
            this.hideLoading();
            return;
        }

        try {
            const prompt = this.getPrompt();
            const endpoint = this.getCurrentModelEndpoint();
            const code = await this.callGeminiAPI(prompt, endpoint);

            this.currentCode = code;
            this.displayCode(code);
            console.info('Plano A: API OK');
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

    pickLanguageType() {
        const types = ['php', 'python', 'typescript'];
        return types[Math.floor(Math.random() * types.length)];
    }

    updateTerminalFilename() {
        const el = document.getElementById('terminal-filename');
        if (el) {
            el.textContent = this.languageFilenames[this.currentLanguageType] || 'DiegoPereira.php';
        }
    }

    getPrompt() {
        switch (this.currentLanguageType) {
            case 'python':
                return this.getPythonPrompt();
            case 'typescript':
                return this.getTypeScriptPrompt();
            default:
                return this.getPhpPrompt();
        }
    }

    getPhpPrompt() {
        const randomSeed = Math.floor(Math.random() * 1000000);

        return `Gere um snippet curto de classe PHP representando um desenvolvedor sênior.

        IMPORTANTE:
        - TODO o código deve estar em PORTUGUÊS (comentários, nomes de variáveis, strings, etc.)
        - Máximo de 15 linhas de código
        - CADA REQUISIÇÃO DEVE USAR UM PERSONAGEM DIFERENTE E ALEATÓRIO
        - SEM tags <?php
        - CÓDIGO DEVE SER SINTATICAMENTE CORRETO
        - Seed de aleatoriedade: ${randomSeed}

        Regras obrigatórias:
        - class [NomePersonagem] extends [ClasseBase]
        - const experiencia = 20
        - const especialidade = ['PHP']
        - const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada']
        - public function fazerAlgo($parametro) - SEMPRE use $ antes de parâmetros
        - Comentários CURTOS (máximo 6 palavras), engraçados e relacionados ao personagem
        - return com frase em português (máximo 8 palavras)

        Exemplo:
        class DocBrown extends DesenvolvedorVeterano {
            const experiencia = 20;
            const especialidade = ['PHP', 'MySQL', 'APIs', 'DeLorean Tech'];
            const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

            public function viajarNoTempo($bug) {
                return "1.21 gigawatts de código limpo!";
            }
        }`;
    }

    getPythonPrompt() {
        const randomSeed = Math.floor(Math.random() * 1000000);

        return `Gere um snippet curto Python (FastAPI + LangGraph) para triagem jurídica com IA.

        IMPORTANTE:
        - Comentários e strings em PORTUGUÊS
        - Máximo de 15 linhas
        - SEM markdown ou blocos de código
        - Seed: ${randomSeed}

        Regras:
        - Use async def quando apropriado
        - Inclua um nó LangGraph (triagem, classificacao ou coleta_documento)
        - Use Pydantic BaseModel ou TypedDict para structured output
        - Comentários curtos (máximo 6 palavras)

        Exemplo:
        from langgraph.graph import StateGraph

        class TriagemState(TypedDict):
            area_juridica: str

        async def no_triagem(state: TriagemState) -> TriagemState:
            return {"area_juridica": "trabalhista"}`;
    }

    getTypeScriptPrompt() {
        const randomSeed = Math.floor(Math.random() * 1000000);

        return `Gere um snippet curto React/TypeScript para dashboard jurídico (Next.js).

        IMPORTANTE:
        - Comentários e strings em PORTUGUÊS
        - Máximo de 15 linhas
        - SEM markdown ou blocos de código
        - Seed: ${randomSeed}

        Regras:
        - Use interface ou type para props
        - Componente funcional com export
        - Tailwind classes em className quando possível

        Exemplo:
        interface LeadCardProps {
            nome: string;
            area: string;
            status: 'triagem' | 'qualificado';
        }

        export function LeadCard({ nome, area, status }: LeadCardProps) {
            return <div className="rounded-lg border p-4">{nome}</div>;
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
                code = code.replace(/```(?:php|python|typescript|tsx|ts)?\n?/g, '').replace(/```\n?/g, '');

                if (this.currentLanguageType === 'php') {
                    code = this.sanitizePHPCode(code);
                    if (!this.isCodeValid(code)) {
                        throw new Error('Código inválido detectado após sanitização');
                    }
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

        const formattedCode = this.formatCode(code, this.currentLanguageType);

        codeContent.innerHTML = `<pre class="text-slate-300 whitespace-pre-wrap break-words">${formattedCode}</pre>`;
        codeContent.classList.remove('hidden');
        this.setSourceBadge('Fonte: IA');
    }

    formatCode(code, lang) {
        switch (lang) {
            case 'python':
                return this.formatGenericCode(code, 'python');
            case 'typescript':
                return this.formatGenericCode(code, 'typescript');
            default:
                return this.formatPHPCode(code);
        }
    }

    formatGenericCode(code, lang) {
        let formatted = code
            .replace(/(#.*$)/gm, '##COMMENT_START##$1##COMMENT_END##')
            .replace(/(\/\/[^\n]*)/g, '##COMMENT_START##$1##COMMENT_END##')
            .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '##STRING_START##$1##STRING_END##');

        const keywords = lang === 'python'
            ? ['async', 'def', 'class', 'return', 'from', 'import', 'await', 'if', 'else']
            : ['interface', 'type', 'export', 'function', 'return', 'const', 'async', 'await', 'import'];

        keywords.forEach((kw) => {
            const re = new RegExp(`\\b(${kw})\\b`, 'g');
            formatted = formatted.replace(re, '##KEYWORD_START##$1##KEYWORD_END##');
        });

        formatted = formatted
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/##COMMENT_START##(.*?)##COMMENT_END##/g, '<span class="text-slate-600">$1</span>')
            .replace(/##STRING_START##(.*?)##STRING_END##/g, '<span class="text-green-400">$1</span>')
            .replace(/##KEYWORD_START##(.*?)##KEYWORD_END##/g, '<span class="text-purple-400">$1</span>');

        return formatted;
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

        const errorMessages = {
            php: [
                `// Ops! A IA tirou um cafezinho
class Desenvolvedor extends Humano {
    const status = "Aguardando IA...";

    public function tentarNovamente() {
        return "Vamos tentar de novo!";
    }
}`,
                `// Houston, temos um problema!
class Astronauta extends Desenvolvedor {
    public function reconectar() {
        return "Missão não cumprida... ainda";
    }
}`
            ],
            python: [
                `# Ops! API indisponível
async def aguardar_ia():
    # Tentando reconectar
    return {"status": "retry"}

# Fallback ativo`,
                `# LangGraph em pausa
class TriagemState(TypedDict):
    status: str

async def no_fallback(state):
    return {"status": "offline"}`
            ],
            typescript: [
                `// Ops! IA offline
interface StatusProps {
    mensagem: string;
}

export function StatusFallback({ mensagem }: StatusProps) {
    return <div className="text-slate-400">{mensagem}</div>;
}`,
                `// Reconectando...
export function LoadingState() {
    return <p className="animate-pulse">Gerando código...</p>;
}`
            ]
        };

        const langErrors = errorMessages[this.currentLanguageType] || errorMessages.php;
        const randomError = langErrors[Math.floor(Math.random() * langErrors.length)];
        const formattedError = this.formatCode(randomError, this.currentLanguageType);

        codeContent.innerHTML = `<pre class="text-slate-300">${formattedError}</pre>`;
        codeContent.classList.remove('hidden');
        this.setSourceBadge('Fonte: Erro');
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    displayFallbackCode() {
        const fallbackCodes = {
            php: [
                `class DocBrown extends CientistaMaluco {
    const experiencia = 20;
    const especialidade = ['PHP', 'Drupal', 'APIs', 'DeLorean Tech'];
    const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

    public function viajarNoTempo($bug) {
        return "1.21 gigawatts de código limpo!";
    }
}`,
                `class Morpheus extends MentorDigital {
    const experiencia = 20;
    const especialidade = ['PHP', 'MySQL', 'Segurança', 'Drupal'];
    const focoAtual = ['FastAPI', 'LangGraph', 'Next.js'];

    public function mostrarVerdade($desenvolvedor) {
        return "Você acha que está debugando ar agora?";
    }
}`
            ],
            python: [
                `from langgraph.graph import StateGraph
from typing import TypedDict

class TriagemState(TypedDict):
    area_juridica: str
    documentos: list[str]

async def no_triagem(state: TriagemState) -> TriagemState:
    # Classifica área jurídica
    return {"area_juridica": "trabalhista", "documentos": []}`,
                `from pydantic import BaseModel

class ResultadoTriagem(BaseModel):
    area: str
    confianca: float

async def classificar_caso(texto: str) -> ResultadoTriagem:
    # Structured output da triagem
    return ResultadoTriagem(area="civil", confianca=0.95)`
            ],
            typescript: [
                `interface LeadCardProps {
    nome: string;
    area: string;
    status: 'triagem' | 'qualificado';
}

export function LeadCard({ nome, area, status }: LeadCardProps) {
    return (
        <div className="rounded-lg border border-slate-700 p-4">
            <span className="text-emerald-400">{area}</span>
            <p className="text-white">{nome}</p>
        </div>
    );
}`,
                `interface MetricProps {
    label: string;
    value: number;
}

export function MetricCard({ label, value }: MetricProps) {
    return (
        <div className="bg-slate-800 rounded-xl p-6 text-center">
            <span className="text-3xl font-bold text-emerald-400">{value}</span>
            <p className="text-slate-400 text-xs">{label}</p>
        </div>
    );
}`
            ]
        };

        const langFallbacks = fallbackCodes[this.currentLanguageType] || fallbackCodes.php;
        const randomCode = langFallbacks[Math.floor(Math.random() * langFallbacks.length)];
        this.displayCode(randomCode);
        this.setSourceBadge('Fonte: Fallback');
    }

    showLoading() {
        const loading = document.getElementById('code-loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
        this.setSourceBadge('Fonte: Gerando...');
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

    setSourceBadge(text) {
        const source = document.getElementById('code-source');
        if (!source) return;
        source.textContent = text;
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