import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_PASSWORD = '481808';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        motorcycles: true,
      },
      orderBy: [
        { ad: 'asc' },
        { soyad: 'asc' },
      ],
    });
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Müşteriler yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.ad?.trim() || !body.soyad?.trim() || !body.telefon?.trim()) {
      return NextResponse.json({ error: 'Ad, soyad ve telefon zorunludur' }, { status: 400 });
    }
    const customer = await prisma.customer.create({
      data: {
        ad: body.ad,
        soyad: body.soyad,
        telefon: body.telefon,
        notlar: body.notlar,
      },
    });
    return NextResponse.json(customer);
  } catch (error) {
    const msg = error instanceof Error && error.message.includes('Unique constraint')
      ? 'Bu telefon numarası zaten kayıtlı!'
      : 'Müşteri eklenemedi';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Yanlış şifre!' }, { status: 401 });
    }
    const customer = await prisma.customer.update({
      where: { id: body.id },
      data: {
        ad: body.ad,
        soyad: body.soyad,
        telefon: body.telefon,
        notlar: body.notlar,
      },
    });
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: 'Müşteri güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Yanlış şifre!' }, { status: 401 });
    }
    await prisma.customer.delete({ where: { id: body.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Müşteri silinemedi' }, { status: 500 });
  }
}
