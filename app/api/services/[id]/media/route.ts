import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put, del } from '@vercel/blob';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const media = await prisma.serviceMedia.findMany({
      where: { serviceRecordId: id },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: 'Medya yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });

    const tip = file.type.startsWith('video/') ? 'video' : 'photo';
    const filename = `service-${id}-${Date.now()}-${file.name}`;

    let url: string;

    // Use Vercel Blob in production, local storage in dev
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, { access: 'public' });
      url = blob.url;
    } else {
      // Local dev: store as base64 data URL
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      url = `data:${file.type};base64,${base64}`;
    }

    const media = await prisma.serviceMedia.create({
      data: {
        serviceRecordId: id,
        url,
        tip,
        dosyaAdi: file.name,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { mediaId } = await request.json();
    const media = await prisma.serviceMedia.findUnique({ where: { id: mediaId } });
    if (!media) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });

    // Delete from Vercel Blob if it's a blob URL
    if (process.env.BLOB_READ_WRITE_TOKEN && media.url.includes('vercel-storage')) {
      await del(media.url);
    }

    await prisma.serviceMedia.delete({ where: { id: mediaId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
}
