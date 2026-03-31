import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayServices, monthServices, totalRevenue, allProducts] = await Promise.all([
      prisma.serviceRecord.count({ where: { tarih: { gte: today } } }),
      prisma.serviceRecord.count({ where: { tarih: { gte: startOfMonth } } }),
      prisma.serviceRecord.aggregate({
        where: { tarih: { gte: startOfMonth } },
        _sum: { toplamUcret: true },
      }),
      prisma.product.findMany({ orderBy: { urunAdi: 'asc' } }),
    ]);

    const lowStockProducts = allProducts.filter(
      p => p.stokMiktari > 0 && p.stokMiktari <= p.minStokSeviyesi
    );
    const outOfStockProducts = allProducts.filter(p => p.stokMiktari === 0);

    return NextResponse.json({
      todayServices,
      monthServices,
      totalRevenue: totalRevenue._sum.toplamUcret || 0,
      lowStockProducts,
      outOfStockProducts,
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({
      todayServices: 0,
      monthServices: 0,
      totalRevenue: 0,
      lowStockProducts: [],
      outOfStockProducts: [],
    }, { status: 500 });
  }
}
