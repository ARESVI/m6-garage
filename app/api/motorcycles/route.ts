import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_PASSWORD = '481808';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');

  try {
    const motorcycles = await prisma.motorcycle.findMany({
      where: customerId ? { customerId } : undefined,
      include: {
        customer: true,
        serviceRecords: {
          orderBy: { tarih: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { marka: 'asc' },
        { model: 'asc' },
      ],
    });
    return NextResponse.json(motorcycles);
  } catch (error) {
    return NextResponse.json({ error: 'Motosikletler yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Yanlış şifre!' }, { status: 401 });
    }
    if (!body.customerId || !body.marka?.trim() || !body.model?.trim() || !body.plaka?.trim()) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 });
    }
    const motorcycle = await prisma.motorcycle.create({
      data: {
        customerId: body.customerId,
        marka: body.marka,
        model: body.model,
        yil: body.yil,
        plaka: body.plaka,
        km: body.km || 0,
      },
    });
    return NextResponse.json(motorcycle);
  } catch (error) {
    const msg = error instanceof Error && error.message.includes('Unique constraint')
      ? 'Bu plaka zaten kayıtlı!'
      : 'Motosiklet eklenemedi';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
