import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talib ul Mola Academy Digital Library",
  description: "A Living Archive of Knowledge, Heritage & Scholarship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:text-brand-900 focus:p-4 focus:rounded-br-lg">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
