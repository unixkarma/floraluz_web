import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://floraluz.xyz';

export const metadata: Metadata = {
  title: "floraluz",
  description: "Electronic Music Producer — Future Beats Latinoamericano",
  openGraph: {
    title: "floraluz",
    description: "Electronic Music Producer — Future Beats Latinoamericano",
    url: siteUrl,
    siteName: "floraluz",
    images: [{ url: `${siteUrl}/floraluz-cover.jpg`, width: 1200, height: 630, alt: "floraluz" }],
    type: "website",
    locale: "es_EC",
  },
  twitter: {
    card: "summary_large_image",
    title: "floraluz",
    description: "Electronic Music Producer — Future Beats Latinoamericano",
    images: [`${siteUrl}/floraluz-cover.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
