import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AuthWrapper } from "@/components/layout/AuthWrapper";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sokara CRM",
  description: "God-Tier CRM Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="h-full flex overflow-hidden">
        {/* Background Base */}
        <ThemeProvider />
        <div className="absolute inset-0 bg-base -z-10" />
        
        <AuthWrapper>
          <Sidebar />
          
          <div className="flex-1 flex flex-col min-w-0 relative">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
              {children}
              
              {/* Ambient Watermark */}
              <div className="pointer-events-none fixed bottom-4 right-6 opacity-[0.03] flex items-center justify-center select-none z-0">
                <span className="text-4xl font-extrabold tracking-tighter whitespace-nowrap">
                  DEMO ALDY ALFARISY
                </span>
              </div>
            </main>
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}
