import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zakarta",
  description: "Zakarta frontend app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
