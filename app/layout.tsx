import type { Metadata } from "next";
import { Geist, Geist_Mono, Black_Ops_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const blackOpsOne = Black_Ops_One({
  variable: "--font-black-ops",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "M6 GARAGE - Motosiklet Servis Yönetimi",
  description: "M6 GARAGE - Motosiklet servisi için stok ve müşteri yönetim sistemi",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${blackOpsOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cover bg-center bg-fixed bg-no-repeat" style={{ backgroundImage: 'url(/background.png)' }}>
        <div className="min-h-full backdrop-blur-sm bg-black/30">
          {children}
        </div>
      </body>
    </html>
  );
}
