import { prisma } from '@/lib/prisma';

interface Params { params: { slug: string } }

export default async function NewsDetail({ params }: Params) {
  const post = await prisma.newsPost.findUnique({ where: { slug: params.slug } });
  if (!post) return <p>Beitrag nicht gefunden.</p>;
  return (
    <article>
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
