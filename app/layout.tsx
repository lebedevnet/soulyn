import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soulyn",
  description:
    "Soulyn is a social discovery platform for gamers, introverts, and online-first people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}