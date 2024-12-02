import type { Metadata } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: "Secret name matcher",
  description: "Randomly and secretly match a list of names",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-xl mx-auto py-12">{children}</div>
      </body>
    </html>
  );
}
