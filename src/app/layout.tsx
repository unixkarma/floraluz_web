import type { Metadata } from "next";
import "./globals.css";
import AnalogOverlay from "./components/AnalogOverlay";

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
        <AnalogOverlay />
        {children}
      </body>
    </html>
  );
}
