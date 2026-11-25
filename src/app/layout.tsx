import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import CartDrawer from "@/components/CartDrawer";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cobi Bread - Bánh Ngon Nhất Là Bánh Mới Ra Lò",
  description:
    "Cobi Bread - Thương hiệu bánh ngọt thuộc COBI GROUP. Cung cấp bánh mì kem tươi, bánh pocket toast, bánh mì đông lạnh nướng tươi mỗi ngày tại 5 chi nhánh TP.HCM, Hà Nội & Long An.",
  keywords: [
    "Cobi Bread",
    "Bánh mì tươi",
    "Bánh mì đông lạnh",
    "Pocket Toast",
    "Bánh mì kem tươi",
    "Cobi Group",
    "Bán sỉ B2B bánh mì",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${lora.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#231812] selection:bg-[#F37021]/20 selection:text-[#231812]">
        <QueryProvider>
          {children}
          <CartDrawer />
        </QueryProvider>
      </body>
    </html>
  );
}
