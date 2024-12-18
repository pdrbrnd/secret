import type { Metadata } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: "Sortear nomes",
  description: "Faz pares aleatórios com uma lista de nomes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <div className="max-w-xl mx-auto p-4 md:py-8 lg:py-12">{children}</div>
      </body>
    </html>
  );
}
