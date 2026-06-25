import type { Metadata } from "next";
import "./globals.css";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Shumitra Exports — Premium Indian Spices & Commodities Exporter",
  description: "Shumitra Exports — Trusted exporter of premium Indian spices and agricultural commodities to 29+ countries. APEDA, FSSAI & ISO 22000 certified.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        {!isAdmin && <Navbar />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppFloat />}
      </body>
    </html>
  );
}
