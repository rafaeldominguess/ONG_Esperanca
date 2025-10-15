const form = document.getElementById('form');
const mensagem = document.getElementById('mensagem-sucesso');

// Função genérica de máscara
function mascaraInput(input, mascaraFunc, maxLength) {
    input.addEventListener('input', () => {
        let v = input.value.replace(/\D/g, '');
        if (maxLength) v = v.slice(0, maxLength);
        input.value = mascaraFunc(v);
    });
}

// Máscara CPF
mascaraInput(document.getElementById('cpf'), v => {
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
}, 11);

// Máscara Telefone
mascaraInput(document.getElementById('telefone'), v => {
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    return v;
}, 11);

// Máscara CEP
mascaraInput(document.getElementById('cep'), v => {
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    return v;
}, 8);

// Envio do formulário
form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.checkValidity()) {
        // Esconde o formulário
        form.style.display = 'none';

        // Mostra a mensagem de sucesso
        mensagem.style.display = 'block';

        // Redireciona após 5 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        form.reportValidity();
    }
});