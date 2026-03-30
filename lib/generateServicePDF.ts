import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NotoSansBase64 } from './NotoSans-Regular.b64';

interface ServiceItem {
  adet: number;
  fiyat: number;
  product: { urunAdi: string };
}

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
    customer: { ad: string; soyad: string };
  };
  serviceItems: ServiceItem[];
}

export async function generateServicePDF(service: ServiceRecord) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Embed Noto Sans for full Turkish Unicode support
  doc.addFileToVFS('NotoSans-Regular.ttf', NotoSansBase64);
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
  doc.setFont('NotoSans', 'normal');

  const font = 'NotoSans';

  // Header - dark band
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageW, 26, 'F');

  // Logo
  try {
    const logoRes = await fetch('/2.png');
    if (logoRes.ok) {
      const logoBuf = await logoRes.arrayBuffer();
      const logoBytes = new Uint8Array(logoBuf);
      let logoBinary = '';
      for (let i = 0; i < logoBytes.byteLength; i++) logoBinary += String.fromCharCode(logoBytes[i]);
      const logoBase64 = btoa(logoBinary);
      doc.addImage(logoBase64, 'PNG', (pageW - 60) / 2, 4, 60, 18);
    }
  } catch {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(font, 'normal');
    doc.text('M6 GARAGE', pageW / 2, 16, { align: 'center' });
  }

  // Tarih & Servis No
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont(font, 'normal');
  const tarih = new Date(service.tarih).toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  doc.text(`Tarih: ${tarih}`, 14, 36);
  doc.text(`Servis No: ${service.id.slice(-8).toUpperCase()}`, pageW - 14, 36, { align: 'right' });

  // Müşteri Bilgileri
  doc.setFontSize(11);
  doc.setFont(font, 'normal');
  doc.text('MÜŞTERİ BİLGİLERİ', 14, 48);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 50, pageW - 14, 50);

  doc.setFontSize(10);
  doc.text(`Ad Soyad : ${service.motorcycle.customer.ad} ${service.motorcycle.customer.soyad}`, 14, 58);
  doc.text(`Araç     : ${service.motorcycle.marka} ${service.motorcycle.model}`, 14, 66);
  doc.text(`Plaka    : ${service.motorcycle.plaka}`, 14, 74);
  doc.text(`KM       : ${service.km.toLocaleString('tr-TR')}`, 14, 82);

  // Yapılan İşlemler
  doc.setFontSize(11);
  doc.text('YAPILAN İŞLEMLER', 14, 96);
  doc.line(14, 98, pageW - 14, 98);

  doc.setFontSize(10);
  const islemLines = doc.splitTextToSize(service.yapilanIslemler, pageW - 28);
  doc.text(islemLines, 14, 106);

  let yPos = 106 + islemLines.length * 6 + 10;

  // Kullanılan Parçalar
  if (service.serviceItems.length > 0) {
    yPos += 6;

    autoTable(doc, {
      startY: yPos,
      head: [['Malzemeler', 'Adet', 'Birim Fiyat', 'Toplam']],
      body: service.serviceItems.map(item => [
        item.product.urunAdi,
        item.adet.toString(),
        `${item.fiyat.toFixed(2)} TL`,
        `${(item.fiyat * item.adet).toFixed(2)} TL`,
      ]),
      styles: { fontSize: 9, cellPadding: 3, font },
      headStyles: { fillColor: [30, 30, 30], textColor: 255, font },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Notlar
  if (service.notlar) {
    doc.setFontSize(11);
    doc.setFont(font, 'normal');
    doc.text('NOTLAR', 14, yPos);
    doc.line(14, yPos + 2, pageW - 14, yPos + 2);
    doc.setFontSize(10);
    const notLines = doc.splitTextToSize(service.notlar, pageW - 28);
    doc.text(notLines, 14, yPos + 8);
    yPos += notLines.length * 6 + 18;
  }

  // Toplam
  doc.setFillColor(30, 30, 30);
  doc.rect(pageW - 80, yPos - 4, 66, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont(font, 'normal');
  doc.text(`TOPLAM: ${service.toplamUcret.toFixed(2)} TL`, pageW - 47, yPos + 5, { align: 'center' });

  // Background image above footer
  const imgY = pageH - 38;
  try {
    const imgRes = await fetch('/background.png');
    if (imgRes.ok) {
      const imgBuf = await imgRes.arrayBuffer();
      const imgBytes = new Uint8Array(imgBuf);
      let imgBinary = '';
      for (let i = 0; i < imgBytes.byteLength; i++) imgBinary += String.fromCharCode(imgBytes[i]);
      const imgBase64 = btoa(imgBinary);
      const imgW = 80;
      const imgH = 25;
      doc.addImage(imgBase64, 'PNG', (pageW - imgW) / 2, imgY - imgH, imgW, imgH);
    }
  } catch { /* skip */ }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont(font, 'normal');
  doc.text('M6 GARAGE - Motosiklet Servis Yönetim Sistemi', pageW / 2, pageH - 8, { align: 'center' });

  doc.save(`servis-${service.id.slice(-8).toUpperCase()}-${service.motorcycle.plaka}.pdf`);
}
