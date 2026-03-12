function avaliacaoView() {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Humorômetro - Autoavaliação</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

    <link rel="stylesheet" href="/public/css/avaliacao.css">

    <style>
        /* BASE & TIPOGRAFIA */
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f4f7f6;
            color: #333;
        }

        /* NAVBAR GAMIFICADA */
        .navbar-custom {
            background: linear-gradient(135deg, #0D5749 0%, #178a75 100%);
            box-shadow: 0 4px 15px rgba(13, 87, 73, 0.2);
        }
        
        /* CARDS DOS FUNCIONÁRIOS */
        .card-funcionario {
            border: none;
            border-radius: 20px;
            background: #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.04);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            cursor: pointer;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .card-funcionario:hover:not(.desabilitado) {
            transform: translateY(-8px);
            box-shadow: 0 15px 25px rgba(13, 87, 73, 0.15);
            border-bottom: 4px solid #178a75;
        }

        .card-funcionario.desabilitado {
            cursor: default;
            background-color: #fafafa;
            opacity: 0.85;
            filter: grayscale(80%);
            transition: all 0.5s ease;
        }

        /* DESTAQUE DO ANIVERSARIANTE (BRILHO PULSANTE) */
        .card-aniversariante {
            border: 2px solid transparent;
            animation: pulseGlow 2s infinite alternate;
        }

        @keyframes pulseGlow {
            0% {
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
                border-color: rgba(255, 215, 0, 0.3);
            }
            100% {
                box-shadow: 0 0 25px rgba(255, 215, 0, 0.9), 0 0 15px rgba(255, 107, 107, 0.6);
                border-color: rgba(255, 215, 0, 1);
            }
        }

        /* Garante que o brilho do aniversário não fique totalmente cinza se ele já se avaliou */
        .card-funcionario.desabilitado.card-aniversariante {
            filter: grayscale(20%);
            opacity: 0.95;
        }

        /* AVATARES - 70% DO CARD */
        .avatar-wrapper {
            position: relative;
            width: 100%;
            height: 70%;
            overflow: hidden;
            border-radius: 20px 20px 0 0;
        }
        
        .avatar-img {
            object-fit: cover;
            border-bottom: 4px solid #e9ecef;
            transition: all 0.3s ease;
            width: 100%;
            height: 100%;
        }

        .card-funcionario:hover:not(.desabilitado) .avatar-img {
            border-color: #178a75;
            transform: scale(1.05);
        }

        /* BADGES (Conquistas) */
        .badge-concluida {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background-color: #28a745;
            color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-size: 0.9rem;
            z-index: 10;
        }

        /* CORPO DO CARD - 30% */
        .card-body.text-center {
            height: 30%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1.5rem;
        }

        /* ESTRELAS GAMIFICADAS */
        .estrela {
            font-size: 2.8rem;
            color: #e4e5e9;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .estrela:hover, .estrela.ativa {
            color: #FFD700;
            transform: scale(1.25);
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
        }

        /* MODALS ARREDONDADOS */
        .modal-content {
            border-radius: 24px;
            border: none;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .modal-header {
            border-bottom: none;
            padding-bottom: 0;
        }

        /* BOTÕES */
        .btn-custom-primary {
            background: linear-gradient(135deg, #0D5749 0%, #178a75 100%);
            border: none;
            color: white;
            border-radius: 50px;
            padding: 10px 25px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-custom-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(23, 138, 117, 0.3);
            color: white;
        }

        /* ANIMAÇÕES GERAIS */
        .sucesso-icon i {
            font-size: 5rem;
            color: #28a745;
            animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }

        .bolo-animado {
            font-size: 5rem;
            color: #ff6b6b;
            animation: floatBolo 1.5s ease-in-out infinite alternate;
        }

        @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
        }

        @keyframes floatBolo {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(-10px) scale(1.05); }
        }

        /* LOADING GLOBAL */
        #loadingOverlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(13, 87, 73, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s ease;
        }

        /* EXPLOSÃO DE ESTRELAS/CONFETES */
        #explosaoGlobal, #explosaoBolo {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 1055;
        }
        .estrela-explosao {
            position: absolute;
            color: #FFD700;
            font-size: 1.5rem;
            animation: explode 1s ease-out forwards;
        }
        @keyframes explode {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
            100% { transform: translate(var(--x), var(--y)) scale(1.5) rotate(360deg); opacity: 0; }
        }
    </style>
