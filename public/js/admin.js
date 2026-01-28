document.addEventListener('DOMContentLoaded', () => {
    carregarFuncionarios();

    const btnSalvar = document.getElementById('btnSalvarFuncionario');
    btnSalvar.addEventListener('click', salvarFuncionario);
});

function salvarFuncionario() {
    const form = document.getElementById('formFuncionario');
    const formData = new FormData(form);

    fetch('/api/funcionarios', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            if (res.sucesso) {
                alert('Funcionário cadastrado com sucesso!');
                form.reset();
                bootstrap.Modal.getInstance(
                    document.getElementById('modalFuncionario')
                ).hide();
                carregarFuncionarios();
            } else {
                alert('Erro ao cadastrar funcionário');
            }
        })
        .catch(() => {
            alert('Erro de comunicação com o servidor');
        });
}