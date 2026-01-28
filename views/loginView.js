function loginView() {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login - Administração</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
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
    </style>
</head>
<body style="background:#f4f6f8;">

<!-- LOADING GLOBAL -->
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
            Humorometro
        </span>
        <a href="/" class="btn btn-outline-light btn-sm">Autoavaliação</a>
    </div>
</nav>

<div class="container d-flex justify-content-center align-items-center" style="min-height:80vh;">
    <div class="card shadow" style="max-width:400px;width:100%;">
        <div class="card-body p-4">

            <h5 class="text-center mb-3">Área Administrativa</h5>

            <form method="POST" action="/login">

                <div class="mb-3">
                    <label class="form-label">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        class="form-control"
                        required
                        autocomplete="username">
                </div>

                <div class="mb-3">
                    <label class="form-label">Senha</label>
                    <input
                        type="password"
                        name="senha"
                        class="form-control"
                        required
                        autocomplete="current-password">
                </div>

                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" name="lembrar" id="lembrar">
                    <label class="form-check-label" for="lembrar">
                        Permanecer conectado
                    </label>
                </div>

                <button type="submit" class="btn btn-success w-100">
                    Entrar
                </button>

            </form>

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
</script>


</body>
</html>
`;
}

module.exports = loginView;
