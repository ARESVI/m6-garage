import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

// Find and delete products with oversized stokMiktari
const bad = await p.$queryRaw`SELECT id, urunAdi, stokMiktari FROM products WHERE urunAdi LIKE '%i%cilik%' OR urunAdi LIKE '%İ%cilik%'`;
console.log('Found:', bad);

// Delete all products with stok > 2147483647 (INT max)
const deleted = await p.$executeRaw`DELETE FROM products WHERE stokMiktari > 2147483647`;
console.log('Deleted rows:', deleted);

await p.$disconnect();
