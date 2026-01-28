const bcrypt = require('bcrypt');

(async () => {
    const senha = 'admin123';
    const hash = await bcrypt.hash(senha, 10);
    console.log(hash);
})();
