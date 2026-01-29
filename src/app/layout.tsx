import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Vereinswebsite',
  description: 'Club website'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <header className="bg-blue-700 text-white">
          <div className="container mx-auto p-4 flex justify-between">
            <h1 className="text-xl font-semibold">Verein</h1>
            <nav className="space-x-4">
              <Link href="/">Home</Link>
              <Link href="/news">News</Link>
              <Link href="/events">Events</Link>
              <Link href="/contact">Kontakt</Link>
              <Link href="/imprint">Impressum</Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-6">{children}</main>
        <footer className="bg-gray-100 p-6 mt-8">© Verein</footer>
      </body>
    </html>
  );
}
