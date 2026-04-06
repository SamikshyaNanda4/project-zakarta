import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Zakarta — Find Your Home",
  description: "Browse property listings on Zakarta.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <NavbarWrapper />
        {children}
        <Toaster richColors position="bottom-center"  />
      </body>
    </html>
  );
}
