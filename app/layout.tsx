import { Navbar } from "@/components/navbar";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className,
      )}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
          <div className="min-h-screen">
            <Navbar />
            <div className="container max-w-7xl mx-auto h-full pt-12">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
