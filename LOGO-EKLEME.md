# Logo/Header Resmi Ekleme Talimatları

## ✅ Tüm Sayfalar Logo İçin Hazırlandı!

Header'a logo eklendi:
- Ana sayfa: Büyük logo (h-20) + "OBK SERVICE" yazısı
- Diğer sayfalar: Küçük logo (h-12) + sayfa başlığı
- Tüm logolar drop-shadow-xl efekti ile

## 📸 Logo Resmini Ekleme

### Adım 1: Logo Dosyasını Hazırla
Logo olarak kullanmak istediğin görseli hazırla:
- Önerilen format: PNG (şeffaf arka plan için)
- Alternatif: JPG, WebP, SVG
- Önerilen boyut: 200x200 veya daha büyük (kare veya yatay)
- Dosya adı: `logo.png` (veya .jpg, .svg, .webp)

### Adım 2: Logo Dosyasını Kopyala
Logo dosyasını şu klasöre kopyala:
```
moto-servis/public/logo.png
```

### Adım 3: Tarayıcıyı Yenile
Tarayıcıda sayfayı yenile (Ctrl + Shift + R)

## 🎨 Logo Boyutlarını Ayarlama

### Ana Sayfa (Dashboard)
Logo daha büyük gösterilir:
```tsx
<img src="/logo.png" alt="OBK SERVICE Logo" className="h-20 w-auto mr-4 drop-shadow-2xl" />
```

Boyutu değiştirmek için `h-20` değerini değiştir:
- `h-16` - Küçük (64px)
- `h-20` - Orta (80px) - varsayılan
- `h-24` - Büyük (96px)
- `h-32` - Çok büyük (128px)

### Diğer Sayfalar
Logo daha küçük gösterilir:
```tsx
<img src="/logo.png" alt="OBK SERVICE Logo" className="h-12 w-auto mr-3 drop-shadow-xl" />
```

Boyutu değiştirmek için `h-12` değerini değiştir:
- `h-8` - Çok küçük (32px)
- `h-10` - Küçük (40px)
- `h-12` - Orta (48px) - varsayılan
- `h-16` - Büyük (64px)

## 🔄 Farklı Dosya Adı Kullanmak

Eğer farklı bir dosya adı kullanmak isterseniz (örn: `obk-logo.png`):

Tüm sayfalarda `src="/logo.png"` kısmını değiştir:
```tsx
<img src="/obk-logo.png" alt="OBK SERVICE Logo" ... />
```

Değiştirilmesi gereken dosyalar:
- `app/page.tsx` (Ana sayfa)
- `app/customers/page.tsx`
- `app/motorcycles/page.tsx`
- `app/products/page.tsx`
- `app/services/page.tsx`
- `app/new-service/page.tsx`

## 🎯 Logo Pozisyonu

### Ana Sayfa
Logo ve yazı ortada:
```tsx
<div className="flex items-center justify-center mb-8">
  <img ... />
  <h1>OBK SERVICE</h1>
</div>
```

### Diğer Sayfalar
Logo ve başlık solda, butonlar sağda:
```tsx
<div className="flex justify-between items-center mb-6">
  <div className="flex items-center">
    <img ... />
    <h1>Sayfa Başlığı</h1>
  </div>
  <div className="space-x-2">
    <!-- Butonlar -->
  </div>
</div>
```

## 💡 Logo Efektleri

Mevcut efektler:
- `drop-shadow-xl` - Güçlü gölge efekti (diğer sayfalar)
- `drop-shadow-2xl` - Çok güçlü gölge efekti (ana sayfa)
- `w-auto` - Genişlik otomatik (orantı korunur)
- `mr-3` veya `mr-4` - Sağ boşluk (logo ile yazı arası)

### Gölge Efektini Değiştirme
- `drop-shadow-none` - Gölge yok
- `drop-shadow-sm` - Hafif gölge
- `drop-shadow-md` - Orta gölge
- `drop-shadow-lg` - Güçlü gölge
- `drop-shadow-xl` - Çok güçlü gölge (varsayılan)
- `drop-shadow-2xl` - En güçlü gölge (ana sayfa)

### Logo Şeklini Değiştirme

Yuvarlak logo için:
```tsx
<img src="/logo.png" alt="OBK SERVICE Logo" className="h-12 w-12 rounded-full mr-3 drop-shadow-xl" />
```

Yuvarlatılmış köşeler için:
```tsx
<img src="/logo.png" alt="OBK SERVICE Logo" className="h-12 w-auto rounded-lg mr-3 drop-shadow-xl" />
```

## 🖼️ Logo Önerileri

İyi logo özellikleri:
- Şeffaf arka plan (PNG)
- Yüksek çözünürlük
- Basit ve okunabilir
- Beyaz veya açık renkli (koyu arka plan için)
- Kare veya yatay format

## 🚫 Logo'yu Kaldırmak

Logo'yu kaldırıp sadece yazıyı bırakmak için:

Her sayfada `<img ... />` satırını sil ve `<div className="flex items-center">` kısmını kaldır.

## ✨ Sonuç

Tüm sayfalar logo için hazır! Sadece `public/logo.png` dosyasını ekle ve tarayıcıyı yenile.

Logo boyutları:
- Ana sayfa: 80px (h-20)
- Diğer sayfalar: 48px (h-12)
