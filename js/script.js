
/* ---------------------------
   UTILIDADES / TEMPLATES
   --------------------------- */
const Templates = (function () {
    // Simples engine de templates: substitui {{chave}} por valores em um objeto
    function render(templateString, data = {}) {
        return templateString.replace(/{{\s*([\w.]+)\s*}}/g, (match, key) => {
            const val = key.split('.').reduce((o, k) => (o ? o[k] : ''), data);
            return val != null ? val : '';
        });
    }

    // Cria um elemento DOM a partir de string HTML
    function toNode(htmlString) {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content;
    }

    return { render, toNode };
})();


/* ---------------------------
   UI MODULE (menu, toast, helpers)
   --------------------------- */
const UI = (function () {
    // Toast simples
    let toastTimer = null;
    function showToast(msg, duration = 3000) {
        // Reutiliza um elemento toast se existir, caso contrário cria
        let toast = document.querySelector('.spa-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'spa-toast';
            document.body.appendChild(toast);
            // styles mínimos (você pode mover para CSS)
            Object.assign(toast.style, {
                position: 'fixed',
                right: '1rem',
                bottom: '1rem',
                background: '#222',
                color: '#fff',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999,
                opacity: 0,
                transition: 'opacity .25s ease'
            });
        }
        toast.textContent = msg;
        toast.style.opacity = '1';

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
        }, duration);
    }

    // Menu hamburger (espera existir #menu-toggle e #menu no DOM principal)
    function initMenu() {
        const btn = document.getElementById('menu-toggle');
        const menu = document.getElementById('menu');
        if (!btn || !menu) return;
        btn.addEventListener('click', () => menu.classList.toggle('show'));
        // Fechar menu ao clicar em um link
        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => menu.classList.remove('show'));
        });
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return { showToast, initMenu, scrollToTop };
})();



/* ---------------------------
   FORM MODULE (validação, consistência, storage)
   --------------------------- */
const FormModule = (function () {
    // Validações utilitárias
    function isCPF(cpf) {
        // Validação básica: aceita formato XXX.XXX.XXX-XX ou apenas dígitos com 11 chars
        if (!cpf) return false;
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length !== 11) return false;
        // algoritmo simplificado (check digit) - implementação comum
        let sum = 0, rem;
        if (/^(.)\1+$/.test(cleaned)) return false; // todos iguais -> inválido
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

    // Mostrar erros inline (pequeno helper)
    function showFieldError(field, message) {
        // remove erro anterior
        removeFieldError(field);
        const span = document.createElement('span');
        span.className = 'field-error';
        span.textContent = message;
        // estilo mínimo se ainda não estilizado
        span.style.color = '#b71c1c';
        span.style.fontSize = '0.85rem';
        span.style.display = 'block';
        span.style.marginTop = '0.25rem';
        field.insertAdjacentElement('afterend', span);
    }

    function removeFieldError(field) {
        const next = field.nextElementSibling;
        if (next && next.classList.contains('field-error')) {
            next.remove();
        }
    }

    function validateForm(form) {
        // Consistência: verifica campos obrigatórios e formatos
        let valid = true;
        const name = form.querySelector('#name');
        const cpf = form.querySelector('#cpf');
        const email = form.querySelector('#email');
        const tel = form.querySelector('#telefone');
        const dataNasc = form.querySelector('#datanascimento');
        const cep = form.querySelector('#cep');

        // limpa erros anteriores
        [name, cpf, email, tel, dataNasc, cep].forEach(f => f && removeFieldError(f));

        if (name && name.value.trim().length < 3) {
            showFieldError(name, 'Nome muito curto');
            valid = false;
        }

        if (cpf && !isCPF(cpf.value)) {
            showFieldError(cpf, 'CPF inválido (use XXX.XXX.XXX-XX)');
            valid = false;
        }

        if (email && !/^[\w+.%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
            showFieldError(email, 'Email com formato inválido');
            valid = false;
        }

        if (tel && !isPhone(tel.value)) {
            showFieldError(tel, 'Telefone inválido');
            valid = false;
        }

        if (dataNasc && !dataNasc.value) {
            showFieldError(dataNasc, 'Data de nascimento é obrigatória');
            valid = false;
        }

        if (cep && !/^\d{5}-?\d{3}$/.test(cep.value)) {
            showFieldError(cep, 'CEP inválido (XXXXX-XXX)');
            valid = false;
        }

        // Exemplo de checagem de consistência extra:
        // usuário menor de 16 anos não pode se cadastrar como voluntário (exemplo)
        if (dataNasc && dataNasc.value) {
            const anoNasc = new Date(dataNasc.value).getFullYear();
            const idade = new Date().getFullYear() - anoNasc;
            if (idade < 16) {
                showFieldError(dataNasc, 'É necessário ter ao menos 16 anos para se voluntariar');
                valid = false;
            }
        }

        return valid;
    }

    // serializa form para objeto
    function serializeForm(form) {
        const fd = new FormData(form);
        const obj = {};
        fd.forEach((v, k) => {
            obj[k] = v;
        });
        return obj;
    }

    // salva voluntário no localStorage (array)
    function saveVolunteer(data) {
        const key = 'ong_voluntarios_v1';
        const listRaw = localStorage.getItem(key);
        const list = listRaw ? JSON.parse(listRaw) : [];
        list.push(Object.assign({ savedAt: new Date().toISOString() }, data));
        localStorage.setItem(key, JSON.stringify(list));
    }

    // Handler do submit
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
        // opcional: limpar formulário
        form.reset();
        return true;
    }

    // Inicializa: conecta o submit se existir um formulário com classe 'container-form'
    function init() {
        const form = document.querySelector('.container-form');
        if (!form) return;
        // remove event listeners antigos (prevenção) — cria clone para remover binds duplicados
        const cloned = form.cloneNode(true);
        form.parentNode.replaceChild(cloned, form);
        cloned.addEventListener('submit', handleSubmit);
        // masks e binds simples (ex: formatando CPF e telefone) - implementações simples:
        const cpfField = cloned.querySelector('#cpf');
        if (cpfField) {
            cpfField.addEventListener('input', (ev) => {
                let v = ev.target.value.replace(/\D/g, '');
                if (v.length > 11) v = v.slice(0, 11);
                v = v.replace(/^(\d{3})(\d)/, '$1.$2');
                v = v.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                v = v.replace(/\.(\d{3})(\d)/, '.$1-$2');
                ev.target.value = v;
            });
        }
        const telField = cloned.querySelector('#telefone');
        if (telField) {
            telField.addEventListener('input', (ev) => {
                let v = ev.target.value.replace(/\D/g, '');
                if (v.length > 11) v = v.slice(0, 11);
                v = v.replace(/^(\d{2})(\d)/, '($1) $2');
                v = v.replace(/(\d{5})(\d)/, '$1-$2');
                ev.target.value = v;
            });
        }
    }

    return { init, validateForm, saveVolunteer };
})();

/* ---------------------------
   INICIALIZAÇÃO DA APLICAÇÃO
   --------------------------- */

// Ativa o menu hamburger em todas as páginas
UI.initMenu();


// Ativa a validação de formulário (só vai funcionar no cadastro.html)
FormModule.init();



