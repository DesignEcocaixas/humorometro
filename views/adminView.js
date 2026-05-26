function adminView() {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Administração - Funcionários</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

    <style>
        body {
            background-color: #f4f6f8;
        }
        .table img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 50%;
        }

         /* ===== LOADING GLOBAL ===== */
        #loadingOverlay {
            position: fixed;
            inset: 0;
            background: rgba(13, 87, 73, 0.35);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        .loading-content {
            text-align: center;
        }

        /* =====================================
   ANIMAÇÃO PERSONALIZADA DOS MODAIS
===================================== */

/* Remove animação padrão do Bootstrap */
.modal.fade .modal-dialog {
    transition: none;
}

/* Estado inicial */
.modal.animar .modal-dialog {
    transform: translateY(40px) scale(0.95);
    opacity: 0;
}

/* Estado ativo */
.modal.animar.show .modal-dialog {
    animation: modalEntrada 0.35s ease forwards;
}

@keyframes modalEntrada {
    0% {
        transform: translateY(40px) scale(0.95);
        opacity: 0;
    }
    60% {
        transform: translateY(-5px) scale(1.02);
        opacity: 1;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

/* Backdrop suave */
.modal-backdrop.show {
    animation: backdropFade 0.3s ease forwards;
}

@keyframes backdropFade {
    from { opacity: 0; }
    to { opacity: 0.5; }
}

/* Micro animação interna */
.modal.animar .modal-content {
    animation: conteudoFade 0.4s ease;
}

@keyframes conteudoFade {
    from {
        opacity: 0;
        transform: scale(0.98);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
    </style>
</head>
<body>

<div id="loadingOverlay">
    <div class="loading-content">
        <div class="spinner-border text-light" role="status"></div>
        <div class="mt-3 text-white fw-semibold">
            Carregando...
        </div>
    </div>
</div>

<nav class="navbar" style="background-color:#0D5749;">
    <div class="container-fluid">
        <span class="navbar-brand d-flex align-items-center gap-2 text-white">
            <img src="/public/logo.png" height="28">
            Administração
        </span>

        <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm"
                onclick="abrirModalAvaliacoes()">
                <i class="fa-regular fa-comment-dots"></i>
                Avaliações
            </button>

            <a href="/" class="btn btn-outline-light btn-sm">
                Autoavaliação
            </a>
        </div>
    </div>
</nav>


<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Funcionários Cadastrados</h4>
        <button class="btn btn-primary" onclick="novoFuncionario()">
            <i class="fa fa-plus"></i> Novo Funcionário
        </button>
    </div>

    <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle">
            <thead class="table-dark text-center">
                <tr>
                    <th>Foto</th>
                    <th>Nome</th>
                    <th>Setor</th>
                    <th>Início</th>
                    <th width="150">Ações</th>
                </tr>
            </thead>
            <tbody id="listaFuncionarios"></tbody>
        </table>

    </div>

</div>

<div class="modal fade animar" id="modalFuncionario" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="tituloModal">Cadastro de Funcionário</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <form id="formFuncionario">

                    <input type="hidden" id="funcionarioId">

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Nome Completo</label>
                            <input type="text" id="nome" class="form-control" required>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Data de Nascimento</label>
                            <input type="date" id="data_nascimento" class="form-control" required>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Início de Contrato</label>
                            <input type="date" id="inicio_contrato" class="form-control" required>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Sexo</label>
                            <select id="sexo" class="form-select" required>
                                <option value="">Selecione</option>
                                <option>Masculino</option>
                                <option>Feminino</option>
                                <option>Outro</option>
                            </select>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Setor</label>
                            <select id="setor" class="form-select" required>
                                <option value="">Selecione</option>
                                <option>Comercial</option>
                                <option>Financeiro</option>
                                <option>Produção</option>
                                <option>Logística</option>
                                <option>RH</option>
                                <option>Gerencia</option>
                                <option>Design</option>
                                <option>Direção</option>
                            </select>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Foto</label>
                            <input type="file" id="foto" class="form-control" accept="image/*">
                        </div>
                    </div>

                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button class="btn btn-success" onclick="salvarFuncionario()">Salvar</button>
            </div>

        </div>
    </div>
</div>

<div class="modal fade animar" id="modalDashboard" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="tituloDashboard">
                    Dashboard de Avaliações
                </h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <canvas id="graficoAvaliacoes" height="120"></canvas>
            </div>

        </div>
    </div>
</div>

<div class="modal fade animar" id="modalRelatorio" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="tituloModalRelatorio">Gerar Relatório de Avaliação</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="relatorioFuncionarioId">
                <input type="hidden" id="relatorioFuncionarioNome">
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Selecione o Ano</label>
                        <select id="selectRelatorioAno" class="form-select" onchange="atualizarMesesRelatorio()"></select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Selecione o Mês</label>
                        <select id="selectRelatorioMes" class="form-select"></select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button class="btn btn-success" onclick="baixarRelatorioCsv()"><i class="fa fa-download"></i> Baixar CSV</button>
            </div>
        </div>
    </div>
</div>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
let modal = new bootstrap.Modal(document.getElementById('modalFuncionario'));
let modalRelatorio = new bootstrap.Modal(document.getElementById('modalRelatorio'));
let opcoesRelatorioCache = [];

document.addEventListener('DOMContentLoaded', carregarFuncionarios);

// ===============================
// LISTAR
// ===============================
function carregarFuncionarios() {
    fetch('/api/funcionarios')
        .then(res => res.json())
        .then(dados => {
            const tbody = document.getElementById('listaFuncionarios');
            tbody.innerHTML = '';

            dados.forEach(f => {
                tbody.innerHTML += \`
                    <tr style="cursor: pointer;" onclick='editarFuncionario(\${JSON.stringify(f)})'>
                        <td class="text-center align-middle">
                            \${f.foto ? '<img src="' + f.foto + '" class="img-fluid rounded" style="max-height:50px;">' : ''}
                        </td>

                        <td class="align-middle">\${f.nome_completo}</td>
                        <td class="align-middle">\${f.setor}</td>
                        <td class="align-middle">\${formatarData(f.inicio_contrato)}</td>

                        <td class="text-center align-middle">
                            <button class="btn btn-sm btn-info me-1" title="Visualizar Dashboard"
                                onclick="event.stopPropagation(); abrirDashboard(\${f.id}, '\${f.nome_completo}')">
                                <i class="fa fa-chart-line"></i>
                            </button>

                            <button class="btn btn-sm btn-success me-1" title="Gerar Relatório"
                                onclick="event.stopPropagation(); abrirModalRelatorio(\${f.id}, '\${f.nome_completo}')">
                                <i class="fa fa-file-excel"></i>
                            </button>

                            <button class="btn btn-sm btn-danger" title="Excluir"
                                onclick="event.stopPropagation(); excluirFuncionario(\${f.id})">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                \`;

            });
        });
}

// ===============================
// NOVO
// ===============================
function novoFuncionario() {
    document.getElementById('formFuncionario').reset();
    document.getElementById('funcionarioId').value = '';
    document.getElementById('tituloModal').innerText = 'Novo Funcionário';
    modal.show();
}

// ===============================
// EDITAR
// ===============================
function editarFuncionario(f) {
    document.getElementById('funcionarioId').value = f.id;
    document.getElementById('nome').value = f.nome_completo;
    document.getElementById('data_nascimento').value = f.data_nascimento.split('T')[0];
    document.getElementById('inicio_contrato').value = f.inicio_contrato.split('T')[0];
    document.getElementById('sexo').value = f.sexo;
    document.getElementById('setor').value = f.setor;

    document.getElementById('tituloModal').innerText = 'Editar Funcionário';
    modal.show();
}

// ===============================
// SALVAR (CREATE / UPDATE)
// ===============================
function salvarFuncionario() {
    const id = document.getElementById('funcionarioId').value;
    const formData = new FormData();

    formData.append('nome_completo', document.getElementById('nome').value);
    formData.append('data_nascimento', document.getElementById('data_nascimento').value);
    formData.append('inicio_contrato', document.getElementById('inicio_contrato').value);
    formData.append('sexo', document.getElementById('sexo').value);
    formData.append('setor', document.getElementById('setor').value);

    const foto = document.getElementById('foto').files[0];
    if (foto) formData.append('foto', foto);

    const url = id ? '/api/funcionarios/' + id : '/api/funcionarios';
    const method = id ? 'PUT' : 'POST';

    fetch(url, { method, body: formData })
        .then(() => {
    modal.hide();
    carregarFuncionarios();

    mostrarSucesso(
        'Dados salvos!',
        'O funcionário foi salvo com sucesso.'
    );
});
}

// ===============================
// EXCLUIR
// ===============================
function excluirFuncionario(id) {
    confirmarAcao('Deseja excluir este funcionário?', () => {
        fetch('/api/funcionarios/' + id, { method: 'DELETE' })
            .then(() => {
                carregarFuncionarios();
                mostrarSucesso(
                    'Funcionário excluído!',
                    'O registro foi removido com sucesso.'
                );
            });
    });
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// ===============================
// DASHBOARD
// ===============================
let modalDashboard = new bootstrap.Modal(
    document.getElementById('modalDashboard')
);

let chartAvaliacoes = null;

function abrirDashboard(funcionarioId, nome) {
    document.getElementById('tituloDashboard').innerText =
        'Avaliações de ' + nome + ' (mês atual)';

    fetch('/api/avaliacoes/mensal/' + funcionarioId)
        .then(res => res.json())
        .then(dados => {
            const labels = dados.map(d => 
                new Date(d.dia).toLocaleDateString('pt-BR')
            );
            const valores = dados.map(d => d.estrelas);

            const ctx = document
                .getElementById('graficoAvaliacoes')
                .getContext('2d');

            if (chartAvaliacoes) {
                chartAvaliacoes.destroy();
            }

            chartAvaliacoes = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Estrelas',
                        data: valores,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        y: {
                            min: 0,
                            max: 6,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });

            modalDashboard.show();
        });
}

// ===============================
// LÓGICA DE RELATÓRIO
// ===============================
function abrirModalRelatorio(funcionarioId, nome) {
    document.getElementById('relatorioFuncionarioId').value = funcionarioId;
    document.getElementById('relatorioFuncionarioNome').value = nome;
    document.getElementById('tituloModalRelatorio').innerText = \`Relatório: \${nome}\`;

    fetch('/api/avaliacoes/relatorio-opcoes/' + funcionarioId)
        .then(res => res.json())
        .then(dados => {
            opcoesRelatorioCache = dados;
            const selectAno = document.getElementById('selectRelatorioAno');
            const selectMes = document.getElementById('selectRelatorioMes');
            
            selectAno.innerHTML = '';
            selectMes.innerHTML = '';

            if (dados.length === 0) {
                selectAno.innerHTML = '<option value="">Sem dados</option>';
                selectMes.innerHTML = '<option value="">Sem dados</option>';
                modalRelatorio.show();
                return;
            }

            // Extrai os anos únicos
            const anosUnicos = [...new Set(dados.map(d => d.ano))];
            anosUnicos.forEach(ano => {
                selectAno.innerHTML += \`<option value="\${ano}">\${ano}</option>\`;
            });

            atualizarMesesRelatorio();
            modalRelatorio.show();
        });
}

function atualizarMesesRelatorio() {
    const anoSelecionado = document.getElementById('selectRelatorioAno').value;
    const selectMes = document.getElementById('selectRelatorioMes');
    selectMes.innerHTML = '';

    const mesesDoAno = opcoesRelatorioCache.filter(d => d.ano == anoSelecionado);
    const nomesMeses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    mesesDoAno.forEach(d => {
        selectMes.innerHTML += \`<option value="\${d.mes}">\${nomesMeses[d.mes]}</option>\`;
    });
}

function baixarRelatorioCsv() {
    const funcionarioId = document.getElementById('relatorioFuncionarioId').value;
    const nome = document.getElementById('relatorioFuncionarioNome').value;
    const ano = document.getElementById('selectRelatorioAno').value;
    const mes = document.getElementById('selectRelatorioMes').value;

    if(!ano || !mes) return alert('Sem dados suficientes para gerar o relatório.');

    fetch(\`/api/avaliacoes/relatorio-dados/\${funcionarioId}/\${ano}/\${mes}\`)
        .then(res => res.json())
        .then(dados => {
            if (dados.length === 0) {
                alert('Nenhum dado encontrado para o período escolhido.');
                return;
            }

            let somaEstrelas = 0;
            let csvContent = \`Relatório de Avaliações - \${nome}\\n\`;
            csvContent += \`Período: \${mes}/\${ano}\\n\\n\`;
            csvContent += "Data;Estrelas\\n";

            dados.forEach(d => {
                const dataLocal = new Date(d.dia).toLocaleDateString('pt-BR');
                csvContent += \`\${dataLocal};\${d.estrelas}\\n\`;
                somaEstrelas += d.estrelas;
            });

            const media = (somaEstrelas / dados.length).toFixed(2);
            csvContent += \`\\nMédia do Mês:;\${media}\\n\`;

            const blob = new Blob(["\\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", \`relatorio_\${nome.replace(/\\s+/g, '_')}_\${mes}_\${ano}.csv\`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            modalRelatorio.hide();
        });
}


function calcularTempoEmpresa(dataInicio) {
    const inicio = new Date(dataInicio);
    const hoje = new Date();

    let meses =
        (hoje.getFullYear() - inicio.getFullYear()) * 12 +
        (hoje.getMonth() - inicio.getMonth());

    if (hoje.getDate() < inicio.getDate()) {
        meses--;
    }

    if (meses < 12) {
        return meses <= 1 ? '1 mês' : meses + ' meses';
    }

    const anos = Math.floor(meses / 12);
    return anos === 1 ? '1 ano' : anos + ' anos';
}

    window.addEventListener('load', () => {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 300);
        }
    });

    function showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    function hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    let modalAvaliacoes = new bootstrap.Modal(
    document.getElementById('modalAvaliacoes')
);

function abrirModalAvaliacoes() {
    const modalEl = document.getElementById('modalAvaliacoes');
    const modalAvaliacoes = bootstrap.Modal.getOrCreateInstance(modalEl);

    const container = document.getElementById('listaAvaliacoes');
    container.innerHTML = '<div class="text-center text-muted">Carregando avaliações...</div>';

    fetch('/api/avaliacoes/todas')
        .then(res => res.json())
        .then(avaliacoes => {

            const comSugestao = avaliacoes.filter(a =>
                a.sugestao && a.sugestao.trim() !== ''
            );

            if (comSugestao.length === 0) {
                container.innerHTML = \`
                    <div class="text-center text-muted py-4">
                        Nenhuma avaliação registrada até o momento.
                    </div>
                \`;
                modalAvaliacoes.show();
                return;
            }

            container.innerHTML = '';

            const agrupadas = {};

            comSugestao.forEach(a => {
                const data = new Date(a.avaliado_em).toLocaleDateString('pt-BR');
                if (!agrupadas[data]) {
                    agrupadas[data] = [];
                }
                agrupadas[data].push(a);
            });

            Object.keys(agrupadas).forEach(data => {
                container.innerHTML += \`
                    
                \`;

                agrupadas[data].forEach(a => {
                    const dataFormatada = new Date(a.avaliado_em).toLocaleDateString('pt-BR');

                    container.innerHTML += \`
                        <div class="card mb-2">
                            <div class="card-body">

                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <small class="text-muted">
                                        \${dataFormatada}
                                    </small>

                                    <button class="btn btn-sm btn-outline-danger"
                                        title="Excluir comentário"
                                        onclick="excluirComentario(\${a.id})">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <strong>\${'⭐'.repeat(a.estrelas)}</strong>
                                    <small class="text-muted">Comentário anônimo</small>
                                </div>

                                <p class="fst-italic mb-0">
                                    "\${a.sugestao}"
                                </p>

                            </div>
                        </div>
                    \`;


                });
            });

            modalAvaliacoes.show();
        })
        .catch(() => {
            container.innerHTML = \`
                <div class="text-center text-danger py-4">
                    Erro ao carregar avaliações.
                </div>
            \`;
            modalAvaliacoes.show();
        });
}

function excluirComentario(id) {
    confirmarAcao('Deseja realmente excluir este comentário?', () => {
        fetch('/api/avaliacoes/comentario/' + id, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => {
            abrirModalAvaliacoes();
            mostrarSucesso(
                'Comentário excluído!',
                'A sugestão foi removida com sucesso.'
            );
        });
    });
}

function mostrarSucesso(titulo, mensagem) {
    const modalEl = document.getElementById('modalSucessoGlobal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('tituloSucesso').innerText = titulo;
    document.getElementById('mensagemSucesso').innerText = mensagem;

    modalInstance.show();

    setTimeout(() => {
        modalInstance.hide();
    }, 2000);
}

function confirmarAcao(mensagem, callback) {
    const modalEl = document.getElementById('modalConfirmacaoGlobal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('mensagemConfirmacao').innerText = mensagem;

    const btn = document.getElementById('btnConfirmarAcao');

    const novoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(novoBtn, btn);

    novoBtn.addEventListener('click', () => {
        modalInstance.hide();
        callback();
    });

    modalInstance.show();
}

</script>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="modal fade animar" id="modalAvaliacoes" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    Avaliações dos Colaboradores
                </h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">

                <div id="listaAvaliacoes" class="d-flex flex-column gap-3">
                    </div>

            </div>

        </div>
    </div>
</div>

<div class="modal fade animar" id="modalSucessoGlobal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center py-4">

            <div class="modal-body">
                <div class="mb-3 text-success">
                    <i class="fa-solid fa-circle-check fa-3x"></i>
                </div>

                <h5 class="fw-bold mb-2" id="tituloSucesso">
                    Operação realizada com sucesso!
                </h5>

                <p class="text-muted mb-0" id="mensagemSucesso">
                    A ação foi concluída corretamente.
                </p>
            </div>

        </div>
    </div>
</div>

<div class="modal fade animar" id="modalConfirmacaoGlobal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    Confirmar ação
                </h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <p class="mb-0" id="mensagemConfirmacao">
                    Deseja realmente continuar?
                </p>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary"
                    data-bs-dismiss="modal">
                    Cancelar
                </button>

                <button class="btn btn-danger"
                    id="btnConfirmarAcao">
                    Confirmar
                </button>
            </div>

        </div>
    </div>
</div>

</body>
</html>
`;
}

module.exports = adminView;