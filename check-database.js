const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

console.log('Verificando banco de dados...');
console.log('Caminho do banco:', dbPath);

if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log('✅ Banco de dados encontrado!');
  console.log('Tamanho:', stats.size, 'bytes');
  console.log('Criado em:', stats.birthtime);
  console.log('Modificado em:', stats.mtime);
} else {
  console.log('❌ Banco de dados não encontrado!');
  console.log('O banco será criado quando a aplicação iniciar.');
}