</head>
<body>

<div id="loadingOverlay">
    <div class="loading-content text-center">
        <div class="spinner-border text-light" style="width: 3rem; height: 3rem;" role="status"></div>
        <div class="mt-3 text-white fw-bold fs-5">
            Preparando o Humorômetro...
        </div>
    </div>
</div>

<audio id="somEstrela" preload="auto">
    <source src="/public/audio/star.mp3" type="audio/mpeg">
</audio>

<nav class="navbar navbar-custom py-3">
    <div class="container-fluid px-4">
        <span class="navbar-brand d-flex align-items-center gap-3 text-white fw-bold mb-0">
            <img src="/public/logo.png" alt="Humorometro" height="35" class="shadow-sm bg-white p-1">
            Humorômetro
        </span>
        <a href="/login" class="btn btn-outline-light rounded-pill px-4 fw-semibold">Área do Gestor</a>
    </div>
</nav>

<div class="container py-5">

    <div class="row align-items-center mb-5">
        <div class="col-md-8 text-center text-md-start mb-3 mb-md-0">
            <h2 class="fw-bold" style="color: #0D5749;">Como você está se sentindo hoje?</h2>
            <p class="text-muted fs-5 mb-0">
                Selecione seu perfil abaixo e conte para a gente. Leva menos de 1 minuto! ✨
            </p>
        </div>
        <div class="col-md-4 text-center text-md-end">
            <button class="btn btn-light rounded-pill shadow-sm text-primary fw-semibold px-4 py-2"
                data-bs-toggle="modal"
                data-bs-target="#modalRegras"
                style="color: #178a75 !important;">
                <i class="fa-solid fa-circle-question me-2"></i> Como funciona?
            </button>
        </div>
    </div>

    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="gridFuncionarios">
        </div>

</div>

<div class="modal fade animar" id="modalAniversario" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-4" style="background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%); border: 3px solid #FFD700;">
            <div class="modal-body position-relative">
                <div class="mb-4">
                    <i class="fa-solid fa-cake-candles bolo-animado"></i>
                </div>
                <h3 class="fw-bold mb-3" style="color: #ff4757;" id="tituloAniversario">Dia de Festa! 🎉</h3>
                <div id="textoAniversario" class="fs-5 text-muted mb-4">
                    </div>
                
                <button class="btn btn-warning rounded-pill px-5 py-2 fw-bold text-dark shadow-sm" onclick="continuarParaAvaliacao()">
                    Vamos para a Avaliação <i class="fa-solid fa-arrow-right ms-2"></i>
                </button>
            </div>
            <div id="explosaoBolo"></div>
        </div>
    </div>
</div>

<div class="modal fade animar" id="modalAvaliacao" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">

            <div class="modal-header">
                <h4 class="modal-title fw-bold" style="color: #0D5749;">Sua avaliação</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body text-center">
                <p class="fs-5 fw-semibold mb-4" id="nomeFuncionario"></p>

                <div class="d-flex justify-content-center gap-1 mb-3">
                    ${[1, 2, 3, 4, 5, 6].map(n => `
                        <i class="fa-solid fa-star estrela" data-valor="${n}"></i>
                    `).join('')}
                </div>

                <div class="badge bg-light text-dark mb-4 py-2 px-3 border rounded-pill">
                    Clique nas estrelas para avaliar ⭐
                </div>

                <div class="text-start bg-light p-3 rounded-4 border">
                    <label class="form-label fw-semibold" style="color: #0D5749;">
                        Caixa de Sugestões <span class="text-muted fw-normal">(opcional)</span>
                    </label>
                    <textarea id="campoSugestao" class="form-control border-0 shadow-sm rounded-3" rows="3" placeholder="Se quiser, deixe aqui uma sugestão ou comentário para melhoria do ambiente, processos ou apoio no dia a dia;"></textarea>
                </div>

            </div>

            <div class="modal-footer border-top-0 justify-content-center gap-2">
                <button class="btn btn-light rounded-pill px-4 fw-semibold" data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button class="btn btn-custom-primary rounded-pill px-5" onclick="enviarAutoAvaliacao()">
                    <i class="fa-solid fa-paper-plane me-2"></i> Enviar
                </button>
            </div>

        </div>
    </div>
