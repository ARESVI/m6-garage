'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trSort } from '@/lib/sort';

interface Customer {
  id: string;
  ad: string;
  soyad: string;
}

interface Motorcycle {
  id: string;
  marka: string;
  model: string;
  plaka: string;
  km: number;
}

interface Product {
  id: string;
  urunAdi: string;
  satisFiyati: number;
  stokMiktari: number;
}

interface ServiceItem {
  productId: string;
  adet: number;
  fiyat: number;
}

export default function NewServicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedMotorcycle, setSelectedMotorcycle] = useState('');
  const [km, setKm] = useState(0);
  const [yapilanIslemler, setYapilanIslemler] = useState('');
  const [notlar, setNotlar] = useState('');
  const [items, setItems] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetch('/api/customers').then((res) => res.json()).then(data => setCustomers(Array.isArray(data) ? data : []));
    fetch('/api/products').then((res) => res.json()).then(data => setProducts(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetch(`/api/motorcycles?customerId=${selectedCustomer}`)
        .then((res) => res.json())
        .then(data => setMotorcycles(Array.isArray(data) ? data : []));
    }
  }, [selectedCustomer]);

  const addItem = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      setItems(items.map((i) => (i.productId === productId ? { ...i, adet: i.adet + 1 } : i)));
    } else {
      setItems([...items, { productId, adet: 1, fiyat: product.satisFiyati }]);
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const updateItemQuantity = (productId: string, adet: number) => {
    if (adet <= 0) {
      removeItem(productId);
    } else {
      setItems(items.map((i) => (i.productId === productId ? { ...i, adet } : i)));
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.fiyat * item.adet, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch('/api/services', {
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

    router.push('/services');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Link href="/">
            <img src="/logo.png" alt="M6 GARAGE Logo" className="h-12 sm:h-16 w-auto drop-shadow-xl cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Araç Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="border p-3 rounded text-lg text-gray-900"
                required
              >
                <option value="">Müşteri Seçin</option>
                {[...customers].sort((a, b) => trSort(`${a.ad} ${a.soyad}`, `${b.ad} ${b.soyad}`)).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ad} {c.soyad}
                  </option>
                ))}
              </select>

              <select
                value={selectedMotorcycle}
                onChange={(e) => setSelectedMotorcycle(e.target.value)}
                className="border p-3 rounded text-lg text-gray-900"
                required
                disabled={!selectedCustomer}
              >
                <option value="">Motosiklet Seçin</option>
                {[...motorcycles].sort((a, b) => trSort(`${a.marka} ${a.model}`, `${b.marka} ${b.model}`)).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.marka} {m.model} - {m.plaka}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Güncel KM"
                value={km}
                onChange={(e) => setKm(parseInt(e.target.value) || 0)}
                className="border p-3 rounded text-lg text-gray-900"
                required
              />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Yapılan İşlemler</h2>
            <textarea
              placeholder="Yapılan işlemleri yazın..."
              value={yapilanIslemler}
              onChange={(e) => setYapilanIslemler(e.target.value)}
              className="border p-3 rounded text-lg w-full h-32 text-gray-900"
              required
            />
            <textarea
              placeholder="Notlar (opsiyonel)"
              value={notlar}
              onChange={(e) => setNotlar(e.target.value)}
              className="border p-3 rounded text-lg w-full h-20 mt-4 text-gray-900"
            />
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Kullanılan Parçalar</h2>
            <select
              onChange={(e) => {
                addItem(e.target.value);
                e.target.value = '';
              }}
              className="border p-3 rounded text-lg w-full mb-4 text-gray-900"
            >
              <option value="">Parça Ekle</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stokMiktari === 0}>
                  {p.urunAdi} - ₺{p.satisFiyati} (Stok: {p.stokMiktari})
                </option>
              ))}
            </select>

            {items.length > 0 && (
              <div className="space-y-2">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="font-semibold text-gray-900">{product?.urunAdi}</span>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.productId, item.adet - 1)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="font-bold text-gray-900">{item.adet}</span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.productId, item.adet + 1)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          +
                        </button>
                        <span className="font-bold text-gray-900">₺{(item.fiyat * item.adet).toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <p className="text-2xl font-bold text-right text-gray-900">
                Toplam: ₺{calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500/90 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-600 shadow-xl"
          >
            Servis Kaydını Oluştur
          </button>
        </form>
      </div>
    </div>
  );
}
