# 🚀 Hızlı Başlangıç Kılavuzu

## Adım 1: Veritabanı Seçimi

### Seçenek A: Supabase (ÖNERİLEN - En Kolay)

1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın (ücretsiz)
4. "New Project" butonuna tıklayın
5. Proje adı: `moto-servis`
6. Database Password: Güçlü bir şifre belirleyin (kaydedin!)
7. Region: Europe (Frankfurt) seçin
8. "Create new project" butonuna tıklayın
9. Proje oluşturulurken bekleyin (1-2 dakika)
10. Sol menüden "Project Settings" > "Database" seçin
11. "Connection string" bölümünden "URI" sekmesini seçin
12. Bağlantı URL'ini kopyalayın
13. `.env` dosyasını açın ve `DATABASE_URL` değerini yapıştırın

### Seçenek B: Yerel PostgreSQL

1. PostgreSQL'i indirin: [postgresql.org/download](https://www.postgresql.org/download/)
2. Kurulumu yapın (varsayılan ayarlarla)
3. pgAdmin'i açın
4. Yeni veritabanı oluşturun: `motoservis`
5. `.env` dosyasında şifrenizi güncelleyin

## Adım 2: Veritabanını Hazırla

Terminal'de şu komutu çalıştırın:

```bash
npx prisma migrate dev --name init
```

Bu komut:
- Veritabanı tablolarını oluşturur
- İlk migration'ı kaydeder

## Adım 3: Uygulamayı Başlat

```bash
npm run dev
```

Tarayıcıda açın: http://localhost:3000

## 🎯 İlk Kullanım

1. **Stok Yönetimi** sayfasına gidin
2. Birkaç ürün ekleyin (örnek):
   - Castrol 10W-40 Motor Yağı
   - Yağ Filtresi
   - Hava Filtresi
   - Fren Balatası

3. **Müşteriler** sayfasına gidin
4. Yeni müşteri ekleyin

5. **Motosikletler** sayfasına gidin
6. Müşteriye ait motosiklet ekleyin

7. **Yeni Servis Kaydı** oluşturun
8. Dashboard'da istatistikleri görün!

## ⚠️ Sorun Giderme

### "Cannot connect to database" hatası

- `.env` dosyasındaki `DATABASE_URL` doğru mu kontrol edin
- Supabase kullanıyorsanız, şifrenizi doğru yazdığınızdan emin olun
- Yerel PostgreSQL kullanıyorsanız, servisin çalıştığından emin olun

### Port 3000 kullanımda hatası

```bash
npm run dev -- -p 3001
```

### Prisma hatası

```bash
npx prisma generate
npx prisma migrate reset
npx prisma migrate dev
```

## 📞 Yardım

Sorun yaşıyorsanız, README.md dosyasına bakın veya issue açın.