</div>

<div class="modal fade animar" id="modalSucesso" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center position-relative overflow-hidden p-4">

            <div class="modal-body py-5">
                <div class="sucesso-icon mb-4">
                    <i class="fa-solid fa-circle-check"></i>
                </div>

                <h3 class="fw-bold text-success mb-2">
                    Avaliação Enviada!
                </h3>
                <p class="text-muted">Obrigado por compartilhar como você se sente hoje.</p>
            </div>

            <div id="explosaoGlobal"></div>

        </div>
    </div>
</div>

<div class="modal fade animar" id="modalRegras" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content p-2">

            <div class="modal-header">
                <h5 class="modal-title fw-bold" style="color: #0D5749;">
                    <i class="fa-solid fa-book-open me-2"></i> Guia do Humorômetro
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <div id="carouselRegras" class="carousel slide" data-bs-ride="carousel">
                    
                    <div class="carousel-indicators" style="bottom: -40px;">
                        <button type="button" data-bs-target="#carouselRegras" data-bs-slide-to="0" class="active bg-secondary"></button>
                        <button type="button" data-bs-target="#carouselRegras" data-bs-slide-to="1" class="bg-secondary"></button>
                        <button type="button" data-bs-target="#carouselRegras" data-bs-slide-to="2" class="bg-secondary"></button>
                    </div>

                    <div class="carousel-inner px-5 py-3 text-center">
                        <div class="carousel-item active">
                            <i class="fa-solid fa-bullseye text-primary mb-3" style="font-size: 3rem;"></i>
                            <h4 class="fw-bold mb-3">Objetivo da Avaliação</h4>
                            <p class="fs-5 text-muted">A autoavaliação tem como objetivo entender como você está se sentindo no seu dia a dia de trabalho. Sua percepção nos ajuda a construir uma empresa mais humana e apoiar sua saúde mental e física.</p>
                        </div>

                        <div class="carousel-item">
                            <i class="fa-solid fa-list-check text-warning mb-3" style="font-size: 3rem;"></i>
                            <h4 class="fw-bold mb-3">O que considerar?</h4>
                            <ul class="list-unstyled fs-5 text-muted d-inline-block text-start">
                                <li><i class="fa-solid fa-check text-success me-2"></i>Estado emocional geral</li>
                                <li><i class="fa-solid fa-check text-success me-2"></i>Nível de motivação e estresse</li>
                                <li><i class="fa-solid fa-check text-success me-2"></i>Qualidade do sono e energia</li>
                                <li><i class="fa-solid fa-check text-success me-2"></i>Foco e concentração</li>
                            </ul>
                        </div>

                        <div class="carousel-item">
                            <i class="fa-regular fa-face-smile-wink text-info mb-3" style="font-size: 3rem;"></i>
                            <h4 class="fw-bold mb-3">Seja Sincero(a)!</h4>
                            <p class="fs-5 text-muted">Considere todos os critérios de forma geral e escolha o número de estrelas que melhor representa como você está se sentindo hoje.</p>
                            <p class="fw-semibold text-dark">Não existe resposta certa ou errada.</p>
                        </div>
                    </div>

                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselRegras" data-bs-slide="prev">
                        <i class="fa-solid fa-chevron-left text-dark fs-3"></i>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselRegras" data-bs-slide="next">
                        <i class="fa-solid fa-chevron-right text-dark fs-3"></i>
                    </button>
                </div>
            </div>

            <div class="modal-footer justify-content-center mt-4 border-top-0">
                <button class="btn btn-custom-primary px-5" data-bs-dismiss="modal">Entendi, vamos lá!</button>
            </div>

        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
