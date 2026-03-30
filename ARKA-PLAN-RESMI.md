# Arka Plan Resmi Ekleme Talimatları

## ✅ Tüm Sayfalar Arka Plan İçin Hazırlandı!

Tüm sayfalar arka plan resmi için optimize edildi:
- Şeffaf/yarı saydam kartlar (bg-white/90, bg-white/95)
- Backdrop blur efekti
- Beyaz başlıklar (drop-shadow ile)
- Gölgeli butonlar (shadow-xl)

## 📸 Arka Plan Resmini Ekleme

### Adım 1: Resmi Hazırla
Arka plan resmi olarak kullanmak istediğin görseli hazırla:
- Önerilen boyut: 1920x1080 veya daha büyük
- Format: JPG, PNG, WebP
- Dosya adı: `background.jpg` (veya .png, .webp)

### Adım 2: Resmi Kopyala
Resmi şu klasöre kopyala:
```
moto-servis/public/background.jpg
```

### Adım 3: Tarayıcıyı Yenile
Tarayıcıda sayfayı yenile (F5 veya Ctrl+R)

## 🎨 Farklı Resim Kullanmak İsterseniz

Eğer farklı bir dosya adı kullanmak isterseniz (örn: `arkaplan.png`):

1. Resmi `public/` klasörüne kopyala
2. `moto-servis/app/layout.tsx` dosyasını aç
3. Şu satırı bul:
   ```tsx
   style={{ backgroundImage: 'url(/background.jpg)' }}
   ```
4. Dosya adını değiştir:
   ```tsx
   style={{ backgroundImage: 'url(/arkaplan.png)' }}
   ```

## 🎯 Arka Plan Ayarları

Mevcut ayarlar:
- `bg-cover`: Resim tüm ekranı kaplar
- `bg-center`: Resim ortadan hizalanır
- `bg-fixed`: Resim sabit kalır (parallax efekti)
- `bg-no-repeat`: Resim tekrarlanmaz
- `backdrop-blur-sm`: Hafif bulanıklık efekti
- `bg-black/30`: %30 siyah overlay (resmi koyulaştırır)

### Overlay'i Ayarlama

Arka plan çok parlaksa veya çok koyuysa, overlay'i ayarlayabilirsin:

`moto-servis/app/layout.tsx` dosyasında:
```tsx
<div className="min-h-full backdrop-blur-sm bg-black/30">
```

Değiştirebileceğin değerler:
- `bg-black/10` - Çok hafif koyulaştırma
- `bg-black/20` - Hafif koyulaştırma
- `bg-black/30` - Orta koyulaştırma (varsayılan)
- `bg-black/40` - Güçlü koyulaştırma
- `bg-black/50` - Çok güçlü koyulaştırma

### Bulanıklığı Ayarlama

Bulanıklık efektini değiştirmek için:
- `backdrop-blur-none` - Bulanıklık yok
- `backdrop-blur-sm` - Hafif bulanıklık (varsayılan)
- `backdrop-blur-md` - Orta bulanıklık
- `backdrop-blur-lg` - Güçlü bulanıklık
- `backdrop-blur-xl` - Çok güçlü bulanıklık

## 🖼️ Örnek Resim Önerileri

İyi arka plan resimleri:
- Motosiklet atölyesi fotoğrafı
- Motosiklet detay görseli
- Soyut/geometrik desenler
- Gradient arka planlar
- Bulanık motosiklet görselleri

Kaçınılması gerekenler:
- Çok karmaşık desenler (metin okunmaz)
- Çok parlak renkler
- Çok fazla detay içeren görseller

## 🔄 Arka Planı Kaldırmak

Arka plan resmini kaldırmak ve düz renge dönmek için:

`moto-servis/app/layout.tsx` dosyasında:
```tsx
<body className="min-h-full flex flex-col bg-gray-50">
  {children}
</body>
```

## ✨ Sonuç

Tüm sayfalar arka plan resmi için hazır! Sadece `public/background.jpg` dosyasını ekle ve tarayıcıyı yenile.
