import { Navbar } from "@/components/navbar";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { BODY_PADDING } from "@/app/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "F1 Guru",
  description: "Get answers to all your F1 questions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(inter.className, "antialiased bg-background")}>
        <Providers>
          <header
            className={cn(
              "top-0 sticky z-20 w-full py-3 bg-background flex flex-row flex-nowrap justify-between max-w-5xl mx-auto h-14 items-stretch animate-in fade-in slide-in-from-top-4 duration-1000 ease-in-out",
              BODY_PADDING,
            )}
          >
            <Navbar />
          </header>
          <main className={cn("min-h-screen flex items-stretch flex-col pb-28 max-w-5xl mx-auto", BODY_PADDING)}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
