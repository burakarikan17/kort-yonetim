import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kort Rezervasyon Paneli",
  description: "Tek tenis kortu için özel rezervasyon ve finans yönetimi.",
  metadataBase: new URL("https://kort.burakarikan.online")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
