'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SlotCounter from '@/components/SlotCounter';

interface DashboardData {
  todayServices: number;
  monthServices: number;
  totalRevenue: number;
  lowStockProducts: Array<{
    id: string;
    urunAdi: string;
    stokMiktari: number;
    minStokSeviyesi: number;
  }>;
  outOfStockProducts: Array<{
    id: string;
    urunAdi: string;
    stokMiktari: number;
    minStokSeviyesi: number;
  }>;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <img src="/logo.png" alt="M6 GARAGE Logo" className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-2xl" />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative overflow-hidden bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-xl w-40 sm:w-48 h-24 sm:h-28 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <p className="relative z-10 text-gray-600 text-xs sm:text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-black-ops)' }}>Bugünkü Servisler</p>
            <div className="relative z-10 flex items-center justify-center h-10 sm:h-12">
              <SlotCounter value={data?.todayServices ?? 0} className="text-2xl sm:text-3xl font-bold text-blue-600" />
            </div>
          </div>
          <div className="relative overflow-hidden bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-xl w-40 sm:w-48 h-24 sm:h-28 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <p className="relative z-10 text-gray-600 text-xs sm:text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-black-ops)' }}>Bu Ay Servisler</p>
            <div className="relative z-10 flex items-center justify-center h-10 sm:h-12">
              <SlotCounter value={data?.monthServices ?? 0} className="text-2xl sm:text-3xl font-bold text-green-600" />
            </div>
          </div>
        </div>

        {data?.outOfStockProducts && Array.isArray(data.outOfStockProducts) && data.outOfStockProducts.length > 0 && (
          <div className="bg-yellow-100/95 backdrop-blur-sm border-2 sm:border-4 border-yellow-500 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-2xl animate-pulse">
            <h3 className="text-lg sm:text-2xl font-black text-yellow-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-2xl sm:text-4xl">🚫</span>
              <span className="bg-yellow-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base">STOK BİTTİ</span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {data.outOfStockProducts.map((product) => (
                <li key={product.id} className="bg-white/90 p-3 sm:p-4 rounded-lg border-l-4 border-yellow-600 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-yellow-900">{product.urunAdi}</span>
                    <div className="flex gap-2 sm:gap-4 items-center">
                      <span className="text-xl sm:text-2xl font-black text-yellow-700 bg-yellow-200 px-3 sm:px-4 py-1 sm:py-2 rounded-lg">
                        0 adet
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700">Min: {product.minStokSeviyesi}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data?.lowStockProducts && Array.isArray(data.lowStockProducts) && data.lowStockProducts.length > 0 && (
          <div className="bg-red-100/95 backdrop-blur-sm border-2 sm:border-4 border-red-500 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-2xl animate-pulse">
            <h3 className="text-lg sm:text-2xl font-black text-red-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-2xl sm:text-4xl">⚠️</span>
              <span className="bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base">KRİTİK STOK</span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {data.lowStockProducts.map((product) => (
                <li key={product.id} className="bg-white/90 p-3 sm:p-4 rounded-lg border-l-4 border-red-600 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-red-900">{product.urunAdi}</span>
                    <div className="flex gap-2 sm:gap-4 items-center">
                      <span className="text-xl sm:text-2xl font-black text-red-700 bg-red-200 px-3 sm:px-4 py-1 sm:py-2 rounded-lg">
                        {product.stokMiktari} adet
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700">Min: {product.minStokSeviyesi}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/customers"
            className="hover-ripple relative overflow-hidden text-white p-6 sm:p-8 rounded-lg shadow-xl text-center text-lg sm:text-xl font-bold transition-transform duration-200 hover:scale-105"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', fontFamily: 'var(--font-black-ops)' }}
          >
            <span className="relative z-10 drop-shadow-lg tracking-widest uppercase">MÜŞTERİLER</span>
            <div className="absolute inset-0 bg-blue-600/60" />
          </Link>
          <Link
            href="/motorcycles"
            className="hover-ripple relative overflow-hidden text-white p-6 sm:p-8 rounded-lg shadow-xl text-center text-lg sm:text-xl font-bold transition-transform duration-200 hover:scale-105 bg-green-800"
            style={{ fontFamily: 'var(--font-black-ops)' }}
          >
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-1 p-2 opacity-20 pointer-events-none select-none">
              {['HONDA', 'YAMAHA', 'KAWASAKI', 'BMW', 'SUZUKI', 'KTM', 'APRILIA', 'DUCATI'].map((brand) => (
                <div key={brand} className="flex items-center justify-center text-white font-black text-xs tracking-widest border border-white/40 rounded">
                  {brand}
                </div>
              ))}
            </div>
            <span className="relative z-10 drop-shadow-lg tracking-widest uppercase">MOTOSİKLETLER</span>
          </Link>
          <Link
            href="/services"
            className="hover-ripple relative overflow-hidden text-white p-6 sm:p-8 rounded-lg shadow-xl text-center text-lg sm:text-xl font-bold transition-transform duration-200 hover:scale-105"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', fontFamily: 'var(--font-black-ops)' }}
          >
            <span className="relative z-10 drop-shadow-lg tracking-widest uppercase">SERVİS KAYITLARI</span>
            <div className="absolute inset-0 bg-purple-600/60" />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Link
            href="/products"
            className="hover-ripple relative overflow-hidden text-white p-6 sm:p-8 rounded-lg shadow-xl text-center text-lg sm:text-xl font-bold transition-transform duration-200 hover:scale-105 sm:w-80"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', fontFamily: 'var(--font-black-ops)' }}
          >
            <span className="relative z-10 drop-shadow-lg tracking-widest uppercase">STOK YÖNETİMİ</span>
            <div className="absolute inset-0 bg-orange-600/60" />
          </Link>
          <Link
            href="/new-service"
            className="hover-ripple relative overflow-hidden text-white p-6 sm:p-8 rounded-lg shadow-xl text-center text-lg sm:text-xl font-bold transition-transform duration-200 hover:scale-105 sm:w-80"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', fontFamily: 'var(--font-black-ops)' }}
          >
            <span className="relative z-10 drop-shadow-lg tracking-widest uppercase">YENİ SERVİS KAYDI</span>
            <div className="absolute inset-0 bg-red-600/60" />
          </Link>
        </div>

        <div className="flex justify-center mt-4">
          <a
            href="https://www.instagram.com/merdiven6racing/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-ripple relative overflow-hidden text-white px-8 py-3 rounded-lg shadow-xl text-center font-bold transition-transform duration-200 hover:scale-105 flex items-center gap-2"
            style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', fontFamily: 'var(--font-black-ops)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            MERDIVEN6 RACING
          </a>
        </div>
      </div>
    </div>
  );
}
