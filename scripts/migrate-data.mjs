// Local SQLite -> Supabase PostgreSQL data migration
import { PrismaClient as SQLiteClient } from '@prisma/client';

const sqlite = new SQLiteClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } }
});

// PostgreSQL client with direct connection
const { PrismaClient: PGClient } = await import('@prisma/client');
const pg = new PGClient({
  datasources: {
    db: {
      url: process.env.PG_URL
    }
  }
});

console.log('Connecting...');
await sqlite.$connect();
await pg.$connect();

// Migrate customers
const customers = await sqlite.customer.findMany({ include: { motorcycles: true } });
console.log(`Migrating ${customers.length} customers...`);
for (const c of customers) {
  await pg.customer.upsert({
    where: { telefon: c.telefon },
    update: { ad: c.ad, soyad: c.soyad, notlar: c.notlar },
    create: { id: c.id, ad: c.ad, soyad: c.soyad, telefon: c.telefon, notlar: c.notlar, createdAt: c.createdAt }
  });
}

// Migrate motorcycles
const motorcycles = await sqlite.motorcycle.findMany();
console.log(`Migrating ${motorcycles.length} motorcycles...`);
for (const m of motorcycles) {
  await pg.motorcycle.upsert({
    where: { plaka: m.plaka },
    update: { marka: m.marka, model: m.model, yil: m.yil, km: m.km },
    create: { id: m.id, customerId: m.customerId, marka: m.marka, model: m.model, yil: m.yil, plaka: m.plaka, km: m.km, createdAt: m.createdAt }
  });
}

// Migrate products
const products = await sqlite.product.findMany();
console.log(`Migrating ${products.length} products...`);
for (const p of products) {
  await pg.product.upsert({
    where: { id: p.id },
    update: { urunAdi: p.urunAdi, kategori: p.kategori, stokMiktari: p.stokMiktari, minStokSeviyesi: p.minStokSeviyesi, alisFiyati: p.alisFiyati, satisFiyati: p.satisFiyati },
    create: { id: p.id, urunAdi: p.urunAdi, kategori: p.kategori, stokMiktari: p.stokMiktari, minStokSeviyesi: p.minStokSeviyesi, alisFiyati: p.alisFiyati, satisFiyati: p.satisFiyati }
  });
}

// Migrate service records
const services = await sqlite.serviceRecord.findMany({ include: { serviceItems: true } });
console.log(`Migrating ${services.length} service records...`);
for (const s of services) {
  await pg.serviceRecord.upsert({
    where: { id: s.id },
    update: { km: s.km, yapilanIslemler: s.yapilanIslemler, toplamUcret: s.toplamUcret, notlar: s.notlar },
    create: { id: s.id, motorcycleId: s.motorcycleId, tarih: s.tarih, km: s.km, yapilanIslemler: s.yapilanIslemler, toplamUcret: s.toplamUcret, notlar: s.notlar }
  });
  for (const item of s.serviceItems) {
    await pg.serviceItem.upsert({
      where: { id: item.id },
      update: { adet: item.adet, fiyat: item.fiyat },
      create: { id: item.id, serviceRecordId: item.serviceRecordId, productId: item.productId, adet: item.adet, fiyat: item.fiyat }
    });
  }
}

console.log('Migration complete!');
await sqlite.$disconnect();
await pg.$disconnect();
