// Gera o hash bcrypt da senha da cliente para a variável ADMIN_PASSWORD_HASH.
// Uso: npm run hash-senha -- "senha-escolhida"
import bcrypt from 'bcryptjs';

const senha = process.argv[2];
if (!senha || senha.length < 8) {
  console.error('Informe uma senha com pelo menos 8 caracteres: npm run hash-senha -- "senha"');
  process.exit(1);
}
console.log(bcrypt.hashSync(senha, 12));