let funcionarioSelecionado = null;
let estrelasSelecionadas = 0;
let modal = new bootstrap.Modal(document.getElementById('modalAvaliacao'));
let modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'));
let modalAniversario = new bootstrap.Modal(document.getElementById('modalAniversario'));

let aniversariantesDeHoje = []; 

document.addEventListener('DOMContentLoaded', carregarFuncionarios);

// ===============================
// LISTAR FUNCIONÁRIOS E VERIFICAR ANIVERSÁRIOS
// ===============================
function carregarFuncionarios() {
    Promise.all([
        fetch('/api/funcionarios').then(r => r.json()),
        fetch('/api/avaliacoes/hoje').then(r => r.json())
    ]).then(([funcionarios, avaliadosHoje]) => {
        const grid = document.getElementById('gridFuncionarios');
        grid.innerHTML = '';
        
        // --- LÓGICA DE ANIVERSÁRIO ---
        const hoje = new Date();
        const diaHoje = hoje.getDate();
        const mesHoje = hoje.getMonth() + 1;

        aniversariantesDeHoje = funcionarios.filter(f => {
            if (!f.data_nascimento) return false;
            const data = new Date(f.data_nascimento);
            // Compara dia e mês ignorando o ano e o fuso horário
            return data.getUTCDate() === diaHoje && (data.getUTCMonth() + 1) === mesHoje;
        });
        // -----------------------------

        funcionarios.forEach(f => {
            const jaAvaliou = avaliadosHoje.includes(f.id);
            const ehAniversariante = aniversariantesDeHoje.some(a => a.id === f.id);
            
            // Adiciona a classe de brilho e o ícone se for o aniversariante
            const classeBolo = ehAniversariante ? 'card-aniversariante' : '';
            const iconeBolo = ehAniversariante ? '<i class="fa-solid fa-cake-candles text-warning ms-1" title="Aniversariante do dia!"></i>' : '';
            
            grid.innerHTML += \`
            <div class="col" style="height: 350px;">
                <div id="card-\${f.id}"
                    class="card card-funcionario h-100 \${jaAvaliou ? 'desabilitado' : ''} \${classeBolo}"
                    \${jaAvaliou ? '' : \`onclick="iniciarFluxoAvaliacao(\${f.id}, '\${f.nome_completo}')"\`}>

                    <div class="text-center h-100">
                        <div class="avatar-wrapper h-100">
                            <img src="\${f.foto || 'https://via.placeholder.com/300x400'}" class="avatar-img">
                            \${jaAvaliou ? '<div class="badge-concluida"><i class="fa-solid fa-check"></i></div>' : ''}
                        </div>
                    </div>

                    <div class="card-body text-center">
                        <h5 class="card-title fw-bold mb-1 text-truncate" style="color: #0D5749;" title="\${f.nome_completo}">
                            \${f.nome_completo} \${iconeBolo}
                        </h5>
                        <span class="badge bg-light text-secondary border border-secondary-subtle rounded-pill px-3 py-1 mt-2 text-truncate" style="max-width: 100%;">
                            <i class="fa-solid fa-briefcase me-1"></i> \${f.setor}
                        </span>
                    </div>
                </div>
            </div>
            \`;
        });
    });
}

// ===============================
// FLUXO DE AVALIAÇÃO (Aniversário -> Estrelas)
// ===============================
function iniciarFluxoAvaliacao(id, nome) {
    funcionarioSelecionado = id;
    estrelasSelecionadas = 0;
    document.getElementById('nomeFuncionario').innerText = nome;
    atualizarEstrelas(0);
    document.getElementById('campoSugestao').value = '';

    if (aniversariantesDeHoje.length > 0) {
        
        const euSouAniversariante = aniversariantesDeHoje.some(a => a.id === id);
        const textoContainer = document.getElementById('textoAniversario');
        const tituloContainer = document.getElementById('tituloAniversario');

        if (euSouAniversariante) {
            tituloContainer.innerText = 'Feliz Aniversário! 🎂';
            textoContainer.innerHTML = \`<p>Parabéns, <strong>\${nome}</strong>!</p>
                                        <p>Desejamos um dia incrível, repleto de conquistas e alegrias. Aproveite muito o seu dia!</p>\`;
        } else {
            tituloContainer.innerText = 'Temos festa hoje! 🎉';
            const nomesAniversariantes = aniversariantesDeHoje.map(a => \`<strong>\${a.nome_completo}</strong>\`).join(', ');
            textoContainer.innerHTML = \`<p>Hoje é aniversário de \${nomesAniversariantes}!</p>
                                        <p>Não deixe de enviar uma mensagem de parabéns e deixar o dia mais especial!</p>\`;
        }

        modalAniversario.show();
        setTimeout(() => explodirEstrelas('explosaoBolo'), 300); 
    } else {
        modal.show();
    }
}

function continuarParaAvaliacao() {
    modalAniversario.hide();
    setTimeout(() => { modal.show(); }, 400);
}

// ===============================
// ESTRELAS GAMIFICADAS
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
// ENVIAR AVALIAÇÃO
// ===============================
function enviarAutoAvaliacao() {
    if (!estrelasSelecionadas) {
        alert('Selecione uma quantidade de estrelas.');
        return;
    }

    const sugestao = document.getElementById('campoSugestao').value.trim();
    document.getElementById('loadingOverlay').style.opacity = '1';
    document.getElementById('loadingOverlay').style.display = 'flex';

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
        document.getElementById('loadingOverlay').style.opacity = '0';
        setTimeout(() => { document.getElementById('loadingOverlay').style.display = 'none'; }, 300);

        if (!res.ok) throw new Error();

        modal.hide();
        bloquearCard(funcionarioSelecionado);

        modalSucesso.show();
        setTimeout(() => {
            tocarSomEstrela();
            explodirEstrelas('explosaoGlobal');
        }, 200);

        setTimeout(() => { modalSucesso.hide(); }, 2800);
    })
    .catch(() => {
        document.getElementById('loadingOverlay').style.opacity = '0';
        setTimeout(() => { document.getElementById('loadingOverlay').style.display = 'none'; }, 300);
        alert('Você já realizou sua autoavaliação hoje.');
        modal.hide();
    });
}

// ===============================
// EFEITOS VISUAIS E AUDITIVOS
// ===============================
function bloquearCard(id) {
    const card = document.getElementById('card-' + id);
    if (!card) return;
    card.classList.add('desabilitado');
    card.removeAttribute('onclick');
    const wrapper = card.querySelector('.avatar-wrapper');
    if (!wrapper.querySelector('.badge-concluida')) {
        const badge = document.createElement('div');
        badge.className = 'badge-concluida';
        badge.innerHTML = '<i class="fa-solid fa-check"></i>';
        wrapper.appendChild(badge);
    }
}

window.addEventListener('load', () => {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.style.display = 'none', 300);
    }
});

function explodirEstrelas(containerId = 'explosaoGlobal') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const largura = window.innerWidth;
    const altura = window.innerHeight;

    for (let i = 0; i < 90; i++) {
        const estrela = document.createElement('i');
        estrela.className = containerId === 'explosaoBolo' ? 'fa-solid fa-circle estrela-explosao' : 'fa-solid fa-star estrela-explosao';
        
        if (containerId === 'explosaoBolo') {
            const cores = ['#ff6b6b', '#48dbfb', '#1dd1a1', '#feca57', '#ff9ff3'];
            estrela.style.color = cores[Math.floor(Math.random() * cores.length)];
            estrela.style.fontSize = '1rem';
        }

        estrela.style.left = '50%';
        estrela.style.top = '50%';
        estrela.style.transform = 'translate(-50%, -50%)';

        const x = (Math.random() - 0.5) * largura * 1.5;
        const y = (Math.random() - 0.5) * altura * 1.5;

        estrela.style.setProperty('--x', \`\${x}px\`);
        estrela.style.setProperty('--y', \`\${y}px\`);

        container.appendChild(estrela);
        setTimeout(() => estrela.remove(), 1000);
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