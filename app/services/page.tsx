'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { generateServicePDF } from '@/lib/generateServicePDF';
import { trSort } from '@/lib/sort';

interface ServiceRecord {
  id: string;
  tarih: string;
  km: number;
  yapilanIslemler: string;
  toplamUcret: number;
  notlar?: string;
  motorcycle: {
    marka: string;
    model: string;
    plaka: string;
    customer: {
      ad: string;
      soyad: string;
    };
  };
  serviceItems: Array<{
    adet: number;
    fiyat: number;
    product: {
      id: string;
      urunAdi: string;
    };
  }>;
}

interface Product {
  id: string;
  urunAdi: string;
  satisFiyati: number;
  stokMiktari: number;
}

interface EditServiceItem {
  productId: string;
  adet: number;
  fiyat: number;
}

export default function ServicesPage() {
  const { toasts, removeToast, success, error } = useToast();
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalAction, setModalAction] = useState<'edit' | 'delete'>('edit');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [editFormData, setEditFormData] = useState({
    km: 0,
    yapilanIslemler: '',
    toplamUcret: 0,
    notlar: '',
    tarih: '',
  });
  const [editItems, setEditItems] = useState<EditServiceItem[]>([]);

  useEffect(() => {
    loadServices();
    loadProducts();
  }, []);

  const loadServices = () => {
    fetch('/api/services')
      .then((res) => res.json())
      .then(setServices);
  };

  const loadProducts = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then(setProducts);
  };

  const handleEditClick = (service: ServiceRecord) => {
    setSelectedServiceId(service.id);
    setEditFormData({
      km: service.km,
      yapilanIslemler: service.yapilanIslemler,
      toplamUcret: service.toplamUcret,
      notlar: service.notlar || '',
      tarih: new Date(service.tarih).toISOString().slice(0, 16),
    });
    // Mevcut parçaları yükle
    setEditItems(
      service.serviceItems.map((item) => ({
        productId: item.product.id,
        adet: item.adet,
        fiyat: item.fiyat,
      }))
    );
    setModalAction('edit');
    setShowPasswordModal(true);
  };

  const addEditItem = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existing = editItems.find((i) => i.productId === productId);
    if (existing) {
      setEditItems(editItems.map((i) => (i.productId === productId ? { ...i, adet: i.adet + 1 } : i)));
    } else {
      setEditItems([...editItems, { productId, adet: 1, fiyat: product.satisFiyati }]);
    }
  };

  const removeEditItem = (productId: string) => {
    setEditItems(editItems.filter((i) => i.productId !== productId));
  };

  const updateEditItemQuantity = (productId: string, adet: number) => {
    if (adet <= 0) {
      removeEditItem(productId);
    } else {
      setEditItems(editItems.map((i) => (i.productId === productId ? { ...i, adet } : i)));
    }
  };

  useEffect(() => {
    const total = editItems.reduce((sum, item) => sum + item.fiyat * item.adet, 0);
    setEditFormData((prev) => ({ ...prev, toplamUcret: total }));
  }, [editItems]);
  const handleDeleteClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setModalAction('delete');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (modalAction === 'edit') {
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedServiceId,
          password,
          ...editFormData,
          tarih: editFormData.tarih ? new Date(editFormData.tarih).toISOString() : undefined,
          items: editItems,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        success('Servis kaydı başarıyla güncellendi!');
        setShowPasswordModal(false);
        setPassword('');
        setEditItems([]);
        loadServices();
      } else {
        error(data.error || 'Güncelleme başarısız!');
      }
    } else if (modalAction === 'delete') {
      const response = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedServiceId,
          password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        success('Servis kaydı başarıyla silindi!');
        setShowPasswordModal(false);
        setPassword('');
        loadServices();
      } else {
        error(data.error || 'Silme başarısız!');
      }
    }
  };

  // Müşteri listesi ve filtreleme
  const customerNames = Array.from(
    new Map(services.map(s => [
      `${s.motorcycle.customer.ad} ${s.motorcycle.customer.soyad}`,
      `${s.motorcycle.customer.ad} ${s.motorcycle.customer.soyad}`
    ])).values()
  ).sort((a, b) => trSort(a, b));

  const filteredServices = selectedCustomer
    ? services.filter(s => `${s.motorcycle.customer.ad} ${s.motorcycle.customer.soyad}` === selectedCustomer)
    : services;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Link href="/">
            <img src="/logo.png" alt="M6 GARAGE Logo" className="h-12 sm:h-16 w-auto drop-shadow-xl cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              href="/new-service"
              className="bg-blue-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 text-center shadow-xl w-full sm:w-auto"
            >
              + Yeni Servis
            </Link>
          </div>
        </div>

        {/* Filtre */}
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl mb-4 flex flex-col sm:flex-row items-center gap-3">
          <span className="font-bold text-gray-900 text-sm whitespace-nowrap">🔍 Filtrele:</span>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="border p-2 rounded text-gray-900 w-full sm:w-64"
          >
            <option value="">Tüm Müşteriler</option>
            {customerNames.map(name => (
              <option key={name} value={name}>{name}</option>
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
          <span className="text-gray-500 text-sm ml-auto">{filteredServices.length} kayıt</span>
        </div>

        <div className="space-y-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.motorcycle.customer.ad} {service.motorcycle.customer.soyad}
                  </h3>
                  <p className="text-gray-900">
                    {service.motorcycle.marka} {service.motorcycle.model} - {service.motorcycle.plaka}
                  </p>
                </div>
                <div className="w-full sm:w-auto sm:text-right">
                  <p className="text-sm text-gray-700">{format(new Date(service.tarih), 'dd.MM.yyyy HH:mm')}</p>
                  <p className="text-lg font-bold text-green-600">₺{service.toplamUcret.toFixed(2)}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditClick(service)}
                      className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex-1 sm:flex-none"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => generateServicePDF(service)}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex-1 sm:flex-none"
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={() => handleDeleteClick(service.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 flex-1 sm:flex-none"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-900">📏 KM: {service.km.toLocaleString()}</p>
                <p className="text-gray-900 mt-2">{service.yapilanIslemler}</p>
                {service.notlar && <p className="text-gray-700 text-sm mt-2 italic">{service.notlar}</p>}
              </div>

              {service.serviceItems.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Kullanılan Parçalar:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.serviceItems.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {item.product.urunAdi} x{item.adet} - ₺{(item.fiyat * item.adet).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Şifre Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {modalAction === 'edit' ? 'Servis Kaydını Düzenle' : 'Silme İçin Şifre Girin'}
              </h3>
              
              {modalAction === 'edit' && (
                <div className="mb-4 space-y-3">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-1">Tarih</label>
                    <input
                      type="datetime-local"
                      value={editFormData.tarih}
                      onChange={(e) => setEditFormData({ ...editFormData, tarih: e.target.value })}
                      className="border p-2 rounded w-full text-gray-900"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="KM"
                    value={editFormData.km}
                    onChange={(e) => setEditFormData({ ...editFormData, km: parseInt(e.target.value) || 0 })}
                    className="border p-2 rounded w-full text-gray-900"
                  />
                  <textarea
                    placeholder="Yapılan İşlemler"
                    value={editFormData.yapilanIslemler}
                    onChange={(e) => setEditFormData({ ...editFormData, yapilanIslemler: e.target.value })}
                    className="border p-2 rounded w-full h-24 text-gray-900"
                  />
                  <textarea
                    placeholder="Notlar"
                    value={editFormData.notlar}
                    onChange={(e) => setEditFormData({ ...editFormData, notlar: e.target.value })}
                    className="border p-2 rounded w-full h-16 text-gray-900"
                  />

                  {/* Kullanılan Parçalar */}
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-bold mb-2 text-gray-900">Kullanılan Parçalar</h4>
                    <select
                      onChange={(e) => {
                        addEditItem(e.target.value);
                        e.target.value = '';
                      }}
                      className="border p-2 rounded w-full mb-3 text-gray-900"
                    >
                      <option value="">Parça Ekle</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.urunAdi} - ₺{p.satisFiyati}
                        </option>
                      ))}
                    </select>

                    {editItems.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {editItems.map((item) => {
                          const product = products.find((p) => p.id === item.productId);
                          return (
                            <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm font-semibold text-gray-900">{product?.urunAdi}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => updateEditItemQuantity(item.productId, item.adet - 1)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                >
                                  -
                                </button>
                                <span className="font-bold text-gray-900 text-sm">{item.adet}</span>
                                <button
                                  type="button"
                                  onClick={() => updateEditItemQuantity(item.productId, item.adet + 1)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                >
                                  +
                                </button>
                                <span className="font-bold text-gray-900 text-sm">₺{(item.fiyat * item.adet).toFixed(2)}</span>
                                <button
                                  type="button"
                                  onClick={() => removeEditItem(item.productId)}
                                  className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                                >
                                  Sil
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="border-t pt-2">
                      <p className="text-lg font-bold text-right text-gray-900">
                        Toplam: ₺{editFormData.toplamUcret.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3 rounded w-full mb-4 text-gray-900"
                autoFocus={modalAction === 'delete'}
              />
              
              <div className="flex gap-2">
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600"
                >
                  Onayla
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword('');
                    setEditItems([]);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-600"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

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
