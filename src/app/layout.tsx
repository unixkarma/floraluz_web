import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "floraluz",
  description: "Electronic Music Producer - Future Beats Latinoamericano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
