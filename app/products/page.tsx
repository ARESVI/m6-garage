'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

interface Product {
  id: string;
  urunAdi: string;
  kategori: string;
  stokMiktari: number;
  minStokSeviyesi: number;
  satisFiyati: number;
}

export default function ProductsPage() {
  const { toasts, removeToast, success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalAction, setModalAction] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    urunAdi: '',
    kategori: 'yag',
    stokMiktari: 0,
    minStokSeviyesi: 0,
    satisFiyati: 0,
  });
  const [editFormData, setEditFormData] = useState({
    urunAdi: '',
    kategori: 'yag',
    stokMiktari: 0,
    minStokSeviyesi: 0,
    satisFiyati: 0,
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  };

  const handleAddClick = () => {
    setFormData({ urunAdi: '', kategori: 'yag', stokMiktari: 0, minStokSeviyesi: 0, satisFiyati: 0 });
    setModalAction('add');
    setPassword('');
    setShowPasswordModal(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProductId(product.id);
    setEditFormData({
      urunAdi: product.urunAdi,
      kategori: product.kategori,
      stokMiktari: product.stokMiktari,
      minStokSeviyesi: product.minStokSeviyesi,
      satisFiyati: product.satisFiyati,
    });
    setModalAction('edit');
    setShowPasswordModal(true);
  };

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId);
    setModalAction('delete');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (modalAction === 'add') {
      if (!formData.urunAdi.trim()) { error('Ürün adı boş olamaz!'); return; }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, alisFiyati: 0, password }),
      });
      const data = await res.json();
      if (res.ok) {
        success('Ürün eklendi!');
        setFormData({ urunAdi: '', kategori: 'yag', stokMiktari: 0, minStokSeviyesi: 0, satisFiyati: 0 });
        setShowPasswordModal(false); setPassword(''); loadProducts();
      } else error(data.error || 'Ürün eklenemedi!');
    } else if (modalAction === 'edit') {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProductId, password, ...editFormData, alisFiyati: 0 }),
      });
      const data = await res.json();
      if (res.ok) { success('Ürün güncellendi!'); setShowPasswordModal(false); setPassword(''); loadProducts(); }
      else error(data.error || 'Güncelleme başarısız!');
    } else {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProductId, password }),
      });
      const data = await res.json();
      if (res.ok) { success('Ürün silindi!'); setShowPasswordModal(false); setPassword(''); loadProducts(); }
      else error(data.error || 'Silme başarısız!');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
          <Link href="/"><img src="/logo.png" alt="M6 GARAGE Logo" className="h-12 sm:h-16 w-auto drop-shadow-xl mx-auto sm:mx-0 cursor-pointer hover:opacity-80 transition-opacity" /></Link>
          <button onClick={handleAddClick} className="bg-blue-500/90 backdrop-blur-sm text-white px-4 sm:px-6 py-3 rounded-lg font-bold hover:bg-blue-600 shadow-xl text-center">
            + Yeni Ürün
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl mb-4">
          <input
            type="text"
            placeholder="🔍 Ürün adına göre ara..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border p-3 rounded text-gray-900 text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.filter(p => p.urunAdi.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
            <div key={product.id} className={`p-6 rounded-lg shadow-xl backdrop-blur-sm ${
              product.stokMiktari === 0 ? 'bg-yellow-100/95 border-4 border-yellow-500 animate-pulse'
              : product.stokMiktari <= product.minStokSeviyesi ? 'bg-red-100/95 border-4 border-red-500 animate-pulse'
              : 'bg-white/95'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{product.urunAdi}</h3>
                <div className="flex gap-2 items-center">
                  {product.stokMiktari === 0 && <span className="text-2xl">🚫</span>}
                  {product.stokMiktari > 0 && product.stokMiktari <= product.minStokSeviyesi && <span className="text-2xl">⚠️</span>}
                  <button onClick={() => handleEditClick(product)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">Düzenle</button>
                  <button onClick={() => handleDeleteClick(product.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Sil</button>
                </div>
              </div>
              <p className="text-sm text-gray-900">Kategori: {product.kategori}</p>
              <p className={`text-2xl font-black mt-2 ${
                product.stokMiktari === 0 ? 'text-yellow-700 bg-yellow-200 px-3 py-2 rounded-lg inline-block'
                : product.stokMiktari <= product.minStokSeviyesi ? 'text-red-700 bg-red-200 px-3 py-2 rounded-lg inline-block'
                : 'text-green-600'}`}>
                Stok: {product.stokMiktari} adet
              </p>
              <p className="text-sm text-gray-700 mt-1">Min: {product.minStokSeviyesi}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">Satış: ₺{product.satisFiyati.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-gray-900">{modalAction === 'add' ? 'Yeni Ürün Ekle' : modalAction === 'edit' ? 'Ürünü Düzenle' : 'Ürünü Sil'}</h3>
              {(modalAction === 'add' || modalAction === 'edit') && (
                <div className="mb-4 space-y-3">
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Ürün Adı</label>
                    <input type="text" value={modalAction === 'add' ? formData.urunAdi : editFormData.urunAdi} onChange={e => modalAction === 'add' ? setFormData({ ...formData, urunAdi: e.target.value }) : setEditFormData({ ...editFormData, urunAdi: e.target.value })} className="border p-2 rounded w-full text-gray-900" /></div>
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Kategori</label>
                    <select value={modalAction === 'add' ? formData.kategori : editFormData.kategori} onChange={e => modalAction === 'add' ? setFormData({ ...formData, kategori: e.target.value }) : setEditFormData({ ...editFormData, kategori: e.target.value })} className="border p-2 rounded w-full text-gray-900">
                      <option value="yag">Yağ</option><option value="filtre">Filtre</option><option value="parca">Yedek Parça</option><option value="diger">Diğer</option>
                    </select></div>
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Stok Miktarı</label>
                    <input type="number" min="0" max="2147483647" value={modalAction === 'add' ? formData.stokMiktari : editFormData.stokMiktari} onChange={e => modalAction === 'add' ? setFormData({ ...formData, stokMiktari: parseInt(e.target.value) || 0 }) : setEditFormData({ ...editFormData, stokMiktari: parseInt(e.target.value) || 0 })} className="border p-2 rounded w-full text-gray-900" /></div>
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Min Stok Seviyesi</label>
                    <input type="number" min="0" value={modalAction === 'add' ? formData.minStokSeviyesi : editFormData.minStokSeviyesi} onChange={e => modalAction === 'add' ? setFormData({ ...formData, minStokSeviyesi: parseInt(e.target.value) || 0 }) : setEditFormData({ ...editFormData, minStokSeviyesi: parseInt(e.target.value) || 0 })} className="border p-2 rounded w-full text-gray-900" /></div>
                  <div><label className="block text-sm font-black text-gray-900 mb-1">Satış Fiyatı (₺)</label>
                    <input type="number" step="0.01" min="0" value={modalAction === 'add' ? formData.satisFiyati : editFormData.satisFiyati} onChange={e => modalAction === 'add' ? setFormData({ ...formData, satisFiyati: parseFloat(e.target.value) || 0 }) : setEditFormData({ ...editFormData, satisFiyati: parseFloat(e.target.value) || 0 })} className="border p-2 rounded w-full text-gray-900" /></div>
                </div>
              )}
              <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} className="border p-3 rounded w-full mb-4 text-gray-900" autoFocus={modalAction === 'delete'} />
              <div className="flex gap-2">
                <button onClick={handlePasswordSubmit} className="flex-1 bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600">Onayla</button>
                <button onClick={() => { setShowPasswordModal(false); setPassword(''); }} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-600">İptal</button>
              </div>
            </div>
          </div>
        )}

        {toasts.map(toast => <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />)}
      </div>
    </div>
  );
}
