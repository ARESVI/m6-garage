'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { trSort } from '@/lib/sort';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

interface Customer {
  id: string;
  ad: string;
  soyad: string;
  telefon: string;
  notlar?: string;
  motorcycles: Array<{ id: string; marka: string; model: string; plaka: string }>;
}

export default function CustomersPage() {
  const { toasts, removeToast, success, error } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ ad: '', soyad: '', telefon: '', notlar: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'edit' | 'delete'>('edit');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [password, setPassword] = useState('');
  const [editData, setEditData] = useState({ ad: '', soyad: '', telefon: '', notlar: '' });

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = () => {
    fetch('/api/customers')
      .then(r => r.json())
      .then(data => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setCustomers([]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      success('Müşteri başarıyla eklendi!');
      setFormData({ ad: '', soyad: '', telefon: '', notlar: '' });
      setShowForm(false);
      loadCustomers();
    } else {
      error('Müşteri eklenemedi!');
    }
  };

  const openEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditData({ ad: customer.ad, soyad: customer.soyad, telefon: customer.telefon, notlar: customer.notlar || '' });
    setModalAction('edit');
    setPassword('');
    setShowModal(true);
  };

  const openDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalAction('delete');
    setPassword('');
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!selectedCustomer) return;
    if (modalAction === 'edit') {
      const res = await fetch('/api/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedCustomer.id, password, ...editData }),
      });
      const data = await res.json();
      if (res.ok) {
        success('Müşteri güncellendi!');
        setShowModal(false);
        loadCustomers();
      } else {
        error(data.error || 'Güncelleme başarısız!');
      }
    } else {
      const res = await fetch('/api/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedCustomer.id, password }),
      });
      const data = await res.json();
      if (res.ok) {
        success('Müşteri silindi!');
        setShowModal(false);
        loadCustomers();
      } else {
        error(data.error || 'Silme başarısız!');
      }
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Link href="/">
            <img src="/logo.png" alt="M6 GARAGE Logo" className="h-12 sm:h-16 w-auto drop-shadow-xl cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 shadow-xl w-full sm:w-auto"
          >
            {showForm ? 'İptal' : '+ Yeni Müşteri'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Ad" value={formData.ad} onChange={e => setFormData({ ...formData, ad: e.target.value })} className="border p-3 rounded text-lg text-gray-900" required />
              <input type="text" placeholder="Soyad" value={formData.soyad} onChange={e => setFormData({ ...formData, soyad: e.target.value })} className="border p-3 rounded text-lg text-gray-900" required />
              <input type="tel" placeholder="Telefon" value={formData.telefon} onChange={e => setFormData({ ...formData, telefon: e.target.value })} className="border p-3 rounded text-lg text-gray-900" required />
              <textarea placeholder="Notlar" value={formData.notlar} onChange={e => setFormData({ ...formData, notlar: e.target.value })} className="border p-3 rounded text-lg text-gray-900" />
            </div>
            <button type="submit" className="mt-4 bg-green-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 w-full shadow-xl">Kaydet</button>
          </form>
        )}

        <div className="space-y-4">
          {[...customers].sort((a, b) => trSort(`${a.ad} ${a.soyad}`, `${b.ad} ${b.soyad}`)).map((customer) => (
            <div key={customer.id} className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{customer.ad} {customer.soyad}</h3>
                  <p className="text-gray-900">📞 {customer.telefon}</p>
                  {customer.notlar && <p className="text-gray-700 text-sm mt-1">{customer.notlar}</p>}
                  {customer.motorcycles.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-semibold text-gray-900">Motosikletler:</p>
                      {customer.motorcycles.map(moto => (
                        <p key={moto.id} className="text-sm text-gray-900">🏍️ {moto.marka} {moto.model} - {moto.plaka}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(customer)} className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">Düzenle</button>
                  <button onClick={() => openDelete(customer)} className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {modalAction === 'edit' ? 'Müşteriyi Düzenle' : 'Müşteriyi Sil'}
              </h3>

              {modalAction === 'edit' && (
                <div className="space-y-3 mb-4">
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Ad</label>
                    <input type="text" value={editData.ad} onChange={e => setEditData({ ...editData, ad: e.target.value })} className="border p-2 rounded w-full text-gray-900" /></div>
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Soyad</label>
                    <input type="text" value={editData.soyad} onChange={e => setEditData({ ...editData, soyad: e.target.value })} className="border p-2 rounded w-full text-gray-900" /></div>
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Telefon</label>
                    <input type="tel" value={editData.telefon} onChange={e => setEditData({ ...editData, telefon: e.target.value })} className="border p-2 rounded w-full text-gray-900" /></div>
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Notlar</label>
                    <textarea value={editData.notlar} onChange={e => setEditData({ ...editData, notlar: e.target.value })} className="border p-2 rounded w-full text-gray-900 h-16" /></div>
                </div>
              )}

              {modalAction === 'delete' && (
                <p className="text-gray-700 mb-4">
                  <span className="font-bold text-red-600">{selectedCustomer?.ad} {selectedCustomer?.soyad}</span> adlı müşteriyi silmek istediğinize emin misiniz?
                  <br />
                  <span className="text-red-500 text-sm font-semibold">⚠️ Bu işlem müşteriye ait tüm motosiklet ve servis kayıtlarını da siler!</span>
                </p>
              )}

              <div><label className="block text-sm font-black text-gray-900 mb-1">Şifre</label>
                <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} className="border p-3 rounded w-full mb-4 text-gray-900" autoFocus /></div>

              <div className="flex gap-2">
                <button onClick={handleModalSubmit} className="flex-1 bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600">Onayla</button>
                <button onClick={() => { setShowModal(false); setPassword(''); }} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-600">İptal</button>
              </div>
            </div>
          </div>
        )}

        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
}
