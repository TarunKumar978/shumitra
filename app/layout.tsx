import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Shumitra Exports — Premium Indian Spices & Commodities Exporter",
  description: "Shumitra Exports — Trusted exporter of premium Indian spices and agricultural commodities to 29+ countries. APEDA, FSSAI & ISO 22000 certified.",
  keywords: "Indian spices exporter, turmeric export, red chilli export, basmati rice export, APEDA certified exporter",
  openGraph: {
    title: "Shumitra Exports",
    description: "Premium Indian spices and commodities. 29+ countries. APEDA certified.",
    url: "https://shumitra.com",
    siteName: "Shumitra Exports",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
