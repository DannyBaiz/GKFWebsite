import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { publishedAt: 'desc' } });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">News</h2>
      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/news/${p.slug}`} className="text-blue-600">{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
