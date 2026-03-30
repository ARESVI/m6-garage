-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "notlar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "motorcycles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "marka" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "yil" INTEGER NOT NULL,
    "plaka" TEXT NOT NULL,
    "km" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "motorcycles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "motorcycleId" TEXT NOT NULL,
    "tarih" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "km" INTEGER NOT NULL,
    "yapilanIslemler" TEXT NOT NULL,
    "toplamUcret" REAL NOT NULL DEFAULT 0,
    "notlar" TEXT,
    CONSTRAINT "service_records_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "motorcycles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceRecordId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "adet" INTEGER NOT NULL,
    "fiyat" REAL NOT NULL,
    CONSTRAINT "service_items_serviceRecordId_fkey" FOREIGN KEY ("serviceRecordId") REFERENCES "service_records" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "service_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "urunAdi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "stokMiktari" INTEGER NOT NULL DEFAULT 0,
    "minStokSeviyesi" INTEGER NOT NULL DEFAULT 5,
    "alisFiyati" REAL NOT NULL,
    "satisFiyati" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "miktar" INTEGER NOT NULL,
    "tarih" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aciklama" TEXT,
    CONSTRAINT "stock_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_telefon_key" ON "customers"("telefon");

-- CreateIndex
CREATE UNIQUE INDEX "motorcycles_plaka_key" ON "motorcycles"("plaka");
