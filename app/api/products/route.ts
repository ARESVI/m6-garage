import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_PASSWORD = '481808';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        urunAdi: 'asc',
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ error: 'Ürünler yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Yanlış şifre!' }, { status: 401 });
    }
    if (!body.urunAdi?.trim()) {
      return NextResponse.json({ error: 'Ürün adı zorunludur' }, { status: 400 });
    }
    if (body.stokMiktari < 0 || body.stokMiktari > 2147483647) {
      return NextResponse.json({ error: 'Geçersiz stok miktarı' }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: {
        urunAdi: body.urunAdi,
        kategori: body.kategori,
        stokMiktari: body.stokMiktari || 0,
        minStokSeviyesi: body.minStokSeviyesi ?? 0,
        alisFiyati: body.alisFiyati,
        satisFiyati: body.satisFiyati,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Ürün eklenemedi' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Şifre kontrolü
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Yanlış şifre!' }, { status: 401 });
    }

    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        urunAdi: body.urunAdi,
        kategori: body.kategori,
        stokMiktari: body.stokMiktari,
        minStokSeviyesi: body.minStokSeviyesi,
        alisFiyati: body.alisFiyati,
        satisFiyati: body.satisFiyati,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    
    // Şifre kontrolü
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Yanlış şifre!' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
  }
}
