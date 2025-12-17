const crypto = require('crypto');

console.log('\n========================================');
console.log('MyFlow - Secret Key Generator');
console.log('========================================\n');

const secret = crypto.randomBytes(32).toString('base64');

console.log('Generated NEXTAUTH_SECRET:');
console.log('');
console.log(secret);
console.log('');
console.log('Copy secret di atas dan paste ke file .env');
console.log('Ganti value NEXTAUTH_SECRET dengan secret ini');
console.log('');
console.log('========================================\n');
