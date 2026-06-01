import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMA — um ser vivo digital que cresce com você",
  description:
    "Um companheiro digital de bem-estar que mora no seu computador. Companhia, autocuidado e memória viva — 100% offline e privado.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-rounded antialiased">{children}</body>
    </html>
  );
}
