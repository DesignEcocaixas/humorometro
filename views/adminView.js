function adminView() {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Administração - Humorômetro</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    
    <!-- Fonte Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        /* ===== TEMA ATUALIZADO ===== */
        :root {
            --ecoflow-dark: #1f1f1f; /* Novo cinza escuro */
            --ecoflow-green: #08c068; /* Novo verde */
            --ecoflow-green-hover: #069d55;
            --ecoflow-bg: #e9ecef; 
            --ecoflow-card: #ffffff;
            --ecoflow-text: #333333;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--ecoflow-bg);
            color: var(--ecoflow-text);
            -webkit-font-smoothing: antialiased;
        }

        .navbar {
            background-color: var(--ecoflow-dark) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn {
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .btn-primary {
            background-color: var(--ecoflow-green);
            border-color: var(--ecoflow-green);
            color: #fff;
        }
        
        .btn-primary:hover {
            background-color: var(--ecoflow-green-hover);
            border-color: var(--ecoflow-green-hover);
            transform: translateY(-1px);
        }

        /* ===== CARDS DE FUNCIONÁRIOS ===== */
        .card-ecoflow {
            background: var(--ecoflow-card);
            border-radius: 16px;
            border: none;
            box-shadow: 0 6px 16px rgba(0,0,0,0.06);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            overflow: hidden;
        }
        .card-ecoflow:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
        .card-img-container {
            height: 140px;
            width: 100%;
            background-color: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .card-img-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .card-img-container i {
            font-size: 3.5rem;
            color: #adb5bd;
        }

        /* ===== BARRA DE PESQUISA ===== */
        .search-bar {
            border-radius: 8px;
            border: 1px solid #dee2e6;
            padding: 0.5rem 1rem;
            box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .search-bar:focus-within {
            border-color: var(--ecoflow-green);
            box-shadow: 0 0 0 0.25rem rgba(8, 192, 104, 0.25);
        }
        .search-bar input {
            border: none;
            outline: none;
            background: transparent;
            width: 100%;
            padding-left: 10px;
        }

        /* ===== MODAIS ===== */
        .modal-content {
            border-radius: 16px;
            border: none;
            box-shadow: 0 16px 40px rgba(0,0,0,0.15);
        }

        /* Container da foto no Modal (Clicável) */
        .foto-preview-container {
            width: 120px;
            height: 120px;
            border-radius: 12px;
            background-color: #f4f5f7;
            border: 2px dashed #dee2e6;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin: 0 auto;
            position: relative;
            cursor: pointer;
            transition: border-color 0.2s ease;
        }
        .foto-preview-container:hover {
            border-color: var(--ecoflow-green);
        }
        .foto-preview-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: none;
        }
        .foto-preview-container i {
            font-size: 3rem;
            color: #adb5bd;
            transition: color 0.2s ease;
        }
        .foto-preview-container:hover i {
            color: var(--ecoflow-green);
        }

        /* ===== LOADING GLOBAL ===== */
        #loadingOverlay {
            position: fixed;
            inset: 0;
            background: rgba(31, 31, 31, 0.6);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .spinner-border { color: var(--ecoflow-green) !important; }

        /* Animação dos modais */
        .modal.fade .modal-dialog { transition: none; }
        .modal.animar .modal-dialog { transform: translateY(30px) scale(0.95); opacity: 0; }
        .modal.animar.show .modal-dialog { animation: modalEntrada 0.3s ease forwards; }
        @keyframes modalEntrada {
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
    </style>
</head>
<body>

<div id="loadingOverlay">
    <div class="loading-content">
        <div class="spinner-border text-light" role="status"></div>
        <div class="mt-3 text-white fw-semibold">Carregando...</div>
    </div>
</div>

<nav class="navbar">
    <div class="container-fluid">
        <span class="navbar-brand d-flex align-items-center gap-2 text-white">
            <img src="/public/logo.png" height="28" alt="Logo">
            Humorômetro
        </span>

        <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm" onclick="abrirModalAvaliacoes()">
                <i class="fa-regular fa-comment-dots"></i> Avaliações
            </button>
            <a href="/" class="btn btn-outline-light btn-sm">Autoavaliação</a>
        </div>
    </div>
</nav>

<div class="container py-4">

    <!-- Topo: Título, Pesquisa e Botão Novo -->
    <div class="row align-items-center mb-4 g-3">
        <div class="col-md-4">
            <h4 class="mb-0 fw-bold" style="color: var(--ecoflow-dark);">Equipe</h4>
        </div>
        <div class="col-md-5">
            <div class="search-bar d-flex align-items-center bg-white">
                <i class="fa-solid fa-magnifying-glass text-muted"></i>
                <input type="text" id="pesquisaNome" placeholder="Pesquisar por nome..." onkeyup="filtrarFuncionarios()">
            </div>
        </div>
        <div class="col-md-3 text-md-end">
            <button class="btn btn-primary w-100" onclick="novoFuncionario()">
                <i class="fa fa-plus me-1"></i> Adicionar
            </button>
        </div>
    </div>

    <!-- Área onde os cards serão renderizados (Grid de 5 colunas via row-cols-xl-5) -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4" id="listaFuncionarios">
        <!-- Cards gerados via JS -->
    </div>

</div>

<!-- Modal Cadastro/Edição -->
<div class="modal fade animar" id="modalFuncionario" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title fw-bold" id="tituloModal">Cadastro de Funcionário</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body p-4">
                <form id="formFuncionario">
                    <input type="hidden" id="funcionarioId">
                    
                    <!-- Área da Foto Clicável -->
                    <div class="text-center mb-4">
                        <div class="foto-preview-container" onclick="document.getElementById('foto').click()" title="Clique para alterar a foto">
                            <img id="imgPreview" src="" alt="Preview">
                            <i id="iconPreview" class="fa fa-camera"></i>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger mt-2" id="btnRemoverFoto" onclick="removerFotoPreview()" style="display: none;">
                            <i class="fa fa-trash me-1"></i>Remover
                        </button>
                        <!-- Input de arquivo oculto -->
                        <input type="file" id="foto" class="d-none" accept="image/*" onchange="atualizarPreviewDaFoto(this)">
                    </div>

                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label small text-muted fw-semibold">Nome Completo</label>
                            <input type="text" id="nome" class="form-control bg-light" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label small text-muted fw-semibold">Nascimento</label>
                            <input type="date" id="data_nascimento" class="form-control bg-light" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label small text-muted fw-semibold">Contrato</label>
                            <input type="date" id="inicio_contrato" class="form-control bg-light" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label small text-muted fw-semibold">Sexo</label>
                            <select id="sexo" class="form-select bg-light" required>
                                <option value="">Selecione</option>
                                <option>Masculino</option>
                                <option>Feminino</option>
                                <option>Outro</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label small text-muted fw-semibold">Setor</label>
                            <select id="setor" class="form-select bg-light" required>
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
                    </div>
                </form>
            </div>

            <div class="modal-footer border-0 pb-4 pe-4">
                <button class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button class="btn btn-primary px-4" onclick="salvarFuncionario()">Salvar</button>
            </div>

        </div>
    </div>
</div>

<!-- Modal Dashboard -->
<div class="modal fade animar" id="modalDashboard" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold" id="tituloDashboard">Dashboard de Avaliações</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <canvas id="graficoAvaliacoes" height="120"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Modal Relatorio -->
<div class="modal fade animar" id="modalRelatorio" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold" id="tituloModalRelatorio">Gerar Relatório de Avaliação</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <input type="hidden" id="relatorioFuncionarioId">
                <input type="hidden" id="relatorioFuncionarioNome">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label small text-muted fw-semibold">Selecione o Ano</label>
                        <select id="selectRelatorioAno" class="form-select bg-light" onchange="atualizarMesesRelatorio()"></select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label small text-muted fw-semibold">Selecione o Mês</label>
                        <select id="selectRelatorioMes" class="form-select bg-light"></select>
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0 pb-4 pe-4">
                <button class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button class="btn btn-primary" onclick="baixarRelatorioCsv()"><i class="fa fa-download me-1"></i> Baixar CSV</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Avaliações -->
<div class="modal fade animar" id="modalAvaliacoes" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Avaliações dos Colaboradores</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div id="listaAvaliacoes" class="d-flex flex-column gap-3"></div>
            </div>
        </div>
    </div>
</div>

<!-- Modais Globais de Feedback -->
<div class="modal fade animar" id="modalSucessoGlobal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center py-4">
            <div class="modal-body">
                <div class="mb-3" style="color: var(--ecoflow-green);">
                    <i class="fa-solid fa-circle-check fa-3x"></i>
                </div>
                <h5 class="fw-bold mb-2" id="tituloSucesso">Operação com sucesso!</h5>
                <p class="text-muted mb-0" id="mensagemSucesso">Concluído.</p>
            </div>
        </div>
    </div>
</div>

<div class="modal fade animar" id="modalConfirmacaoGlobal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Confirmar ação</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body pt-3">
                <p class="mb-0 text-muted" id="mensagemConfirmacao">Deseja realmente continuar?</p>
            </div>
            <div class="modal-footer border-0">
                <button class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button class="btn btn-danger px-4" id="btnConfirmarAcao">Confirmar</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
let modal = new bootstrap.Modal(document.getElementById('modalFuncionario'));
let modalRelatorio = new bootstrap.Modal(document.getElementById('modalRelatorio'));
let opcoesRelatorioCache = [];
let todosFuncionarios = []; 

document.addEventListener('DOMContentLoaded', carregarFuncionarios);

// ===============================
// LISTAR E FILTRAR (CARDS)
// ===============================
function carregarFuncionarios() {
    fetch('/api/funcionarios')
        .then(res => res.json())
        .then(dados => {
            todosFuncionarios = dados; 
            renderizarCards(dados);
        });
}

function filtrarFuncionarios() {
    const termo = document.getElementById('pesquisaNome').value.toLowerCase();
    const filtrados = todosFuncionarios.filter(f => 
        f.nome_completo.toLowerCase().includes(termo)
    );
    renderizarCards(filtrados);
}

function renderizarCards(dados) {
    const container = document.getElementById('listaFuncionarios');
    container.innerHTML = '';

    if (dados.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted py-5">Nenhum funcionário encontrado.</div>';
        return;
    }

    dados.forEach(f => {
        const fotoHtml = f.foto 
            ? \`<img src="\${f.foto}" alt="Foto">\` 
            : \`<i class="fa fa-user"></i>\`;

        // Agora cada card está em uma <div class="col"> para respeitar o row-cols
        container.innerHTML += \`
            <div class="col">
                <div class="card card-ecoflow h-100" onclick='editarFuncionario(\${JSON.stringify(f)})' style="cursor: pointer;">
                    
                    <div class="card-img-container">
                        \${fotoHtml}
                    </div>
                    
                    <div class="card-body text-center d-flex flex-column">
                        <h6 class="card-title fw-bold text-truncate mb-1" title="\${f.nome_completo}">\${f.nome_completo}</h6>
                        <span class="badge bg-light text-dark border rounded-pill align-self-center mb-2 px-3 py-1">\${f.setor}</span>
                        <small class="text-muted mb-3 mt-auto">Início: \${formatarData(f.inicio_contrato)}</small>
                        
                        <div class="d-flex justify-content-center gap-2 mt-2">
                            <button class="btn btn-sm btn-light text-primary border" title="Dashboard" onclick="event.stopPropagation(); abrirDashboard(\${f.id}, '\${f.nome_completo}')">
                                <i class="fa fa-chart-line"></i>
                            </button>
                            <button class="btn btn-sm btn-light text-success border" title="Gerar Relatório" onclick="event.stopPropagation(); abrirModalRelatorio(\${f.id}, '\${f.nome_completo}')">
                                <i class="fa fa-file-excel"></i>
                            </button>
                            <button class="btn btn-sm btn-light text-danger border" title="Excluir" onclick="event.stopPropagation(); excluirFuncionario(\${f.id})">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        \`;
    });
}

// ===============================
// PREVIEW E REMOÇÃO DA FOTO
// ===============================
function atualizarPreviewDaFoto(input) {
    const img = document.getElementById('imgPreview');
    const icon = document.getElementById('iconPreview');
    const btnRemover = document.getElementById('btnRemoverFoto');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            img.style.display = 'block';
            icon.style.display = 'none';
            btnRemover.style.display = 'inline-block';
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        resetarPreviewDaFoto();
    }
}

function removerFotoPreview() {
    document.getElementById('foto').value = ''; 
    resetarPreviewDaFoto();
}

function resetarPreviewDaFoto() {
    document.getElementById('imgPreview').style.display = 'none';
    document.getElementById('imgPreview').src = '';
    document.getElementById('iconPreview').style.display = 'block';
    document.getElementById('btnRemoverFoto').style.display = 'none';
}

function setPreviewDaFoto(src) {
    if (src) {
        document.getElementById('imgPreview').src = src;
        document.getElementById('imgPreview').style.display = 'block';
        document.getElementById('iconPreview').style.display = 'none';
        document.getElementById('btnRemoverFoto').style.display = 'inline-block';
    } else {
        resetarPreviewDaFoto();
    }
}

// ===============================
// NOVO FUNCIONÁRIO
// ===============================
function novoFuncionario() {
    document.getElementById('formFuncionario').reset();
    document.getElementById('funcionarioId').value = '';
    resetarPreviewDaFoto();
    document.getElementById('tituloModal').innerText = 'Novo Funcionário';
    modal.show();
}

// ===============================
// EDITAR FUNCIONÁRIO
// ===============================
function editarFuncionario(f) {
    document.getElementById('formFuncionario').reset(); 
    
    document.getElementById('funcionarioId').value = f.id;
    document.getElementById('nome').value = f.nome_completo;
    document.getElementById('data_nascimento').value = f.data_nascimento.split('T')[0];
    document.getElementById('inicio_contrato').value = f.inicio_contrato.split('T')[0];
    document.getElementById('sexo').value = f.sexo;
    document.getElementById('setor').value = f.setor;

    // Atualiza o preview com a foto existente
    setPreviewDaFoto(f.foto);

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
            mostrarSucesso('Dados salvos!', 'O funcionário foi salvo com sucesso.');
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
                mostrarSucesso('Funcionário excluído!', 'O registro foi removido.');
            });
    });
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// ===============================
// DASHBOARD
// ===============================
let modalDashboard = new bootstrap.Modal(document.getElementById('modalDashboard'));
let chartAvaliacoes = null;

function abrirDashboard(funcionarioId, nome) {
    document.getElementById('tituloDashboard').innerText = 'Avaliações de ' + nome;

    fetch('/api/avaliacoes/mensal/' + funcionarioId)
        .then(res => res.json())
        .then(dados => {
            const labels = dados.map(d => new Date(d.dia).toLocaleDateString('pt-BR'));
            const valores = dados.map(d => d.estrelas);

            const ctx = document.getElementById('graficoAvaliacoes').getContext('2d');

            if (chartAvaliacoes) chartAvaliacoes.destroy();

            chartAvaliacoes = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Estrelas',
                        data: valores,
                        tension: 0.4,
                        borderColor: '#08c068',
                        backgroundColor: 'rgba(8, 192, 104, 0.1)',
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        y: { min: 0, max: 6, ticks: { stepSize: 1 } }
                    }
                }
            });

            modalDashboard.show();
        });
}

// ===============================
// RELATÓRIOS E OUTRAS FUNÇÕES
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
            let csvContent = \`Relatório de Avaliações - \${nome}\\nPeríodo: \${mes}/\${ano}\\n\\nData;Estrelas\\n\`;

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

window.addEventListener('load', () => {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 300);
    }
});

let modalAvaliacoes = new bootstrap.Modal(document.getElementById('modalAvaliacoes'));

function abrirModalAvaliacoes() {
    const modalEl = document.getElementById('modalAvaliacoes');
    const modalAvaliacoes = bootstrap.Modal.getOrCreateInstance(modalEl);
    const container = document.getElementById('listaAvaliacoes');
    container.innerHTML = '<div class="text-center text-muted">Carregando avaliações...</div>';

    fetch('/api/avaliacoes/todas')
        .then(res => res.json())
        .then(avaliacoes => {
            const comSugestao = avaliacoes.filter(a => a.sugestao && a.sugestao.trim() !== '');

            if (comSugestao.length === 0) {
                container.innerHTML = \`<div class="text-center text-muted py-4">Nenhuma avaliação registrada até o momento.</div>\`;
                modalAvaliacoes.show();
                return;
            }

            container.innerHTML = '';
            const agrupadas = {};

            comSugestao.forEach(a => {
                const data = new Date(a.avaliado_em).toLocaleDateString('pt-BR');
                if (!agrupadas[data]) agrupadas[data] = [];
                agrupadas[data].push(a);
            });

            Object.keys(agrupadas).forEach(data => {
                agrupadas[data].forEach(a => {
                    const dataFormatada = new Date(a.avaliado_em).toLocaleDateString('pt-BR');
                    container.innerHTML += \`
                        <div class="card bg-light border-0 mb-2">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <small class="text-muted fw-semibold">\${dataFormatada}</small>
                                    <button class="btn btn-sm btn-outline-danger border-0" title="Excluir" onclick="excluirComentario(\${a.id})">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                                <div class="mb-2" style="color:#ffc107;">\${'⭐'.repeat(a.estrelas)}</div>
                                <p class="fst-italic mb-0 text-dark">"\${a.sugestao}"</p>
                            </div>
                        </div>
                    \`;
                });
            });

            modalAvaliacoes.show();
        })
        .catch(() => {
            container.innerHTML = \`<div class="text-center text-danger py-4">Erro ao carregar avaliações.</div>\`;
            modalAvaliacoes.show();
        });
}

function excluirComentario(id) {
    confirmarAcao('Deseja realmente excluir este comentário?', () => {
        fetch('/api/avaliacoes/comentario/' + id, { method: 'DELETE' })
        .then(() => {
            abrirModalAvaliacoes();
            mostrarSucesso('Comentário excluído!', 'A sugestão foi removida com sucesso.');
        });
    });
}

function mostrarSucesso(titulo, mensagem) {
    const modalEl = document.getElementById('modalSucessoGlobal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    document.getElementById('tituloSucesso').innerText = titulo;
    document.getElementById('mensagemSucesso').innerText = mensagem;
    modalInstance.show();
    setTimeout(() => { modalInstance.hide(); }, 2000);
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
</body>
</html>
`;
}

module.exports = adminView;