import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const news = await prisma.newsPost.findMany({ where: { publishedAt: { not: null } }, orderBy: { publishedAt: 'desc' }, take: 3 });
  const events = await prisma.event.findMany({ orderBy: { startsAt: 'asc' }, take: 3 });
  return (
    <div>
      <section className="mb-8">
        <h2 className="text-2xl font-bold">Willkommen</h2>
        <p>Willkommen auf der Vereinswebsite.</p>
      </section>
      <section className="mb-8">
        <h3 className="text-xl">Neuigkeiten</h3>
        <ul>
          {news.map((n) => (
            <li key={n.id}>
              <Link href={`/news/${n.slug}`}>{n.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="text-xl">Nächste Termine</h3>
        <ul>
          {events.map((e) => (
            <li key={e.id}>{e.title} — {new Date(e.startsAt).toLocaleString()}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
