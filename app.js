const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');

const db = require('./db');

const app = express();

// ===============================
// CONFIGURAÇÕES GERAIS
// ===============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'autoavaliacao_secret',
    resave: false,
    saveUninitialized: true
}));

// Arquivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));

// ===============================
// CONFIGURAÇÃO DO UPLOAD (MULTER)
// ===============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads/funcionarios'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

// ===============================
// MIDDLEWARE DE AUTENTICAÇÃO
// ===============================
function verificarLogin(req, res, next) {
    if (req.session.usuario) {
        return next();
    }
    res.redirect('/login');
}

// ===============================
// IMPORTAÇÃO DAS VIEWS
// ===============================
const loginView = require('./views/loginView');
const avaliacaoView = require('./views/avaliacaoView');
const adminView = require('./views/adminView');

// ===============================
// ROTAS DE VIEWS
// ===============================

// VIEW PRINCIPAL → AUTOAVALIAÇÃO (LIVRE)
app.get('/', (req, res) => {
    res.send(avaliacaoView());
});

// LOGIN (ADMIN)
app.get('/login', (req, res) => {
    res.send(loginView());
});

// ADMIN (PROTEGIDO)
app.get('/admin', verificarLogin, (req, res) => {
    res.send(adminView());
});

// LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ===============================
// LOGIN (POST)
// ===============================
app.post('/login', (req, res) => {
    console.log('BODY:', req.body);
    const { email, senha, lembrar } = req.body;

    db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        async (err, results) => {

            if (err) {
                console.error('Erro no MySQL:', err);
                return res.redirect('/login');
            }

            if (!results || results.length === 0) {
                console.log('Usuário não encontrado');
                return res.redirect('/login');
            }

            const usuario = results[0];

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            console.log('Senha válida:', senhaValida);

            if (!senhaValida) {
                return res.redirect('/login');
            }

            req.session.usuario = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            };

            // 🔥 garante que a sessão será salva antes do redirect
            req.session.save(() => {
                res.redirect('/admin');
            });
        }
    );
});

// ===============================
// ROTAS API — FUNCIONÁRIOS (CRUD) [PROTEGIDAS]
// ===============================

// LISTAR FUNCIONÁRIOS
app.get('/api/funcionarios', (req, res) => {
    db.query(
        'SELECT * FROM funcionarios WHERE ativo = 1 ORDER BY nome_completo',
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ erro: 'Erro ao buscar funcionários' });
            }
            res.json(results);
        }
    );
});

