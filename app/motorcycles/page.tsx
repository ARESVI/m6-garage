'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBrands, getModels } from '@/lib/motorcycle-data';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { trSort } from '@/lib/sort';

interface Motorcycle {
  id: string;
  marka: string;
  model: string;
  yil: number;
  plaka: string;
  km: number;
  customer: { ad: string; soyad: string };
}

interface Customer {
  id: string;
  ad: string;
  soyad: string;
}

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [brands] = useState(getBrands());
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    marka: '',
    model: '',
    yil: new Date().getFullYear(),
    plaka: '',
    km: 0,
  });

  useEffect(() => {
    loadMotorcycles();
    loadCustomers();
  }, []);

  useEffect(() => {
    if (formData.marka) {
      setAvailableModels(getModels(formData.marka));
      setFormData(prev => ({ ...prev, model: '' }));
    }
  }, [formData.marka]);

  const loadMotorcycles = () => {
    fetch('/api/motorcycles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMotorcycles(data);
        } else {
          console.error('Motorcycles API error:', data);
          setMotorcycles([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load motorcycles:', err);
        setMotorcycles([]);
      });
  };

  const loadCustomers = () => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.error('Customers API error:', data);
          setCustomers([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load customers:', err);
        setCustomers([]);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/motorcycles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, password: '481808' }),
    });
    if (res.ok) {
      setFormData({ customerId: '', marka: '', model: '', yil: new Date().getFullYear(), plaka: '', km: 0 });
      setShowForm(false);
      loadMotorcycles();
    } else {
      const data = await res.json();
      alert(data.error || 'Motosiklet eklenemedi');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Link href="/">
            <img src="/logo.png" alt="M6 GARAGE Logo" className="h-12 sm:h-16 w-auto drop-shadow-xl cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 shadow-xl w-full sm:w-auto"
            >
              {showForm ? 'İptal' : '+ Yeni Motosiklet'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="border p-3 rounded text-lg text-gray-900"
                required
              >
                <option value="">Müşteri Seçin</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ad} {c.soyad}
                  </option>
                ))}
              </select>
              <select
                value={formData.marka}
                onChange={(e) => setFormData({ ...formData, marka: e.target.value })}
                className="border p-3 rounded text-lg text-gray-900"
                required
              >
                <option value="">Marka Seçin</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="border p-3 rounded text-lg text-gray-900"
                required
                disabled={!formData.marka}
              >
                <option value="">Model Seçin</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Yıl"
                value={formData.yil}
                onChange={(e) => setFormData({ ...formData, yil: parseInt(e.target.value) || new Date().getFullYear() })}
                className="border p-3 rounded text-lg text-gray-900"
                min="1950"
                max={new Date().getFullYear() + 1}
                required
              />
              <input
                type="text"
                placeholder="Plaka (örn: 34ABC123)"
                value={formData.plaka}
                onChange={(e) => setFormData({ ...formData, plaka: e.target.value.toUpperCase() })}
                className="border p-3 rounded text-lg text-gray-900"
                required
              />
              <input
                type="number"
                placeholder="KM"
                value={formData.km}
                onChange={(e) => setFormData({ ...formData, km: parseInt(e.target.value) || 0 })}
                className="border p-3 rounded text-lg text-gray-900"
                min="0"
              />
            </div>
            <button type="submit" className="mt-4 bg-green-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 w-full shadow-xl">
              Kaydet
            </button>
          </form>
        )}

        {/* Filtre */}
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl mb-4 flex flex-col sm:flex-row items-center gap-3">
          <span className="font-bold text-gray-900 text-sm whitespace-nowrap">🔍 Filtrele:</span>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="border p-2 rounded text-gray-900 w-full sm:w-64"
          >
            <option value="">Tüm Müşteriler</option>
            {[...customers].sort((a, b) => trSort(`${a.ad} ${a.soyad}`, `${b.ad} ${b.soyad}`)).map(c => (
              <option key={c.id} value={`${c.ad} ${c.soyad}`}>{c.ad} {c.soyad}</option>
            ))}
          </select>
          {selectedCustomer && (
            <button
              onClick={() => setSelectedCustomer('')}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300 whitespace-nowrap"
            >
              ✕ Filtreyi Kaldır
            </button>
          )}
          <span className="text-gray-500 text-sm ml-auto">
            {(selectedCustomer ? motorcycles.filter(m => `${m.customer.ad} ${m.customer.soyad}` === selectedCustomer) : motorcycles).length} araç
          </span>
        </div>

        <div className="space-y-4">
          {(selectedCustomer ? motorcycles.filter(m => `${m.customer.ad} ${m.customer.soyad}` === selectedCustomer) : motorcycles)
            .sort((a, b) => trSort(`${a.customer.ad} ${a.customer.soyad}`, `${b.customer.ad} ${b.customer.soyad}`))
            .map((moto) => (
            <div key={moto.id} className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {moto.marka} {moto.model} ({moto.yil})
              </h3>
              <p className="text-gray-900">🔖 Plaka: {moto.plaka}</p>
              <p className="text-gray-900">📏 KM: {moto.km.toLocaleString()}</p>
              <p className="text-gray-900">
                👤 Sahibi: {moto.customer.ad} {moto.customer.soyad}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
