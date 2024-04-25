"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "./ui/toaster";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* @ts-ignore */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
    </>
  );
};

export default Providers;
