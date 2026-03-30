# Toast Notification Sistemi Kurulumu

## ✅ Tamamlanan İşlemler

### 1. Stok Yönetimi Düzeltildi
- ✅ Servis kaydı düzenlendiğinde eski parçalar stoka iade ediliyor
- ✅ Yeni parçalar stoktan düşülüyor
- ✅ Servis kaydı silindiğinde tüm parçalar stoka iade ediliyor
- ✅ Tüm stok hareketleri `stock_movements` tablosuna kaydediliyor

### 2. Toast Notification Sistemi
- ✅ `components/Toast.tsx` - Toast komponenti oluşturuldu
- ✅ `hooks/useToast.ts` - Toast hook'u oluşturuldu
- ✅ `app/globals.css` - Animasyonlar eklendi (slide-in, slide-out)
- ✅ Servis kayıtları sayfasına toast eklendi
- ✅ Ürünler sayfasına toast eklendi
- ✅ Müşteriler sayfasına toast eklendi

### 3. Animasyonlar
- ✅ Sağdan sola kayarak giriş (slide-in)
- ✅ Sağa kayarak çıkış (slide-out)
- ✅ 3 saniye otomatik kapanma
- ✅ Manuel kapatma butonu (×)

## 📋 Kalan İşlemler

Motorcycles ve New Service sayfalarına toast eklemek için:

### Motorcycles Page (app/motorcycles/page.tsx)

1. Import ekle (YAPILDI):
```tsx
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
```

2. Hook ekle:
```tsx
export default function MotorcyclesPage() {
  const { toasts, removeToast, success, error } = useToast();
  // ... diğer state'ler
```

3. handleSubmit güncelle:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const response = await fetch('/api/motorcycles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  
  if (response.ok) {
    success('Motosiklet başarıyla eklendi!');
    setFormData({ customerId: '', marka: '', model: '', yil: new Date().getFullYear(), plaka: '', km: 0 });
    setShowForm(false);
    loadMotorcycles();
  } else {
    error('Motosiklet eklenemedi!');
  }
};
```

4. Toast render ekle (return sonunda):
```tsx
        {/* Toast Notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

### New Service Page (app/new-service/page.tsx)

1. Import ekle:
```tsx
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
```

2. Hook ekle:
```tsx
export default function NewServicePage() {
  const router = useRouter();
  const { toasts, removeToast, success, error } = useToast();
  // ... diğer state'ler
```

3. handleSubmit güncelle:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch('/api/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      motorcycleId: selectedMotorcycle,
      km,
      yapilanIslemler,
      notlar,
      toplamUcret: calculateTotal(),
      items,
    }),
  });

  if (response.ok) {
    success('Servis kaydı başarıyla oluşturuldu!');
    setTimeout(() => {
      router.push('/services');
    }, 1500);
  } else {
    error('Servis kaydı oluşturulamadı!');
  }
};
```

4. Toast render ekle (return sonunda):
```tsx
        {/* Toast Notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

## 🎨 Toast Tipleri

```tsx
success('İşlem başarılı!');  // Yeşil, ✓ ikonu
error('Hata oluştu!');       // Kırmızı, ✕ ikonu
info('Bilgi mesajı');        // Mavi, ℹ ikonu
warning('Uyarı mesajı');     // Sarı, ⚠ ikonu
```

## 🔧 Özelleştirme

### Süre Değiştirme
Toast.tsx'te `duration` prop'u:
```tsx
<Toast message="..." type="success" onClose={...} duration={5000} />
```

### Pozisyon Değiştirme
Toast.tsx'te className:
```tsx
// Sağ üst (varsayılan)
className="fixed top-4 right-4 z-[9999]"

// Sol üst
className="fixed top-4 left-4 z-[9999]"

// Orta üst
className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
```

## ✨ Sonuç

Stok yönetimi tamamen düzeltildi ve animasyonlu toast notification sistemi eklendi!
