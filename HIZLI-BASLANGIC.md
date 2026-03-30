# ⚡ 5 Dakikada Başla

## 1️⃣ Supabase Hesabı Oluştur (2 dakika)

1. 🌐 [supabase.com](https://supabase.com) → "Start your project"
2. 🔐 GitHub ile giriş yap
3. ➕ "New Project" tıkla
4. 📝 Bilgileri doldur:
   - Name: `moto-servis`
   - Database Password: Güçlü şifre (KAYDET!)
   - Region: Europe (Frankfurt)
5. ⏳ 1-2 dakika bekle

## 2️⃣ Bağlantı URL'ini Al (30 saniye)

1. 📊 Sol menü → "Project Settings"
2. 🗄️ "Database" sekmesi
3. 📋 "Connection string" → "URI" sekmesi
4. 📄 URL'i kopyala

## 3️⃣ Projeyi Yapılandır (1 dakika)

Terminal'de:

```bash
# .env dosyasını oluştur
copy .env.example .env
```

`.env` dosyasını aç ve `DATABASE_URL` satırına Supabase URL'ini yapıştır.

## 4️⃣ Veritabanını Hazırla (1 dakika)

```bash
# Tabloları oluştur
npx prisma migrate dev --name init

# Örnek verileri ekle (opsiyonel)
npm run seed
```

## 5️⃣ Başlat! (10 saniye)

```bash
npm run dev
```

🎉 Tarayıcıda aç: **http://localhost:3000**

---

## 🎯 İlk Adımlar

1. **📦 Stok Yönetimi** → Ürün ekle (yağ, filtre, parça)
2. **👥 Müşteriler** → Müşteri ekle
3. **🏍️ Motosikletler** → Motosiklet ekle
4. **🔧 Yeni Servis Kaydı** → İlk servisi kaydet
5. **📊 Ana Sayfa** → Dashboard'u gör!

---

## ❓ Sorun mu var?

### "Cannot connect to database"
- `.env` dosyasındaki URL'i kontrol et
- Supabase şifresini doğru yazdığından emin ol

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Prisma hatası
```bash
npx prisma generate
npx prisma migrate reset
```

---

## 📱 Mobil Kullanım

Telefonundan erişmek için:

1. Bilgisayarının IP adresini öğren:
   ```bash
   ipconfig
   ```
2. Telefonundan aç: `http://[IP-ADRESI]:3000`
   Örnek: `http://192.168.1.100:3000`

---

## 🚀 Production'a Al

### Vercel (Ücretsiz)

```bash
npm install -g vercel
vercel
```

Supabase URL'ini Vercel environment variables'a ekle!

---

**Hazırsın! İyi çalışmalar! 🏍️💨**
