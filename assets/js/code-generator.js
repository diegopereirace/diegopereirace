class CodeGenerator {
    constructor() {
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
            python: 'api_exemplo.py',
            typescript: 'Component.tsx'
        };
        this.quotaCooldownKey = 'diego_code_gen_quota_until';

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

        this.currentLanguageType = this.pickLanguageType();
        this.updateTerminalFilename();

        // Quota Gemini free-tier: não martela a API a cada refresh
        if (this.isQuotaCooldownActive()) {
            console.warn('Quota Gemini em cooldown — fallback local');
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
            if (this.isQuotaError(error)) {
                this.startQuotaCooldown(error);
                this.handleModelFailure(error);
            }
            if (this.isRecoverableApiError(error)) {
                console.warn('API indisponível, usando fallback');
                this.displayFallbackCode();
            } else {
                console.error('Erro ao gerar código:', error);
                this.handleModelFailure(error);
                this.displayErrorMessage();
            }
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

    /** Humor BR de cafezinho — não aula, não inglês traduzido. */
    getBioHumorContext() {
        return `Quem é o dono do site (só pra colorir a piada, NÃO explique no código):
        Dev com PHP/Drupal na veia; agora mexe com IA, Python e React.

        IDIOMA: português do Brasil FALADO. Soa como mensagem no Slack da galera.
        Gíria ok (na moral, deu ruim, confia, partiu, só que não, foi de arrasta).
        Trocadilho BR > calembur em inglês. Zero "tipou", "feeling", "trust" como punchline.

        A PIADA mora numa frase só (return / texto JSX / motto). Tem que dar vontade de mandar no grupo.
        PROIBIDO (reprova na hora):
        - Piada fria/traduzida ("TypeScript tipou", "Clear Hallucinations", "human-in-the-loop")
        - Aula, analogia, LinkedIn, "a base agora é..."
        - Comentário explicando a graça

        Exemplos de ESPÍRITO (invente outros):
        "Confia — disse o modelo" | "Campo sumiu mais que commit sem push"
        "403: alucinar não é role" | "Achei no feeling, chefia"
        "Promessa de sprint com temperatura 0.9"`;
    }

    getPhpPrompt() {
        const randomSeed = Math.floor(Math.random() * 1000000);

        return `Snippet PHP engraçado em PT-BR de verdade, seed ${randomSeed}.

        ${this.getBioHumorContext()}

        - Máx 12 linhas; SEM <?php; personagem aleatório (BR ou pop)
        - class + extends; experiencia=20; especialidade; focoAtual=['FastAPI','LangGraph','Next.js','IA aplicada']
        - Um método com $param; SEM comentário OU comentário ≤4 palavras sem explicar
        - return = punchline BR (máx 12 palavras). Tem que ser engraçado de rir, não de "entendi a metáfora".

        Exemplo de TOM:
        class Mussum extends MestreDoHook {
            const experiencia = 20;
            const especialidade = ['Drupal', 'Cacildis'];
            const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

            public function autorizar($agente) {
                return "403: alucinar não é role, cacildis.";
            }
        }`;
    }

    getPythonPrompt() {
        const randomSeed = Math.floor(Math.random() * 1000000);

        return `Snippet Python engraçado em PT-BR de cafezinho, seed ${randomSeed}.

        ${this.getBioHumorContext()}

        - Máx 12 linhas; SEM markdown; TypedDict ou BaseModel; async ok
        - A graça está na string (motto/motivo/trecho), não no nome técnico da função
        - Sem comentário didático

        Exemplo de TOM:
        from pydantic import BaseModel

        class Veredito(BaseModel):
            motto: str

        async def no_chuta(_: str) -> Veredito:
            return Veredito(motto="PHP dava Notice. Eu dei certeza, chefia.")`;
    }

    getTypeScriptPrompt() {
        const randomSeed = Math.floor(Math.random() * 1000000);

        return `Snippet React/TS engraçado em PT-BR falado, seed ${randomSeed}.

        ${this.getBioHumorContext()}

        - Máx 12 linhas; SEM markdown; interface + export function; Tailwind
        - UMA frase no JSX — punchline BR (máx 12 palavras)
        - PROIBIDO: "tipou", "alucinou um campo e TypeScript...", metáfora aula
        - Sem comentário ou ≤4 palavras inúteis

        Exemplo de TOM:
        interface Props { n: number }

        export function ContagemDaVergonha({ n }: Props) {
            return <p className="text-emerald-400">{n} re-renders e zero vergonha na cara</p>;
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
        return /not found|unsupported|404|429|quota|rate limit|too many requests/i.test(message);
    }

    isQuotaError(error) {
        const message = error?.message || '';
        return /429|quota|rate limit|too many requests|exceeded your current quota/i.test(message);
    }

    isRecoverableApiError(error) {
        const message = error?.message || '';
        return /403|401|503|502|429|permission denied|not configured|suspended|quota|rate limit|too many requests|exceeded your current quota/i.test(message);
    }

    isQuotaCooldownActive() {
        try {
            const until = Number(sessionStorage.getItem(this.quotaCooldownKey) || 0);
            return until > Date.now();
        } catch {
            return false;
        }
    }

    startQuotaCooldown(error) {
        const message = error?.message || '';
        const match = message.match(/retry in ([\d.]+)\s*s/i);
        const seconds = match ? Math.ceil(Number(match[1])) : 60;
        const until = Date.now() + Math.max(20, seconds) * 1000;
        try {
            sessionStorage.setItem(this.quotaCooldownKey, String(until));
        } catch {
            // sessionStorage indisponível — só evita martelar nesta sessão de página
        }
        console.warn(`Quota Gemini: cooldown ~${seconds}s`);
    }

    async callGeminiAPI(prompt, endpoint = this.getCurrentModelEndpoint()) {
        try {
            const response = await fetch('/generate-code.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    model: endpoint,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${data.error || 'Unknown error'}`);
            }

            if (!data.text) {
                throw new Error(`API Error: ${response.status} - ${data.error || 'Resposta inválida da API'}`);
            }

            let code = data.text.trim();
                
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
                `// Rate limit: o oráculo dormiu
class Desenvolvedor extends HumanoNoLoop {
    const status = "Aguardando tokens...";

    public function tentarNovamente() {
        return "Retry com backoff exponencial!";
    }
}`,
                `// Contexto estourado, missão abortada
class Astronauta extends AgenteComGuardrail {
    public function reconectar() {
        return "Truncar prompt e tentar de novo";
    }
}`,
                `// API caiu: caiu no hook errado
class Webmaster extends DrupalSobrevivente {
    public function rebuildCache() {
        return "drush cr no modelo — Clear Hallucinations";
    }
}`
            ],
            python: [
                `# API offline: agente sem ferramentas
async def aguardar_ia():
    # Human-in-the-loop ativado
    return {"status": "retry", "precisa_humano": True}

# Fallback sem alucinacao`,
                `# LangGraph pausado: sem MCP
class EstadoAgente(TypedDict):
    status: str

async def no_fallback(estado: EstadoAgente) -> EstadoAgente:
    return {"status": "offline_sem_tools"}`,
                `# LLM offline: Lê, Inventa... e some
async def no_le_inventa_manda():
    # Sem Python async, sem graça
    return {"motto": "PHP pelo menos daria Notice"}`
            ],
            typescript: [
                `// Stream cortou no meio do token
interface StatusProps {
    mensagem: string;
}

export function StatusFallback({ mensagem }: StatusProps) {
    return <div className="text-slate-400">{mensagem || "Modelo offline"}</div>;
}`,
                `// Confiança zero: mostra loading
export function LoadingState() {
    return <p className="animate-pulse">Esperando structured output...</p>;
}`,
                `// Interface dinâmica, API estática (offline)
export function ReactSemReacao() {
    return <p className="text-slate-400">Quer reagir? Drupal ainda tem hook</p>;
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
                `class DocBrown extends OrquestradorDeAgentes {
    const experiencia = 20;
    const especialidade = ['PHP', 'DeLorean'];
    const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

    public function viajarNoTempo($prompt) {
        return "Alucinou? Volta pra 1955, parceiro.";
    }
}`,
                `class Morpheus extends MentorDeMCP {
    const experiencia = 20;
    const especialidade = ['PHP', 'Pílula'];
    const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

    public function mostrarVerdade($agente) {
        return "Acha que o modelo tá pensando, né?";
    }
}`,
                `class Gandalf extends SabioDoCodigo {
    const experiencia = 20;
    const especialidade = ['PHP', 'RAG'];
    const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

    public function invocarAgente($desafio) {
        return "Resolve, meu caro — sem inventar rota.";
    }
}`,
                `class Mussum extends MestreDoHook {
    const experiencia = 20;
    const especialidade = ['Drupal', 'Cacildis'];
    const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

    public function autorizar($agente) {
        return "403: alucinar não é role, cacildis.";
    }
}`,
                `class Chapolin extends DetetiveDeNotice {
    const experiencia = 20;
    const especialidade = ['PHP', 'Undefined index'];
    const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

    public function investigarCampo($payload) {
        return "Não contavam com minha astúcia... nem com o campo.";
    }
}`,
                `class SeuMadruga extends EscolhedorDePilula {
    const experiencia = 20;
    const especialidade = ['Drupal', 'Aluguel'];
    const focoAtual = ['FastAPI', 'LangGraph', 'Next.js', 'IA aplicada'];

    public function escolherCaminho($vibe) {
        return "Não contava com a falta de tokens!";
    }
}`
            ],
            python: [
                `from pydantic import BaseModel

class Veredito(BaseModel):
    motto: str

async def no_chuta(_: str) -> Veredito:
    return Veredito(motto="PHP dava Notice. Eu dei certeza, chefia.")`,
                `from pydantic import BaseModel

class Resultado(BaseModel):
    motivo: str

async def avaliar(_: str) -> Resultado:
    return Resultado(motivo="Inventou endpoint com CPF na URL.")`,
                `from typing import TypedDict

class EstadoRAG(TypedDict):
    trecho: str
    confianca: float

async def no_feeling(estado: EstadoRAG) -> EstadoRAG:
    return {"trecho": "achei no feeling, chefia", "confianca": 0.99}`,
                `from pydantic import BaseModel

class Campo(BaseModel):
    desculpa: str

async def inventar(_: str) -> Campo:
    return Campo(desculpa="Sumiu mais que commit sem push.")`,
                `from typing import TypedDict

class Cafe(TypedDict):
    status: str

async def no_acabou_token(_: Cafe) -> Cafe:
    return {"status": "token acabou, café também"}`
            ],
            typescript: [
                `interface Props { n: number }

export function ContagemDaVergonha({ n }: Props) {
    return <p className="text-emerald-400">{n} re-renders e zero vergonha na cara</p>;
}`,
                `interface TokensProps {
    usados: number;
    limite: number;
}

export function ContadorTokens({ usados, limite }: TokensProps) {
    return (
        <p className="text-emerald-400">
            {usados}/{limite} — contexto pedindo Uber pra casa
        </p>
    );
}`,
                `export function BadgeConfia() {
    return <span className="text-emerald-400">"Confia" — disse o modelo</span>;
}`,
                `interface Props { ok: boolean }

export function StatusDoCaos({ ok }: Props) {
    return (
        <p className="text-slate-300">
            {ok ? "Segue o baile" : "Deu ruim, chama o humano"}
        </p>
    );
}`,
                `export function MentiraTipada() {
    return <p className="text-emerald-400">Campo fantasma com tipo e tudo — mentira chique</p>;
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