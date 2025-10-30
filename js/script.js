

/* ---------------------------
   MÓDULO 1: UTILIDADES / TEMPLATES
   --------------------------- */
const Templates = (function () {
    function render(templateString, data = {}) {
        return templateString.replace(/{{\s*([\w.]+)\s*}}/g, (match, key) => {
            const val = key.split('.').reduce((o, k) => (o ? o[k] : ''), data);
            return val != null ? val : '';
        });
    }

    function toNode(htmlString) {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content;
    }

    return { render, toNode };
})();


/* ---------------------------
   MÓDULO 2: UI (menu, toast, helpers)
   --------------------------- */
const UI = (function () {
    let toastTimer = null;
    function showToast(msg, duration = 3000) {
        let toast = document.querySelector('.spa-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'spa-toast';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            document.body.appendChild(toast);
            Object.assign(toast.style, {
                position: 'fixed', right: '1rem', bottom: '1rem',
                background: '#222', color: '#fff', padding: '0.75rem 1rem',
                borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999, opacity: 0, transition: 'opacity .25s ease'
            });
        }
        toast.textContent = msg;
        toast.style.opacity = '1';

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, duration);
    }

    function initMenu() {
        const btn = document.getElementById('menu-toggle');
        const menu = document.getElementById('menu');
        if (!btn || !menu) return;
        btn.addEventListener('click', () => menu.classList.toggle('show'));
        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => menu.classList.remove('show'));
        });
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // <-- A FUNÇÃO FOI MOVIDA PARA ANTES DO RETURN -->
    function initThemeToggle() {
        const toggleButton = document.getElementById('theme-toggle');
        if (!toggleButton) return;

        const body = document.body;
        const sunIcon = '🌙';
        const moonIcon = '☀️';

        // Função para aplicar o tema
        function setTheme(theme) {
            if (theme === 'dark') {
                body.classList.add('dark-mode');
                toggleButton.innerHTML = sunIcon; // Mostra sol no modo escuro
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                toggleButton.innerHTML = moonIcon; // Mostra lua no modo claro
                localStorage.setItem('theme', 'light');
            }
        }

        // Evento de clique no botão
        toggleButton.addEventListener('click', () => {
            const isDarkMode = body.classList.contains('dark-mode');
            setTheme(isDarkMode ? 'light' : 'dark');
        });

        // Verifica a preferência salva ao carregar a página
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }

    // <-- ESTE É O ÚNICO RETURN, AGORA COM TUDO INCLUÍDO -->
    return {
        showToast,
        initMenu,
        scrollToTop,
        initThemeToggle // Adicionado ao return original
    };
})();


/* ---------------------------
   MÓDULO 3: FORMULÁRIO (validação)
   --------------------------- */
