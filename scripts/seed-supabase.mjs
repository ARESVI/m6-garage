import { PrismaClient } from '@prisma/client';
import pg from 'pg';
const { Client } = pg;

const PG_URL = "postgresql://postgres.ckusaponjbvpahlkadkm:481808ObkYmr@aws-1-eu-central-1.pooler.supabase.com:5432/postgres";

const sqlite = new PrismaClient();
const pgClient = new Client({ 
  connectionString: PG_URL,
  ssl: { rejectUnauthorized: false },
  client_encoding: 'UTF8',
});

await sqlite.$connect();
await pgClient.connect();
console.log('Connected to both databases');

// Customers
const customers = await sqlite.customer.findMany();
console.log(`Migrating ${customers.length} customers...`);
for (const c of customers) {
  await pgClient.query(`
    INSERT INTO customers (id, ad, soyad, telefon, notlar, "createdAt")
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT (telefon) DO UPDATE SET ad=$2, soyad=$3, notlar=$5
  `, [c.id, c.ad, c.soyad, c.telefon, c.notlar, c.createdAt]);
}

// Motorcycles
const motorcycles = await sqlite.motorcycle.findMany();
console.log(`Migrating ${motorcycles.length} motorcycles...`);
for (const m of motorcycles) {
  await pgClient.query(`
    INSERT INTO motorcycles (id, "customerId", marka, model, yil, plaka, km, "createdAt")
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (plaka) DO UPDATE SET marka=$3, model=$4, yil=$5, km=$7
  `, [m.id, m.customerId, m.marka, m.model, m.yil, m.plaka, m.km, m.createdAt]);
}

// Products
const products = await sqlite.product.findMany();
console.log(`Migrating ${products.length} products...`);
for (const p of products) {
  await pgClient.query(`
    INSERT INTO products (id, "urunAdi", kategori, "stokMiktari", "minStokSeviyesi", "alisFiyati", "satisFiyati")
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (id) DO UPDATE SET "urunAdi"=$2, kategori=$3, "stokMiktari"=$4, "minStokSeviyesi"=$5
  `, [p.id, p.urunAdi, p.kategori, p.stokMiktari, p.minStokSeviyesi, p.alisFiyati, p.satisFiyati]);
}

// Service Records
const services = await sqlite.serviceRecord.findMany({ include: { serviceItems: true } });
console.log(`Migrating ${services.length} service records...`);
for (const s of services) {
  await pgClient.query(`
    INSERT INTO service_records (id, "motorcycleId", tarih, km, "yapilanIslemler", "toplamUcret", notlar)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (id) DO UPDATE SET km=$4, "yapilanIslemler"=$5, "toplamUcret"=$6
  `, [s.id, s.motorcycleId, s.tarih, s.km, s.yapilanIslemler, s.toplamUcret, s.notlar]);

  for (const item of s.serviceItems) {
    await pgClient.query(`
      INSERT INTO service_items (id, "serviceRecordId", "productId", adet, fiyat)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (id) DO UPDATE SET adet=$4, fiyat=$5
    `, [item.id, item.serviceRecordId, item.productId, item.adet, item.fiyat]);
  }
}

console.log('✓ Migration complete!');
await sqlite.$disconnect();
await pgClient.end();
