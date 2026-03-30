import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Veritabanı seed başlıyor...');

  // Örnek ürünler
  const products = await Promise.all([
    prisma.product.create({
      data: {
        urunAdi: 'Castrol 10W-40 Motor Yağı',
        kategori: 'yag',
        stokMiktari: 20,
        minStokSeviyesi: 5,
        alisFiyati: 150,
        satisFiyati: 250,
      },
    }),
    prisma.product.create({
      data: {
        urunAdi: 'Yağ Filtresi',
        kategori: 'filtre',
        stokMiktari: 15,
        minStokSeviyesi: 5,
        alisFiyati: 30,
        satisFiyati: 60,
      },
    }),
    prisma.product.create({
      data: {
        urunAdi: 'Hava Filtresi',
        kategori: 'filtre',
        stokMiktari: 12,
        minStokSeviyesi: 5,
        alisFiyati: 40,
        satisFiyati: 80,
      },
    }),
    prisma.product.create({
      data: {
        urunAdi: 'Fren Balatası Ön',
        kategori: 'parca',
        stokMiktari: 8,
        minStokSeviyesi: 3,
        alisFiyati: 120,
        satisFiyati: 200,
      },
    }),
    prisma.product.create({
      data: {
        urunAdi: 'Zincir Seti',
        kategori: 'parca',
        stokMiktari: 5,
        minStokSeviyesi: 2,
        alisFiyati: 300,
        satisFiyati: 500,
      },
    }),
  ]);

  console.log(`✅ ${products.length} ürün eklendi`);

  // Örnek müşteri
  const customer = await prisma.customer.create({
    data: {
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      telefon: '05551234567',
      notlar: 'Düzenli müşteri',
    },
  });

  console.log(`✅ Müşteri eklendi: ${customer.ad} ${customer.soyad}`);

  // Örnek motosiklet
  const motorcycle = await prisma.motorcycle.create({
    data: {
      customerId: customer.id,
      marka: 'Honda',
      model: 'CBR 150R',
      yil: 2020,
      plaka: '34ABC123',
      km: 15000,
    },
  });

  console.log(`✅ Motosiklet eklendi: ${motorcycle.marka} ${motorcycle.model}`);

  console.log('🎉 Seed tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
