function avaliacaoView() {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Autoavaliação</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

    <link rel="stylesheet" href="/public/css/avaliacao.css">
</head>
<body>

<!-- LOADING GLOBAL -->
<div id="loadingOverlay">
    <div class="loading-content">
        <div class="spinner-border text-light" role="status"></div>
        <div class="mt-3 text-white fw-semibold">
            Carregando...
        </div>
    </div>
</div>

<audio id="somEstrela" preload="auto">
    <source src="/public/audio/star.mp3" type="audio/mpeg">
</audio>

<nav class="navbar" style="background-color:#0D5749;">
    <div class="container-fluid">
        <span class="navbar-brand d-flex align-items-center gap-2 text-white">
            <img src="/public/logo.png" alt="Humorometro" height="28">
            Humorometro
        </span>
        <a href="/login" class="btn btn-outline-light btn-sm">Admin</a>
    </div>
</nav>

<div class="container py-4">

    <div class="text-center mb-4">
        <h4 class="fw-bold">Autoavaliação de Desempenho</h4>
        <p class="text-muted mb-0">
            Selecione seu perfil abaixo e realize sua autoavaliação
        </p>
    </div>

    <div class="d-flex justify-content-end justify-content-sm-end mb-3">
        <button class="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#modalRegras">
            <i class="fa-solid fa-comment-dots"></i>
        </button>
    </div>


    <!-- GRID -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
         id="gridFuncionarios"></div>

</div>

<!-- MODAL -->
<div class="modal fade animar" id="modalAvaliacao" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Minha Autoavaliação</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body text-center">
                <p class="fw-semibold mb-2" id="nomeFuncionario"></p>

                <div class="d-flex justify-content-center gap-2 mb-2">
                    ${[1, 2, 3, 4, 5, 6].map(n => `
                        <i class="fa-solid fa-star estrela" data-valor="${n}"></i>
                    `).join('')}
                </div>

                <small class="text-muted">
                    Preencha seguindo os critérios 😉
                </small>

                <div class="mt-3 text-start">
                    <label class="form-label fw-semibold">
                        Sugestões de melhoria <span class="text-muted">(opcional)</span>
                    </label>
                    <textarea id="campoSugestao" class="form-control" rows="3" placeholder="Se quiser, deixe aqui uma sugestão ou comentário para melhoria do ambiente, processos ou apoio no dia a dia;"></textarea>
                </div>

            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button class="btn btn-primary" onclick="enviarAutoAvaliacao()">
                    Enviar Autoavaliação
                </button>
            </div>

        </div>
    </div>
</div>

<!-- MODAL SUCESSO -->
<div class="modal fade animar" id="modalSucesso" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center position-relative overflow-hidden">

            <div class="modal-body py-5">
                <div class="sucesso-icon mb-3">
                    <i class="fa-solid fa-circle-check"></i>
                </div>

                <h4 class="fw-bold text-success mb-2">
                    Avaliação Enviada!
                </h4>
                
            </div>

            <!-- Container da explosão -->
            <div id="explosaoGlobal"></div>

        </div>
    </div>
</div>

<!-- Bootstrap -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
let funcionarioSelecionado = null;
let estrelasSelecionadas = 0;
let modal = new bootstrap.Modal(document.getElementById('modalAvaliacao'));

let modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'));

document.addEventListener('DOMContentLoaded', carregarFuncionarios);

// ===============================
// LISTAR FUNCIONÁRIOS
// ===============================
function carregarFuncionarios() {
    Promise.all([
        fetch('/api/funcionarios').then(r => r.json()),
        fetch('/api/avaliacoes/hoje').then(r => r.json())
    ]).then(([funcionarios, avaliadosHoje]) => {
        const grid = document.getElementById('gridFuncionarios');
        grid.innerHTML = '';

        funcionarios.forEach(f => {
            const jaAvaliou = avaliadosHoje.includes(f.id);
            
            grid.innerHTML += \`
        
            <div id="card-\${f.id}"
                class="card card-funcionario h-100 \${jaAvaliou ? 'desabilitado' : ''}"
                \${jaAvaliou ? '' : \`onclick="abrirAutoAvaliacao(\${f.id}, '\${f.nome_completo}')"\`}>

                <div class="position-relative">
                    \${jaAvaliou ? \`
                                <span class="badge bg-secondary badge-avaliado">
                                    Avaliado hoje
                                </span>
                            \` : ''}
                    <img src="\${f.foto || 'https://via.placeholder.com/300x200'}"
                        class="card-img-top">
                </div>

                <div class="card-body text-center">
                    <h6 class="card-title mb-1">\${f.nome_completo}</h6>
                    <small class="text-muted">\${f.setor}</small>
                </div>
            </div>
                </div >
        \`;
        });
    });
}

// ===============================
// MODAL
// ===============================
function abrirAutoAvaliacao(id, nome) {
    funcionarioSelecionado = id;
    estrelasSelecionadas = 0;

    document.getElementById('nomeFuncionario').innerText = nome;
    atualizarEstrelas(0);

    modal.show();
}

// ===============================
// ESTRELAS
// ===============================
document.querySelectorAll('.estrela').forEach(e => {
    e.addEventListener('click', () => {
        estrelasSelecionadas = e.dataset.valor;
        atualizarEstrelas(estrelasSelecionadas);
    });
});

function atualizarEstrelas(qtd) {
    document.querySelectorAll('.estrela').forEach(e => {
        e.classList.toggle('ativa', e.dataset.valor <= qtd);
    });
}

// ===============================
// ENVIAR AUTOAVALIAÇÃO
// ===============================
function enviarAutoAvaliacao() {
    if (!estrelasSelecionadas) {
        alert('Selecione uma quantidade de estrelas.');
        return;
    }

    const sugestao = document.getElementById('campoSugestao').value.trim();

    fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            funcionario_id: funcionarioSelecionado,
            estrelas: estrelasSelecionadas,
            sugestao: sugestao || null
        })
    })
    .then(res => {
    if (!res.ok) throw new Error();

    modal.hide();

    document.getElementById('campoSugestao').value = '';

    bloquearCard(funcionarioSelecionado);

    // Mostra modal sucesso
    modalSucesso.show();

setTimeout(() => {
    tocarSomEstrela();   // 🔊 toca o som
    explodirEstrelas();  // 🌟 explosão
}, 200);

    // Fecha automático depois de 2.5s
    setTimeout(() => {
        modalSucesso.hide();
    }, 2500);
})
    .catch(() => {
        alert('Você já realizou sua autoavaliação hoje.');
        modal.hide();
    });
}

// ===============================
// BLOQUEAR CARD APÓS AVALIAÇÃO
// ===============================
function bloquearCard(id) {
    const card = document.getElementById('card-' + id);
    if (!card) return;

    card.classList.add('desabilitado');
    card.removeAttribute('onclick');

    const badge = document.createElement('span');
    badge.className = 'badge bg-secondary badge-avaliado';
    badge.innerText = 'Avaliado hoje';

    card.querySelector('.position-relative').appendChild(badge);
}
</script>

<!-- MODAL REGRAS DA AUTOAVALIAÇÃO -->
<div class="modal fade animar" id="modalRegras" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    Regras da Autoavaliação
                </h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">

                <div id="carouselRegras" class="carousel slide" data-bs-ride="carousel">

                    <!-- INDICADORES -->
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselRegras" data-bs-slide-to="0"
                            class="active"></button>
                        <button type="button" data-bs-target="#carouselRegras" data-bs-slide-to="1"></button>
                        <button type="button" data-bs-target="#carouselRegras" data-bs-slide-to="2"></button>
                    </div>

                    <div class="carousel-inner">

                        <!-- SLIDE 1 -->
                        <div class="carousel-item active">
                            <h5 class="mb-3">🎯 Objetivo da Avaliação</h5>
                            <p>
                                A autoavaliação tem como objetivo entender como você
                                está se sentindo no seu dia a dia de trabalho.
                            </p>
                            <p>
                                Sua percepção nos ajuda a melhorar o ambiente,
                                apoiar sua saúde mental e física, e construir
                                uma empresa mais humana e produtiva.
                            </p>
                        </div>

                        <!-- SLIDE 2 -->
                        <div class="carousel-item">
                            <h5 class="mb-3">📝 Critérios considerados</h5>
                            <ul>
                                <li>Estado emocional geral</li>
                                <li>Nível de motivação</li>
                                <li>Qualidade do sono</li>
                                <li>Saúde física e energia</li>
                                <li>Nível de estresse</li>
                                <li>Foco e concentração</li>
                            </ul>
                        </div>

                        <!-- SLIDE 3 -->
                        <div class="carousel-item">
                            <h5 class="mb-3">⭐ Como realizar a avaliação</h5>
                            <p>
                                Considere todos os critérios de forma geral e
                                escolha o número de estrelas que melhor representa
                                como você está se sentindo hoje.
                            </p>
                            <p class="fw-semibold">
                                Não existe resposta certa ou errada.
                                Seja sincero(a).
                            </p>
                        </div>

                    </div>

                    <!-- BOTÃO VOLTAR -->
                    <button class="carousel-control-prev" type="button"
                        data-bs-target="#carouselRegras" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon"></span>
                    </button>

                    <!-- BOTÃO AVANÇAR -->
                    <button class="carousel-control-next" type="button"
                        data-bs-target="#carouselRegras" data-bs-slide="next">
                        <span class="carousel-control-next-icon"></span>
                    </button>

                </div>

            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" data-bs-dismiss="modal">
                    Entendi
                </button>
            </div>

        </div>
    </div>
</div>

<script>
    // Esconde o loading quando a página terminar de carregar
    window.addEventListener('load', () => {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 300);
        }
    });

    // Funções globais (opcional)
    function showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    function hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    function explodirEstrelas() {
    const container = document.getElementById('explosaoGlobal');
    container.innerHTML = '';

    const largura = window.innerWidth;
    const altura = window.innerHeight;

    for (let i = 0; i < 90; i++) {
        const estrela = document.createElement('i');
        estrela.className = 'fa-solid fa-star estrela-explosao';

        // Nasce exatamente no centro
        estrela.style.left = '50%';
        estrela.style.top = '50%';
        estrela.style.transform = 'translate(-50%, -50%)';

        // Direção aleatória pela tela inteira
        const x = (Math.random() - 0.5) * largura;
        const y = (Math.random() - 0.5) * altura;

        estrela.style.setProperty('--x', \`\${x}px\`);
        estrela.style.setProperty('--y', \`\${y}px\`);

        container.appendChild(estrela);

        setTimeout(() => estrela.remove(), 1200);
    }
}

function tocarSomEstrela() {
    const audio = document.getElementById('somEstrela');
    if (!audio) return;

    audio.currentTime = 0;
    audio.volume = 0.6;
    audio.play().catch(() => {});
}

</script>
</body>
</html>
`;
}

module.exports = avaliacaoView;