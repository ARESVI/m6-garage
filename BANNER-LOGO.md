# Banner Logo Ekleme (1602x402 Piksel)

## ✅ Tüm Sayfalar Banner Logo İçin Optimize Edildi!

Banner logo (yatay format) için sayfalar düzenlendi:
- Ana sayfa: Büyük banner (h-24 = 96px yükseklik)
- Diğer sayfalar: Orta banner (h-16 = 64px yükseklik)
- Sayfa başlıkları kaldırıldı (logo içinde yazı var)
- Tüm logolar drop-shadow-xl efekti ile

## 📸 Banner Logo Ekleme

### Adım 1: Banner Dosyasını Hazırla
Banner logo dosyanı hazırla:
- Boyut: 1602x402 piksel (4:1 oran)
- Format: PNG (şeffaf arka plan önerilir)
- Alternatif: JPG, WebP
- Dosya adı: `logo.png`

### Adım 2: Banner Dosyasını Kopyala
Banner dosyasını şu klasöre kopyala:
```
moto-servis/public/logo.png
```

### Adım 3: Tarayıcıyı Yenile
Tarayıcıda sayfayı yenile (Ctrl + Shift + R)

## 🎨 Banner Boyutları

### Ana Sayfa (Dashboard)
Banner ortada, büyük boyutta:
```tsx
<img src="/logo.png" alt="OBK SERVICE Logo" className="h-24 w-auto drop-shadow-2xl" />
```

Yükseklik: 96px (h-24)
Genişlik: Otomatik (orantı korunur: ~384px)

### Diğer Sayfalar
Banner solda, orta boyutta:
```tsx
<img src="/logo.png" alt="OBK SERVICE Logo" className="h-16 w-auto drop-shadow-xl" />
```

Yükseklik: 64px (h-16)
Genişlik: Otomatik (orantı korunur: ~256px)

## 📐 Boyut Ayarlama

Banner çok büyük/küçük görünüyorsa:

### Ana Sayfa
```tsx
className="h-20 w-auto ..."  // Küçük (80px)
className="h-24 w-auto ..."  // Orta (96px) - varsayılan
className="h-28 w-auto ..."  // Büyük (112px)
className="h-32 w-auto ..."  // Çok büyük (128px)
```

### Diğer Sayfalar
```tsx
className="h-12 w-auto ..."  // Küçük (48px)
className="h-16 w-auto ..."  // Orta (64px) - varsayılan
className="h-20 w-auto ..."  // Büyük (80px)
className="h-24 w-auto ..."  // Çok büyük (96px)
```

## 🎯 Banner Pozisyonu

### Ana Sayfa
Banner tam ortada:
```tsx
<div className="flex items-center justify-center mb-8">
  <img src="/logo.png" ... />
</div>
```

### Diğer Sayfalar
Banner solda, butonlar sağda:
```tsx
<div className="flex justify-between items-center mb-6">
  <img src="/logo.png" ... />
  <div className="space-x-2">
    <!-- Butonlar -->
  </div>
</div>
```

## 💡 Banner Efektleri

Mevcut efektler:
- `drop-shadow-xl` - Güçlü gölge (diğer sayfalar)
- `drop-shadow-2xl` - Çok güçlü gölge (ana sayfa)
- `w-auto` - Genişlik otomatik (4:1 orantı korunur)

### Gölge Değiştirme
```tsx
className="... drop-shadow-none"  // Gölge yok
className="... drop-shadow-lg"    // Orta gölge
className="... drop-shadow-xl"    // Güçlü gölge (varsayılan)
className="... drop-shadow-2xl"   // En güçlü gölge
```

### Yuvarlatılmış Köşeler
```tsx
className="h-16 w-auto rounded-lg drop-shadow-xl"  // Hafif yuvarlatma
className="h-16 w-auto rounded-xl drop-shadow-xl"  // Orta yuvarlatma
className="h-16 w-auto rounded-2xl drop-shadow-xl" // Güçlü yuvarlatma
```

## 🖼️ Banner Logo Önerileri

İyi banner özellikleri:
- Şeffaf arka plan (PNG)
- Yüksek çözünürlük (1602x402 veya daha büyük)
- Beyaz veya açık renkli (koyu arka plan için)
- Logo + yazı birlikte
- 4:1 oran (yatay)

Örnek boyutlar:
- 1602x402 (orijinal)
- 2000x500 (daha yüksek çözünürlük)
- 1600x400 (standart)

## 📱 Mobil Uyumluluk

Banner mobilde otomatik küçülür:
- Yükseklik sabit kalır (h-24 veya h-16)
- Genişlik ekrana sığacak şekilde küçülür
- Orantı korunur

Mobilde çok büyük görünüyorsa:
```tsx
className="h-16 md:h-24 w-auto ..."  // Mobilde 64px, masaüstünde 96px
```

## 🔄 Farklı Dosya Adı

Farklı dosya adı kullanmak için (örn: `obk-banner.png`):

Tüm sayfalarda değiştir:
```tsx
<img src="/obk-banner.png" alt="OBK SERVICE Logo" ... />
```

Değiştirilecek dosyalar:
- `app/page.tsx`
- `app/customers/page.tsx`
- `app/motorcycles/page.tsx`
- `app/products/page.tsx`
- `app/services/page.tsx`
- `app/new-service/page.tsx`

## ✨ Sonuç

Banner logo için hazır! 

Boyutlar:
- Ana sayfa: 96px yükseklik (h-24) → ~384px genişlik
- Diğer sayfalar: 64px yükseklik (h-16) → ~256px genişlik

Sadece `public/logo.png` dosyasını ekle ve tarayıcıyı yenile!