const FormModule = (function () {

    function isCPF(cpf) {
        if (!cpf) return false;
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length !== 11) return false;
        if (/^(.)\1+$/.test(cleaned)) return false;
        let sum = 0, rem;
        for (let i = 1; i <= 9; i++) sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
        rem = (sum * 10) % 11;
        if (rem === 10) rem = 0;
        if (rem !== parseInt(cleaned.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
        rem = (sum * 10) % 11;
        if (rem === 10) rem = 0;
        if (rem !== parseInt(cleaned.substring(10, 11))) return false;
        return true;
    }
    function isPhone(tel) {
        if (!tel) return false;
        const cleaned = tel.replace(/\D/g, '');
        return cleaned.length === 10 || cleaned.length === 11;
    }
    function showFieldError(field, message) {
        removeFieldError(field);
        const span = document.createElement('span');
        span.className = 'field-error';
        span.textContent = message;
        const errorId = field.id + '-error'; // Cria um ID único
        span.id = errorId;
        field.setAttribute('aria-describedby', errorId);
        field.setAttribute('aria-invalid', 'true');
        span.style.cssText = 'color: #b71c1c; font-size: 0.85rem; display: block; margin-top: 0.25rem;';
        field.insertAdjacentElement('afterend', span);
    }
    function removeFieldError(field) {
        const next = field.nextElementSibling;
        if (next && next.classList.contains('field-error')) {
            next.remove();
        }
        field.removeAttribute('aria-describedby');
        field.removeAttribute('aria-invalid');
    }
    function validateForm(form) {
        let valid = true;
        const fields = {
            name: form.querySelector('#name'),
            cpf: form.querySelector('#cpf'),
            email: form.querySelector('#email'),
            telefone: form.querySelector('#telefone'),
            datanascimento: form.querySelector('#datanascimento'),
            cep: form.querySelector('#cep')
        };

        Object.values(fields).forEach(f => f && removeFieldError(f));

        if (fields.name && fields.name.value.trim().length < 3) {
            showFieldError(fields.name, 'Nome muito curto'); valid = false;
        }
        if (fields.cpf && !isCPF(fields.cpf.value)) {
            showFieldError(fields.cpf, 'CPF inválido (use XXX.XXX.XXX-XX)'); valid = false;
        }
        if (fields.email && !/^[\w+.%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(fields.email.value)) {
            showFieldError(fields.email, 'Email com formato inválido'); valid = false;
        }
        if (fields.telefone && !isPhone(fields.telefone.value)) {
            showFieldError(fields.telefone, 'Telefone inválido'); valid = false;
        }
        if (fields.datanascimento && !fields.datanascimento.value) {
            showFieldError(fields.datanascimento, 'Data de nascimento é obrigatória'); valid = false;
        } else if (fields.datanascimento && fields.datanascimento.value) {
            const anoNasc = new Date(fields.datanascimento.value).getFullYear();
            const idade = new Date().getFullYear() - anoNasc;
            if (idade < 16) {
                showFieldError(fields.datanascimento, 'É necessário ter ao menos 16 anos para se voluntariar');
                valid = false;
            }
        }
        if (fields.cep && !/^\d{5}-?\d{3}$/.test(fields.cep.value)) {
            showFieldError(fields.cep, 'CEP inválido (XXXXX-XXX)'); valid = false;
        }
        return valid;
    }
    function serializeForm(form) {
        const fd = new FormData(form);
        const obj = {};
        fd.forEach((v, k) => { obj[k] = v; });
        return obj;
    }
    function saveVolunteer(data) {
        const key = 'ong_voluntarios_v1';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.push(Object.assign({ savedAt: new Date().toISOString() }, data));
        localStorage.setItem(key, JSON.stringify(list));
    }
    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        if (!validateForm(form)) {
            UI.showToast('Corrija os erros do formulário', 3000);
            return false;
        }
        const data = serializeForm(form);
        saveVolunteer(data);
        UI.showToast('Inscrição recebida! Obrigado por se voluntariar.', 3000);
        form.reset();
        return true;
    }

    function init() {
        const form = document.querySelector('.container-form');
        if (!form) return;


        form.setAttribute('novalidate', true);

        const cloned = form.cloneNode(true);
        form.parentNode.replaceChild(cloned, form);
        cloned.addEventListener('submit', handleSubmit);

        const cpfField = cloned.querySelector('#cpf');
        if (cpfField) {
            cpfField.addEventListener('input', (ev) => {
                let v = ev.target.value.replace(/\D/g, '').slice(0, 11);
                v = v.replace(/^(\d{3})(\d)/, '$1.$2');
                v = v.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                v = v.replace(/\.(\d{3})(\d)/, '.$1-$2');
                ev.target.value = v;
            });
        }
        const telField = cloned.querySelector('#telefone');
        if (telField) {
            telField.addEventListener('input', (ev) => {
                let v = ev.target.value.replace(/\D/g, '').slice(0, 11);
                v = v.replace(/^(\d{2})(\d)/, '($1) $2');
                v = v.replace(/(\d{5})(\d)/, '$1-$2');
                ev.target.value = v;
            });
        }
    }

    return { init };
})();



const DADOS_GALERIA = [
    { img: 'img/1.jpg', alt: 'Várias cestas básicas' },
    { img: 'img/2.jpg', alt: 'Distribuição de cestas básicas' },
    { img: 'img/3.jpg', alt: 'Voluntários organizando doações' },
    { img: 'img/4.jpg', alt: 'Crianças recebendo brinquedos' },
    { img: 'img/5.jpg', alt: 'Equipe da ONG em ação' },
    { img: 'img/6.jpg', alt: 'Distribuição de roupas' },
    { img: 'img/7.jpg', alt: 'Voluntários em evento comunitário' },
    { img: 'img/8.jpg', alt: 'Aulas de reforço escolar' },
    { img: 'img/9.jpg', alt: 'Campanha de vacinação' },
    { img: 'img/10.jpg', alt: 'Construção de moradias' },
    { img: 'img/11.jpg', alt: 'Atividades recreativas' },
    { img: 'img/12.jpg', alt: 'Distribuição de alimentos' },
    { img: 'img/13.jpg', alt: 'Treinamento profissional' },
    { img: 'img/14.jpg', alt: 'Palestra sobre saúde' },
    { img: 'img/15.jpg', alt: 'Jornada de limpeza comunitária' },
    { img: 'img/16.jpg', alt: 'Doação de livros' },
    { img: 'img/17.jpg', alt: 'Atendimento médico' },
    { img: 'img/18.jpg', alt: 'Evento cultural' },
    { img: 'img/19.jpg', alt: 'Voluntários sorrindo' },
    { img: 'img/20.jpg', alt: 'Famílias beneficiadas' }
];

const TEMPLATE_FOTO = `
    <img src="{{img}}" width="200" height="200" alt="{{alt}}" loading="lazy">
`;



const Router = (function () {

    // Seus templates HTML que você já copiou
    const templates = {
        inicio: `
   
        <section class="introduction">
            <div class="initial-introduction">
                <h2>Bem-vindo a ONG Brasil Esperança</h2>
                <p>Nosso compromisso é ajudar comunidades carentes através de diversos projetos
                    sociais. Junte-se a nós
                    nessa missão!</p>
                <div>
                    <a href="#projetos-sociais" class="btn">Saiba Mais</a>
                </div>
            </div>
        </section>

        <section id="sobre" class="sobre">
            <div class="container">
                <h2>Sobre Nós</h2>
                <p>A ONG Brasil Esperança é uma organização não governamental dedicada a promover o bem-estar social
                    e o desenvolvimento sustentável em comunidades vulneráveis. Fundado em 2010, nosso trabalho abrange
                    diversas áreas, incluindo educação, saúde, meio ambiente e assistência social.</p>
            </div>
        </section>

        <section id="informacoes" class="informacoes">
            <h2>Informações:</h2>
            <div class="container">
                <div class="informacoes-grid">
                    <article class="info-card">
                        <h2>Missão</h2>
                        <p>Promover a transformação social por meio de ações solidárias, educativas e sustentáveis,
                            contribuindo
                            para o bem-estar e o desenvolvimento das comunidades.</p>
                    </article>

                    <article class="info-card">
                        <h2>Visão</h2>
                        <p>Ser reconhecida como uma organização de referência no impacto social positivo, inspirando a
                            construção de uma sociedade mais justa, humana e igualitária.</p>
                    </article>

                    <article class="info-card">
                        <h2>Valores</h2>
                        <p>Ética, transparência, empatia, respeito, comprometimento e trabalho coletivo — princípios que
                            orientam todas as nossas ações e decisões.</p>
                    </article>

                    <article class="info-card">
                        <h2>Histórico e Conquistas</h2>
                        <p>Desde a nossa fundação, temos trabalhado incansavelmente para promover mudanças positivas nas
                            comunidades que atendemos. Nossas conquistas incluem a implementação de programas
                            educacionais,
                            campanhas de saúde e iniciativas de sustentabilidade que impactaram milhares de vidas.</p>
                    </article>

                    <article class="info-card">
                        <h2>Equipe e Estrutura Organizacional</h2>
                        <p>Nossa equipe é composta por profissionais dedicados e voluntários apaixonados pela causa
                            social.
                            Contamos com uma estrutura organizacional eficiente que nos permite planejar, executar e
                            monitorar nossos projetos de forma eficaz.</p>
                    </article>

                    <article class="info-card">
                        <h2>Relatórios de Transparência</h2>
                        <p>Comprometidos com a transparência, disponibilizamos relatórios anuais detalhando nossas
                            atividades,
                            finanças e impacto social. Acreditamos que a confiança é fundamental para fortalecer nossa
                            relação
                            com apoiadores, parceiros e a comunidade.</p>
                    </article>
                </div>
            </div>
        </section>

        <section id="projetos" class="projetos">
            <h2>Projetos:</h2>
            <div class="galeria-fotos" id="galeria-dinamica"> </div>
        </section>

        <section id="localizacao" class="localizacao">
            <div class="container">
                <h2>Localização</h2>
                <div class="localizacao-info">
                    <p>Endereço: R. Figueiredo Camargo, 137 - Bangu, Rio de Janeiro - RJ, CEP - 21875-020</p>
                    <p>Celular: (21) 99999-9999</p>
                    <p>Email: contato@ongbrasilesperanca.com.br</p>
                </div>

                <div class="mapa"> <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14704.514710513371!2d-43.47014094458007!3d-22.8717045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x99602a74114a15%3A0xb5d085b1ba398c06!2sONG%20Brasil%20Esperan%C3%A7a%20entregas%20de%20cestas!5e0!3m2!1spt-BR!2sbr!4v1760487815223!5m2!1spt-BR!2sbr"
                        width="500" height="350" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </section>
   
        `,
        cadastro: `

        <div class="voltar">
            <a href="#inicio">Voltar para a página inicial</a>
        </div>

        <div class="container-cadastro">
            <h1>Inscreva-se como voluntário</h1>
            <p>Preencha o formulário abaixo para fazer parte da ONG Brasil Esperança.</p>
        </div>


        <section class="pagina-cadastro">
            <form class="container-form" >
                <fieldset class="container-formulario">
                    <legend>Dados Pessoais</legend>
                    <div>
                        <label class="form" for="name">Nome Completo:</label>
                        <input type="text" id="name" name="name" placeholder="Seu nome" >
                    </div>
                    <div>
                        <label class="form" for="cpf">CPF:</label> <input type="text" id="cpf" name="cpf" placeholder="Seu CPF">
                    </div>
                    <div>
                        <label class="form" for="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="seuemail@exemplo.com">
                    </div>
                    <div>
                        <label class="form" for="telefone">Telefone:</label> <input type="tel" id="telefone" name="telefone" placeholder="(XX) XXXXX-XXXX">
                    </div>
                    <div>
                        <label class="form" for="datanascimento">Data de Nascimento:</label>
                        <input type="date" id="datanascimento" name="datanascimento" >
                    </div>
                </fieldset>

                <fieldset class="container-endereco">
                    <legend>Endereço</legend>
                    <div>
                        <label for="endereco">Endereço:</label>
                        <input type="text" id="endereco" name="endereco" placeholder="Seu endereço completo" >
                    </div>
                    <div>
                        <label for="cep">CEP:</label>
                        <input type="text" id="cep" name="cep" placeholder="XXXXX-XXX" >
                    </div>
                    <div>
                        <label for="cidade">Cidade:</label>
                        <input type="text" id="cidade" name="cidade" placeholder="Sua cidade" >
                    </div>
                </fieldset>

                <fieldset class="radio">
                    <legend>Preferências</legend>
                    <div>
                        <p>Deseja receber atualizações do projeto?</p>
                        <input type="radio" name="atualizacoes" id="sim" value="sim" >
                        <label for="sim">Sim</label>

                        <input type="radio" name="atualizacoes" id="nao" value="nao" >
                        <label for="nao">Não</label>
                    </div>
                </fieldset>
                <div class="btn-form">
                     <button class="bt-form1" type="submit">Voluntário!</button>
                 </div>
            </form>
        </section>
        
  
        `,

        'projetos-sociais': `

        <div class="container-projetos"> 
        <div class="voltar">
            <a href="#inicio">Voltar para a página inicial</a>
        </div>
        <div class="section-grid-doacoes">
            <section class="section">
                <h2>Sua doação faz a diferença!</h2>
                <a href="https://www.paypal.com/donate" target="_blank" rel="noopener noreferrer">Doe Agora</a>
            </section>

            <section class="section">
                <h2>Por que doar ?</h2>
                <p>Na ONG Brasil Esperança, acreditamos que pequenas atitudes podem gerar grandes mudanças.
                    Suas doações tornam possíveis projetos que levam educação, alimentação e dignidade a famílias em
                    situação de
                    vulnerabilidade.</p>
            </section>

            <section class="section">
                <h2>Seu apoio pode garantir:</h2>
                <ul>
                    <li>🍽️ Refeições para crianças em risco de fome</li>
                    <li>📚 Materiais escolares e apoio educacional</li>
                    <li>🏡 Acolhimento a famílias em situação de vulnerabilidade</li>
                </ul>
                <strong>Juntos, podemos espalhar esperança.</strong>
            </section>
        </div>

        <section class="section-doacoes">
            <h2>Formas de Doação:</h2>
            <div class="formasdecoacoes">
                <div class="pix">
                    <h3>Doação via Pix</h3>
                    <p>Chave Pix: 1234567890</p>
                </div>
                <h3>Transferência Bancária</h3>
                <ul>
                    <li>Tipo de Conta: Conta Corrente</li>
                    <li>Banco: 001 - Banco do Brasil</li>
                    <li>Agência: 1234</li>
                    <li>Conta: 56789-0</li>
                    <li>Favorecido: ONG Brasil Esperança</li>
                </ul>
            </div>
        </section>
        <div class="galeria-fotos"> <img src="img/1.jpg" width="200" height="200" alt="Várias cestas básicas" loading="lazy">
            <img src="img/2.jpg" width="200" height="200" alt="Distribuição de cestas básicas" loading="lazy">
            <img src="img/3.jpg" width="200" height="200" alt="Acolhimento de pessoas em situação de rua"
                loading="lazy">
            <img src="img/4.jpg" width="200" height="200" alt="Atividades recreativas para crianças" loading="lazy">
        </div>

        <section class="galeria-fotos-grid-12">
            <div class="col-3 card">
                <img src="img/8.jpg" alt="Projeto Esperança">
                <h3>Projeto Esperança</h3>
                <p>Iniciativa de inclusão social para jovens da comunidade.</p>
                <span class="tag">Educação</span>
            </div>

            <div class="col-3 card">
                <img src="img/6.jpg" alt="Cuidar é Amar">
                <h3>Cuidar é Amar</h3>
                <p>Apoio a famílias em vulnerabilidade social.</p>
                <span class="tag">Saúde</span>
            </div>
        </section>
    <div class="doacoes">
        <p> <strong>🔒 Doação 100% segura.</strong></p>
        <p>Cada centavo é investido com transparência e responsabilidade.</p>
        <p>Acompanhe nossos relatórios e veja o impacto da sua contribuição.</p>
    </div>
</div>
 
   
        `
    };

    // Armazena a página que está carregada no momento
    let paginaAtual = null;

    // Lista de chaves que são "páginas" (trocam o conteúdo)
    const paginasReais = ['inicio', 'cadastro', 'projetos-sociais'];

    // Função que carrega o conteúdo de uma página
    function carregarPagina(pageKey) {
        const container = document.getElementById('app-container');
        if (!container) return;

        // Pega o HTML do template
        const html = templates[pageKey] || `<h2>Página não encontrada</h2>`;
        container.innerHTML = html;

        // Define a classe no container para o CSS funcionar
        container.className = 'page-' + pageKey;

        // Salva a página atual
        paginaAtual = pageKey;

        const newHeading = container.querySelector('h1, h2');
        if (newHeading) {
            // Adiciona tabindex="-1" para permitir que ele receba foco
            newHeading.setAttribute('tabindex', '-1');
            // Move o foco para ele
            newHeading.focus();
        }


        if (pageKey === 'cadastro') {
            FormModule.init(); // Ativa a validação do formulário
        }

        if (pageKey === 'inicio') {
            // Ativa a galeria dinâmica
            const galeriaContainer = document.getElementById('galeria-dinamica');
            if (galeriaContainer) {
                const htmlGaleria = DADOS_GALERIA.map(foto => {
                    return Templates.render(TEMPLATE_FOTO, foto);
                }).join('');
                galeriaContainer.innerHTML = htmlGaleria;
            }
        }
    }


    function handleRouteChange() {
        const hash = window.location.hash || '#inicio';
        let pageKey = hash.substring(1);

        if (paginasReais.includes(pageKey)) {



            if (pageKey !== paginaAtual) {
                carregarPagina(pageKey);
            }

            UI.scrollToTop();

        } else {


            if (paginaAtual !== 'inicio') {

                carregarPagina('inicio');


                setTimeout(() => {
                    const ancora = document.getElementById(pageKey);
                    if (ancora) {
                        ancora.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);

            } else {

                const ancora = document.getElementById(pageKey);
                if (ancora) {
                    ancora.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }

    function init() {
        // Ouve a mudança de hash (cliques nos links #)
        window.addEventListener('hashchange', handleRouteChange);
        // Carrega a página correta quando o site abre
        window.addEventListener('load', handleRouteChange);
    }

    return { init };

})();




// Ativa o menu hamburger em todas as páginas
UI.initMenu();

// Ativa o toggle de tema claro/escuro
UI.initThemeToggle();

// Ativa o Router. O Router agora é responsável por chamar o FormModule.init()
Router.init();