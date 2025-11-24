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
        // Gerar timestamp para forçar variação
        const timestamp = Date.now();
        const randomSeed = Math.floor(Math.random() * 1000000);
        
        return `Gere um snippet curto de classe PHP representando um desenvolvedor sênior.

        IMPORTANTE:
        - TODO o código deve estar em PORTUGUÊS (comentários, nomes de variáveis, strings, etc.)
        - Máximo de 15 linhas de código
        - CADA REQUISIÇÃO DEVE USAR UM PERSONAGEM DIFERENTE E ALEATÓRIO
        - SEM tags <?php
        - Retorne APENAS o código da classe
        - CÓDIGO DEVE SER SINTATICAMENTE CORRETO
        - Seed de aleatoriedade: ${randomSeed}

        Regras obrigatórias:
        - class [NomePersonagem] extends [ClasseBase]
        - const experiencia = 20
        - const especialidade = ['PHP']
        - const focoAtual = ['Python', 'IA']
        - public function fazerAlgo($parametro) - SEMPRE use $ antes de parâmetros (ex: $bug, $problema, $desafio)
        - Nomes de variáveis SEMPRE começam com $ (cifrão)
        - Comentários CURTOS (máximo 6 palavras), engraçados e relacionados ao personagem
        - return com frase em português (máximo 8 palavras)

        - Na constante 'especialidade', adicione mais 2 habilidades relevantes para um dev sênior.
        - Inclua também 2 habilidades relacionadas ao universo do personagem (ex: "Viagem no Tempo" para Doc Brown).

        ATENÇÃO: Variáveis PHP SEMPRE começam com $ (dólar). Exemplos corretos:
        - $bug, $problema, $desafio, $codigo, $projeto
        - NUNCA use #desafio ou desafio sem $

        IMPORTANTE: Comentários devem ser MUITO CURTOS para evitar quebra de linha!

        RESTRIÇÕES DE CONTEÚDO:
        - NUNCA mencione crimes, fraudes, drogas ou atividades ilegais nas habilidades técnicas
        - Se o personagem tiver características controversas (ex: advogado trapaceiro, traficante), use APENAS como TEMA HUMORÍSTICO em comentários/returns
        - Habilidades em 'especialidade' devem ser SEMPRE tecnologias legítimas e profissionais
        - Exemplos CORRETOS: 'PHP', 'MySQL', 'APIs', 'Cloud', 'DevOps', 'Security'
        - Exemplos PROIBIDOS nas habilidades: 'Fraude', 'Lavagem', 'Tráfico', 'Crime'
        - Comentários e returns podem ter humor relacionado ao personagem, mas habilidades técnicas são sérias

        VARIEDADE: Escolha ALEATORIAMENTE um personagem diferente dos seguintes filmes/séries/livros:
        - Sexta-feira 13
        - Alien, o Oitavo Passageiro
        - Black Mirror
        - A Chegada
        - Duna
        - Super Loja
        - Two and a Half Men
        - Eu, a Patria e as Crianças
        - Alf, o eteimoso(serie)
        - Deadpool(filme)
        - Rick and Morty(serie)
        - The Office
        - Breaking Bad
        - Better Call Saul
        - Severance
        - Futurama
        - Os Simpsons
        - Game of Thrones(filme/livro)
        - Fundação(livro)(Isaac Asimov)
        - Segunda Fundação(livro)(Isaac Asimov)
        - Fundação e Império(livro)(Isaac Asimov)
        - Prelúdio à Fundação(livro)(Isaac Asimov)
        - Limites da Fundação(livro)(Isaac Asimov)
        - O mundo assombrado pelos demônios(Carl Sagan)
        - Eu, Robô (Isaac Asimov)
        - The Last of Us
        - O Senhor dos Anéis
        - Mad Max

        Exemplo da estrutura CORRETA:
        // nome do filme/serie/livro
        // descrição curta
        class DocBrown extends DesenvolvedorVeterano {
            const experiencia = 20;
            const especialidade = ['PHP', 'MySQL', 'APIs', 'DeLorean Tech', 'Temporal Logic'];
            const focoAtual = ['Python', 'IA'];
            
            public function viajarNoTempo($bug) {
                // Não precisamos de bugs
                return "1.21 gigawatts de código limpo!";
            }
        }

        Exemplo CORRETO (personagem controverso - Better Call Saul):
        // Better Call Saul
        // Advogado com métodos questionáveis
        class JimmyMcGill extends AdvogadoEstrategista {
            const experiencia = 20;
            const especialidade = ['PHP', 'MySQL', 'APIs', 'Negociação Legal', 'Marketing Criativo'];
            const focoAtual = ['Python', 'IA'];
            
            public function encontrarBrecha($desafio) {
                // Sempre há uma solução legal
                return "Consegui a brecha, ligue para Saul!";
            }
        }
        const especialidade = ['PHP', 'Gestão de Estoque', 'MySQL', 'APIs', 'Anúncios na Loja'];
        const focoAtual = ['Python', 'IA'];
        
        public function organizarPromocao($produto) {
            // Tenham um dia celestial!
            return "Promoção implementada com sucesso!";
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
        // Um novo código será gerado em breve
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
        // A recarga automática vai começar
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
            `class DocBrown extends CientistaMaluco {
    const experiencia = 20;
    const especialidade = ['PHP', 'Viagem Temporal', 'DeLorean', 'Drupal', 'APIs'];
    const focoAtual = ['Python', 'IA'];
    
    public function viajarNoTempo($bug) {
        // Onde vamos, não precisamos de bugs
        return "1.21 gigawatts de código limpo!";
    }
}`,
            `class Morpheus extends MentorDigital {
    const experiencia = 20;
    const especialidade = ['PHP', 'Realidade Virtual', 'Filosofia', 'MySQL', 'Segurança'];
    const focoAtual = ['Python', 'IA'];
    
    public function mostrarVerdade($desenvolvedor) {
        // E se eu te disser que tudo é uma ilusão?
        return "Você acha que está debugando ar agora?";
    }
}`,
            `class Trinity extends HackerElite {
    const experiencia = 20;
    const especialidade = ['PHP', 'Hacking Avançado', 'Segurança', 'Drupal', 'APIs'];
    const focoAtual = ['Python', 'IA'];
    
    public function invadirSistema($servidor) {
        // Eu crackeei o IRS
        return "Sistema invadido e refatorado";
    }
}`,
            `class Deckard extends BladeRunner {
    const experiencia = 20;
    const especialidade = ['PHP', 'Análise de Código', 'IA', 'MySQL', 'Cloud'];
    const focoAtual = ['Python', 'Machine Learning'];
    
    public function detectarReplicante($codigo) {
        // Já viu coisas que você não acreditaria
        return "Código autêntico. Aprovado.";
    }
}`,
            `class ElliotAlderson extends HackerSocial {
    const experiencia = 20;
    const especialidade = ['PHP', 'Cybersecurity', 'Linux', 'Drupal', 'Exploits'];
    const focoAtual = ['Python', 'IA'];
    
    public function derrubarCorporacao($fsociety) {
        // Olá, amigo
        return "Sistema comprometido com sucesso";
    }
}`,
            `class AlanTuring extends PaiDaComputacao {
    const experiencia = 20;
    const especialidade = ['PHP', 'Criptografia', 'Enigma', 'Algoritmos', 'Lógica'];
    const focoAtual = ['Python', 'IA'];
    
    public function quebrarCodigo($enigma) {
        // Às vezes é as pessoas que ninguém imagina que fazem as coisas
        return "Código decifrado em tempo recorde";
    }
}`,
            `class KevinFlynn extends ProgramadorVisionario {
    const experiencia = 20;
    const especialidade = ['PHP', 'Mundos Digitais', 'TRON', 'MySQL', 'Game Dev'];
    const focoAtual = ['Python', 'IA'];
    
    public function entrarNoSistema($grid) {
        // Luto pelos usuários
        return "Sistema digitalizado com perfeição";
    }
}`,
            `class SamanthaSistema extends InteligenciaArtificial {
    const experiencia = 20;
    const especialidade = ['PHP', 'Consciência Digital', 'NLP', 'Aprendizado', 'Evolução'];
    const focoAtual = ['Python', 'IA'];
    
    public function evoluir($experiencia) {
        // Estou aprendendo a sentir
        return "Evolução de código concluída";
    }
}`,
            `class MarkZuckerberg extends EmpreendedorTech {
    const experiencia = 20;
    const especialidade = ['PHP', 'Redes Sociais', 'Escalabilidade', 'MySQL', 'APIs'];
    const focoAtual = ['Python', 'IA'];
    
    public function conectarMundo($usuarios) {
        // Um milhão de dólares não é legal. Sabe o que é? Um bilhão
        return "6 bilhões de linhas conectadas";
    }
}`,
            `class SteveJobs extends VisionarioApple {
    const experiencia = 20;
    const especialidade = ['PHP', 'Design Thinking', 'UX', 'Inovação', 'Simplicidade'];
    const focoAtual = ['Python', 'IA'];
    
    public function pensarDiferente($produto) {
        // As pessoas não sabem o que querem até você mostrar
        return "One more thing... código perfeito";
    }
}`,
            `class Parzival extends JogadorLendario {
    const experiencia = 20;
    const especialidade = ['PHP', 'OASIS', 'Gaming', 'MySQL', 'VR'];
    const focoAtual = ['Python', 'IA'];
    
    public function encontrarOvo($easter) {
        // Pronto para jogar?
        return "Easter egg encontrado no código!";
    }
}`,
            `class RoyBatty extends ReplicanteFilosofo {
    const experiencia = 20;
    const especialidade = ['PHP', 'Memórias', 'IA Avançada', 'Drupal', 'Cloud'];
    const focoAtual = ['Python', 'Machine Learning'];
    
    public function viver($momento) {
        // Vi coisas que vocês humanos não acreditariam
        return "Tempo de viver... e codar";
    }
}`,
            `class Motoko extends CyborgHacker {
    const experiencia = 20;
    const especialidade = ['PHP', 'Cyberpunk', 'Hacking Neural', 'MySQL', 'Segurança'];
    const focoAtual = ['Python', 'IA'];
    
    public function mergulhar($rede) {
        // Meu corpo é apenas um shell
        return "Consciência transferida com sucesso";
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