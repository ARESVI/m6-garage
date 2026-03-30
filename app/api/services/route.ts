import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_PASSWORD = '481808';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const motorcycleId = searchParams.get('motorcycleId');

  try {
    const services = await prisma.serviceRecord.findMany({
      where: motorcycleId ? { motorcycleId } : undefined,
      include: {
        motorcycle: {
          include: {
            customer: true,
          },
        },
        serviceItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        tarih: 'desc',
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Servis kayıtları yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.motorcycleId || !body.yapilanIslemler?.trim()) {
      return NextResponse.json({ error: 'Motosiklet ve yapılan işlemler zorunludur' }, { status: 400 });
    }
    if (body.km !== undefined && (isNaN(body.km) || body.km < 0)) {
      return NextResponse.json({ error: 'Geçersiz KM değeri' }, { status: 400 });
    }
    
    const service = await prisma.$transaction(async (tx) => {
      const newService = await tx.serviceRecord.create({
        data: {
          motorcycleId: body.motorcycleId,
          km: body.km,
          yapilanIslemler: body.yapilanIslemler,
          toplamUcret: body.toplamUcret,
          notlar: body.notlar,
        },
      });

      if (body.items && body.items.length > 0) {
        for (const item of body.items) {
          // Stok yeterlilik kontrolü
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product || product.stokMiktari < item.adet) {
            throw new Error(`Yetersiz stok: ${product?.urunAdi ?? item.productId}`);
          }

          await tx.serviceItem.create({
            data: {
              serviceRecordId: newService.id,
              productId: item.productId,
              adet: item.adet,
              fiyat: item.fiyat,
            },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stokMiktari: {
                decrement: item.adet,
              },
            },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              tip: 'cikis',
              miktar: item.adet,
              aciklama: `Servis kaydı: ${newService.id}`,
            },
          });
        }
      }

      await tx.motorcycle.update({
        where: { id: body.motorcycleId },
        data: { km: body.km },
      });

      return newService;
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Servis kaydı oluşturulamadı' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Şifre kontrolü
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Yanlış şifre!' }, { status: 401 });
    }

    const service = await prisma.$transaction(async (tx) => {
      // Eski serviceItems'ları al (stok iadesi için)
      const oldServiceItems = await tx.serviceItem.findMany({
        where: { serviceRecordId: body.id },
      });

      // Eski parçaların stoklarını geri ekle
      for (const oldItem of oldServiceItems) {
        await tx.product.update({
          where: { id: oldItem.productId },
          data: {
            stokMiktari: {
              increment: oldItem.adet,
            },
          },
        });

        // Stok hareketi kaydet (giriş)
        await tx.stockMovement.create({
          data: {
            productId: oldItem.productId,
            tip: 'giris',
            miktar: oldItem.adet,
            aciklama: `Servis kaydı düzenleme - iade: ${body.id}`,
          },
        });
      }

      // Eski serviceItems'ları sil
      await tx.serviceItem.deleteMany({
        where: { serviceRecordId: body.id },
      });

      // Yeni serviceItems'ları ekle ve stoktan düş
      if (body.items && body.items.length > 0) {
        for (const item of body.items) {
          await tx.serviceItem.create({
            data: {
              serviceRecordId: body.id,
              productId: item.productId,
              adet: item.adet,
              fiyat: item.fiyat,
            },
          });

          // Stoktan düş
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stokMiktari: {
                decrement: item.adet,
              },
            },
          });

          // Stok hareketi kaydet (çıkış)
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              tip: 'cikis',
              miktar: item.adet,
              aciklama: `Servis kaydı düzenleme: ${body.id}`,
            },
          });
        }
      }

      // Servis kaydını güncelle
      const updatedService = await tx.serviceRecord.update({
        where: { id: body.id },
        data: {
          km: body.km,
          yapilanIslemler: body.yapilanIslemler,
          toplamUcret: body.toplamUcret,
          notlar: body.notlar,
          ...(body.tarih && { tarih: new Date(body.tarih) }),
        },
      });

      return updatedService;
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Servis kaydı güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    
    // Şifre kontrolü
    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Yanlış şifre!' }, { status: 401 });
    }

    // Servis kayıtlarını ve ilişkili verileri sil
    await prisma.$transaction(async (tx) => {
      // ServiceItems'ları al (stok iadesi için)
      const serviceItems = await tx.serviceItem.findMany({
        where: { serviceRecordId: body.id },
      });

      // Stokları geri ekle
      for (const item of serviceItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stokMiktari: {
              increment: item.adet,
            },
          },
        });

        // Stok hareketi kaydet (giriş)
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            tip: 'giris',
            miktar: item.adet,
            aciklama: `Servis kaydı silme - iade: ${body.id}`,
          },
        });
      }

      // ServiceItems'ları sil
      await tx.serviceItem.deleteMany({
        where: { serviceRecordId: body.id },
      });

      // Servis kaydını sil
      await tx.serviceRecord.delete({
        where: { id: body.id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Servis kaydı silinemedi' }, { status: 500 });
  }
}
