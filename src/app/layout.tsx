import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/orchid/Navbar";

export const metadata: Metadata = {
  title: "Orchid AI Web",
  description: "Web nhận diện và phân loại hoa lan bằng AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
