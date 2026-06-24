import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Profession Classifier",
  description: "Modern fullstack application for classifying professional codes using Anthropic Claude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={cn(inter.className, "min-h-screen bg-background antialiased selection:bg-primary/30")}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0 pointer-events-none"></div>
          <main className="flex-1 relative z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
