import type { Metadata } from "next";
import Link from 'next/link'
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Requests",
  description: "Film Requests Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>
        <main>
          <header>
            <div className="header-inner">
              <div className="wordmark">
                <span className="wordmark-serif">Creature</span>
                <span className="wordmark-mono">DLCS</span>
              </div>
              <Link href="/">DLCS</Link>
              <Link href="/requests">Requests</Link>
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
