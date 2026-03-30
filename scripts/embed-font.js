const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/NotoSans-Regular.ttf');
const outPath = path.join(__dirname, '../lib/NotoSans-Regular.b64.ts');

const b64 = fs.readFileSync(fontPath).toString('base64');
fs.writeFileSync(outPath, `// Auto-generated - do not edit\nexport const NotoSansBase64 = "${b64}";\n`);
console.log('Font embedded, size:', b64.length, 'chars');