// CADASTRAR FUNCIONÁRIO
app.post('/api/funcionarios', upload.single('foto'), (req, res) => {
    const {
        nome_completo,
        data_nascimento,
        inicio_contrato,
        sexo,
        setor
    } = req.body;

    // Tratamento para evitar erro de string vazia em campos de data
    const dataNasc = data_nascimento === '' ? null : data_nascimento;
    const inicioContrato = inicio_contrato === '' ? null : inicio_contrato;

    const foto = req.file
        ? '/public/uploads/funcionarios/' + req.file.filename
        : null;

    db.query(
        `INSERT INTO funcionarios
        (nome_completo, data_nascimento, inicio_contrato, sexo, setor, foto)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            nome_completo,
            dataNasc, // Usando a variável tratada
            inicioContrato, // Usando a variável tratada
            sexo,
            setor,
            foto
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ erro: 'Erro ao cadastrar funcionário' });
            }
            res.json({ sucesso: true });
        }
    );
});

// EDITAR FUNCIONÁRIO
// EDITAR FUNCIONÁRIO
app.put('/api/funcionarios/:id', upload.single('foto'), (req, res) => {
    const { id } = req.params;
    const {
        nome_completo,
        data_nascimento,
        inicio_contrato,
        sexo,
        setor
    } = req.body;

    // Tratamento para evitar erro ER_TRUNCATED_WRONG_VALUE
    const dataNasc = data_nascimento === '' ? null : data_nascimento;
    const inicioContrato = inicio_contrato === '' ? null : inicio_contrato;

    let sql = `
        UPDATE funcionarios SET
            nome_completo = ?,
            data_nascimento = ?,
            inicio_contrato = ?,
            sexo = ?,
            setor = ?
    `;

    const params = [
        nome_completo,
        dataNasc,       // Valor tratado
        inicioContrato, // Valor tratado
        sexo,
        setor
    ];

    if (req.file) {
        sql += ', foto = ?';
        params.push('/public/uploads/funcionarios/' + req.file.filename);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    db.query(sql, params, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: 'Erro ao atualizar funcionário' });
        }
        res.json({ sucesso: true });
    });
});

// EXCLUIR FUNCIONÁRIO
app.delete('/api/funcionarios/:id', (req, res) => {
    db.query(
        'UPDATE funcionarios SET ativo = 0 WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ erro: 'Erro ao excluir funcionário' });
            }
            res.json({ sucesso: true });
        }
    );
});

// ===============================
// ROTAS API — AVALIAÇÕES (LIVRES)
// ===============================
app.post('/api/avaliacoes', (req, res) => {
    const { funcionario_id, estrelas, sugestao } = req.body;

    if (!funcionario_id || !estrelas) {
        return res.status(400).json({ erro: 'Dados incompletos' });
    }

    if (estrelas < 1 || estrelas > 6) {
        return res.status(400).json({ erro: 'Avaliação inválida' });
    }

    db.query(
        `SELECT id FROM avaliacoes
         WHERE funcionario_id = ?
         AND DATE(avaliado_em) = CURDATE()`,
        [funcionario_id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ erro: 'Erro na verificação' });
            }

            if (results.length > 0) {
                return res.status(403).json({
                    erro: 'Você já realizou sua autoavaliação hoje'
                });
            }

            db.query(
                `INSERT INTO avaliacoes (funcionario_id, estrelas, sugestao)
                 VALUES (?, ?, ?)`,
                [
                    funcionario_id,
                    estrelas,
                    sugestao || null
                ],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ erro: 'Erro ao salvar avaliação' });
                    }

                    res.json({
                        sucesso: true,
                        mensagem: 'Autoavaliação registrada com sucesso'
                    });
                }
            );
        }
    );
});


// QUEM JÁ AVALIOU HOJE
app.get('/api/avaliacoes/hoje', (req, res) => {
    db.query(
        `SELECT funcionario_id
         FROM avaliacoes
         WHERE DATE(avaliado_em) = CURDATE()`,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json([]);
            }

            res.json(results.map(r => r.funcionario_id));
        }
    );
});

// ===============================
// DASHBOARD — AVALIAÇÕES MENSAIS (PROTEGIDO)
// ===============================
app.get('/api/avaliacoes/mensal/:funcionarioId', verificarLogin, (req, res) => {
    const { funcionarioId } = req.params;

    db.query(
        `
        SELECT 
            DATE(avaliado_em) AS dia,
            estrelas
        FROM avaliacoes
        WHERE funcionario_id = ?
          AND MONTH(avaliado_em) = MONTH(CURDATE())
          AND YEAR(avaliado_em) = YEAR(CURDATE())
        ORDER BY avaliado_em
        `,
        [funcionarioId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json([]);
            }

            res.json(results);
        }
    );
});

// ===============================
// AVALIAÇÕES ANÔNIMAS (ADMIN)
// ===============================
app.get('/api/avaliacoes/todas', verificarLogin, (req, res) => {
    db.query(
        `
        SELECT 
            id,
            estrelas,
            sugestao,
            avaliado_em
        FROM avaliacoes
        ORDER BY avaliado_em DESC
        `,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json([]);
            }

            res.json(results);
        }
    );
});


// ===============================
// EXCLUIR COMENTÁRIO (ADMIN)
// ===============================
app.delete('/api/avaliacoes/comentario/:id', verificarLogin, (req, res) => {
    const { id } = req.params;

    db.query(
        'UPDATE avaliacoes SET sugestao = NULL WHERE id = ?',
        [id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ erro: 'Erro ao excluir comentário' });
            }

            res.json({ sucesso: true });
        }
    );
});


// ===============================
// SERVER
// ===============================
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Sistema rodando em http://localhost:${PORT}`);
});
