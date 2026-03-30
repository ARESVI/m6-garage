# 🏍️ Moto Servis Yönetim Sistemi

Motosiklet tamircileri için geliştirilmiş tam kapsamlı servis ve stok yönetim sistemi.

## ✨ Özellikler

- 👥 Müşteri yönetimi
- 🏍️ Motosiklet kayıtları
- 🔧 Servis geçmişi takibi
- 📦 Stok yönetimi (otomatik düşüm)
- 💰 Gelir takibi
- ⚠️ Düşük stok uyarıları
- 📱 Mobil uyumlu tasarım

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Veritabanı Kurulumu

#### Seçenek A: Yerel PostgreSQL

PostgreSQL'i yükleyin ve çalıştırın, ardından `.env` dosyasını düzenleyin:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/motoservis?schema=public"
```

#### Seçenek B: Supabase (Önerilen - Daha Kolay)

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Project Settings > Database > Connection String kısmından bağlantı URL'ini alın
4. `.env` dosyasına yapıştırın

### 3. Veritabanını Oluştur

```bash
npx prisma migrate dev --name init
```

### 4. Uygulamayı Başlat

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

## 📱 Kullanım

### İlk Adımlar

1. **Ürün Ekle**: Stok Yönetimi sayfasından yağ, filtre ve parçaları ekleyin
2. **Müşteri Ekle**: Müşteriler sayfasından yeni müşteri kaydedin
3. **Motosiklet Ekle**: Müşteriye ait motosikleti kaydedin
4. **Servis Kaydı Oluştur**: Yeni Servis Kaydı sayfasından işlem yapın

### Servis Kaydı Oluştururken

- Müşteri ve motosiklet seçin
- Güncel KM'yi girin
- Yapılan işlemleri yazın
- Kullanılan parçaları ekleyin
- Sistem otomatik olarak:
  - Stokları düşer
  - Toplam ücreti hesaplar
  - Motosiklet KM'sini günceller

## 🛠 Teknolojiler

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **State Management**: Zustand
- **Date Handling**: date-fns

## 📊 Veritabanı Yapısı

- **Customer**: Müşteri bilgileri
- **Motorcycle**: Motosiklet kayıtları
- **ServiceRecord**: Servis işlemleri
- **ServiceItem**: Serviste kullanılan parçalar
- **Product**: Stok ürünleri
- **StockMovement**: Stok hareketleri

## 🔄 Geliştirme

### Prisma Studio ile Veritabanını Görüntüle

```bash
npx prisma studio
```

### Yeni Migration Oluştur

```bash
npx prisma migrate dev --name migration_adi
```

## 📈 Gelecek Özellikler

- [ ] SMS/WhatsApp hatırlatma
- [ ] Gelir raporları ve grafikler
- [ ] Müşteri sadakat sistemi
- [ ] Yağ değişimi hatırlatıcı (KM bazlı)
- [ ] PDF fatura oluşturma
- [ ] Kullanıcı giriş sistemi

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

## 📝 Lisans

MIT
